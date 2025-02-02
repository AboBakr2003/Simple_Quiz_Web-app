// Select elements
let quizApp = document.querySelector(".quiz-app");
let difficultyLevel = document.querySelector(".quiz-app .quiz-info .difficulty-level span");
let countdown = document.querySelector(".quiz-app .quiz-info .countdown");
let minutesOfCountdown = document.querySelector(".quiz-app .quiz-info .countdown .minutes");
let secondsOfCountdown = document.querySelector(".quiz-app .quiz-info .countdown .seconds");
let countSpan = document.querySelector(".quiz-app .quiz-info .count span");
let quizArea = document.querySelector(".quiz-app .quiz-area");
let answersArea = document.querySelector(".quiz-app .answers-area");
let submitBtn = document.querySelector(".quiz-app .submit-btn");
let bullets = document.querySelector(".quiz-app .bullets");
let bulletsSpanContainer = document.querySelector(".quiz-app .bullets .spans");
let resultWindow = document.querySelector(".result");
let currentRate = document.querySelector(".result span:nth-of-type(1)");
let currentDegree = document.querySelector(".result span:nth-of-type(2)");
let quizDegree = document.querySelector(".result span:nth-of-type(3)");


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
            
            // Get questions from JSON file
            let questionsObject = JSON.parse(this.responseText);
            let questionsCount = questionsObject.length;
            
            // CountDown timer 
            countDown(45, questionsCount);
            
            
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

                    // CountDown timer 
                    clearInterval(countdownInterval);
                    countDown(45, questionsCount);
                    countdown.classList.remove("end-seconds");
                } 
                else {
                    // Show result window
                    showResult(questionsCount);
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
        questionBullet.classList.add("right-answer");
    } else {
        questionBullet.classList.add("wrong-answer");
    }
    
    // Remove the active style from previous question bullet
    questionBullet.classList.remove("on")
}


function countDown(duration, questionsCount) {
    if (currentIndex < questionsCount) {
        let minutes, seconds;
        countdownInterval = setInterval(() => {
            minutes = parseInt(duration / 60);
            seconds = parseInt(duration % 60);
            
            minutes = minutes < 10 ? `0${minutes}` : minutes
            seconds = seconds < 10 ? `0${seconds}` : seconds
            
            minutesOfCountdown.textContent = minutes;
            secondsOfCountdown.textContent = seconds;
            
            if (seconds < 11) {
                countdown.classList.toggle("end-seconds")
            }
            
            if (--duration < 0) {
                clearInterval(countdownInterval);
                submitBtn.click();
                countdown.classList.remove("end-seconds");
            }
        }, 1000) 
    }
}


function showResult (questionsCount) {
    if (currentIndex === questionsCount) {
        resultWindow.style.display = "block";
        quizApp.style.pointerEvents = "none";
        quizApp.style.filter = "blur(5px)"
        
        if (rightAnswersCount >= (questionsCount - 1) && rightAnswersCount <= questionsCount) {
            currentRate.innerHTML = "Perfect&#129395;";
            currentRate.className = "perfect";
        } else if (rightAnswersCount >= Math.ceil(questionsCount / 2 )) {
            currentRate.innerHTML = "Good&#128079;";
            currentRate.className = "good";
        } else {
            currentRate.innerHTML = "Bad&#128529;";
            currentRate.className = "bad";
        }
        
        currentDegree.textContent = rightAnswersCount;
        quizDegree.textContent = questionsCount;
    }
}

// Close result window
resultWindow.querySelector(".close-btn").onclick = () => {
    resultWindow.style.display = "none";
    quizApp.style.pointerEvents = "auto";
    quizApp.style.filter = "none";
    window.location.reload();
}
