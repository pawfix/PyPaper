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
    
    try:
        response = requests.get(SEARCH_URL, params=params, timeout=10)
        response.raise_for_status()  # Raise HTTPError for bad responses
        return {"success": True, "data": response.json(), "status_code": response.status_code, "error": None}
    
    except requests.exceptions.HTTPError as http_err:
        status = response.status_code
        # Map HTTP status codes to messages
        status_messages = {
            400: "Bad request – check your query parameters.",
            401: "Unauthorized – API key missing or invalid.",
            403: "Forbidden – you don't have access.",
            404: "Not found – the resource does not exist.",
            429: "Too many requests – rate limit exceeded."
        }
        message = status_messages.get(status, f"HTTP error occurred: {http_err}")
        return {"success": False, "data": None, "status_code": status, "error": message}
    
    except requests.exceptions.Timeout:
        return {"success": False, "data": None, "status_code": None, "error": "Request timed out."}
    except requests.exceptions.ConnectionError:
        return {"success": False, "data": None, "status_code": None, "error": "Network problem. Check your connection."}
    except requests.exceptions.JSONDecodeError:
        return {"success": False, "data": None, "status_code": response.status_code if 'response' in locals() else None, "error": "Could not decode JSON response."}
    except Exception as err:
        return {"success": False, "data": None, "status_code": None, "error": f"An unexpected error occurred: {err}"}   
