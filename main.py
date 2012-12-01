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


@get(API_ROOT + "/accessions")
@get(API_ROOT + "/accessions/<id>")
def get_accessions(id=None):
    # TODO: this is just for testing right now
    mimetype, depth = parse_accept_header()
    if mimetype == JSON_MIMETYPE:
        from bauble.model.accession import Accession
        response.content_type = '; '.join((JSON_MIMETYPE, "charset=utf8"))
        # query the accession based on the ID
        session = db.connect()
        accessions_json = [a.json() for a in session.query(Accession)]
        session.close()
        response_json = dict(accessions=accessions_json)
        return response_json
    else:
        response.status = "400"


@post(API_ROOT + "/family")
def post_family():
    mimetype, depth = parse_accept_header()
    if mimetype == JSON_MIMETYPE:
        from bauble.model import Family
        response.content_type = '; '.join((JSON_MIMETYPE, "charset=utf8"))
        session = db.connect()

        # nned to process request.forms to remove to avoid xss
        f = Family(**request.forms)
        session.add(f)
        session.commit()
        response_json = f.json()
        session.close()
        return response_json
    else:
        response.status = "400"
        

@get(API_ROOT + "/family")
@get(API_ROOT + "/family/<id>")
def get_family(id=None):
    mimetype, depth = parse_accept_header()
    if mimetype == JSON_MIMETYPE:
        from bauble.model import Family
        response.content_type = '; '.join((JSON_MIMETYPE, "charset=utf8"))
        # query the accession based on the ID
        session = db.connect()
        families = session.query(Family)
        if id is not None:
            families.filter_by(id=id)
        families_json = [f.json() for f in families] 
        session.close()
        response_json = dict(families=families_json)
        return response_json
    else:
        response.status = "400"


@delete(API_ROOT + "/family/<id>")
def delete_family(id): 
    from bauble.model import Family
    # query the family based on the ID
    session = db.connect()
    family = session.query(Family).filter_by(id=id)
    family.delete()
    session.commit()
    session.close()


@get(API_ROOT + "/genus")
@get(API_ROOT + "/genus/<id>")
def get_genus(id=None):
    mimetype, depth = parse_accept_header()
    if mimetype == JSON_MIMETYPE:
        from bauble.model import Genus
        session = db.connect()
        genera = session.query(Genus)    
        if id is not None:
            genera.filter_by(id=id)
        genera_json = [g.json() for g in genera]
        response_json = dict(genera=genera_json)
        response.content_type = '; '.join((JSON_MIMETYPE, "charset=utf8"))
        session.close()
        return response_json
    else:
        respons.status = "400"
    

@post(API_ROOT + "/genus")
def post_genus():
    mimetype, depth = parse_accept_header()
    if mimetype == JSON_MIMETYPE:
        from bauble.model import Genus
        session = db.connect()
        genera = session.query(Genus)    
        from bauble.model import Genus
        genus = Genus(**request.forms)
        session.add(genus)
        session.commit()
        response_json = genus.json()
        session.close()
        response.content_type = '; '.join((JSON_MIMETYPE, "charset=utf8"))
        return response_json
    else:
        respons.status = "400"


@delete(API_ROOT + "/genus/<id>")
def delete_genus(id): 
    from bauble.model import Genus
    # query the genus based on the ID
    session = db.connect()
    genus = session.query(Genus).filter_by(id=id)
    genus.delete()
    session.commit()
    session.close()


@get("/search/<query>")
def search(query):
    return query


db.connect()
db.Base.metadata.create_all(db.engine)
bottle.run(host='localhost', port=8080, reloader=True, debug=True)
