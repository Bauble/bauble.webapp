
import test.api as test
import requests

def test_auth():
    headers = {
        "Accept": "application/json"
    }

    url = test.api_root + "/auth"
    data = {
        'user': 'test',
        'password': 'test'
    }

    response = requests.post(url, data=data, headers=headers)
    assert response.status_code == 200

