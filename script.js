/* ==========================================
   UTTAKALADEBA GARNAIK
   PORTFOLIO
========================================== */


/* Current Year */

const year =
    document.getElementById("year");

if (year) {

    year.textContent =
        new Date().getFullYear();

}



/* Smooth scrolling */

document
    .querySelectorAll('a[href^="#"]')
    .forEach(link => {

        link.addEventListener(
            "click",
            function (event) {

                const id =
                    this.getAttribute("href");

                if (
                    id === "#" ||
                    !id
                ) {
                    return;
                }

                const section =
                    document.querySelector(id);

                if (!section) {
                    return;
                }

                event.preventDefault();

                section.scrollIntoView({

                    behavior: "smooth",

                    block: "start"

                });

            }
        );

    });



/* Scroll reveal */

const elements =
    document.querySelectorAll(
        ".section-heading, .about-content, .skill, .project, .journey-content, .contact-main, .socials"
    );


elements.forEach(element => {

    element.classList.add("reveal");

});


const observer =
    new IntersectionObserver(

        entries => {

            entries.forEach(entry => {

                if (
                    entry.isIntersecting
                ) {

                    entry.target.classList.add(
                        "visible"
                    );

                    observer.unobserve(
                        entry.target
                    );

                }

            });

        },

        {
            threshold: 0.12
        }

    );


elements.forEach(element => {

    observer.observe(element);

});



/* Hero mouse movement */

const hero =
    document.querySelector(".hero");


if (
    hero &&
    window.matchMedia(
        "(pointer:fine)"
    ).matches
) {

    hero.addEventListener(
        "mousemove",
        event => {

            const x =
                (
                    event.clientX /
                    window.innerWidth -
                    .5
                );


            const y =
                (
                    event.clientY /
                    window.innerHeight -
                    .5
                );


            const glowOne =
                document.querySelector(
                    ".glow-1"
                );


            const glowTwo =
                document.querySelector(
                    ".glow-2"
                );


            if (glowOne) {

                glowOne.style.transform =
                    `
                    translate(
                        ${x * 35}px,
                        ${y * 35}px
                    )
                    `;

            }


            if (glowTwo) {

                glowTwo.style.transform =
                    `
                    translate(
                        ${x * -25}px,
                        ${y * -25}px
                    )
                    `;

            }

        }
    );

}



/* Project hover movement */

const projects =
    document.querySelectorAll(
        ".project"
    );


projects.forEach(project => {

    project.addEventListener(
        "mousemove",
        event => {

            if (
                !window.matchMedia(
                    "(pointer:fine)"
                ).matches
            ) {
                return;
            }


            const rect =
                project.getBoundingClientRect();


            const x =
                event.clientX -
                rect.left;


            const y =
                event.clientY -
                rect.top;


            const rotateY =
                (
                    x /
                    rect.width -
                    .5
                ) * 2;


            const rotateX =
                (
                    y /
                    rect.height -
                    .5
                ) * -2;


            project.style.transform =
                `
                translateY(-12px)
                perspective(800px)
                rotateX(${rotateX}deg)
                rotateY(${rotateY}deg)
                `;

        }
    );


    project.addEventListener(
        "mouseleave",
        () => {

            project.style.transform =
                "";

        }
    );

});