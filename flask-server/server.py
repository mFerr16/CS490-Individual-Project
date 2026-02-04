from flask import Flask, jsonify
import mysql.connector

app = Flask(__name__)

#create connection to db
con=mysql.connector.connect(
    host='localhost',
    user='root',
    password='',
    database='sakila'
    
)

@app.route("/getTable", methods=['GET'])
def get_tables():
    cursor=con.cursor()
    cursor.execute("SHOW TABLES;")
    tables=cursor.fetchall()
    cursor.close()
    table_names=[table[0] for table in tables]
    return jsonify({"Top Films": table_names}), 200

@app.route("/topFilms", methods=['GET'])
def topFilms():
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


@app.route("/members")
def members():
    return {"members": ["M1", " M2", "M3"]}

if __name__ == "__main__":
    app.run(debug=True, host='localhost', port='5000')