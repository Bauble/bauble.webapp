import json
import os

from bottle import request, response, get, post, put, delete, HTTPError

import bauble
import bauble.db as db
import bauble.i18n
import bauble.model as model
import bauble.search as search

import sqlalchemy.orm as orm
import bauble.server as server
import bauble.db as db

#
# Family request handlers
#
@put(server.API_ROOT + "/family")
@put(server.API_ROOT + "/family/<family_id>")
@post(server.API_ROOT + "/family")
def save_family(family_id=None):
    """
    Handle generic POST and PUT requests.

    If a family_id is passed the family will be updated. Otherwise it will be
    created.  The request body should contain a Family json object.

    A JSON object that represents the created Family will be returned in the response.
    """
    from bauble.model import Family, FamilyNote, FamilySynonym

    accepted = server.parse_accept_header()
    if server.JSON_MIMETYPE not in accepted:
        raise HTTPError('406 Only application/json responses supported')

    depth = 1
    if 'depth' in accepted[server.JSON_MIMETYPE]:
        depth = accepted[server.JSON_MIMETYPE]['depth']

    response.content_type = '; '.join((server.JSON_MIMETYPE, "charset=utf8"))
    session = db.connect()

    # make sure the content is JSON
    if server.JSON_MIMETYPE not in request.headers.get("Content-Type"):
        raise HTTPError('400 Content-Type should be application/json')

    # we assume all requests are in utf-8
    data = json.loads(request.body.read().decode('utf-8'))

    notes = data.pop('notes', [])
    synonyms = data.pop('synonyms', [])
    ref = data.pop('ref', None)

    # if this is a PUT to a specific ID then get the existing family
    # else we'll create a new one
    if request.method == 'PUT' and family_id is not None:
        family = session.query(Family).get(family_id)
        for key in data.keys():
            setattr(family, 'key', data[key])
    else:
        family = Family(**data)

    # notes and synonyms on this object will always be created so that a PUT
    # and POST act the same...to update use /family/<id>/note/<id>, etc.
    for note in notes:
        family_note = FamilyNote(**note)
        family.notes.append(family_note)

    # syn objects can be of the form {'synonym': {'ref': '/family/<id>'}}
    # or {'synonym_id': <id>}
    for syn in synonyms:
        family_synonym = FamilySynonym(family=family)
        if 'synonym_id' in syn:
            family_synonym.synonym_id = syn['synonym_id']
        elif 'synonym' in syn:
            family_synonym.synonym_id = syn['synonym']['ref'].split('/')[-1]

    session.add(family)
    session.commit()
    response_json = family.json(depth=int(depth))
    session.close()
    return response_json


@get(server.API_ROOT + "/family/<family_id>")
def get_family(family_id=None):
    """
    Handle GET /family/<id> requests.
    """
    from bauble.model import Family
    return server.handle_get(Family, family_id)


@get(server.API_ROOT + "/family")
def query_family():
    """
    Handle GET /family?q= requests.
    """
    from bauble.model import Family
    q = request.query.q

    accepted = server.parse_accept_header()
    if server.JSON_MIMETYPE not in accepted:
        raise HTTPError('406 Only application/json responses supported')

    session = db.connect()
    query = session.query(Family).filter(Family.family.like(q))
    json_objs = [obj.json() for obj in query]
    session.close()

    response_json = {'families': json_objs}
    response.content_type = '; '.join((server.JSON_MIMETYPE, "charset=utf8"))

    #return json.dumps(json_objs)
    return response_json


@delete(server.API_ROOT + "/family/<family_id>")
def delete_family(family_id):
    """
    Handle DELETE /family/<id> requests.
    """
    from bauble.model import Family
    server.handle_delete(Family, family_id)
