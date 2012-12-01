import json

import requests

server="http://localhost:8080/api/v1"

def get_random_name():
    import random
    return str(random.random())


def get_headers(depth=1):
    return {'accept': 'application/json;depth=' + str(depth)}


def create_family(**kwargs):
    response = requests.post(server + "/family", data=kwargs, 
                             headers=get_headers())
    assert response.status_code == 200
    return json.loads(response.text)


def test_family():
    family = create_family(family=get_random_name())

    # get the family id
    response = requests.get(server + "/family/" + str(family['id']), 
                            headers=get_headers())
    assert response.status_code == 200

    response = requests.delete(server + "/family/" + str(family['id']), 
                               headers=get_headers())
    assert response.status_code == 200


def create_genus(family, **kwargs):
    kwargs['family_id'] = family['id']
       
    response = requests.post(server + "/genus", data=kwargs, 
                             headers=get_headers())
    assert response.status_code == 200
    return json.loads(response.text)
        
    
def test_genus():
    family = create_family(family=get_random_name())
    genus = create_genus(family, genus=get_random_name())
    response = requests.get(server + "/genus/" + str(genus['id']), 
                            headers=get_headers())
    assert response.status_code == 200
    response = requests.delete(server + "/genus/" + str(genus['id']), 
                               headers=get_headers())
    assert response.status_code == 200
