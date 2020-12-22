from flask import Flask, jsonify, request, session
from database.models import setup_db
from database.mock_data import collections, links
from database.models import Link, Collection, User
from flask_cors import CORS
import uuid
import json
from auth.auth import requires_auth, get_user_id
from os import environ as env
import requests
from jose import jwt

# client_id = 'gmdRc7yb4eUpme3tXN2R8r67LVjSVPUw'
# client_secret = 'yABUNNOVhxEcaRkLoqMt7QPJPD4nFKNhubx-xDy0CbjwJHkqOM8V58cX5T06-0Sc'

# id_token = ''
# access_token = ''

# user_info = {}

user: User

app = Flask(__name__)
code = ''

CORS(app)

setup_db(app)

@app.route('/')
def home():
  # data = request.json()
  return {"a": None}

@app.route('/collections')
@get_user_id()
def get_collections(user_id):
  # print('jwt', jwt)
  print('extracted user id', user_id)
  collections = Collection.query.filter(Collection.owner == user_id).all()
  collections = [collection.details() for collection in collections]
  return jsonify({
    "code": 200,
    "data": collections
  })

@app.route('/links')
def get_links_by_collection_id():
  collection_id = request.args.get('collection_id')
  links_by_collection = Link.query.filter(Link.collection == collection_id).all()
  links_by_collection = [link.details() for link in links_by_collection]
  return jsonify({
    "code": 200,
    "data": links_by_collection
  })


@app.route('/links', methods=["POST"])
def save_link():
  collection_id = request.args.get("collection_id")
  payload = request.get_json()
  link_name = extract_name_from_url(payload["url"])
  id = uuid.uuid4().hex
  new_link = Link(id=id, url=payload["url"], description=payload["description"], name=link_name, collection=collection_id)
  new_link.insert()
  return jsonify({
    "code": 200,
    "data": {
      "name": link_name,
      "id": id,
      "url": payload["url"],
      "description": payload["description"],
      "collection": collection_id
    }
  })


@app.route('/collections', methods=["POST"])
# @requires_auth("create:collection")
def add_new_collection():
  access_token = request.headers.get('Authorization').split(' ').pop()
  print('Access Token', access_token)
  collection_name = request.get_json()["name"]
  print(collection_name)

  decoded_access_token = jwt.get_unverified_claims(access_token)
  print('decoded_access_token', decoded_access_token)
  user_id = decoded_access_token["sub"]
  collection_id = uuid.uuid4().hex
  new_collection = Collection(id=collection_id, name=collection_name, owner=user_id)
  print(new_collection)
  new_collection.insert()
  return jsonify({
    "code": 200,
    "data": {
      "id": collection_id,
      "name": collection_name
    }
  })

@app.route('/public-collections')
def get_public_collections():
  pass


@app.route('/userinfo')
def get_user_info():
  access_token = request.args.get('access_token').split(' ').pop()
  user = get_user_info_from_auth0_server(access_token)

  return jsonify({
    "code": 200,
    "message": "User info fetched successfully",
    "data": user,
  })


def create_user(user_info, user_id):
  user = User.query.filter(User.id == user_id).one_or_none()
  print(user)
  if not user:
    user = User(id=user_id, email=user_info["email"], username=user_info["name"])
    user.insert()
    # print('user created', user)
  return user



def get_user_info_from_auth0_server(access_token):

  userinfo_url = 'https://project-bookmark.us.auth0.com/userinfo?access_token=' + access_token

  decoded_access_token = jwt.get_unverified_claims(access_token)
  user_id = decoded_access_token["sub"]
  response = requests.get(userinfo_url)

  if response.status_code == 200 or response.status_code == 201:

    user_info = response.json()

    user = create_user(user_info, user_id)

    return user_info



def extract_name_from_url(url):
  split_url = url.split(".")
  return split_url[1]
