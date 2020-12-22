from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from sqlalchemy import Column, Integer, String, ForeignKey, Boolean, ARRAY


datatabase_path = "postgres://postgres:postgres@localhost:5432/bookmark"

db = SQLAlchemy()
migrate = None


def setup_db(app):
    app.config["SQLALCHEMY_DATABASE_URI"] = datatabase_path
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    db.app = app
    db.init_app(app)
    migrate = Migrate(app, db)


class User(db.Model):
    id = Column(String(), primary_key=True)
    username = Column(String(50))
    email = Column(String(50), unique=True)

    def insert(self):
      db.session.add(self)
      db.session.commit()


    def __repr__(self):
      return f'<User: {self.username}, email: {self.email}>'


class Link(db.Model):
  id = Column(String(), primary_key=True)
  url = Column(String())
  name = Column(String())
  description = Column(String())
  tags = Column(ARRAY(String()))
  collection = Column(String(), ForeignKey('collection.id'))

  def insert(self):
    db.session.add(self)
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


class Collection(db.Model):
    id = Column(String(), primary_key=True)
    name = Column(String())
    owner = Column(String(), ForeignKey('user.id'))
    # owner = Column(String())
    is_public = Column(Boolean())
    description = Column(String(300))

    def insert(self):
      db.session.add(self)
      db.session.commit()

    def details(self):
      return {
        "id": self.id,
        "name": self.name
      }

    def __repr__(self):
      return f'<Collection: {self.name}, Owner: {self.owner}, ID: {self.id}>'
