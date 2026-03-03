from flask import Flask, jsonify, request
from flask_cors import CORS
import mysql.connector
from flask_cors import cross_origin

import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
CORS(app)

# Database connection function
def get_db_connection():
    return mysql.connector.connect(
        host=os.getenv('database_host'),
        user=os.getenv('database_user'),
        password=os.getenv('database_pass'),
        database=os.getenv('database_name')
    )

@app.route("/addCustomer", methods=['POST'])
def addCustomer():
    con = get_db_connection()
    cursor=con.cursor()
    data = request.get_json()

    cursor.execute("""
        insert into address(address, district, city_id, postal_code, phone, location)
        values (%s, 'None', 1, %s, %s, Point(1,1));
        """, (data["address"], data["postal_code"], data["phone"],))
    cursor.execute("select LAST_INSERT_ID()")
    adID = cursor.fetchone()

    cursor.execute("""
        insert into customer (first_name, last_name, store_id, email, address_id, active)
        values (%s, %s, 1, %s, %s, 1);
        """, (data["first_name"], data["last_name"], data["email"], adID[0], ))
    con.commit()
    cursor.close()
    con.close()

    return jsonify({"message":"Customer added successfully"}), 200


@app.route("/updateCustomer", methods=['POST'])
def updateCustomer():
    con = get_db_connection()
    cursor=con.cursor()
    data = request.get_json()
    customerID = data["customer_id"]
    addressID = data["address_id"]

    if "phone" in data:
        newPhone = data["phone"]
        cursor.execute("""
        update address
        set phone = %s
        where address_id = %s
        """, (newPhone, addressID,))
    
    #c.email, c.create_date 
    if "address" in data:
        newAddress = data["address"]
        cursor.execute("""
        update address
        set address = %s
        where address_id = %s
        """, (newAddress, addressID,))
    
    if "postal_code" in data:
        newPcode = data["postal_code"]
        cursor.execute("""
        update address
        set postal_code = %s
        where address_id = %s
        """, (newPcode, addressID,))
    
    if "email" in data:
        newEmail = data["email"]
        cursor.execute("""
        update customer
        set email = %s
        where customer_id = %s
        """, (newEmail, customerID,))
    
    con.commit()
    cursor.close()
    con.close()

    return jsonify({"message":"Customer added successfully"}), 200


@app.route("/deleteCustomer", methods=['POST'])
def delCustomer():
    con = get_db_connection()
    cursor=con.cursor()
    data = request.get_json()
    customerID = data["customer_id"]
    addressID = data["address_id"]

    cursor.execute("""
    select *
    from rental as r
    where r.return_date is null and r.customer_id = %s;
    """, (customerID,))

    rentals = cursor.fetchall()
    print(rentals)
    #not working properly
    if len(rentals) > 0:
        con.commit()
        con.close()
        return {"Response": "ERROR: customer is currently renting a film"}, 999
    else:
        #update rental table
        #600 used as replacement customer ID for rentals
        cursor.execute("""
            update rental
            set customer_id = 600
            where customer_id = %s
        """,(customerID,))
        cursor.execute("delete from payment where customer_id = %s", (customerID,))
        cursor.execute("delete from customer where customer_id = %s", (customerID,)) #error bc im trying to delete foriegn key, possible solution (cascade delete), problem will remove rental count of films
        cursor.execute("delete from address where address_id = %s", (addressID,))

        con.commit()
        con.close()

        return {"Response": "Transaction Complete"}, 200

    




@app.route("/getFilmInfo/<film_id>", methods=['GET', 'POST'])
@cross_origin()
def get_filmInfo(film_id):
    con = get_db_connection()
    cursor=con.cursor(dictionary=True)
    cursor.execute("""
        select f.description, f.rating, f.rental_rate, f.rental_duration, f.special_features, count(*) as inv
        from inventory as i
        join film as f
        on f.film_id=i.film_id
        where f.film_id = %s;
        """, (film_id,))
    film=cursor.fetchall()
    cursor.execute("""
        select count(r.rental_id) as rented
        from inventory i 
        left join rental as r
        on i.inventory_id  = r.inventory_id and r.return_date is null
        join film f
        on i.film_id = f.film_id
        where f.film_id = %s   
        group by f.film_id;      
    """, (film_id,))
    rented=cursor.fetchall()
    film[0]["rented"] = rented[0]["rented"]
    film[0]["special_features"] = list(film[0]["special_features"])
    film[0]["number_available"] = int(film[0]["inv"]) - int(film[0]["rented"])
    cursor.close()
    con.close()
    return jsonify({"Info":film}), 200
    
    
