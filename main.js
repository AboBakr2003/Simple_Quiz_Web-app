// Select elements
let countSpan = document.querySelector(".quiz-app .quiz-info .count span");
let difficultyLevel = document.querySelector(".quiz-app .quiz-info .difficulty-level span");
let bullets = document.querySelector(".quiz-app .bullets");
let bulletsSpanContainer = document.querySelector(".quiz-app .bullets .spans");
let quizArea = document.querySelector(".quiz-app .quiz-area");
let answersArea = document.querySelector(".quiz-app .answers-area");
let userAnswer = document.querySelector(".quiz-app .answers-area .answer input:checked");
let submitBtn = document.querySelector(".quiz-app .submit-btn");
let resultsContainer = document.querySelector(".quiz-app .results");
let countdownElement = document.querySelector(".quiz-app .quiz-info .countdown");
let quizDegree = document.querySelector(".quiz-app .results span:nth-child(3)");
let currentDegree = document.querySelector(".quiz-app .results span:nth-child(2)");

// Set Options
let currentIndex = 0;
let rightAnswersCount = 0;
let countdownInterval;

function getQuestionsJsonFile() {
    const myRequest = new XMLHttpRequest();
    myRequest.open('GET', 'html_questions.json', true);
    myRequest.send();

    myRequest.onreadystatechange = function() {
        if (myRequest.readyState === 4 && myRequest.status === 200) {
            let questionsObject = JSON.parse(this.responseText);
            let questionsCount = questionsObject.length;
            quizDegree.innerHTML = questionsCount;
            currentDegree.innerHTML = rightAnswersCount;
            createBullets(questionsCount)

            // Show question content
            showQuestionData(questionsObject[currentIndex], questionsCount, questionsObject[currentIndex].question_level);

            
            // Click on submit button
            submitBtn.onclick = () => {
                let theRightAnswer = questionsObject[currentIndex].right_answer;
                
                // Increase index
                currentIndex++;
                
                // Check answer
                checkAnswer(theRightAnswer);
                
                if (currentIndex < questionsCount) {
                    // Remove the previous question and answers
                    quizArea.innerHTML = '';
                    answersArea.innerHTML = '';
                    
                    // Show next question and answers
                    showQuestionData(questionsObject[currentIndex], questionsCount, questionsObject[currentIndex].question_level);

                    // Handle bullets 
                    handleBullets();
                }      
            }
        }
    }
}
getQuestionsJsonFile()

// Create bullets
function createBullets(num) {
    countSpan.innerHTML = num;

    for (let i = 1; i <= num; i++) {
        let bullet = document.createElement("span");
        bullet.innerHTML = i;
        bulletsSpanContainer.appendChild(bullet);
    }
}

function showQuestionData(obj, count, level) {
    if (currentIndex < count) {
        // Active question bullet number
        difficultyLevel.innerHTML = level;

        bulletsSpanContainer.children[currentIndex].classList.add("on");

        // Show question text and answers
        let questionText = document.createElement("h2");
        questionText.textContent = obj.title
        for (let i = 1; i <= 4; i++) {
            let answer = document.createElement("div");
            answer.className = "answer";

            let radio = document.createElement("input");
            radio.type = "radio";
            radio.name = "question";
            radio.id = `answer-${i}`;
            radio.dataset.answer = obj[`answer_${i}`];

            let label = document.createElement("label");
            label.htmlFor = `answer-${i}`;
            label.textContent = obj[`answer_${i}`];

            answer.appendChild(radio);
            answer.appendChild(label);
            answersArea.appendChild(answer);
        }
        quizArea.appendChild(questionText);
    }
}

function checkAnswer(rightAnswer) {
    let answers = document.getElementsByName("question");
    let answerChoosed;
    for (let i = 0; i < answers.length; i++) {
        if (answers[i].checked) {
            answerChoosed = answers[i].dataset.answer;
            break;
        }
    }

    // Add class to question bullet for right or wrong answer style 
    let questionBullet = document.querySelector(`.quiz-app .bullets .spans span:nth-child(${currentIndex})`);
    if (answerChoosed === rightAnswer) {
        rightAnswersCount++;
        currentDegree.innerHTML = rightAnswersCount;
        questionBullet.classList.add("right-answer");
    } else if (answerChoosed != undefined) {
        questionBullet.classList.add("wrong-answer");
    }

    // Remove the active style from previous question bullet
    questionBullet.classList.remove("on")
}

