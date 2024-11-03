import json
import requests

def emotionDetector(text_to_analyze):
    ## get the query parameter textToAnalyze from the URL 
    
    input_json = { "raw_document": { "text": text_to_analyze }}
    ## call the emotion-detector API
    try:
        print(f"requesting emotion detection for: {text_to_analyze}")
        ## this API cannot run locally, so we will comment it out
        # response = requests.post(URL, json=input_json, headers=HEADERS)
        response = {
                    'anger': 0.001,
                    'disgust': 0.001,
                    'fear': 0.001,
                    'joy': 0.996,
                    'sadness': 0.001,
                    'dominant_emotion': 'joy'
                    }
        response = json.dumps(response)
    except Exception as e:
        print(f"Error: {e}")
    
    json_response = json.loads(response)
    ## return the response in JSON format
    return json.loads(response)
    
    
if __name__ == '__main__':
    print(emotionDetector("I am glad this happened"))
    

