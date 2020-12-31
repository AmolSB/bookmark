import os
import unittest
import json
from flask import Flask

from app import app
from models import setup_db, Collection

class AppNameTestCase(unittest.TestCase):
    """This class represents the ___ test case"""

    def setUp(self):
        """Executed before each test. Define test variables and initialize app."""
        self.app = Flask(__name__)
        setup_db(self.app)
        self.client = app.test_client
        # self.database_path = 'postgres://itxpebkiznjnqa:3ad5e249a2810ad4ea3c7424808aabde3f6dbad7b310af1a4d4ca20060a0d6ad@ec2-50-19-247-157.compute-1.amazonaws.com:5432/dd0tht8mo6moqg'
        

    def tearDown(self):
        """Executed after reach test"""
        pass

    def test_should_return_public_collections(self):

        res = self.client().get('/public-collections')
        data = res.get_json()
        self.assertEqual(data["code"], 200)
        public_collections = Collection.query.filter(Collection.is_public == True).all()
        self.assertEqual(len(data["data"]), len(public_collections))


    # This test should return 401 because only admin can perform curd on a public collection.
    def test_should_not_create_a_public_collection(self):
        collection = {
            "name": 'Public Test'
        }
        res = self.client().post('/public-collections', data=json.dumps(collection), headers={'Content-Type': 'application/json'})
        data = res.get_json()
        self.assertEqual(data["code"], 401)

    
    # This test should return 401 because only logged in user can view private collections.
    def test_should_not_return_private_collection(self):
        res = self.client().get('/collections')
        data = res.get_json()
        self.assertEqual(data["code"], 401)

    # This test should return 401 because only logged in user can create a new private collection.
    def test_should_not_create_a_private_collection(self):
        collection = {
            "name": "Private Collection"
        }

        res = self.client().post('/collections', data=json.dumps(collection), headers={'Content-Type': 'application/json'})
        data = res.get_json()
        self.assertEqual(data["code"], 401)


# Make the tests conveniently executable
if __name__ == "__main__":
    unittest.main()