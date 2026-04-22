"use strict";

let info;

window.onload = function() {
    fetch("https://www.padelfip.com/es/wp-json/fip/v1/rankings" + 
        "/?category=4fa3a8c3-c5fb-457a-a793-c0c3b5cfbc79&circuit=6ea3dc15-" +
        "1c19-42ad-99b7-bab78d9fb871&category_name=Master&gender=male", 
        { method: "GET" })
        .then(response => response.json())
        .then(res => {
            info = res;
            fill();
    });
}

function fill() {
    let playes_profile = document.getElementById("players_profile")
    info.forEach(element => {
        let newProfile = document.createElement("article");

    });
}