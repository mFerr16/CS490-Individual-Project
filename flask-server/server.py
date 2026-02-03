from flask import Flask
from flask_mysqldb import MySQL

app = Flask(__name__)

"""
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = 'your_password'
app.config['MYSQL_DB'] = 'your_database'

mysql = MySQL(app)
"""

@app.route("/members")
def members():
    return {"members": ["M1", " M2", "M3"]}

if __name__ == "__main__":
    app.run(debug=True)