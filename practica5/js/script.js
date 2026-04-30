const formDestiny = "http://localhost:5678/webhook-test/results";

window.onload = function() {
    // const f = document.talentForm;
    // f.onSubmit = verification;
}

function soundEffect(freq_start = 700, freq_end = 700, time = 1) {
    const audioCtx = new AudioContext();

    const oscNode = audioCtx.createOscillator();
    oscNode.type = "sine";
    oscNode.frequency.setValueAtTime(freq_start, audioCtx.currentTime);
    oscNode.frequency.exponentialRampToValueAtTime(freq_end, audioCtx.currentTime + time);
    
    const gainNode = audioCtx.createGain();
    gainNode.gain.setValueAtTime(0.01, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.1, audioCtx.currentTime + (time/4));
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + time);

    oscNode.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscNode.start();
    oscNode.stop(audioCtx.currentTime + time + 1);
}

function changePosition(element) {
    const puesto_requerido = document.getElementById("puesto_requerido");
    puesto_requerido.value = element.id;
}

async function verification(token) {
    const f = document.talentForm;
    
    await grecaptcha.ready(() => {
        grecaptcha.execute("6Lc7SdEsAAAAAIwx2lrNtpLdiALBvX4EKe0TikeU", {action: "registry"})
            .then((token) => {
                f.prepend("<input type='hidden' name='token' value='" + token + "'>");
                f.prepend("<input type='hidden' name='action' value='registry'>");
        });
    });
    

    const data = new FormData(f);

    if (f.cv.value == "") {
        data.delete("cv");
    }

    try {
        const response = await fetch(formDestiny, 
            {
                method: "POST",
                body: data
            }
        );

        const result = await response.json();
        
        if (result[0].error) {
            showResponse(true, "No se ha podido procesar su solicitud");
        } else {
            showResponse(false, "Solicitud procesada correctamente. En breve nos pondremos en contacto contigo");
            document.getElementById("submitBtn").hidden = true;
        }

    } catch (error) {
        showResponse(true, "No se ha podido procesar su solicitud");
    }
}

function showResponse(error = false, message) {
    const response = document.getElementById("response");
    response.innerText = message;
    response.style.color = error? "red" : "white";
}

// function onSubmit(token) {
//     document.getElementById("talentForm").submit();
// }