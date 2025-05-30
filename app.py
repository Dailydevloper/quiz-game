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
    data = request.get_json()
    amount = data.get('amount')
    difficulty = data.get('difficulty')
    qtype = data.get('type')
    category = data.get('category')
    student_name = data.get('studentName')
    roll_no = data.get('rollNo')

    print(f"Quiz started by {student_name} (Roll No: {roll_no})")

    with open('students_log.txt', 'a') as f:
        f.write(f"{student_name} - {roll_no}\n")

    url = f'https://opentdb.com/api.php?amount={amount}&category={category}&difficulty={difficulty}&type={qtype}'
    response = requests.get(url)
    questions = response.json().get('results', [])

    return jsonify(questions)




if __name__ == "__main__":
    app.run(debug=True)



    
