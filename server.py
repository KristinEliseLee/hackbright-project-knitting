from flask import Flask, render_template, flash, redirect, request, session, jsonify
from flask_debugtoolbar import DebugToolbarExtension
from model import connect_to_db, User, Pattern, UserLikesPattern, db
from forms import RegistrationForm, LoginForm
from server_helper_functions import *

app = Flask(__name__)
app.secret_key = 'ABCSECRETDEF'
connect_to_db(app, 'knitpreviewproject')


@app.route('/')
def show_homepage():

    latest = get_newest()
    most_liked = get_most_liked()

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
        user_id = register_new_user(form.email.data.lower(), form.password.data)
        session['user_id'] = user_id
        flash('Registered Successfully')
        
    return jsonify(data=form.errors)


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
    return jsonify(data=form.errors)

@app.route('/logout')
def logout_user():
    del session['user_id']
    flash('Successfully logged out')
    return redirect('/')


@app.route('/user')
def show_current_user_page():
    """ Shows the user page only if logged in"""
    user_id = session.get('user_id')
    if user_id:
        return render_template('user.html',user=User.query.get(user_id))
    else:

        return redirect('/login')

# @app.route('/settings')
# def show_settings_page():
#     """"""

# @app.route('/users')
# def show_list_of_users():
#     """"""

# @app.route('/users/<user_id>')
# def show_user_id_page():
#     """"""

@app.route('/patterns')
def show_all_patterns():
    """ shows the results of seach '' """
    return render_template('patterns.html')


@app.route('/patterns/search')
def show_search_form():
    """ Patterns search page"""
    return render_template('patterns_search.html')


@app.route('/patterns/search/results.json')
def get_search_results():
    """Sends search results back for AJAX"""
    search_val = request.args.get('searchVal')
    page = int(request.args.get('page', 1,))
    return make_search_json(search_val, page, 10)


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
    return render_template('pattern.html', pattern=pattern, to_like=to_like)


@app.route('/patterns/<pattern_id>', methods=['POST'])
def like_or_unlike_pattern(pattern_id):
    """ Toggles on or off user like of pattern"""
    pattern = Pattern.query.get(pattern_id)
    user = User.query.get(session['user_id'])
    if pattern in user.likes:
        unlike_pattern(user.user_id, pattern_id)
        return 'like'

    if pattern in user.created_patterns:
        return 'created'

    else:
        like_pattern(user.user_id, pattern_id)
        return 'liked'


@app.route('/save', methods=['POST'])
def save_pattern():
    """ Saves the pattern to the DB, creates a saved SVG text file."""
    svg_string = request.form.get('svgString')
    pattern_text = request.form.get('patternText')
    pattern_name = request.form.get('name')
    user_id = session.get('user_id')

    pattern = save_new_pattern(user_id, pattern_text, pattern_name, svg_string)
    return str(pattern.pattern_id)


if __name__ == '__main__':

    app.debug = True

    # Use the DebugToolbar
    # DebugToolbarExtension(app)

    app.run(host="0.0.0.0")
