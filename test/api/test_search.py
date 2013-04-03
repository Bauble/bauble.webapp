import json

import requests

import bauble.search as search
import test.api as test


def test_parser():
    """
    Test the bauble.search.SearchParser
    """
    family = test.create_resource('/family', {'family': test.get_random_name()})
    parser = search.SearchParser()
    parser.statement.parseString(family['family'])


def get_headers():
    return {'accept': 'application/json'}


def test_search():
    family_name = test.get_random_name()
    family = test.create_resource('/family', {'family': family_name})

    family2 = test.create_resource('/family', {'family': test.get_random_name()})

    # return $http({method: 'GET', url: globals.apiRoot + '/search', params: {'q': value}})
    #         .then(callback);

    response = requests.get(test.api_root + "/search", params={'q': family_name},
                            headers=get_headers())
    assert response.status_code == 200

    response_json = json.loads(response.text)
    results = response_json['results']
    # make sure we only get the one we searched for
    assert len(results) == 1

    assert results[0]['ref'] == family['ref']

    test.delete_resource(family['ref'])
    test.delete_resource(family2['ref'])
