from flask import Flask, jsonify
import mysql.connector
from flask_cors import cross_origin

app = Flask(__name__)

#create connection to db
con=mysql.connector.connect(
    host='localhost',
    user='root',
    password='admin@1234',
    database='sakila' 
)

@app.route("/getFilms", methods=['GET'])
@cross_origin()
def get_films():
    cursor=con.cursor(dictionary=True) #gets each entry as a dict with column names
    
    #gets all customer data
    cursor.execute("""
        select *
        from film;
        """)
    films=cursor.fetchall() #fetch the query result into data
    cursor.close()
    return jsonify({"films":films}), 200 #return a json of data

@app.route("/getCustomers", methods=['GET'])
@cross_origin()
def get_customers():
    cursor=con.cursor(dictionary=True) #gets each entry as a dict with column names
    
    #gets all customer data
    cursor.execute("""
        select *
        from customer;
        """)
    data=cursor.fetchall() #fetch the query result into data
    cursor.close()
    return jsonify({"customers":data}), 200 #return a json of data

@app.route("/getTable", methods=['GET'])
def get_tables():
    cursor=con.cursor()
    cursor.execute("SHOW TABLES;")
    tables=cursor.fetchall()
    cursor.close()
    table_names=[table[0] for table in tables]
    return jsonify({"Top Films": table_names}), 200

@app.route("/topFilms", methods=['GET'])
def top_films():
    cursor=con.cursor()
    cursor.execute("""
        select f.title
        from film as f
        join film_category as fc
        on f.film_id = fc.film_id
        join category as c 
        on fc.category_id = c.category_id
        limit 5;
        """)
    films=cursor.fetchall()
    cursor.close()
    film_names = [film[0] for film in films]
    return jsonify({"Films": film_names}), 200

@app.route("/topActors")
def topActors():
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
    
    topactors =[]
    for actor in actors:
        name = actor[0] + " " +actor[1]
        topactors.append(name)
    return jsonify({"Actors": topactors}), 200

@app.route("/topRentedFilms", methods=["GET"])
def top_rented_films():
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
    rows = cursor.fetchall()
    cursor.close()

    top_films = []
    for row in rows:
        top_films.append({
            "film_id": row[0],
            "title": row[1],
            "rental_count": row[2]
        })

    return jsonify({"Top Rented Films": top_films}), 200


    

#remove at some point
@app.route("/members")
def members():
    return {"members": ["M1", " M2", "M3"]}

if __name__ == "__main__":
    app.run(debug=True, host='localhost', port='5000')
    con.close()