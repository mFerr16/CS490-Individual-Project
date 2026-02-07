from flask import Flask, jsonify
from flask_cors import CORS
import mysql.connector
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
CORS(app)

#create connection to db using environment variables
con=mysql.connector.connect(
    host=os.getenv('database_host'),
    user=os.getenv('database_user'),
    password=os.getenv('database_pass'),
    database=os.getenv('database_name')
)

@app.route("/getFilms", methods=['GET'])
def get_films():
    cursor=con.cursor(dictionary=True)
    
    cursor.execute("""
        select f.film_id, f.title, f.rating, f.last_update, fc.category_id, c.name
        from film as f
        join film_category as fc
        on f.film_id = fc.film_id
        join category as c 
        on fc.category_id = c.category_id;
        """)
    films=cursor.fetchall()
    cursor.close()
    return jsonify({"films":films}), 200

@app.route("/getCustomers", methods=['GET'])
def get_customers():
    cursor=con.cursor(dictionary=True)
    
    cursor.execute("""
        select *
        from customer;
        """)
    data=cursor.fetchall()
    cursor.close()
    return jsonify({"customers":data}), 200

@app.route("/getTable", methods=['GET'])
def get_tables():
    cursor=con.cursor()
    cursor.execute("SHOW TABLES;")
    tables=cursor.fetchall()
    cursor.close()
    table_names=[table[0] for table in tables]
    return jsonify({"Top Films": table_names}), 200

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
    rows=cursor.fetchall()
    cursor.close()
    
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
    con.close()