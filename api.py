import requests

SEARCH_URL = "https://wallhaven.cc/api/v1/search"

def search_wallpapers(query):
    params = {
        "q": query,
        "categories": "111",
        "purity": "100",
        "sorting": "toplist",
        "order": "desc"
    }

    response = requests.get(SEARCH_URL, params=params)
    response.raise_for_status()
    return response.json()
