# DeltaProp

Try it at: https://amolsb.github.io/deltaprop/



## BACKEND

### Installing Dependencies

#### Python 3.7

Follow instructions to install the latest version of python for your platform in the [python docs](https://docs.python.org/3/using/unix.html#getting-and-installing-the-latest-version-of-python).

#### Virtual Enviornment

Recommend working within a virtual environment whenever using Python for projects. This keeps your dependencies for each project separate and organaized. Instructions for setting up a virual enviornment for your platform can be found in the [python docs](https://packaging.python.org/guides/installing-using-pip-and-virtual-environments/).

#### PIP Dependencies

Once you have your virtual environment setup and running, install dependencies by running:

```bash
pip3 install -r requirements.txt
```

This will install all of the required packages.

##### Key Dependencies

- [Flask](http://flask.pocoo.org/)  is a lightweight backend microservices framework. Flask is required to handle requests and responses.

- [SQLAlchemy](https://www.sqlalchemy.org/) is the Python SQL toolkit and ORM we'll use handle the lightweight sqlite database. You'll primarily work in app.py and can reference models.py. 

## Running the server

Setting the `FLASK_APP` variable to `app.py` directs flask to use the `app.py` file to find the application. 

Using the `--reload` flag will detect file changes and restart the server automatically.

## API Reference

## Getting Started
Base URL: This application can be run locally. The hosted version is at `https://deltaprop.herokuapp.com/`.

Authentication: This application requires authentication to perform various actions. All the endpoints require
various permissions, except the root (or health) endpoint, that are passed via the `Bearer` token.

The application has three different types of roles:

- Visitor
  - If someone just visits a site, he can view public collections, which is collections of webisites created by Admin or people.

- User
  - When someone creates a account, he becomes a user of `DeltaProp`. User can then create a private collection and save links in that collection. He can also view public collections (A user can choses to make his/her collection public. This feature is currently not available though).

- Admin
  - Admin can create a private collection of his own.
  - Admin can perform curd operations on Public Collections


## Error Handling
Errors are returned as JSON objects in the following format:
```
{
    "error": 404,
    "message": "The requested URL was not found on the server. If you entered the URL manually please check your spelling and try again.",
    "success": false
}
```

The API will return the following errors based on how the request fails:
 - 400: Bad Request
 - 401: Unauthorized
 - 403: Forbidden
 - 404: Not Found
 - 405: Method Not Allowed
 - 422: Unprocessable Entity
 - 500: Internal Server Error

## Endpoints

#### GET /
 - General
   - root endpoint
   - can also work to check if the api is up and running
   - is a public endpoint, requires no authentication
 
 - Sample Request
   - `https://deltaprop.herokuapp.com/`

<details>
<summary>Sample Response</summary>

```
{
    "Health": "Running!!"
}
```

</details>

#### GET /public-collections
 - General
   - gets all the public collections
   - requires no permission
 
 - Sample Request
   - `https://deltaprop.herokuapp.com/public-collections`

<details>
<summary>Sample Response</summary>

```
{
  "code": 200,
  "data": [
    {
      "id": "94067d4156a94808bdd6693bb856de35",
      "name": "Public 1"
    }
  ]
}
```

</details>


#### POST /public-collections
 - General
   - creates a new public collection
   - requires `create:public-collections` permission
 
 - Request Body
   - name: string, required
 
 - Sample Request
   - `https://deltaprop.herokuapp.com/public-collections`
   - Request Body
     ```
        {
            "name": "Some Public Collection",
        }
     ```

<details>
<summary>Sample Response</summary>

```
{
  "id": "a id in uuid4 format",
  "name": "Some Public Collection",
  "public_collection": "true"
}
```
  
</details>

#### GET /collections
 - General
   - gets all the private collection of a particular user
   - User has to login to the application
 
 - Sample Request
   - `https://deltaprop.herokuapp.com/collections`

<details>
<summary>Sample Response</summary>

```
{
  "code": 200,
  "data": [
    {
      "id": "94067d4156a94808bdd6693bb856de35",
      "name": "Private 1"
    }
  ]
}
```

</details>


#### POST /collections
 - General
   - creates a new private collection
   - User has to login to the application to create a collection for himself / herself
 
 - Request Body
   - name: string, required
 
 - Sample Request
   - `https://deltaprop.herokuapp.com/collections`
   - Request Body
     ```
        {
            "name": "Some Public Collection",
        }
     ```

<details>
<summary>Sample Response</summary>

```
{
  "id": "a id in uuid4 format",
  "name": "Some private Collection",
}
```
  
</details>



#### GET /links?collection_id=<collection_id>
 - General
   - gets all the links in a private collection of a user 
   - User has to login to the application
 
 - Sample Request
   - `https://deltaprop.herokuapp.com/links?collection_id=<collection_id>`

<details>
<summary>Sample Response</summary>

```
{
  "code": 200,
  "data": [
    collection: "<collection_id>"
    description: "<description of the website user has wrote while saving the link>"
    id: "<link_id>"
    name: "<link name>"
    url: "<link>"
  ]
}
```

</details>


#### POST /links?collection_id=<collection_id>
 - General
   - creates a new link in a collection
   - User has to login to the application to save a link.
 
 - Request Body
   - url: string, required
   - description: string, optional
 
 - Sample Request
   - `https://deltaprop.herokuapp.com/links?collection_id=<collection_id>`
   - Request Body
     ```
        {
            "url": "<url> e.g. https://www.youtube.com",
            "description": "<description> e.g. youtube is a video sharing platform"
        }
     ```

<details>
<summary>Sample Response</summary>

```
{
  code: '200',
  data: [
    {
      collection: "<collection_id>"
      description: "<description>"
      id: "<link_id>"
      name: "<name>"
      url: "<url>"
    }
  ]
}
```
  
</details>

#### PATCH /links
 - General
   - updates the link details
   - user has to log in
 
 - Request Body (at least one of the following fields required)
   - link_id: the link id user want to edit
   - url: URL (if edited), optional
   - description: DESCRIPTION (if edited), optional
 
 - Sample Request
   - `https://deltaprop.herokuapp.com/links`
   - Request Body
     ```
       {
            "id": "<link_id>",
            "url": "<link_url>",
            "description": "<description>"
       }
     ```

<details>
<summary>Sample Response</summary>

```
{
  code: '200',
  data: [
    {
      collection: "<collection_id>"
      description: "<description>"
      id: "<link_id>"
      name: "<name>"
      url: "<url>"
    }
  ]
}
```
  
</details>

#### DELETE /link?link_id=<link_id>
 - General
   - deletes the link
   - User has to login
 
 - Sample Request
   - `https://deltaprop.herokuapp.com/links?link_id=<link_id>`

<details>
<summary>Sample Response</summary>

```
  {
      'code': 200,
      'id': link_id,
      'message': f'{link_id} deleted successfully'
  }
```
  
</details>


## Testing
For testing the backend, run the following commands (in the exact order):
```
python3 -m test
```


## FRONTEND

Frontend uses angular 10 to serve the application

### Dependencies
- Node must be installed (v12.16.1 or above) in order to run the application locally
- Run `npm i` in the root directory (in frontend/)
- Run `ng serve` to serve the application. By default the application will use port 4200, so by opening `localhost:4200` you can view the application locally.
- You can also visit the webisite at https://amolsb.github.io/deltaprop/

### Authentication
  - Auth0 is used for authentication.

### How to use
  - DeltaProp let's you organize your links in a new way. A user can either view public collections or sign up and create his / her own collections of links.
  - Upon opening the application, plase click on What is it to know more.
