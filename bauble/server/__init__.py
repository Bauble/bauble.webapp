#!/usr/bin/env python

import json
import os
import os.path

import bottle
from bottle import request, response, get, post, delete

import bauble
import bauble.db as db
import bauble.i18n
import bauble.model as model
import bauble.search as search

import sqlalchemy.orm as orm

app = bottle.Bottle()

API_ROOT = "/api/v1"
JSON_MIMETYPE = "application/json"

cwd = os.path.abspath(bauble.__path__[0])

app_dir = os.path.join(cwd, 'app')
lib_dir = os.path.join(app_dir, 'lib')
js_dir = os.path.join(app_dir, 'js')
test_dir = os.path.join(cwd, 'test')

bottle.TEMPLATE_PATH.insert(0, cwd)


@get('/lib/<path:path>/<filename>')
def lib_get(path, filename):
    parts = path.split('/')
    return bottle.static_file(filename, root=os.path.join(lib_dir, *parts))


@get('/partials/<filename>')
def partials_get(filename):
    return bottle.static_file(filename, root=os.path.join(app_dir, 'partials'))


@get('/css/<filename>')
def css_get(filename):
    return bottle.static_file(filename, root=os.path.join(app_dir, 'css'))


@get('/js/<filename>')
def js_get(filename):
    return bottle.static_file(filename, root=os.path.join(app_dir, 'js'))


@get('/test')
def test_index():
    return bottle.static_file('index.html', root=test_dir)


@get('/test/<filename>')
def test_get(filename):
    return bottle.static_file(filename, root=test_dir)


@get('/test/<path:path>/<filename>')
def testlib_get(path, filename):
    parts = path.split('/')
    return bottle.static_file(filename, root=os.path.join(test_dir, *parts))


@get("/")
def index():
    #return "Welcome"
    return bottle.template("app/index.html")

#
# Rest API request handlers.
#
# TODO: these should probably be moved into a different subproject/app
#


def parse_accept_header(header=None):
    """
    Parse the Accept header.

    Returns a dict of mimetype keys that map to an accept param dict
    """
    if(not header):
        header = request.headers.get("Accept")
    ranges = [rng.strip() for rng in header.split(',')]

    result = {}
    for rng in ranges:
        params = rng.split(';')
        d = {}
        for param in params[1:]:
            key, value = param.split("=")
            d[key] = value
        result[params[0]] = d

    return result


def handle_get(mapper, id, collection_name):
    """
    Handle generic GET requests.

    Return a standard json response object representing the mapper
    where the queried objects are returned in the json object in
    the collection_name array.
    """
    accepted = parse_accept_header()
    if JSON_MIMETYPE not in accepted:
        response.status = 400
        return

    depth = 1
    if 'depth' in accepted[JSON_MIMETYPE]:
        depth = accepted[JSON_MIMETYPE]['depth']

    session = db.connect()
    query = session.query(mapper)
    if id is not None:
        query.filter_by(id=id)

    print('handle get')
    json_objs = [obj.json(depth=int(depth)) for obj in query]
    print(json_objs[0])
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
    # mimetype, depth = parse_accept_header()
    # if mimetype != JSON_MIMETYPE:
    #     response.status = 400
    #     return

    accepted = parse_accept_header()
    if JSON_MIMETYPE not in accepted:
        response.status = 400
        return

    depth = 1
    if 'depth' in accepted[JSON_MIMETYPE]:
        depth = accepted[JSON_MIMETYPE]['depth']

    response.content_type = '; '.join((JSON_MIMETYPE, "charset=utf8"))
    session = db.connect()

    # extract the param values that are columns on the mapper and build a new
    # dict to pass as the values for the new object
    cls_mapper = orm.class_mapper(mapper)
    values = {}
    for key in request.forms:
        if key in cls_mapper.columns:
            values[key] = request.forms[key]

    # need to process request.forms to remove to avoid xss
    obj = mapper(**values)
    print(request.forms)
    session.add(obj)
    session.commit()
    response_json = {}
    response_json[collection_name] = [obj.json(depth=depth)]
    session.close()
    return response_json


def handle_delete(mapper, id):
    """
    Handle generic DELETE requests.

    Delete a mapper with id=id.
    """
    # query the mapper based on the ID
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


@get(API_ROOT + "/family/<id>")
def get_family(id=None):
    from bauble.model import Family
    return handle_get(Family, id, 'families')


@get(API_ROOT + "/family")
def query_family():
    from bauble.model import Family
    q = request.query.q

    # mimetype, depth = parse_accept_header()
    # if mimetype != JSON_MIMETYPE:
    #     response.status = 400
    #     return

    session = db.connect()
    query = session.query(Family).filter_by(family=q)
    json_objs = [obj.json() for obj in query]
    session.close()
    response.content_type = '; '.join((JSON_MIMETYPE, "charset=utf8"))

    return json.dumps(json_objs)


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
    return handle_post(Species, 'species')


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
    return handle_get(Accession, id, 'accessions')


@post(API_ROOT + "/accession")
def post_accessions():
    from bauble.model import Accession
    return handle_post(Accession, 'accessions')


@delete(API_ROOT + "/accession/<id>")
def delete_accessions(id):
    from bauble.model import Accession
    handle_delete(Accession, id)


#
# Plant request handlers
#
@get(API_ROOT + "/plant")
@get(API_ROOT + "/plant/<id>")
def get_plants(id=None):
    from bauble.model import Plant
    return handle_get(Plant, id, 'plants')


@post(API_ROOT + "/plant")
def post_plants():
    from bauble.model import Plant
    return handle_post(Plant, 'plants')


@delete(API_ROOT + "/plant/<id>")
def delete_plants(id):
    from bauble.model import Plant
    handle_delete(Plant, id)


#
# Location request handlers
#
@get(API_ROOT + "/location")
@get(API_ROOT + "/location/<id>")
def get_locations(id=None):
    from bauble.model import Location
    return handle_get(Location, id, 'locations')


@post(API_ROOT + "/location")
def post_locations():
    from bauble.model import Location
    return handle_post(Location, 'locations')


@delete(API_ROOT + "/location/<id>")
def delete_locations(id):
    from bauble.model import Location
    handle_delete(Location, id)


#
# Handle search requests
#
@get("/search")
def get_search():
    #mimetype, depth = parse_accept_header()
    accepted = parse_accept_header()
    if JSON_MIMETYPE not in accepted:
        response.status = 400
        return

    depth = 1
    if 'depth' in accepted[JSON_MIMETYPE]:
        depth = accepted[JSON_MIMETYPE]['depth']

    query = request.query.q
    session = db.connect()
    results = {}
    if query:
        results = search.search(query, session)
    response.content_type = '; '.join((JSON_MIMETYPE, "charset=utf8"))
    return {'results': [r.json(depth=depth) for r in results]}


def start():
    """
    Start the Bauble server.
    """
    # start the application
    db.connect()

    # TODO: the tables should be created everytime the application is started
    db.Base.metadata.create_all(db.engine)

    bottle.run(host='localhost', port=8080, reloader=True, debug=True)
