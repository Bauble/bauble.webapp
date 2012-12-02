import json

import requests

server="http://localhost:8080/api/v1"

def get_random_name():
    """
    Return a random string for creating resources that require unique names.
    """
    import random
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
    response = requests.post(server+resource, data=kwargs,
                             headers=get_headers())
    assert response.status_code == 200
    return json.loads(response.text)


def get_resource(resource, id=None):
    """
    Get a server based resource with id=id
    """
    uri = server + resource
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
    response = requests.delete(server + resource + "/" + str(id))
    assert response.status_code == 200
    return response


def test_basics():
    # create the family
    response_json = create_resource('/family', family=get_random_name())
    family = response_json['families'][0]

    # create the genus
    response_json = create_resource('/genus', family_id=family['id'],
                                    genus=get_random_name())
    genus = response_json['genera'][0]

    # create the species
    response_json = create_resource('/species', sp=get_random_name(),
                                    genus_id=genus['id'])
    species = response_json['species'][0]

    # create the accession
    response_json = create_resource('/accession', code=get_random_name(),
                                    species_id=species['id'])
    accession = response_json['accessions'][0]

    # create the location
    response_json = create_resource('/location', code=get_random_name())
    location = response_json['locations'][0]
    
    # create the plant
    response_json = create_resource('/plant', code=get_random_name(),
                                    quantity=1,
                                    accession_id=accession['id'],
                                    location_id=location['id'])
    plant = response_json['plants'][0]
    
    # get each of the resources we created
    get_resource('/family', family['id'])
    get_resource('/genus', genus['id'])
    get_resource('/species', species['id'])
    get_resource('/accession', accession['id'])    
    get_resource('/plant', plant['id'])
    get_resource('/location', location['id'])
    
    # delete each of the resources we created
    delete_resource('/plant', plant['id'])
    delete_resource('/location', location['id'])
    delete_resource('/accession', accession['id'])
    delete_resource('/species', species['id'])
    delete_resource('/genus', genus['id'])
    delete_resource('/family', family['id'])

