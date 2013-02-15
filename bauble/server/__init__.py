from collections import namedtuple, OrderedDict
import json
import os
import os.path

import bottle
from bottle import request, response
import sqlalchemy as sa
import sqlalchemy.orm as orm

import bauble
import bauble.db as db
import bauble.i18n
import bauble.search as search
import bauble.utils as utils

from bauble.model.family import Family, FamilySynonym, FamilyNote
from bauble.model.genus import Genus
from bauble.model.species import Species
from bauble.model.accession import Accession
from bauble.model.plant import Plant
from bauble.model.location import Location


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


class Resource:
    """
    """

    ignore = ['ref', 'str']
    relations = {}
    mapped_class = None
    resource = None

    def __init__(self):
        if not self.resource:
            raise NotImplementedError("resource is required")
        if not self.mapped_class:
            raise NotImplementedError("mapped_class is required")

        super().__init__()

        app.get(API_ROOT + self.resource + "/<resource_id>", callback=self.get)
        app.get(API_ROOT + self.resource, callback=self.query)
        app.put(API_ROOT + self.resource, callback=self.save_or_update)
        app.put(API_ROOT + self.resource + "/<resource_id>", callback=self.save_or_update)
        app.post(API_ROOT + self.resource, callback=self.save_or_update)
        app.delete(API_ROOT + self.resource + "/<resource_id>", callback=self.delete)

        # URL for relations
        app.get(API_ROOT + self.resource + "/schema", callback=self.get_schema)
        app.get(API_ROOT + self.resource + "/<relation:path>/schema", callback=self.get_schema)
        app.get(API_ROOT + self.resource + "/<resource_id>/<relation:path>", callback=self.get_relation)


    def get_relation(self, resource_id, relation):
        """
        Handle GET requests on relation rooted at this resource.

        Return a JSON object where the results property represents the items
        from the relation end point.  e.g. /family/1/genera/species would return
        all the species related to the family with id=1.
        """

        accepted = parse_accept_header()
        if JSON_MIMETYPE not in accepted:
            raise bottle.HTTPError('406 Not Accepted - Expected application/json')

        depth = 1
        if 'depth' in accepted[JSON_MIMETYPE]:
            depth = accepted[JSON_MIMETYPE]['depth']

        session = db.connect()

        # get the mapper for the last item in the list of relations
        mapper = orm.class_mapper(self.mapped_class)
        for name in relation.split('/'):
            mapper = getattr(mapper.relationships, name).mapper

        # query the mapped class and the end point relation using the list of the passed
        # relations to create the join between the two
        query = session.query(self.mapped_class, mapper.class_).\
            filter(getattr(self.mapped_class, 'id') == resource_id).\
            join(*relation.split('/'))

        response.content_type = '; '.join((JSON_MIMETYPE, "charset=utf8"))
        results = [obj.json(depth=int(depth)) for parent, obj in query]
        response_json = {'results': results}
        session.close()
        return response_json


    def get(self, resource_id):
        """
        Handle GET requests on this resource.

        Return a standard json response object representing the mapped_class
        where the queried objects are returned in the json object in
        the collection_name array.
        """
        accepted = parse_accept_header()
        if JSON_MIMETYPE not in accepted:
            raise bottle.HTTPError('406 Not Accepted - Expected application/json')

        depth = 1
        if 'depth' in accepted[JSON_MIMETYPE]:
            depth = accepted[JSON_MIMETYPE]['depth']

        session = db.connect()
        obj = session.query(self.mapped_class).get(resource_id)

        response.content_type = '; '.join((JSON_MIMETYPE, "charset=utf8"))
        response_json = obj.json(depth=int(depth))
        session.close()
        return response_json


    def get_schema(self, relation=None):
        """
        Return a JSON representation of the queryable schema of this resource or one
        of it's relations.

        This doesn't necessarily represent the json object that is returned
        for this resource.  It is more for the queryable parts of this resources
        to be used for building reports and query strings.

        A schema object can be declared in the class or else a schema will be generated
        from the mapper.  If a schema is not to be returned then set schema to None.
        """
        flags = request.query.flags
        if(flags):
            flags = flags.split(',')

        mapper = orm.class_mapper(self.mapped_class)
        if relation:
            for name in relation.split('/'):
                mapper = getattr(mapper.relationships, name).mapper
        schema = dict()
        schema['columns'] = [col for col in mapper.columns.keys() if not col.startswith('_')]

        if 'scalars_only' in flags:
            schema['relations'] = [key for key, rel in mapper.relationships.items() if not key.startswith('_') and not rel.uselist]
        else:
            schema['relations'] = [key for key in mapper.relationships.keys() if not key.startswith('_')]
        return schema


    @staticmethod
    def get_ref_id(ref):
        # assume that if ref is not a str then it is a resource JSON object
        if not isinstance(ref, str):
            ref = ref['ref']
        return ref.split('/')[-1]


    def apply_query(self, query, query_string):
        raise bottle.HTTPError("404 Not Found - Query on " + self.resource + " not supported")


    def query(self):
        """
        Handle GET /resource?q= requests on this resource.
        """
        q = request.query.q
        relations = request.query.relations
        if(relations):
            relations = [relation.strip() for relation in relations.split(',')]
        else:
            relations = []

        accepted = parse_accept_header()
        if JSON_MIMETYPE not in accepted:
            raise bottle.HTTPError('406 Not Accepted - Expected application/json')

        depth = 1
        if 'depth' in accepted[JSON_MIMETYPE]:
            depth = accepted[JSON_MIMETYPE]['depth']

        session = db.connect()

        # TODO: should split on either / or . to allow dot or slash delimeters
        # between references

        def get_relation_class(relation):
            # get the class at the end of the relationship
            relation_mapper = orm.class_mapper(self.mapped_class)
            for kid in relation.split('.'):
                relation_mapper = getattr(relation_mapper.relationships, kid).mapper
            return relation_mapper.class_


        json_objs = []
        if relations:
            # use an OrderedDict so we can maintain the default sort order on the resource and
            unique_objs = OrderedDict()

            # get the json objects for each of the relations and add them to the
            # main resource json at resource[relation_name], e.g. resource['genera.species']
            for relation in relations:
                query = session.query(self.mapped_class, get_relation_class(relation)).\
                    join(*relation.split('.'))
                if(q):
                    query = self.apply_query(query, q)

                for result in query:
                    resource = result[0]

                    # add the resource_json to unique_objs if it doesn't already exist
                    if resource.id not in unique_objs:
                        resource_json = resource.json(int(depth))
                        resource_json[relation] = []
                        unique_objs[resource.id] = resource_json
                    else:
                        resource_json = unique_objs[resource.id]

                    resource_json[relation].append(result[1].json(depth=int(depth)))

            # create a list of json objs that should maintain the
            json_objs = [obj for obj in unique_objs.values()]

        else:
            query = session.query(self.mapped_class)
            if(q):
                query = self.apply_query(query, q)
            json_objs = [obj.json(int(depth)) for obj in query]

        session.close()
        response_json = {'results': json_objs}
        response.content_type = '; '.join((JSON_MIMETYPE, "charset=utf8"))
        return response_json


    def delete(self, resource_id):
        """
        Handle DELETE requests on this resource.
        """
        session = db.connect()
        obj = session.query(self.mapped_class).get(resource_id)
        session.delete(obj)
        session.commit()
        session.close()


    def save_or_update(self, resource_id=None):
        """
        Handle POST and PUT requests on this resource.

        If a family_id is passed the family will be updated. Otherwise it will be
        created.  The request body should contain a Family json object.

        A JSON object that represents the created Family will be returned in the response.
        """
        accepted = parse_accept_header()
        if JSON_MIMETYPE not in accepted:
            raise bottle.HTTPError('406 Not Accepted - Expected application/json')

        depth = 1
        if 'depth' in accepted[JSON_MIMETYPE]:
            depth = accepted[JSON_MIMETYPE]['depth']

        response.content_type = '; '.join((JSON_MIMETYPE, "charset=utf8"))
        session = db.connect()

        # make sure the content is JSON
        if JSON_MIMETYPE not in request.headers.get("Content-Type"):
            raise bottle.HTTPError('415 Unsupported Media Type - Expected application/json')

        # we assume all requests are in utf-8
        data = json.loads(request.body.read().decode('utf-8'))

        # remove all the JSON properties we should ignore
        for name in self.ignore:
            data.pop(name, None)

        relation_data = {}
        for name in self.relations.keys():
            if name in data:
                relation_data[name] = data.pop(name)

        # if this is a PUT to a specific ID then get the existing family
        # else we'll create a new one
        if request.method == 'PUT' and resource_id is not None:
            instance = session.query(self.mapped_class).get(resource_id)
            for key in data.keys():
                setattr(instance, key, data[key])
            response.status = 200
        else:
            instance = self.mapped_class(**data)
            response.status = 201

        # TODO: how many relations deep do we support saving, e.g.
        # family.genera or family.genera.species, or maybe we only support
        # non-list relations, e.g genus.family

        # handle the relations
        for name in relation_data:
            getattr(self, self.relations[name])(instance, relation_data[name], session)

        session.add(instance)
        session.commit()
        response_json = instance.json(depth=int(depth))
        session.close()
        return response_json


