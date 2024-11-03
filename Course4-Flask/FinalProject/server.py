'''
This is the main file for the Flask application. It contains the routes for the application.
'''
from flask import Flask, render_template, request
from EmotionDetection import emotion_detection

app = Flask(__name__)

URL = 'https://sn-watson-sentiment-bert.labs.skills.network/v1/watson.runtime.nlp.\
        v1/NlpService/SentimentPredict'
HEADERS =  {"grpc-metadata-mm-model-id": "emotion_aggregated-workflow_lang_en_stock"}

@app.route('/')
def index():
    '''## return the index.html file'''
    return render_template('index.html')

@app.route("/emotionDetector", methods=['GET'])
def detection():
    '''## get the query parameter textToAnalyze from the URL'''
    text_to_analyze = request.args.get('textToAnalyze')
    if text_to_analyze is None:
        return "Please provide a text to analyze!", 400
    response = emotion_detection.emotionDetector(text_to_analyze)
    text_response = str(f"For the given statement, the system response is : \
                    'anger': {response['anger']}, \
                    'disgust': {response['disgust']}, \
                    'fear': {response['fear']}, \
                    'joy': {response['joy']} and \
                    'sadness': { response['sadness']}. \
                    The dominant emotion is {response['dominant_emotion']}.")
    if text_response is None:
        text_response = "Invalid text! Please try again!"
    return text_response

if __name__ == '__main__':
    app.run(debug=True, port=5000)
