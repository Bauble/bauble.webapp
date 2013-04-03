
from api import *


def test_basics():
    # create the family
    response_json = create_resource('/family', family=get_random_name())
    family = response_json['families'][0]

    # create the genus
    response_json = create_resource('/genus', family_id=family['id'],
                                    genus=get_random_name())
    genus = response_json['genera'][0]

    # create the taxon
    response_json = create_resource('/taxon', sp=get_random_name(),
                                    genus_id=genus['id'])
    taxon = response_json['taxon'][0]

    # create the accession
    response_json = create_resource('/accession', code=get_random_name(),
                                    taxon_id=taxon['id'])
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
    get_resource('/taxon', taxon['id'])
    get_resource('/accession', accession['id'])
    get_resource('/plant', plant['id'])
    get_resource('/location', location['id'])

    # delete each of the resources we created
    delete_resource('/plant', plant['id'])
    delete_resource('/location', location['id'])
    delete_resource('/accession', accession['id'])
    delete_resource('/taxon', taxon['id'])
    delete_resource('/genus', genus['id'])
    delete_resource('/family', family['id'])


def test_parse_accept_header():
    from bauble.server import parse_accept_header

    result = parse_accept_header("application/json;q=0;depth=1")
    assert result == {"application/json": {'q': '0', 'depth': '1'}}

    result = parse_accept_header("application/json;q=0;depth=1, */*")
    assert result == {"application/json": {'q': '0', 'depth': '1'},
                      "*/*": {}}

    result = parse_accept_header("application/json;q=0;depth=1, */*, text/html;depth=2")
    assert result == {"application/json": {'q': '0', 'depth': '1'},
                      "*/*": {},
                      "text/html": {'depth': '2'}}
