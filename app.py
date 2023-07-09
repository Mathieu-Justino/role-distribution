from flask import Flask, g
import sqlite3
from routes import routes_bp

# Flask configuration
app = Flask(__name__)
app.secret_key = "Ilikewaffles20"
app.config["SESSION_TYPE"] = "filesystem"

# Get routes from routes.py
app.register_blueprint(routes_bp)


if __name__ == "__main__":
    app.run()

