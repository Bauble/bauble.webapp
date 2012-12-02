import json

import requests

import bauble.search as search
from test import *

server="http://localhost:8080"
api_root = server + '/api/v1'


def test_parser():
    """
    Test the bauble.search.SearchParser
    """
    family_name = get_random_name()
    response_json = create_resource('/family', family=get_random_name())
    family = response_json['families'][0]

    parser = search.SearchParser
    parser.statement.parseString('test')


def get_headers():
    return {'accept': 'application/json'}


def test_search():
    family_name = get_random_name()
    response_json = create_resource('/family', family=family_name)
    family = response_json['families'][0]

    
    response_json = create_resource('/family', family=get_random_name())
    family2 = response_json['families'][0]

    response = requests.get(server + "/search", params={'query': family_name},
                            headers=get_headers())
    assert response.status_code == 200

    response_json = json.loads(response.text)
    results = response_json['results']

    # make sure we only get the one we searched for
    assert len(results) == 1
    assert results[0]['id'] == family['id']

    delete_resource('/family', family['id'])
    delete_resource('/family', family2['id'])

    






    
