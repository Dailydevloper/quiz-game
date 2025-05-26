from flask import Flask, render_template, request, jsonify
import requests
import html

app = Flask(__name__)

OPEN_TRIVIA_API_URL = "https://opentdb.com/api.php"

@app.route("/")
def index():
    return render_template("index.html")

@app.route('/get_questions', methods=['POST'])
def get_questions():
    try:
        data = request.get_json()
        difficulty = data.get('difficulty')
        q_type = data.get('type')
        amount = data.get('amount')
        category = data.get('category')  

        params = {
            'amount': amount,
            'difficulty': difficulty,
            'type': q_type,
            'category': category
        }

        response = requests.get('https://opentdb.com/api.php', params=params)
        result = response.json()

        if result['response_code'] != 0:
            return jsonify({'error': 'Could not fetch questions'}), 400

        return jsonify(result['results'])

    except Exception as e:
        return jsonify({'error': str(e)}), 500



if __name__ == "__main__":
    app.run(debug=True)



    
