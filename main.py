#!/usr/bin/env python

import os
import sys

import bottle
from bottle import request, response, get, post, delete
from bottle import mako_view as view, mako_template as template

import bauble
import bauble.i18n
import bauble.model as model
import bauble.db as db

app = bottle.Bottle()

API_ROOT = "/api/v1"
JSON_MIMETYPE="application/json"

view_dir = os.path.join(os.getcwd(), 'bauble', 'view')
bottle.TEMPLATE_PATH.insert(0, view_dir)


@get('/static/css/<filename>')
def css_get(filename):
    return bottle.static_file(filename, root=os.path.join(view_dir, 'css'))


@get('/static/js/<filename>')
def js_get(filename):
    return bottle.static_file(filename, root=os.path.join(view_dir, 'js'))


@get("/")
def index():
    #return "Welcome"
    return bottle.template("index.html")


def parse_accept_header():
    header = request.headers.get("Accept");
    parts = header.split(';')
    mimetype = parts[0]
    depth = parts[1]
    return mimetype, depth


def handle_get(mapper, id, collection_name):
    """
    Handle generic GET requests.  

    Return a standard json response object representing the mapper
    where the queried objects are returned in the json object in
    the collection_name array.
    """
    mimetype, depth = parse_accept_header()
    if mimetype != JSON_MIMETYPE:
        response.status = 400
        return

    session = db.connect()
    query = session.query(mapper)    
    if id is not None:
        query.filter_by(id=id)

    json_objs = [obj.json() for obj in query]
    session.close()

    response.content_type = '; '.join((JSON_MIMETYPE, "charset=utf8"))
    response_json = {}
    response_json[collection_name] = json_objs
    return response_json


def handle_post(mapper, collection_name):
    """
    Handle generic POST requests.  

    Create an instance of mapper where the fields are set from the
    form encoded values.  Returns the JSON resposne the same as a GET
    request
    """
    mimetype, depth = parse_accept_header()
    if mimetype != JSON_MIMETYPE:
        response.status = 400
        return
    
    response.content_type = '; '.join((JSON_MIMETYPE, "charset=utf8"))
    session = db.connect()
        
    # TODO: the request forms values probably need to be reencoded as
    # UTF8 where appropriate

    # need to process request.forms to remove to avoid xss
    obj = mapper(**request.forms)
    session.add(obj)
    session.commit()
    response_json = {}
    response_json[collection_name] = [obj.json()]
    #print(response_json)
    session.close()
    return response_json


def handle_delete(mapper, id):
    """
    Handle generic DELETE requests.  

    Delete a mapper with id=id.
    """
    # query the family based on the ID
    session = db.connect()
    obj = session.query(mapper).filter_by(id=id)
    obj.delete()
    session.commit()
    session.close()


#
# Family request handlers
# 

@post(API_ROOT + "/family")
def post_family():
    from bauble.model import Family
    return handle_post(Family, 'families')
        

@get(API_ROOT + "/family")
@get(API_ROOT + "/family/<id>")
def get_family(id=None):
    from bauble.model import Family
    handle_get(Family, id, 'families')


@delete(API_ROOT + "/family/<id>")
def delete_family(id): 
    from bauble.model import Family
    handle_delete(Family, id)


#
# Genus request handlers
#

@get(API_ROOT + "/genus")
@get(API_ROOT + "/genus/<id>")
def get_genus(id=None):
    from bauble.model import Genus
    return handle_get(Genus, id, 'genera')


@post(API_ROOT + "/genus")
def post_genus():
    from bauble.model import Genus
    return handle_post(Genus, 'genera')


@delete(API_ROOT + "/genus/<id>")
def delete_genus(id): 
    from bauble.model import Genus
    handle_delete(Genus, id)


#
# Species request handlers
# 

@get(API_ROOT + "/species")
@get(API_ROOT + "/species/<id>")
def get_species(id=None):
    from bauble.model import Species
    return handle_get(Species, id, 'species')

@post(API_ROOT + "/species")
def post_species():
    from bauble.model import Species
    return handle_post(Species, 'genera')


@delete(API_ROOT + "/species/<id>")
def delete_species(id): 
    from bauble.model import Species
    handle_delete(Species, id)


#
# Accession request handlers
# 
@get(API_ROOT + "/accession")
@get(API_ROOT + "/accession/<id>")
def get_accessions(id=None):
    from bauble.model import Accession
    handle_get(Accession, id, 'accessions')


@post(API_ROOT + "/accession")
def post_accessions():
    from bauble.model import Accession
    return handle_post(Accession, 'genera')


@delete(API_ROOT + "/accession/<id>")
def delete_accessions(id): 
    from bauble.model import Accession
    handle_delete(Accession, id)


#
# Handle search requests
# 
@get("/search/<query>")
def search(query):
    return query


db.connect()
db.Base.metadata.create_all(db.engine)
bottle.run(host='localhost', port=8080, reloader=True, debug=True)
