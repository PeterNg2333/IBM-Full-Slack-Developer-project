import unittest

from  EmotionDetection import emotion_detection

class TestEmotionDetection(unittest.TestCase):
    def test_emotionDetector(self):
        statement = [
            ["I am glad this happened", "joy"], 
            ["I am really mad about this", "anger"], 
            ["I feel disgusted just hearing about this", "disgust"], 
            ["I am so sad about this", "sadness"], 
            ["I am really afraid that this will happen", "fear"]
        ]
        for text, expected in statement:
            with self.subTest(text=text, expected=expected):
                response = emotion_detection.emotionDetector(text)
                self.assertEqual(response['dominant_emotion'], expected)

if __name__ == '__main__':
    unittest.main()