class FamilyResource(Resource):

    resource = '/family'
    mapped_class = Family
    relations = {
        'notes': 'handle_notes',
        'synonyms': 'handle_synonyms'
    }

    def handle_synonyms(self, family, synonyms, session):
        # syn objects can be of the form {'synonym': {'ref': '/family/<id>'}}
        # or {'synonym_id': <id>}
        for syn in synonyms:
            family_synonym = FamilySynonym(family=family)
            if 'synonym_id' in syn:
                family_synonym.synonym_id = syn['synonym_id']
            elif 'synonym' in syn:
                family_synonym.synonym_id = syn['synonym']['ref'].split('/')[-1]


    def handle_notes(self, family, notes, session):
        for note in notes:
            family_note = FamilyNote(**note)
            family.notes.append(family_note)


    def apply_query(self, query, query_string):
        return query.filter(Family.family.like(query_string))


class GenusResource(Resource):
    resource = "/genus"
    mapped_class = Genus
    relations = {'family': 'handle_family'}

    def handle_family(self, genus, family, session):
        genus.family_id = self.get_ref_id(family)


    def apply_query(self, query, query_string):
        return query.filter(Genus.genus.like(query_string))


class TaxonResource(Resource):
    resource = "/taxon"
    mapped_class = Species
    relations = {'genus': 'handle_genus'}

    def handle_genus(self, taxon, genus, session):
        taxon.genus_id = self.get_ref_id(genus)

    def apply_query(self, query, query_string):
        mapper = orm.class_mapper(Species)
        ilike = lambda col: \
                lambda val: utils.ilike(mapper.c[col], '%%%s%%' % val)
        properties = ['sp', 'sp2', 'infrasp1', 'infrasp2',
                                'infrasp3', 'infrasp4']
        ors = sa.or_(*[ilike(prop)(query) for prop in properties])
        return query.filter(ors)


