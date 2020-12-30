from flask_sqlalchemy import SQLAlchemy
# from flask_migrate import Migrate
from sqlalchemy import Column, Integer, String, ForeignKey, Boolean, ARRAY
import os


# project_dir = os.path.dirname(os.path.abspath(__file__))
# datatabase_path = os.environ['DATABASE_URL']
# database_path = 'postgres://postgres:postgres@localhost:5432/bookmark'
database_path = "postgres://itxpebkiznjnqa:3ad5e249a2810ad4ea3c7424808aabde3f6dbad7b310af1a4d4ca20060a0d6ad@ec2-50-19-247-157.compute-1.amazonaws.com:5432/dd0tht8mo6moqg"


db = SQLAlchemy()
# migrate = None


def setup_db(app):
    app.config["SQLALCHEMY_DATABASE_URI"] = database_path
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    db.app = app
    db.init_app(app)
    # db.create_all()
    # migrate = Migrate(app, db)


class User(db.Model):
    __tablename__ = 'user'
    id = Column(String(), primary_key=True)
    username = Column(String(50))
    email = Column(String(50), unique=True)

    def insert(self):
        db.session.add(self)
        db.session.commit()

    def __repr__(self):
        return f'<User: {self.username}, email: {self.email}>'


class Collection(db.Model):
    __tablename__ = 'collection'
    id = Column(String(), primary_key=True)
    name = Column(String())
    owner = Column(String(), ForeignKey('user.id'))
    # owner = Column(String())
    is_public = Column(Boolean())
    description = Column(String(300))

    def insert(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    def details(self):
        return {
            "id": self.id,
            "name": self.name
        }

    def __repr__(self):
        return f'<Collection: {self.name}, Owner: {self.owner}, ID: {self.id}>'


class Link(db.Model):
    __tablename__ = 'link'
    id = Column(String(), primary_key=True)
    url = Column(String())
    name = Column(String())
    description = Column(String())
    tags = Column(ARRAY(String()))
    collection = Column(String(), ForeignKey('collection.id'))

    def insert(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    def update(self):
        db.session.commit()

    def details(self):
        return {
            "id": self.id,
            "name": self.name,
            "url": self.url,
            "description": self.description,
            "collection": self.collection
        }

    def __repr__(self):
        return f'<Link: {self.url}>'
