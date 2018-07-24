from flask_sqlalchemy import SQLAlchemy

db=SQLAlchemy()
def connect_to_db(app, db_name):
    """Connect to the db"""
    app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql:///' + db_name
    app.config['SQLALCHEMY_ECHO'] = True
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    db.app = app
    db.init_app(app)

class User(db.Model):
    """User objects"""
    __tablename__ = 'users'
    user_id = db.Column(db.Integer, primary_key= True, autoIncrement=True)
    email = db.Column(db.String(100), nullable=False, unique=True)
    password = db.Column(db.String(50), nullable=False)
        created_patterns = db.relationship('Pattern', backref='created_by')
        likes = db.relationship('Pattern', secondary='UserLikesPattern', 
            backref='likes')
    def __repr__(self):
        return f"<User user_id: {self.user_id}, email:{self.email}>"


class Pattern(db.Model):
    """Pattern objects"""
    __tablename__ = 'patterns'
    pattern_id = db.Column(db.Integer, primary_key= True, autoIncrement=True)
    pattern_text = db.Column(db.Text, nullable=False)
    pattern_url = db.Column(db.String(200), nullable=false)
    user_id = db.ForeignKey('users.user_id')

    def __repr__(self):
        return f"<Pattern created by{self.user_id} pattern_url:{self.pattern_url}>"


class UserLikesPattern(db.Model):
    """Association table of users and likes"""
    __tablename__ = 'user_likes_pattern'
    like_id = db.Column(db.Integer, primary_key= True, autoIncrement=True)
    pattern_id = db.ForeignKey('patterns.pattern_id')
    user_id = db.ForeignKey('users.user_id')

    def __repr__(self):
        return f"<Like user_id:{self.user_id} pattern_id:{self.pattern_id}>"

connect_to_db('knitpreview')