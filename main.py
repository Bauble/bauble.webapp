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
        db.initialize()
        session = db.Session()
        accessions_json = [a.json() for a in session.query(Accession)]
        response_json = dict(accessions=accessions_json)
        return response_json
    else:
        response.status = "400"


@post(API_ROOT + "/family")
def post_family():
    mimetype, depth = parse_accept_header()
    if mimetype == JSON_MIMETYPE:
        from bauble.model.family import Family
        response.content_type = '; '.join((JSON_MIMETYPE, "charset=utf8"))
        db.initialize()
        session = db.Session()

        # create a random family name for testing
        import random
        name = str(random.random())
        f = Family(family=name)        
        session.add(f)
        session.commit()
        response_json = f.json()
        session.close()
        return response_json
        


@get(API_ROOT + "/family/<id>")
def get_family(id):
    mimetype, depth = parse_accept_header()
    if mimetype == JSON_MIMETYPE:
        from bauble.model.family import Family
        response.content_type = '; '.join((JSON_MIMETYPE, "charset=utf8"))
        # query the accession based on the ID
        db.initialize()
        session = db.Session()
        if not id:
            families = session.query(Family)
        else:
            families = session.query(Family).filter_by(id=id)
        families_json = [f.json() for f in families] 
        response_json = dict(families=families_json)
        return response_json
    else:
        response.status = "400"


@delete(API_ROOT + "/family/<id>")
def delete_family(id): 
    from bauble.model.family import Family

    # query the accession based on the ID
    db.initialize()
    session = db.Session()
    family = session.query(Family).filter_by(id=id)
    family.delete()
    session.commit()
    

@get("/search/<query>")
def search(query):
    return query


db.initialize()
db.Base.metadata.create_all(db.engine)
bottle.run(host='localhost', port=8080, reloader=True, debug=True)
