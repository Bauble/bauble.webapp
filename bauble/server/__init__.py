import os
import os.path

import bottle
from bottle import request, response

import bauble
import bauble.db as db
import bauble.i18n
import bauble.search as search

app = bottle.Bottle()

API_ROOT = "/api/v1"
JSON_MIMETYPE = "application/json"

cwd = os.path.abspath(bauble.__path__[0])

#
# TODO: Seems like these hardcoded paths should set somewhere else
#
app_dir = os.path.join(cwd, 'app')
lib_dir = os.path.join(app_dir, 'lib')
js_dir = os.path.join(app_dir, 'js')
test_dir = os.path.join(cwd, 'test')

bottle.TEMPLATE_PATH.insert(0, cwd)


@app.hook('before_request')
def enable_cors():
    """
    You need to add some headers to each request.
    Don't use the wildcard '*' for Access-Control-Allow-Origin in production.
    """
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Methods'] = 'PUT, GET, POST, DELETE, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Origin, Accept, Content-Type, X-Requested-With, X-CSRF-Token'


@app.get('/test')
def test_index():
    return bottle.static_file('index.html', root=test_dir)


@app.get('/test/<filename>')
def test_get(filename):
    return bottle.static_file(filename, root=test_dir)


@app.get('/test/<path:path>/<filename>')
def testlib_get(path, filename):
    parts = path.split('/')
    return bottle.static_file(filename, root=os.path.join(test_dir, *parts))


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


#
# Handle search requests
#
@app.route(API_ROOT + "/search", method=['OPTIONS', 'GET'])
def get_search():
    #mimetype, depth = parse_accept_header()
    accepted = parse_accept_header()

    if JSON_MIMETYPE not in accepted and '*/*' not in accepted and request.method != 'OPTIONS':
        raise bottle.HTTPError('406 Not Accepted - Expected application/json')

    if(request.method == 'OPTIONS'):
        return ''
        return {}

    depth = 1
    if 'depth' in accepted[JSON_MIMETYPE]:
        depth = accepted[JSON_MIMETYPE]['depth']

    query = request.query.q
    if not query:
        raise bottle.HTTPError('400 Bad Request')

    session = db.connect()
    results = search.search(query, session)
    response.content_type = '; '.join((JSON_MIMETYPE, "charset=utf8"))
    return {'results': [r.json(depth=depth) for r in results]}


def start(host='localhost', port=8080, debug=False):
    """
    Start the Bauble server.
    """
    # start the application
    db.connect()

    # *******
    # TODO: the tables shouldn't be created everytime the application is started
    # *******
    db.Base.metadata.create_all(db.engine)

    import bauble.server.resource as resource
    resource.FamilyResource()
    resource.GenusResource()
    resource.TaxonResource()
    resource.AccessionResource()
    resource.PlantResource()
    resource.LocationResource()
    resource.SourceDetailResource()
    app.run(host=host, port=port, reloader=True, debug=debug)
