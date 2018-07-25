from flask import Flask, render_template, flash
from flask_debugtoolbar import DebugToolbarExtension

from model import connect_to_db


app = Flask(__name__)
app.secret_key = 'ABCSECRETDEF'

@app.route('/')
def show_homepage():

    return render_template('home.html')
