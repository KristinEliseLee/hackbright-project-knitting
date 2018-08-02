from flask import Flask, render_template, flash, redirect, request, session

from flask_debugtoolbar import DebugToolbarExtension
import urllib
from flask_sqlalchemy import SQLAlchemy

from model import connect_to_db, User, Pattern, UserLikesPattern

from wtforms import Form, BooleanField, StringField, PasswordField, validators
from wtforms.validators import ValidationError

from forms import RegistrationForm, LoginForm



app = Flask(__name__)
app.secret_key = 'ABCSECRETDEF'
db = SQLAlchemy()
connect_to_db(app, 'knitpreviewproject')


@app.route('/')
def show_homepage():

    return render_template('home.html')


@app.route('/register')
def show_registration_form():
    form = RegistrationForm(request.form)
    return render_template('register.html', form=form)


@app.route('/register', methods=['POST'])
def register_user():
    """adds new user to the DB and logs them in"""
    form = RegistrationForm(request.form)
    if form.validate():
        user = User(email=form.email.data, password=form.password.data)
        db.session.add(user)
        db.session.commit()

        session['user_id'] = user.user_id
        flash('Registered Successfully')
        return redirect('/user')
    return render_template('register.html', form=form)



@app.route('/login')
def show_login_page():
    """"""
    form = LoginForm(request.form)
    return render_template('login.html', form=form)


@app.route('/login', methods=['POST'])
def login_user():
    """"""
    form = LoginForm(request.form)
    if form.validate():
        user = User.query.filter_by(email=form.email.data).first()
        session['user_id'] = user.user_id
        flash('Logged In Successfully')
        return redirect('/user')
    return render_template('login.html', form=form)


    # the below was for AJAX version, the above uses WTForms
    # email = request.form.get('email')
    # password = request.form.get('password')
    # user = User.query.filter_by(email=email).first()
    # if not user or user.password != password:
    #     print('no')
    #     return 'no'
    # else:
    #     session['user_id'] = user.user_id
    #     flash("Successfully logged in")
    #     print('yes')
    #     return 'yes'

@app.route('/logout')
def logout_user():
    del session['user_id']
    flash('Successfully logged out')
    return redirect('/')

@app.route('/user')
def show_user_page():
    """"""

    user_id = session.get('user_id')
    if user_id:
        return render_template('user.html',user=User.query.get(user_id))
    else:

        return redirect('/login')


@app.route('/patterns/new')
def create_pattern():
    return render_template('new_pattern.html')

@app.route('/patterns/new/react')
def create_pattern_react():
    return render_template('new_pattern_react.html')


@app.route('/patterns/<pattern_id>')
def show_pattern(pattern_id):
    pattern= Pattern.query.get(pattern_id)
    return render_template('pattern.html', pattern=pattern)


@app.route('/patterns/<pattern_id>', methods=['POST'])
def like_pattern(pattern_id):
    pattern = Pattern.query.get(pattern_id)
    user = User.query.get(session['user_id'])
    if pattern in user.likes:
        return 'already liked'
    elif pattern in user.patterns:
        return 'you made this'
    else:
        new_like = Like(user_id=user.user_id, pattern_id=pattern.pattern_id)
        db.session.add(new_like)
        db.session.commit()
        return 'added'





if __name__ == '__main__':

    app.debug = True

    # Use the DebugToolbar
    DebugToolbarExtension(app)

    app.run(host="0.0.0.0")



