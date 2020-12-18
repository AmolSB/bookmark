from flask import Flask, jsonify, request, session
from database.models import setup_db
from database.mock_data import collections, links
from database.models import Link, Collection, User
from flask_cors import CORS
import uuid
import json
from auth.auth import requires_auth
from os import environ as env

from authlib.integrations.flask_client import OAuth
from six.moves.urllib.parse import urlencode
from werkzeug.exceptions import HTTPException
from dotenv import load_dotenv, find_dotenv

app = Flask(__name__)

oauth = OAuth(app)

auth0 = oauth.register(
  'auth0',
  code='BMkVJEE3X46VoEcd',
  client_id='gmdRc7yb4eUpme3tXN2R8r67LVjSVPUw',
  client_secret='yABUNNOVhxEcaRkLoqMt7QPJPD4nFKNhubx-xDy0CbjwJHkqOM8V58cX5T06-0Sc',
  api_base_url='https://project-bookmark.us.auth0.com',
  access_token_url='https://project-bookmark.us.auth0.com/oauth/token',
  authorize_url='https://project-bookmark.us.auth0.com/authorize',
  client_kwargs={
      'scope': 'openid profile email',
  },

)

CORS(app)

setup_db(app)

@app.route('/')
def home():
  # data = request.json()
  return {"a": None}

@app.route('/collections')
def get_collections():

  # print(auth0.__dict__)

  token = oauth.auth0.authorize_access_token()
  print(token)
  # resp = oauth.auth0.get('userinfo')
  # print(resp)
  # auth0.authorize_access_token()
  # resp = auth0.get('userinfo')
  # print('resp', resp)
  # userinfo = resp.json()
  # print('userinfo', userinfo)
  collections = Collection.query.all()
  collections = [collection.details() for collection in collections]
  return jsonify({
    "code": 200,
    "data": collections
  })

@requires_auth('patch:drinks')
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
  id = uuid.uuid4()
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
def add_new_collection():
  collection_name = request.get_json()["name"]
  print(collection_name)
  id = uuid.uuid4()
  new_collection = Collection(id=id, name=collection_name)
  print(new_collection)
  new_collection.insert()
  return jsonify({
    "code": 200,
    "data": {
      "id": id,
      "name": collection_name
    }
  })













def extract_name_from_url(url):
  split_url = url.split(".")
  return split_url[1]
