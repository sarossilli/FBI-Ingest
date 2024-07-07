from typing import Union, Literal
from fbiApi import __get_api_response
import requests
import os
import zlib
import brotli

def handler(event, context):
    results = wanted()
    print(results)
    imageMap = {}
    for result in results:
        largeImageUrl = result['images'][-1]['large']
        personUid = result['uid']
        imageData = getImage(largeImageUrl)
        imageMap.update({personUid:imageData})
    print(imageMap)




def wanted(person_classification: Union[Literal['Main'], Literal['Accomplice'], Literal['Victim']] = None,
           page_size: int = 20, page: int = 1, sort_order: Union[Literal['asc'], Literal['desc']] = None) -> dict:
    """
    Get listing of wanted people
    :param person_classification: person classification
    :param page_size: number of items to return
    :param page: page of result listing
    :param sort_order: result sort order
    :return: a list of result dictionaries
    """
    if person_classification is None:
        person_classification = ""
    else:
        person_classification = f"&person_classification={person_classification}"

    if sort_order is None:
        sort_order = ""
    else:
        sort_order = f"&sort_order={sort_order}"

    response = __get_api_response(f"https://api.fbi.gov/wanted?pageSize={page_size}&page={page}{person_classification}")

    return response['items']

def getImage(image_url):
    # Fetch the image data
    image_url = "https://www.fbi.gov/wanted/counterintelligence/boris-yakovlevich-livshits/@@images/image/large"
    print("Fetching image from: ", image_url)
    headers = {}

    try:
        response = requests.get(image_url, headers=headers, verify=False)
    except requests.exceptions.RequestException as e:
        raise Exception(f"Request failed: {e}")
    
    if response.status_code == 200:
        image_data = response.content
        return image_data
    else:
        # Try to decode the response content
        encoding = response.headers.get('Content-Encoding')
        if encoding == 'gzip':
            try:
                decoded_content = zlib.decompress(response.content, zlib.MAX_WBITS | 16)
            except zlib.error:
                decoded_content = response.content
        elif encoding == 'deflate':
            try:
                decoded_content = zlib.decompress(response.content)
            except zlib.error:
                decoded_content = response.content
        elif encoding == 'br':
            try:
                decoded_content = brotli.decompress(response.content)
            except brotli.error:
                decoded_content = response.content
        else:
            decoded_content = response.content
        
        raise Exception("Failed to fetch image from API. Response was", response.status_code, decoded_content.decode('utf-8', errors='ignore'))
