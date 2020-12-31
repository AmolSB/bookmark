import os
import unittest
import json
from flask import Flask

from app import app
from models import setup_db, Collection

ADMIN_TOKEN='eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ik1fQlNCbG1McVRVX2RDaEJKb21NViJ9.eyJpc3MiOiJodHRwczovL3Byb2plY3QtYm9va21hcmsudXMuYXV0aDAuY29tLyIsInN1YiI6ImF1dGgwfDVmZWQ3NzNiMDgyODRiMDA2YmI1NzBjZSIsImF1ZCI6WyJodHRwczovL2RlbHRhcHJvcC5oZXJva3VhcHAuY29tLyIsImh0dHBzOi8vcHJvamVjdC1ib29rbWFyay51cy5hdXRoMC5jb20vdXNlcmluZm8iXSwiaWF0IjoxNjA5NDAwNTMzLCJleHAiOjE2MDk0MDc3MzMsImF6cCI6Im9YVkhHdmMyblJWeG5ZdnVlZTBDV3ZuSFVkVHV2dm5NIiwic2NvcGUiOiJvcGVuaWQgcHJvZmlsZSBlbWFpbCIsInBlcm1pc3Npb25zIjpbImNyZWF0ZTpwdWJsaWMtY29sbGVjdGlvbnMiLCJkZWxldGU6cHVibGljLWNvbGxlY3Rpb25zIiwicmVhZDpwdWJsaWMtY29sbGVjdGlvbnMiLCJ1cGRhdGU6cHVibGljLWNvbGxlY3Rpb25zIl19.xOE4p75Pcbnzr-93ImT1FEcnxtVnwIxqJtD4-4SOCR5Nh9BNOKgDobx75KOMm08H1S0Ct_2CdsmvyD0J27LTAbLwktCXnJx9RT-qr7poits6SKNJfLypKCtQAJY05_Dr2idaSgot0na55aAtqxy2flF3Eb2wngxxIO7U4MqijFaEdk1FLzqCrT_zGnz7E8VGLVwAueoZ6y1JfhRQ4aby8SqTzAlNg4VbxogulI7RI1SsaouLWmU2Yp2P33aDMw7hApNLytnmSWVaxGiBFEktNUddKOe9B8b3gksICEX2DdR3eA5zkLCZANYNakIRmV9kGWJQiYnpKk1TopWCxJo1Jw'
USER_TOKEN='eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ik1fQlNCbG1McVRVX2RDaEJKb21NViJ9.eyJpc3MiOiJodHRwczovL3Byb2plY3QtYm9va21hcmsudXMuYXV0aDAuY29tLyIsInN1YiI6Imdvb2dsZS1vYXV0aDJ8MTE3ODc0ODc2MDYzOTMwNjI4ODcyIiwiYXVkIjpbImh0dHBzOi8vZGVsdGFwcm9wLmhlcm9rdWFwcC5jb20vIiwiaHR0cHM6Ly9wcm9qZWN0LWJvb2ttYXJrLnVzLmF1dGgwLmNvbS91c2VyaW5mbyJdLCJpYXQiOjE2MDk0MDA2MjcsImV4cCI6MTYwOTQwNzgyNywiYXpwIjoib1hWSEd2YzJuUlZ4bll2dWVlMENXdm5IVWRUdXZ2bk0iLCJzY29wZSI6Im9wZW5pZCBwcm9maWxlIGVtYWlsIiwicGVybWlzc2lvbnMiOltdfQ.TZLJNsmj4Yhq6iyEfwTWCZry5TpRAjDX_nLuobPwlB4o5e0yT2vvqFjyatn_vMLN0qK736BhVLx-PMcTnNWJBYtRQJOcaLUv0YtpuWKHMZlJu3q03tZeK_obnbD_SDkA7WK3-G4lohMQOwtfnq6ZVDgdI6saSGVtDMs_YgYCvzOP_Pdngq81TY1Ba9kuuQBeR3G1MnIdkSHYxH1t3jCtiXfo1Kmb1Dd8aaLf6T6X0uSsCVx3VW4hYc3LLFXRzWdQW8hMbVp7BxkOF40rdJEox4CIe4hRCbEnJJ9IhDZvTI8gMdbjJvVKAYgs0REQnqSqN6Umq94B5tilt1g2B_HQzA'

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
    def test_user_should_not_create_a_public_collection(self):
        collection = {
            "name": 'Public Test'
        }
        res = self.client().post('/public-collections', data=json.dumps(collection), headers={'Content-Type': 'application/json'})
        data = res.get_json()
        self.assertEqual(data["code"], 401)



    # This test should return 200 because ADMIN can create a public collection
    def test_should_crate_a_public_collection(self):
        collection = {
            "name": 'Admin Test'
        }
        res = self.client().post('/public-collections', data=json.dumps(collection), headers={
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {ADMIN_TOKEN}'
        })
        data = res.get_json()
        print(data)
        self.assertEqual(data['code'], 200)




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




    # This test should return 200 because a logged in user can create a private collection
    def test_should_crate_a_private_collection(self):
        collection = {
            "name": 'User Test'
        }
        res = self.client().post('/collections', data=json.dumps(collection), headers={
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {USER_TOKEN}'
        })
        data = res.get_json()
        print(data)
        self.assertEqual(data['code'], 200)


    # This test should return 200 because a logged in user can save a link in his/her collection

    def test_should_save_a_link_in_private_collection(self):
        user_collection_id = '149580edb7ba433db8f311915daa9e67'
        link = {
            "url": "https://www.youtube.com",
            "description": "Youtube is good",
        }
        res = self.client().post(f'/links?collection_id={user_collection_id}', data=json.dumps(link), headers={
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {USER_TOKEN}'
        })
        data = res.get_json()
        print(data)
        self.assertEqual(data["code"], 200)


    # This test should return 200 because a logged in user can edit his/her saved link
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

    # This test should return 401 because only a logged in user can save a link and only admin can save links in public collections 
    def test_should_not_save_a_link_in_any_collection(self):
        user_collection_id = ''
        link = {
            "url": "https://www.youtube.com",
            "description": "Youtube is good",
        }
        res = self.client().post(f'/links?collection_id={user_collection_id}', data=json.dumps(link), headers={
            'Content-Type': 'application/json',
        })
        data = res.get_json()
        self.assertEqual(data["code"], 404)


# Make the tests conveniently executable
if __name__ == "__main__":
    unittest.main()
