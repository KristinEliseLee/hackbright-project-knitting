import unittest
import server_helper_functions as shf
from server import app
from model import connect_to_db, User, Pattern, UserLikesPattern, db, create_test_data
import json
from passlib.hash import argon2


class DBTestCase(unittest.TestCase):

    def setUp(self):
        self.client=app.test_client()
        app.config['TESTING'] = True
        connect_to_db(app,'knitpreviewtest')
        db.create_all()
        create_test_data()


    def test_get_most_liked(self):
        """in the test data, the pattern_2 was liked 4 times and named 'Purl'"""
        self.assertEqual(shf.get_most_liked()[0][1], 'Purl')


    def test_get_newest(self):
        """ create a new pattern, that pattern should be newest"""
        user = User.query.filter(User.email == 'potato@potato').first()
        pattern_new = Pattern(pattern_name='new', user_id=user.user_id, pattern_text='new')
        db.session.add(pattern_new)
        db.session.commit()
        self.assertEqual(shf.get_newest()[0][1],'new')


    def test_make_search_json(self):
        """in the test data, only 1 pattern had 'knit' in the name"""
        search_json =shf.make_search_json('knit', 1)
        search_dict = json.loads(search_json)
        self.assertEqual(search_dict['numResults'], 1)
        self.assertEqual(search_dict['patterns'][0][1], 'Knit')
        self.assertEqual(search_dict['numPages'], 1)


    def test_register_new_user(self):
        email = 'otatopay@potato'
        password='thisissafe'
        shf.register_new_user(email, password)
        user = User.query.filter(User.email == email).first()
        self.assertTrue(user)
        self.assertNotEqual(password, user.password)
        self.assertTrue(argon2.verify(password, user.password))


    def test_unlike_pattern(self):
        # in test data user with email 'fry@potato' liked pattern named 'Purl'
        pattern = Pattern.query.filter(Pattern.pattern_name == 'Purl').first()
        user = User.query.filter(User.email == 'fry@potato').first()
        self.assertIn(pattern, user.likes)
        shf.unlike_pattern(user.user_id, pattern.pattern_id)
        self.assertNotIn(pattern, user.likes)


    def test_like_pattern(self):
        # in test data user with email 'fry@potato' did not like pattern named 'Knit'
        pattern = Pattern.query.filter(Pattern.pattern_name == 'Knit').first()
        user = User.query.filter(User.email == 'fry@potato').first()
        self.assertNotIn(pattern, user.likes)
        shf.like_pattern(user.user_id, pattern.pattern_id)
        self.assertIn(pattern, user.likes)


    def test_save_new_pattern(self):
        user = User.query.filter(User.email == 'fry@potato').first()
        pattern_name = 'new_save'
        pattern_svg = 'would be SVG code'
        pattern_text = 'knit instructions'
        self.assertEqual(Pattern.query.filter(Pattern.pattern_name == pattern_name).all(),[])
        pattern = shf.save_new_pattern(user.user_id, pattern_text, pattern_name, pattern_svg)
        self.assertTrue(pattern)
        self.assertEqual(pattern.pattern_name,pattern_name)
        self.assertEqual(pattern.user_id,user.user_id)
        file = open(f'static/patternSVGs/{pattern.pattern_id}.svg')
        text = file.readline()
        file.close()
        self.assertEqual(text,pattern_svg)


class FlaskTestCase(unittest.TestCase):

    def setUp(self):
        self.client = app.test_client()
        app.config['TESTING'] = False
        app.config['SECRET_KEY'] = 'totalysecret'
        connect_to_db(app,'knitpreviewtest')
        db.create_all()
        create_test_data()

    def test_homepage(self):
        result = self.client.get('/')
        self.assertEqual(result.status_code, 200)
        self.assertIn(b'<h2>News</h2>', result.data)

    def test_search_shows(self):
        result = self.client.get('/patterns/search')
        self.assertIn(b'patternsSearch.js', result.data)

    def test_pattern_page_shows(self):
        pattern = Pattern.query.filter(Pattern.pattern_name=='Purl').first()
        result = self.client.get(f'/patterns/{pattern.pattern_id}')
        self.assertIn(b'Purl', result.data)
        self.assertIn(b'Row1: P10', result.data)

    def test_log_in_shows(self):
        result = self.client.get('/login')
        self.assertIn(b'Email Address', result.data)
        self.assertNotIn(b'Repeat Password', result.data)

    def test_login(self):
        result = self.client.post('/login', data={'email': 'potato@potato',
          'password': 'password'}, follow_redirects=True)
        self.assertIn(b'Patterns You Created', result.data)        

    def test_register_page_shows(self):
        result = self.client.get('/register')
        self.assertIn(b'Repeat Password', result.data)

    def test_register_user(self):
        result = self.client.post('/register', data={'email': 'testemail@email',
          'password': 'totalysecret', 'confirm': 'totalysecret'}, follow_redirects=True)
        self.assertIn(b'Patterns You Created', result.data)

    def test_user_logged_out_user_page(self):
        result = self.client.get('/user', follow_redirects = True)
        self.assertNotIn(b'Patterns You Created', result.data)
        self.assertIn(b'Email Address', result.data)

    def test_user_logged_out_new_pattern_page(self):
        result = self.client.get('/patterns/new', follow_redirects = True)
        self.assertNotIn(b'patternMakerReact.js', result.data)
        self.assertIn(b'Email Address', result.data)

    def test_user_logged_in_user_page(self):
        user = User.query.filter(User.email=='fry@potato').first()
        with self.client as c:
            with c.session_transaction() as sess:
                sess['user_id'] = user.user_id
        result = self.client.get('/user', follow_redirects = True)
        self.assertIn(b'Patterns You Created', result.data)
        self.assertNotIn(b'Email Address', result.data)

    def test_user_logged_in_new_pattern_page(self):
        user = User.query.filter(User.email=='fry@potato').first()
        with self.client as c:
            with c.session_transaction() as sess:
                sess['user_id'] = user.user_id
        result = self.client.get('/patterns/new', follow_redirects = True)
        self.assertIn(b'patternMakerReact.js', result.data)
        self.assertNotIn(b'Email Address', result.data)


if __name__ == '__main__':
    unittest.main()

