import requests

from configuration import SERVICE_URL

from src.enums.global_enums import GlobalErrorMessages


def test_equal(start_message):
    assert 1 == 1, "Number is not equal to expected"
    print(start_message)


def test_get_request():
    response = requests.get(url=SERVICE_URL + '/typicode/demo/posts')
    received_json = response.json()

    assert response.status_code == 200, GlobalErrorMessages.WRONG_STATUS_CODE.value
    assert len(received_json) == 3, GlobalErrorMessages.WRONG_ELEMENT_COUNT.value
    print(response.json())
