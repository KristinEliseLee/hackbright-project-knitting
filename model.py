
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from sqlalchemy.sql import func

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


if __name__ == '__main__':

    from server import app

    connect_to_db(app, 'knitpreviewproject')
    db.create_all()

