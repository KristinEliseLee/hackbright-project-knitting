from flask import Flask, render_template, flash, redirect, request, session
from passlib.hash import argon2
from flask_debugtoolbar import DebugToolbarExtension
import urllib
from flask_sqlalchemy import SQLAlchemy
import json
from sqlalchemy import desc
from sqlalchemy import func

from model import connect_to_db, User, Pattern, UserLikesPattern, db

from wtforms import Form, BooleanField, StringField, PasswordField, validators
from wtforms.validators import ValidationError

from forms import RegistrationForm, LoginForm
import math

app = Flask(__name__)
app.secret_key = 'ABCSECRETDEF'
# db = SQLAlchemy()
connect_to_db(app, 'knitpreviewproject')


@app.route('/')
def show_homepage():
    base_query = db.session.query(Pattern.pattern_id, Pattern.pattern_name,
        Pattern.pattern_url)

    latest = base_query.order_by(desc(Pattern.time_created)).limit(5).all()
    most_liked = base_query.join(UserLikesPattern).group_by(Pattern.pattern_id,
        Pattern.pattern_name, Pattern.pattern_url).order_by(desc(func.count(UserLikesPattern.like_id)
        )).limit(5).all()

    return render_template('home.html', latest=latest, most_liked=most_liked)


@app.route('/register')
def show_registration_form():
    form = RegistrationForm(request.form)
    return render_template('register.html', form=form)


@app.route('/register', methods=['POST'])
def register_user():
    """ Adds new user to the DB and logs them in"""
    form = RegistrationForm(request.form)
    if form.validate():
        user = User(email=form.email.data, password=argon2.hash(form.password.data))
        db.session.add(user)
        db.session.commit()

        session['user_id'] = user.user_id
        flash('Registered Successfully')
        return redirect('/user')
    return render_template('register.html', form=form)


@app.route('/login')
def show_login_page():
    form = LoginForm(request.form)
    return render_template('login.html', form=form)


@app.route('/login', methods=['POST'])
def login_user():
    """ Logs in user """
    form = LoginForm(request.form)
    if form.validate():
        user = User.query.filter_by(email=form.email.data).first()
        session['user_id'] = user.user_id
        flash('Logged In Successfully')
        return redirect('/user')
    return render_template('login.html', form=form)

@app.route('/logout')
def logout_user():
    del session['user_id']
    flash('Successfully logged out')
    return redirect('/')


@app.route('/user')
def show_user_page():
    """ Shows the user page only if logged in"""

    user_id = session.get('user_id')
    if user_id:
        return render_template('user.html',user=User.query.get(user_id))
    else:

        return redirect('/login')

@app.route('/settings')
def show_settings_page():
    """"""


@app.route('/patterns')
def show_all_patterns():
    """ currently shows all patterns in no particular order"""
    patterns = Pattern.query.order_by(Pattern.pattern_id).all()
    return render_template('patterns.html', patterns=patterns)


@app.route('/patterns/search')
def show_search_form():
    """"""
    return render_template('patterns_search.html')


@app.route('/patterns/search/results.json')
def get_search_results():
    """"""
    search_val = request.args.get('searchVal')
    per_page = 20
    page = int(request.args.get('page', 1))
    patterns = db.session.query(Pattern.pattern_id, Pattern.pattern_name, Pattern.pattern_url).filter(Pattern.pattern_name.ilike(f'%{search_val}%')).all()
    patterns_num = len(patterns)
    num_pages = math.ceil(len(patterns) / per_page)
    to_show = patterns[(per_page * (page - 1)): (per_page * page)]
    pattern_dict = {'patterns': to_show, 'numResults': patterns_num, 'numPages': num_pages, 'page': page}
    json_dict = json.dumps(pattern_dict)
    print(json_dict)
    return json_dict


@app.route('/patterns/new')
def create_pattern():
    """ Shows page to create new pattern only if logged in"""
    user_id = session.get('user_id')
    if user_id:
        return render_template('patterns_new.html')
    else:
        return redirect('/login')


@app.route('/patterns/<pattern_id>')
def show_pattern(pattern_id):
    """ Based on user log status, shows like button on pattern page. """
    user_id = session.get('user_id')
    pattern= Pattern.query.get(pattern_id)
    if not user_id:
        to_like = 'logged out'
    elif pattern.user_id == user_id:
        to_like = 'created'
    elif UserLikesPattern.query.filter_by(user_id=user_id, pattern_id=pattern_id).first():
        to_like = 'liked'
    else:
        to_like = 'like'

    # pattern_svg_info = open(pattern.pattern_url)
    # pattern_svg = pattern_svg_info.readline().rstrip();
    return render_template('pattern.html', pattern=pattern, to_like=to_like)


@app.route('/patterns/<pattern_id>', methods=['POST'])
def like_pattern(pattern_id):
    """ Toggles on or off user like of pattern"""
    pattern = Pattern.query.get(pattern_id)
    user = User.query.get(session['user_id'])
    if pattern in user.likes:
        old_like = UserLikesPattern.query.filter_by(user_id=user.user_id, pattern_id=pattern.pattern_id).first()
        db.session.delete(old_like)
        db.session.commit()
        return 'like'

    if pattern in user.created_patterns:
        return 'created'

    else:
        new_like = UserLikesPattern(user_id=user.user_id, pattern_id=pattern.pattern_id)
        db.session.add(new_like)
        db.session.commit()
        return 'liked'


@app.route('/save', methods=['POST'])
def save_pattern():
    """ Saves the pattern to the DB, creates a saved SVG text file."""
    svg_string = request.form.get('svgString')
    pattern_text = request.form.get('patternText')
    pattern_name = request.form.get('name')
    user_id = session.get('user_id')
    pattern = Pattern(user_id=user_id, pattern_text=pattern_text,
        pattern_name=pattern_name)
    db.session.add(pattern)
    db.session.commit()
    # Creates the file as {pattern_id}.txt
    # Cant create the file until pattern has a pattern_id.
    save_file = open((f'static/patternSVGs/{pattern.pattern_id}.svg'), 'w')
    save_file.write(svg_string)
    save_file.close()
    pattern.pattern_url = (f'/static/patternSVGs/{pattern.pattern_id}.svg')
    db.session.commit()
    # Gives back the pattern_id for redirect
    print(pattern.pattern_url)
    return str(pattern.pattern_id)


if __name__ == '__main__':

    app.debug = True

    # Use the DebugToolbar
    DebugToolbarExtension(app)

    app.run(host="0.0.0.0")
