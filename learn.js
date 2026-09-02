/* =====================================================
   LEARN WITH ME
   CONTENT MANAGEMENT FILE

   IMPORTANT:
   Future mein new course / lecture add karne ke liye
   mostly isi file ko edit karna hoga.
===================================================== */


/* =====================================================
   1. COURSES
===================================================== */

const courses = [

    {
        id: "python",

        name: "Python",

        description:
            "Learn Python from the basics with simple explanations, notes and practice.",

        available: true
    },


    {
        id: "html",

        name: "HTML",

        description:
            "Learn the fundamentals of HTML and build the foundation of websites.",

        available: true
    },


    {
        id: "css",

        name: "CSS",

        description:
            "Learn CSS and create beautiful and responsive websites.",

        available: true
    },





     {
        id: "javascript",
        name: "JavaScript",
        description:
            "Learn JavaScript and make your websites interactive.",
        available: true
    }

];



/* =====================================================
   2. LECTURES

   ⭐ ADD NEW VIDEOS HERE ⭐

   Just copy one lecture object and change:

   id
   course
   lecture
   title
   description
   youtube
   notes

===================================================== */

const lectures = [

    /* -------------------------------------------------
       PYTHON — LECTURE 01
    ------------------------------------------------- */

    {
        id: 1,

        course: "python",

        lecture: "Lecture 01",

        title:
            "Introduction to Python",

        description:
            "Start your Python programming journey from the basics.",

        youtube:
            "https://www.youtube.com/",

        notes:
            ""
    },


    /* -------------------------------------------------
       PYTHON — LECTURE 02
    ------------------------------------------------- */

    {
        id: 2,

        course: "python",

        lecture: "Lecture 02",

        title:
            "Variables & Data Types",

        description:
            "Understand variables and basic Python data types.",

        youtube:
            "https://www.youtube.com/",

        notes:
            ""
    },


    /* -------------------------------------------------
       PYTHON — LECTURE 03
    ------------------------------------------------- */

    {
        id: 3,

        course: "python",

        lecture: "Lecture 03",

        title:
            "Input & Type Casting",

        description:
            "Learn how to take user input and convert data types in Python.",

        youtube:
            "https://www.youtube.com/",

        notes:
            ""
    },



  /* -------------------------------------------------
       PYTHON — LECTURE 04
    ------------------------------------------------- */




    {
    id: 4,

    course: "python",

    lecture: "Lecture 04",

    title:
        "Python Strings",

    description:
        "Learn strings and basic string operations in Python.",

    youtube:
        "https://www.youtube.com/watch?v=YOUR_VIDEO_ID",

    notes:
        "notes/python/lecture-04.pdf"
}

];





/* =====================================================
   3. HTML ELEMENTS
===================================================== */

const courseContainer =
    document.getElementById(
        "course-container"
    );


const lectureContainer =
    document.getElementById(
        "lecture-container"
    );



/* =====================================================
   4. DISPLAY COURSES
===================================================== */

function displayCourses() {

    courseContainer.innerHTML = "";


    courses.forEach(course => {


        /* Count lectures */

        const lectureCount =
            lectures.filter(
                lecture =>
                    lecture.course === course.id
            ).length;


        /* Create card */

        const card =
            document.createElement("div");


        card.className =
            "course-card";


        /* Card content */

        card.innerHTML = `

            <div class="course-info">

                <span class="course-tag">
                    ${course.name}
                </span>


                <h3>
                    ${course.name}
                    ${course.id === "python"
                        ? " Programming"
                        : ""
                    }
                </h3>


                <p>
                    ${course.description}
                </p>


                ${
                    course.available
                    ?
                    `
                    <span class="lecture-count">
                        ${lectureCount}
                        ${
                            lectureCount === 1
                            ? " Lecture"
                            : " Lectures"
                        }
                        Available
                    </span>
                    `
                    :
                    `
                    <span class="coming-soon">
                        Coming Soon
                    </span>
                    `
                }

            </div>


            ${
                course.available
                ?
                `
                <button
                    class="course-button"
                    onclick="
                        showCourseLectures('${course.id}')
                    "
                >
                    View Lectures →
                </button>
                `
                :
                `
                <button
                    class="course-button disabled"
                    disabled
                >
                    Coming Soon
                </button>
                `
            }

        `;


        courseContainer.appendChild(card);

    });

}



/* =====================================================
   5. DISPLAY LECTURES
===================================================== */

function displayLectures(
    selectedCourse = null
) {

    lectureContainer.innerHTML = "";


    /* Filter lectures */

    let filteredLectures =
        lectures;


    if (selectedCourse) {

        filteredLectures =
            lectures.filter(
                lecture =>
                    lecture.course ===
                    selectedCourse
            );

    }


    /* No lectures */

    if (
        filteredLectures.length === 0
    ) {

        lectureContainer.innerHTML = `

            <div class="empty-state">

                <h3>
                    No lectures available yet.
                </h3>

                <p>
                    New lessons will be added soon.
                </p>

            </div>

        `;

        return;
    }



    /* Create lecture cards */

    filteredLectures.forEach(
        lecture => {


            const card =
                document.createElement("div");


            card.className =
                "lecture-card";


            /*
                Whole card opens YouTube.
            */

            card.addEventListener(
                "click",
                function () {

                    if (
                        lecture.youtube &&
                        lecture.youtube !== "#"
                    ) {

                        window.open(
                            lecture.youtube,
                            "_blank"
                        );

                    }

                }
            );



            /* Lecture content */

            card.innerHTML = `

                <div class="lecture-content">

                    <span class="lecture-number">
                        ${lecture.lecture}
                    </span>


                    <h3>
                        ${lecture.title}
                    </h3>


                    <p>
                        ${lecture.description}
                    </p>

                </div>


                <div class="lecture-buttons">


                    ${
                        lecture.youtube
                        ?
                        `
                        <a
                            href="${lecture.youtube}"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="watch-button"
                            onclick="
                                event.stopPropagation()
                            "
                        >
                            ▶ Watch
                        </a>
                        `
                        :
                        ""
                    }


                    ${
                        lecture.notes
                        ?
                        `
                        <a
                            href="${lecture.notes}"
                            target="_blank"
                            class="notes-button"
                            onclick="
                                event.stopPropagation()
                            "
                        >
                            📄 Notes
                        </a>
                        `
                        :
                        ""
                    }

                </div>

            `;


            lectureContainer.appendChild(
                card
            );

        }
    );

}



/* =====================================================
   6. COURSE BUTTON
===================================================== */

function showCourseLectures(
    courseId
) {

    displayLectures(courseId);


    document
        .getElementById("lectures")
        .scrollIntoView({
            behavior: "smooth"
        });

}



/* =====================================================
   7. INITIAL LOAD
===================================================== */

displayCourses();

displayLectures();