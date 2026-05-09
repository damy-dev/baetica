'use strict';

const url = "http://localhost:5678/webhook-test/post";

window.onload = function() {
    const f = document.posts;
    f.onsubmit = verification;

    const form = document.getElementById("posts");

    const uploadZone = document.getElementById("upload_zone");
    const file = document.getElementById("file");
    
}

function verification(event) {
    const message = document.getElementById("messages");
    const f = document.posts;
    
    message.innerText = "Enviando..."

    const data = new FormData(f)

    fetch(url, 
        { 
            method: "POST",
            body: data
        })
        .then(response => { 
            if (response.ok) {
                return response.json();
            }
        })
        .then(result => {
            message.innerHTML = "";
            switch(result[0].facebook) {
                case "Ok":
                    message.innerHTML += "<p>Post publicado en Facebook</p>";
                    fieldsReset();
                    break;
                case "notOk":
                    message.innerHTML += "<p>No se ha podido publicar en Facebook</p>";
                    break;
            }

            switch(result[1].instagram) {
                case "Ok":
                    message.innerHTML += "<p>Post publicado en Instagram</p>";
                    fieldsReset();
                    break;
                case "notOk":
                    message.innerHTML += "<p>No se ha podido publicar en Instagram</p>";
                    break;
            }
        })
        .catch(error => message.textContent = "Fallo en el envío");

    event.preventDefault();
}

function fieldsReset() {
    const f = document.posts;
    f.reset();
}