
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from sqlalchemy.sql import func
from passlib.hash import argon2

db = SQLAlchemy()

def connect_to_db(app, db_name):
    """Connect to the db"""

    app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql:///' + db_name
    app.config['SQLALCHEMY_ECHO'] = False
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    db.app = app
    db.init_app(app)


class User(db.Model):
    """User objects"""
    __tablename__ = 'users'
    user_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    email = db.Column(db.String(100), nullable=False, unique=True)
    password = db.Column(db.String(200), nullable=False)

    created_patterns = db.relationship('Pattern', backref='created_by')

    likes = db.relationship('Pattern', secondary='userlikespattern',
                            backref='likes')

    def __repr__(self):
        return f"<User user_id: {self.user_id}, email:{self.email}>"


class Pattern(db.Model):
    """Pattern objects"""
    __tablename__ = 'patterns'
    pattern_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    pattern_name= db.Column(db.String(200), nullable=False)
    pattern_text = db.Column(db.Text, nullable=False)
    pattern_url = db.Column(db.String(200))
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'), nullable=False)
    time_created = db.Column(db.DateTime, server_default=func.now())
    def __repr__(self):
        return f"<Pattern created by user_id {self.user_id} pattern_url: {self.pattern_url}>"


class UserLikesPattern(db.Model):
    """Association table of users and likes"""
    __tablename__ = 'userlikespattern'
    like_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    pattern_id = db.Column(db.Integer, db.ForeignKey('patterns.pattern_id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'),  nullable=False)

    def __repr__(self):
        return f"<Like user_id:{self.user_id} pattern_id:{self.pattern_id}>"

def create_test_data():
    UserLikesPattern.query.delete()
    Pattern.query.delete()
    User.query.delete()
    user_1 = User(email='potato@potato', password=argon2.hash('password'))
    user_2 = User(email='tater@potato', password=argon2.hash('supersafe'))
    user_3 = User(email='ptate@potato', password=argon2.hash('asecret'))
    user_4 = User(email='mashed@potato', password=argon2.hash('totessecure'))
    user_5 = User(email='fry@potato', password=argon2.hash('omgsecret'))
    db.session.add_all([user_1, user_2, user_3, user_4, user_5])
    db.session.commit()
    pattern_1 = Pattern(user_id=user_1.user_id, pattern_name='Knit', pattern_text=
        'Row1: K10', pattern_url='/static/patternSVGs/1.svg')
    pattern_2 = Pattern(user_id=user_1.user_id, pattern_name='Purl', pattern_text=
        'Row1: P10', pattern_url='/static/patternSVGs/2.svg')
    pattern_3 = Pattern(user_id=user_2.user_id, pattern_name='1x1 Rib', pattern_text=
        'Row1: K1P1K1P1K1P1', pattern_url='/static/patternSVGs/3.svg')
    pattern_4 = Pattern(user_id=user_2.user_id, pattern_name='2x2 Rib', pattern_text=
        'Row1: K2P2K2P2', pattern_url='/static/patternSVGs/4.svg')
    pattern_5 = Pattern(user_id=user_3.user_id, pattern_name='cable 2x2 row', pattern_text=
        'Row1: CFk2 CBK2 CFK2 CBK2', pattern_url='/static/patternSVGs/5.svg')
    db.session.add_all([pattern_1, pattern_2, pattern_3, pattern_4, pattern_5])
    db.session.commit()
    like_1 = UserLikesPattern(user_id=user_2.user_id, pattern_id=pattern_1.pattern_id)
    like_2 = UserLikesPattern(user_id=user_2.user_id, pattern_id=pattern_2.pattern_id)
    like_3 = UserLikesPattern(user_id=user_1.user_id, pattern_id=pattern_5.pattern_id)
    like_4 = UserLikesPattern(user_id=user_4.user_id, pattern_id=pattern_2.pattern_id)
    like_5 = UserLikesPattern(user_id=user_5.user_id, pattern_id=pattern_5.pattern_id)
    like_6 = UserLikesPattern(user_id=user_3.user_id, pattern_id=pattern_2.pattern_id)
    like_7 = UserLikesPattern(user_id=user_5.user_id, pattern_id=pattern_2.pattern_id)
    like_8 = UserLikesPattern(user_id=user_5.user_id, pattern_id=pattern_3.pattern_id)
    db.session.add_all([like_1, like_2, like_3, like_4, like_5, like_6, like_7, like_8])
    db.session.commit()


if __name__ == '__main__':

    from server import app

    connect_to_db(app, 'knitpreviewproject')
    db.create_all()

