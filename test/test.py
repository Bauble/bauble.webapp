import json

import requests

server="http://localhost:8080/api/v1"

def test_family():
    headers = {'accept': 'application/json;depth=1'}

    response = requests.post(server + "/family", headers=headers)
    assert response.status_code == 200

    # get the family id
    print(response)
    family_json = json.loads(response.text)
    family_id = family_json['id']

    response = requests.get(server + "/family/" + str(family_id), 
                            headers=headers)
    assert response.status_code == 200

    response = requests.delete(server + "/family/" + str(family_id), 
                               headers=headers)
    assert response.status_code == 200
