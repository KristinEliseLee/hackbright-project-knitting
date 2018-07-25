from flask import Flask, render_template
from flask_debugtoolbar import DebugToolbarExtension

from model import connect_to_db


app = Flask(__name__)
app.secret_key = 'ABCSECRETDEF'
