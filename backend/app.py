from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector

app = Flask(__name__)
CORS(app)

# Database Connection
def get_db_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="suhani8857",
        database="study"
    )

# Test Route
@app.route("/")
def home():
    return "StudyFlow Backend Running"

# -------------------------
# SIGNUP API
# -------------------------
@app.route("/signup", methods=["POST"])
def signup():
    try:
        data = request.json

        name = data.get("name")
        email = data.get("email")
        password = data.get("password")

        db = get_db_connection()
        cursor = db.cursor()

        sql = """
        INSERT INTO users (name, email, password)
        VALUES (%s, %s, %s)
        """

        cursor.execute(sql, (name, email, password))
        db.commit()

        cursor.close()
        db.close()

        return jsonify({"message": "User registered successfully"})

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# -------------------------
# LOGIN API
# -------------------------
@app.route("/login", methods=["POST"])
def login():
    try:
        data = request.json

        email = data.get("email")
        password = data.get("password")

        db = get_db_connection()
        cursor = db.cursor(dictionary=True)

        sql = """
        SELECT * FROM users
        WHERE email = %s AND password = %s
        """

        cursor.execute(sql, (email, password))
        user = cursor.fetchone()

        cursor.close()
        db.close()

        if user:
            return jsonify({
                "message": "Login successful",
                "user": user
            })
        else:
            return jsonify({
                "message": "Invalid email or password"
            }), 401

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# -------------------------
# GET ALL USERS
# -------------------------
@app.route("/users", methods=["GET"])
def get_users():
    try:
        db = get_db_connection()
        cursor = db.cursor(dictionary=True)

        cursor.execute("SELECT * FROM users")
        users = cursor.fetchall()

        cursor.close()
        db.close()

        return jsonify(users)

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(port=5000, debug=True)