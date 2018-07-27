from flask import Flask, render_template, flash, redirect, request, session

from flask_debugtoolbar import DebugToolbarExtension
import urllib

from model import connect_to_db, User, Pattern, UserLikesPattern

from wtforms import Form, BooleanField, StringField, PasswordField, validators, ValidationError

class RegistrationForm(Form):

    def validate_new_user(form, field):
        if User.query.filter_by(email=field.data):
            raise ValidationError('That email is taken')

    email = StringField('Email Address', [
        validators.Length(min=6, max=100),
        validate_new_user])
    password = PasswordField('New Password', [
        validators.DataRequired(),
        validators.EqualTo('confirm', message='Passwords must match'),
        validators.Length(min=6, max=50),
    ])
    confirm = PasswordField('Repeat Password')




app = Flask(__name__)
app.secret_key = 'ABCSECRETDEF'
connect_to_db(app, 'knitpreviewproject')

@app.route('/')
def show_homepage():

    return render_template('home.html')


@app.route('/register')
def show_registration_form():
    form = RegistrationForm(request.form)
    if request.method == 'POST' and form.validate():
        user = User(form.username.data, form.email.data,
                    form.password.data)
        db_session.add(user)
        flash('Thanks for registering')
        return redirect(url_for('login'))
    return render_template('register.html', form=form)


@app.route('/register', methods=['POST'])
def register_user():
    """adds new user to the DB and logs them in"""
    form = RegistrationForm(request.form)
    if form.validate():
        user = User(email=form.email.data, password=form.password.data)
        db_session.add(user)

        session['user_id'] = user.user_id
        flash('Registered Successfully')
        return redirect('/user')
    return render_template('register.html', form=form)


@app.route('/login')
def show_login_page():
    """"""
    return render_template('login.html')


@app.route('/login', methods=['POST'])
def login_user():
    """"""
    email = request.form.get('email')
    print(email)
    # email = urllib.unquote(email).decode('utf8')
    password = request.form.get('password')
    print(password)
    user = User.query.filter_by(email=email).first()
    if not user or user.password != password:
        print('no')
        return 'no'
    else:
        session['user_id'] = user.user_id
        flash("Successfully logged in")
        print('yes')
        return 'yes'

@app.route('/logout')
def logout_user():
    del session['user_id']
    flash('Successfully logged out')
    return redirect('/')


@app.route('/patterns/new')
def get_pattern_text():
    """"""

    return render_template('patterns-new.html')

@app.route('/user')
def show_user_page():
    """"""

    user_id = session.get('user_id')
    if user_id:
        return render_template('user.html',user=User.query.get(user_id))
    else:

        return redirect('/login')




if __name__ == '__main__':

    app.debug = True

    # Use the DebugToolbar
    DebugToolbarExtension(app)

    app.run(host="0.0.0.0")



