import sqlite3
from flask import g

DATABASE = 'secrethitler.db'

def get_db():
    if 'db' not in g:
        g.db = sqlite3.connect(DATABASE)
        g.c = g.db.cursor()
    return g.db, g.c

def close_db():
    db = g.pop('db', None)
    if db is not None:
        db.close()