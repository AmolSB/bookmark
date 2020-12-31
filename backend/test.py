import os
import unittest
import json
from flask import Flask
from app import app
from models import setup_db, Collection


ADMIN_TOKEN = os.environ.get('ADMIN_TOKEN')
USER_TOKEN = os.environ.get('USER_TOKEN')

class AppNameTestCase(unittest.TestCase):
    """This class represents the ___ test case"""

    def setUp(self):
        """Executed before each test. Define test variables and
        initialize app."""
        self.app = Flask(__name__)
        setup_db(self.app)
        self.client = app.test_client

    def tearDown(self):
        """Executed after reach test"""
        pass

    # This test should return 200 as viewing public collections does not
    # require any authentication or authorization

    def test_should_return_public_collections(self):

        res = self.client().get('/public-collections')
        data = res.get_json()
        self.assertEqual(data["code"], 200)
        public_collections = Collection.query.filter(
            Collection.is_public).all()
        self.assertEqual(len(data["data"]), len(public_collections))

    # This test should return 401 because only admin can perform curd on a
    # public collection.

    def test_user_should_not_create_a_public_collection(self):
        collection = {
            "name": 'Public Test'
        }
        res = self.client().post(
            '/public-collections',
            data=json.dumps(collection),
            headers={
                'Content-Type': 'application/json'})
        data = res.get_json()
        self.assertEqual(data["code"], 401)

    # This test should return 200 because ADMIN can create a public collection

    def test_should_crate_a_public_collection(self):
        collection = {
            "name": 'Admin Test'
        }
        res = self.client().post(
            '/public-collections',
            data=json.dumps(collection),
            headers={
                'Content-Type': 'application/json',
                'Authorization': f'Bearer {ADMIN_TOKEN}'})
        data = res.get_json()
        print(data)
        self.assertEqual(data['code'], 200)

    # This test should return 401 because only logged in user can view private
    # collections.

    def test_should_not_return_private_collection(self):
        res = self.client().get('/collections')
        data = res.get_json()
        self.assertEqual(data["code"], 401)

    # This test should return 401 because only logged in user can create a new
    # private collection.

    def test_should_not_create_a_private_collection(self):
        collection = {
            "name": "Private Collection"
        }

        res = self.client().post('/collections', data=json.dumps(collection),
                                 headers={'Content-Type': 'application/json'})
        data = res.get_json()
        self.assertEqual(data["code"], 401)

    # This test should return 200 because a logged in user can create a
    # private collection

    def test_should_crate_a_private_collection(self):
        collection = {
            "name": 'User Test'
        }
        res = self.client().post(
            '/collections',
            data=json.dumps(collection),
            headers={
                'Content-Type': 'application/json',
                'Authorization': f'Bearer {USER_TOKEN}'})
        data = res.get_json()
        print(data)
        self.assertEqual(data['code'], 200)

    # This test should return 200 because a logged in user can save a link in
    # his/her collection

    def test_should_save_a_link_in_private_collection(self):
        user_collection_id = '149580edb7ba433db8f311915daa9e67'
        link = {
            "url": "https://www.youtube.com",
            "description": "Youtube is good",
        }
        res = self.client().post(
            f'/links?collection_id={user_collection_id}',
            data=json.dumps(link),
            headers={
                'Content-Type': 'application/json',
                'Authorization': f'Bearer {USER_TOKEN}'})
        data = res.get_json()
        print(data)
        self.assertEqual(data["code"], 200)

    # This test should return 200 because a logged in user can edit his/her
    # saved link

    def test_should_update_a_link_in_private_collection(self):
        # user_collection_id = '149580edb7ba433db8f311915daa9e67'
        link = {
            "id": "c5aa8b1889a74f86bc7cfd8fda9b08ba",
            "description": "Youtube is good after patching as well",
            "url": "https://www.youtube.com"
        }

        res = self.client().patch('links', data=json.dumps(link), headers={
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {USER_TOKEN}'
        })

        data = res.get_json()
        print(data)
        self.assertEqual(data["code"], 200)

    # This test should return 401 because only a logged in user can save a
    # link and only admin can save links in public collections
    def test_should_not_save_a_link_in_any_collection(self):
        user_collection_id = ''
        link = {
            "url": "https://www.youtube.com",
            "description": "Youtube is good",
        }
        res = self.client().post(
            f'/links?collection_id={user_collection_id}',
            data=json.dumps(link),
            headers={
                'Content-Type': 'application/json',
            })
        data = res.get_json()
        self.assertEqual(data["code"], 404)


# Make the tests conveniently executable
if __name__ == "__main__":
    unittest.main()
