from flask import Flask, jsonify
from flask_cors import CORS
import mysql.connector
from flask_cors import cross_origin
from markupsafe import escape

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
        select *
        from customer;
        """)
    data=cursor.fetchall()
    cursor.close()
    con.close()
    return jsonify({"customers":data}), 200

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