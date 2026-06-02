'use strict';

const sections = ["info", "skills", "tecno", "projects", "contact"]

window.onload = function() {
    let menu = document.querySelectorAll("#menu li:not(:last-child");
    
    for(let i = 0; i < menu.length; i++) {
        menu[i].addEventListener("click", () => {
            showSection(sections[i]);   
        });
    }

    let listProjects = document.querySelectorAll("#projects li");

    for(let i = 0; i < listProjects.length; i++) {
        listProjects[i].addEventListener("click", () => {
            showProject(i);
        });
    }

    let buttonsHeader = document.querySelectorAll("#content_header_buttons button");
    buttonsHeader[0].addEventListener("click", () => {
        showSection(sections[3]);   
    });

    buttonsHeader[1].addEventListener("click", () => {
        showSection(sections[4]);   
    });

    moveLight();

}

function moveLight() {
    const light = document.getElementById("light");
    const topRandom = Math.floor(Math.random() * (600 - 100 + 1) + 100);
    light.style.top = `${topRandom}px`;
}

function showSection(section) {
    let menu = document.querySelectorAll("#menu li");
    let mainSections = document.querySelectorAll("main>section:not(:first-child)");
    
    for(let i = 0; i < mainSections.length; i++) { 
        if (mainSections[i].id == section) {
            menu[i].id = "itemSelected";
            mainSections[i].classList.add("contentSelected");
            mainSections[i].classList.remove("contentNotSelected");
        } else {
            menu[i].id = "";
            mainSections[i].classList.add("contentNotSelected");
            mainSections[i].classList.remove("contentSelected");
        }
    }
}

function showProject(item) {
    let listProjects = document.querySelectorAll("#projects li");
    let projects = document.querySelectorAll("#projects div");

    for(let i = 0; i < projects.length; i++) { 
        if (i == item) {
            listProjects[i].id = "projectSelected"
            projects[i].classList.add("contentSelected");
            projects[i].classList.remove("contentNotSelected");
        } else {
            listProjects[i].id = ""
            projects[i].classList.add("contentNotSelected");
            projects[i].classList.remove("contentSelected");
        }
    }
}