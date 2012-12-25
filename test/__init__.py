import json
import random

import requests


server="http://localhost:8080"
api_root = server + "/api/v1"

def get_random_name():
    """
    Return a random string for creating resources that require unique names.
    """
    return str(random.random())


def get_headers(depth=1):
    """
    Return the standard request headers
    """
    return {'accept': 'application/json;depth=' + str(depth)}


def create_resource(resource, **kwargs):
    """
    Create a server based resource with fields in kwargs with a POST
    """
    response = requests.post(api_root+resource, data=kwargs,
                             headers=get_headers())
    assert response.status_code == 200
    return json.loads(response.text)


def get_resource(resource, id=None, depth=1):
    """
    Get a server based resource with id=id
    """
    uri = api_root + resource
    if id is not None:
        uri = uri + "/" + str(id)
    print(uri)
    response = requests.get(uri, headers=get_headers())
    print(response.text)
    assert response.status_code == 200
    return json.loads(response.text)


def delete_resource(resource, id):
    """
    Delete a server based resource with id=id
    """
    response = requests.delete(api_root + resource + "/" + str(id))
    assert response.status_code == 200
    return response
