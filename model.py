
from flask_sqlalchemy import SQLAlchemy

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
    password = db.Column(db.String(50), nullable=False)

    created_patterns = db.relationship('Pattern', backref='created_by')

    likes = db.relationship('Pattern', secondary='userlikespattern',
                            backref='likes')

    def __repr__(self):
        return f"<User user_id: {self.user_id}, email:{self.email}>"


class Pattern(db.Model):
    """Pattern objects"""
    __tablename__ = 'patterns'
    pattern_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    pattern_text = db.Column(db.Text, nullable=False)
    pattern_url = db.Column(db.String(200), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'), nullable=False)

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


def example_data():
    user1 = User(user_id=1, email='potato@potato', password='password')
    user2 = User(user_id=2, email='tater@potato', password='safe')
    user3 = User(user_id=3, email='ptate@potato', password='secure')
    pattern1 = Pattern(pattern_id=1, pattern_text='knit 4', pattern_url='/patterns/1', user_id=1)
    pattern2 = Pattern(pattern_id=2, pattern_text='purl 3', pattern_url='/patterns/2', user_id=1)
    pattern3 = Pattern(pattern_id=3, pattern_text='knit 5', pattern_url='/patterns/3', user_id=2)
    pattern4 = Pattern(pattern_id=4, pattern_text='knit 2', pattern_url='/patterns/4', user_id=2)

    db.session.add_all([user1, user2, user3, pattern1, pattern2, pattern3, pattern4])
    db.session.commit()

    like1 = UserLikesPattern(like_id=1, user_id=1, pattern_id=3)
    like2 = UserLikesPattern(like_id=2, user_id=1, pattern_id=2)
    like3 = UserLikesPattern(like_id=3, user_id=3, pattern_id=3)
    db.session.add_all([like1, like2, like3])

    db.session.commit()


if __name__ == '__main__':

    from server import app

    connect_to_db(app, 'knitprojectpreview')
    # db.create_all()
    # example_data()
    print("Connected to DB.")
