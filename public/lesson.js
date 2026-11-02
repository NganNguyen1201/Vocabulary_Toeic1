const correctSound =
new Audio("/audio/correct.mp3");

const wrongSound =
new Audio("/audio/wrong.mp3");
function speak(text){

    const utter =
    new SpeechSynthesisUtterance(text);

    utter.lang = "en-US";

    speechSynthesis.cancel();

    speechSynthesis.speak(utter);

}

const params =
    new URLSearchParams(
        location.search
    );

const lessonId =
    params.get("id");

let vocabList = [];

let currentIndex = 0;

let selectedAnswer = "";

let correct = 0;
let wrong = 0;

init();

async function init() {

    const res = await fetch(
        "/api/admin/lesson/" + lessonId
    );

    vocabList = await res.json();

    console.log(vocabList);

    if (!vocabList.length) {

        document.querySelector(
            ".quiz-container"
        ).innerHTML =
            "<h2>Không có dữ liệu</h2>";

        return;
    }

    loadQuestion();

}

function loadQuestion() {

    if (
        currentIndex >= vocabList.length
    ) 
    
   function finishQuiz(){

    const accuracy =
    (
        correct /
        vocabList.length *
        100
    ).toFixed(2);

    document.querySelector(
        ".quiz-container"
    ).innerHTML =
    `
    <h1>
        🎉 Hoàn thành
    </h1>

    <h2>
        ✅ Correct: ${correct}
    </h2>

    <h2>
        ❌ Wrong: ${wrong}
    </h2>

    <h2>
        🎯 Accuracy: ${accuracy}%
    </h2>

    <br>

    <button
        class="restart-btn"
        onclick="restartQuiz()"
    >
        🔄 Làm lại từ đầu
    </button>

    <button
        class="home-btn"
        onclick="goHome()"
    >
        🏠 Home
    </button>
    `;
}

    const current =
        vocabList[currentIndex];
    
    document.getElementById(
        "progress"
    ).innerText =
    `Câu ${currentIndex + 1} / ${vocabList.length}`;

    document.getElementById(
        "meaning"
    ).innerText =
        current.meaning;

    document.getElementById(
        "result"
    ).innerHTML = "";

    selectedAnswer = "";

    const optionsBox =
        document.getElementById(
            "options"
        );

    optionsBox.innerHTML = "";

    const wrongAnswers =
        vocabList
            .filter(
                x => x.vocab !== current.vocab
            )
            .sort(
                () => Math.random() - 0.5
            )
            .slice(0, 3);

    const options =
        [
            current,
            ...wrongAnswers
        ]
            .sort(
                () => Math.random() - 0.5
            );

    const letters =
        ["A", "B", "C", "D"];

    options.forEach(
        (item, index) => {

            const div =
                document.createElement(
                    "div"
                );

            div.className =
                "option";

            div.innerHTML =
                `
                <div class="letter">
                    ${letters[index]}
                </div>

                <div class="word">

                <span class="english">
                     ${item.vocab}
                 </span>


                </div>
                `;

            div.addEventListener(
                "click",
                () => chooseAnswer(
                    div,
                    item.vocab
                )
            );

            optionsBox.appendChild(
                div
            );

        }
    );

}

function chooseAnswer(
    element,
    answer
) {

    document
        .querySelectorAll(".option")
        .forEach(
            x => x.classList.remove(
                "selected"
            )
        );

    element.classList.add(
        "selected"
    );

    selectedAnswer = answer;

    checkAnswer();

}

function checkAnswer(){

    const current =
    vocabList[currentIndex];

    const allOptions =
    document.querySelectorAll(
        ".option"
    );

    allOptions.forEach(option => {

        const text =
        option.querySelector(
            ".english"
        ).innerText;

        if(
            text.toLowerCase() ===
            current.vocab.toLowerCase()
        ){

            option.classList.add(
                "correct"
            );

        }

    });

    if(
        selectedAnswer ===
        current.vocab
    ){

        correct++;

        speak(current.vocab);

        document
        .getElementById("result")
        .innerHTML =
        `
        ✅ Chính xác
        `;

    }
    else{

        wrong++;

        speak(current.vocab);

        document
        .getElementById("result")
        .innerHTML =
        `
        ❌ Đáp án đúng:
        <b>${current.vocab}</b>
        `;

    }

    updateStats();

    setTimeout(() => {

        currentIndex++;

        loadQuestion();

    },5000); // đợi 5 giây

}

function updateStats() {

    const total =
        correct + wrong;

    const accuracy =
        total === 0
            ? 0
            : (
                correct /
                total *
                100
            ).toFixed(2);

    document
        .getElementById("result")
        .innerHTML +=
        `
        <br><br>

        ✅ ${correct}

        &nbsp;&nbsp;

        ❌ ${wrong}

        &nbsp;&nbsp;

        🎯 ${accuracy}%
        `;
}
document.getElementById(
    "progress"
).innerText =
`Câu ${currentIndex + 1}/${vocabList.length}`;


document.querySelector(
    ".quiz-container"
).innerHTML =
`
<h1>🎉 Hoàn thành</h1>

<h2>Correct: ${correct}</h2>

<h2>Wrong: ${wrong}</h2>

<h2>Accuracy: ${accuracy}%</h2>

<button onclick="location.reload()">
    🔄 Làm lại
</button>

<button onclick="window.location.href='/'">
    🏠 Trang chủ
</button>
`;
function goHome(){

    window.location.href =
    "http://localhost:3000/";

}

function restartQuiz(){

    location.reload();

}

function goHome(){

    window.location.href =
    "http://localhost:3000/";

}