from wtforms import Form, BooleanField, StringField, PasswordField, validators
from wtforms.validators import ValidationError

from model import connect_to_db, User, Pattern, UserLikesPattern

class RegistrationForm(Form):

    def validate_new_user(form, field):
        if User.query.filter_by(email=field.data).first():
            raise ValidationError('That email is taken')

    email = StringField('Email Address', [
        validators.InputRequired(),
        validators.Length(min=6, max=100),
        validate_new_user])
    password = PasswordField('New Password', [
        validators.InputRequired(),
        validators.EqualTo('confirm', message='Passwords must match'),
        validators.Length(min=6, max=50),
    ])
    confirm = PasswordField('Repeat Password')


class LoginForm(Form):

    def validate_user_exists(form, field):
        if not User.query.filter_by(email=field.data).first():
            raise ValidationError('User not found')

    def validate_user_password_match(form, field):
        user = User.query.filter_by(email=form.email.data).first()
        if user:
            if user.password != field.data:
                raise ValidationError('Password does not match')


    email = StringField('Email Address', [
        validators.InputRequired(),
        validators.Length(min=6, max=100), 
        validate_user_exists
        ])
    password = PasswordField('Password', [
        validators.InputRequired(),
        validate_user_password_match,
        validators.Length(min=6, max=50)
        ])

    

