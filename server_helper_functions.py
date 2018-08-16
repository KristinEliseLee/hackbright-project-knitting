
from passlib.hash import argon2
import json
from sqlalchemy import desc, func
from model import connect_to_db, User, Pattern, UserLikesPattern, db
import math


def get_most_liked():
    """ Returns top 5 most liked patterns"""
    base_query = db.session.query(Pattern.pattern_id, Pattern.pattern_name,
        Pattern.pattern_url)
    most_liked = base_query.join(UserLikesPattern).group_by(Pattern.pattern_id,
        Pattern.pattern_name, Pattern.pattern_url).order_by(desc(func.count(UserLikesPattern.like_id)
        )).limit(5).all()
    return most_liked


def get_newest():
    """ Returns top 5 newest patterns"""
    base_query = db.session.query(Pattern.pattern_id, Pattern.pattern_name,
        Pattern.pattern_url)
    newest = base_query.order_by(desc(Pattern.time_created)).limit(5).all()
    return newest


def register_new_user(email, password):
    """ Registers a new user in the database. Does not check if user already exists"""
    user = User(email=email, password=argon2.hash(password))
    db.session.add(user)
    db.session.commit()
    return user.user_id


def make_search_json(search_val,page, per_page=20):
    """ Create a JSON with requested search information"""
    patterns = db.session.query(Pattern.pattern_id, Pattern.pattern_name,
        Pattern.pattern_url).filter(Pattern.pattern_name.ilike(
            f'%{search_val}%')).all()
    patterns_num = len(patterns)
    num_pages = math.ceil(len(patterns) / per_page)
    to_show = patterns[(per_page * (page - 1)): (per_page * page)]
    pattern_dict = {'patterns': to_show, 'numResults': patterns_num, 'numPages': num_pages, 'page': page}
    json_dict = json.dumps(pattern_dict)
    return json_dict


def unlike_pattern(user_id, pattern_id):
    """ Removes a like from the DB"""
    old_like = UserLikesPattern.query.filter_by(user_id=user_id, pattern_id=pattern_id).first()
    db.session.delete(old_like)
    db.session.commit()


def like_pattern(user_id, pattern_id):
    """ Adds a like to the DB"""
    new_like = UserLikesPattern(user_id=user_id, pattern_id=pattern_id)
    db.session.add(new_like)
    db.session.commit()


def save_new_pattern(user_id, pattern_text, pattern_name, svg_string):
    """ Saves pattern SVG and adds pattern to DB"""
    pattern = Pattern(user_id=user_id, pattern_text=pattern_text,
        pattern_name=pattern_name)
    db.session.add(pattern)
    db.session.commit()
    save_file = open((f'static/patternSVGs/{pattern.pattern_id}.svg'), 'w')
    save_file.write(svg_string)
    save_file.close()
    pattern.pattern_url = (f'/static/patternSVGs/{pattern.pattern_id}.svg')
    db.session.commit()
    return pattern