@app.route("/getFilms", methods=['GET'])
def get_films():
    con = get_db_connection()
    cursor=con.cursor(dictionary=True)
    
    cursor.execute("""
        select f.film_id, f.title, f.last_update, c.name, group_concat(concat(a.first_name, ' ', a.last_name)) as actors
		from film_actor fa
		join actor a
		on fa.actor_id = a.actor_id 
        join film as f
        on f.film_id = fa.film_id 
        join film_category as fc
        on f.film_id = fc.film_id
        join category as c 
        on fc.category_id = c.category_id
        group by f.film_id, c.name; 
        """)
    films=cursor.fetchall()
    cursor.close()
    con.close()
    return jsonify({"films":films}), 200

@app.route("/getCustomers", methods=['GET'])
def get_customers():
    con = get_db_connection()
    cursor=con.cursor(dictionary=True)
    
    cursor.execute("""
        select c.customer_id, c.first_name, c.last_name, a.address, a.phone, a.postal_code, c.email, c.create_date, c.address_id 
        from customer c
        join address a
        on c.address_id = a.address_id
        where c.customer_id != 600
        group by c.customer_id, c.first_name, c.last_name;
        """)
    data=cursor.fetchall()
    cursor.close()
    con.close()
    return jsonify({"customers":data}), 200

@app.route("/getCustomerRentals/<customer_id>", methods=['GET'])
def get_customer_rentals(customer_id):
    con = get_db_connection()
    cursor = con.cursor(dictionary=True)
    
    cursor.execute("""
        select f.title, r.rental_date
        from rental r
        join inventory i on r.inventory_id = i.inventory_id
        join film f on i.film_id = f.film_id
        where r.customer_id = %s and r.return_date is null
        order by r.rental_date desc;
    """, (customer_id,))
    current_rentals = cursor.fetchall()
    
    cursor.execute("""
        select f.title, r.rental_date, r.return_date
        from rental r
        join inventory i on r.inventory_id = i.inventory_id
        join film f on i.film_id = f.film_id
        where r.customer_id = %s and r.return_date is not null
        order by r.return_date desc
        limit 10;
    """, (customer_id,))
    past_rentals = cursor.fetchall()
    
    cursor.close()
    con.close()
    
    return jsonify({
        "current_rentals": current_rentals,
        "past_rentals": past_rentals
    }), 200

@app.route("/getTable", methods=['GET'])
def get_tables():
    con = get_db_connection()
    cursor=con.cursor()
    cursor.execute("SHOW TABLES;")
    tables=cursor.fetchall()
    cursor.close()
    con.close()
    table_names=[table[0] for table in tables]
    return jsonify({"Top Films": table_names}), 200

@app.route("/topActors")
def topActors():
    con = get_db_connection()
    cursor=con.cursor()
    cursor.execute("""
        select a.first_name, a.last_name, count(fa.film_id) as movies
        from film_actor as fa
        join actor as a
        on fa.actor_id = a.actor_id
        group by fa.actor_id
        order by movies desc
        limit 5;
        """)
    actors=cursor.fetchall()
    cursor.close()
    con.close()
    
    topactors =[]
    for actor in actors:
        name = actor[0] + " " +actor[1]
        topactors.append(name)
    return jsonify({"Actors": topactors}), 200

@app.route("/getActorInfo/<actor_name>", methods=['GET'])
def get_actorInfo(actor_name):
    con = get_db_connection()
    cursor = con.cursor(dictionary=True)
    
    cursor.execute("""
        select f.title, count(r.rental_id) as rental_count
        from actor a
        join film_actor fa on a.actor_id = fa.actor_id
        join film f on fa.film_id = f.film_id
        join inventory i on f.film_id = i.film_id
        join rental r on i.inventory_id = r.inventory_id
        where concat(a.first_name, ' ', a.last_name) = %s
        group by f.film_id, f.title
        order by rental_count desc
        limit 5;
    """, (actor_name,))
    
    top_films = cursor.fetchall()

    cursor.execute("""
        select count(*) as total_films
        from actor a
        join film_actor fa on a.actor_id = fa.actor_id
        where concat(a.first_name, ' ', a.last_name) = %s;
    """, (actor_name,))
    
    film_count = cursor.fetchone()
    
    cursor.close()
    con.close()
    
    return jsonify({
        "actor_name": actor_name,
        "total_films": film_count['total_films'],
        "top_films": top_films
    }), 200

@app.route("/topRentedFilms", methods=["GET"])
def top_rented_films():
    con = get_db_connection()
    cursor = con.cursor()
    cursor.execute("""
        select f.film_id, f.title, count(r.rental_id) as rental_count
        from rental r
        join inventory i on r.inventory_id = i.inventory_id
        join film f on i.film_id = f.film_id
        group by f.film_id, f.title
        order by rental_count desc
        limit 5;
        """)
    rows=cursor.fetchall()
    cursor.close()
    con.close()
    
    top_films = []
    for row in rows:
        top_films.append({
            "film_id": row[0],
            "title": row[1],
            "rental_count": row[2]
        })
    
    return jsonify({"Top Rented Films": top_films}), 200

if __name__ == "__main__":
    app.run(debug=True, host='localhost', port='5000')