class AccessionResource(Resource):
    resource = "/accession"
    mapped_class = Accession
    ignore = ['ref', 'str', 'species_str']

    relations = {'taxon': 'handle_taxon',
                 'species': 'handle_taxon'}


    def handle_taxon(self, accession, taxon, session):
        accession.species_id = self.get_ref_id(taxon)

    def apply_query(self, query, query_string):
        return query.filter(Accession.code.like(query_string))


class PlantResource(Resource):
    resource = "/plant"
    mapped_class = Plant

    relations = {'accession': 'handle_accession',
                 'location': 'handle_location'}

    def handle_accession(self, plant, accession, session):
        plant.accession_id = self.get_ref_id(accession)

    def handle_location(self, plant, location, session):
        plant.location_id = self.get_ref_id(location)

    def apply_query(self, query, session):
        # TODO: we also need to support searching will full accession.plant
        # strings like the PlantSearch mapper strategy from bauble 1
        return query.filter(Plant.code.like(query_string))


class LocationResource(Resource):
    resource = "/location"
    mapped_class = Location

    def apply_query(self, query, query_string):
        return query.filter(Location.code.like(query_string))


@app.get('/lib/<path:path>/<filename>')
def lib_get(path, filename):
    parts = path.split('/')
    return bottle.static_file(filename, root=os.path.join(lib_dir, *parts))


@app.get('/partials/<filename>')
def partials_get(filename):
    return bottle.static_file(filename, root=os.path.join(app_dir, 'partials'))


@app.get('/css/<filename>')
def css_get(filename):
    return bottle.static_file(filename, root=os.path.join(app_dir, 'css'))


@app.get('/js/<filename>')
def js_get(filename=None):
    return bottle.static_file(filename, root=js_dir)


@app.get('/js/<path:path>/<filename>')
def js_sub_get(path, filename):
    parts = path.split('/')
    return bottle.static_file(filename, root=os.path.join(js_dir, *parts))


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


@app.get("/")
def index():
    #return "Welcome"
    return bottle.template("app/index.html")


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
@app.get("/search")
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

    # *******
    # TODO: the tables shouldn't be created everytime the application is started
    # *******
    db.Base.metadata.create_all(db.engine)
    FamilyResource()
    GenusResource()
    TaxonResource()
    AccessionResource()
    PlantResource()
    LocationResource()
    app.run(host='localhost', port=8080, reloader=True, debug=True)

