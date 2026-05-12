'use strict';

const url = "http://localhost:5678/webhook/post";

window.onload = function() {
    const f = document.posts;
    f.onsubmit = verification;

    const form = document.getElementById("posts");

    const uploadZone = document.getElementById("upload_zone");
    const file = document.getElementById("file");
    
    const previewContainer = document.getElementById("preview_container");
    const imagePreview = document.getElementById("image_preview");

    const imageContainer = document.getElementById("image_container");
    const uploadImage = document.getElementById("upload_image")

    imageContainer.addEventListener("click", (element) => {
        file.click();
    });

    previewContainer.addEventListener("click", (element) => {
        file.click();
    });

    file.addEventListener("change", (event) => {
        const img = event.srcElement.files[0];
        
        if (img) {
            const reader = new FileReader()
            reader.readAsDataURL(img);
            reader.onload = (event) => {
                imagePreview.setAttribute("src", event.target.result);
                previewContainer.hidden = false;
                imageContainer.hidden = true;        
            };
        }
    });

    let logos = document.getElementsByClassName("logos");

    for(let i = 0; i < logos.length; i++) {
        logos[i].addEventListener("click", (event) => {
            const input = logos[i].previousSibling.previousSibling;
            const check = input.parentNode.nextSibling.nextSibling;
            
            check.hidden = input.checked? true : false; 
            const message = document.getElementById("messages");
            message.textContent = "";
        });
    }
    
    const btnOpenClose = document.getElementById("btnOpenClose");

    btnOpenClose.addEventListener("click", (event) => {
        if (btnOpenClose.innerText == ">") {
            document.body.classList.add("body-out");
            btnOpenClose.innerText = "<";
        } else {
            document.body.classList.remove("body-out");
            btnOpenClose.innerText = ">";
        }
    });
    
}

function verification(event) {
    const imagePreview = document.getElementById("image_preview");
    const message = document.getElementById("messages");
    const uploadImage = document.getElementById("upload_image");
    let logos = document.querySelectorAll("input[type=checkbox]");

    if (imagePreview.getAttribute("src") == "") {
        message.textContent = "Debe seleccionar la foto a postear";
        uploadImage.style.color = "red";
        return false;
    }

    if (!logos[0].checked && !logos[1].checked) {
        message.textContent = "Debe seleccionar un destino para el post";
        return false;
    }

    message.innerText = "Enviando..."

    const f = document.posts;

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

    const previewContainer = document.getElementById("preview_container");
    const imagePreview = document.getElementById("image_preview");
    imagePreview.setAttribute("src", "");
    previewContainer.hidden = true;

    const imageContainer = document.getElementById("image_container");
    imageContainer.hidden = false;
    
    const checks = document.getElementsByClassName("check");
    for(let i = 0; i < checks.length; i++) {
        checks[i].hidden = true;
    }
}