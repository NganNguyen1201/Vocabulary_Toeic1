loadLessons();

setInterval(loadLessons, 3000);

async function loadLessons(){

    try{

        const lessons =
        await fetch("/api/lessons")
        .then(res => res.json());

        render(lessons);

    }
    catch(error){

        console.error(error);

    }

}

function render(lessons){

    document.getElementById(
        "totalLessons"
    ).innerHTML =
    `(${lessons.length} Conversations)`;

    const grid =
    document.getElementById("lessonGrid");

    grid.innerHTML = "";

    lessons.forEach((lesson,index)=>{

        grid.innerHTML += `
        <div
            class="lesson-card"
            onclick="openLesson(${lesson.id})"
        >

            <div class="lesson-number">
                Conversation ${index + 1}
            </div>

            <div class="lesson-title">
                ${lesson.title}
            </div>

            <div class="lesson-info">
                ${lesson.totalParts} parts
            </div>

        </div>
        `;

    });

}

function openLesson(id){

    location.href =
    `lesson.html?id=${id}`;

}