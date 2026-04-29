const formDestiny = "http://localhost:5678/webhook-test/results";

window.onload = function() {
    const f = document.talentForm;
    f.onsubmit = verification;
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

async function verification(event) {
    const f = document.talentForm;
    event.preventDefault();

    const data = new FormData(f);
    const jsonData = Object.fromEntries(data.entries());

    try {
        const response = await fetch(formDestiny, 
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(jsonData)
            }
        );
        
        const form = document.getElementById("talentForm");
        let p = document.createElement("p");
        p.innerText = "Solicitud procesada correctamente. En breve nos pondremos en contacto contigo";
        p.classList.add("response");
        form.appendChild(p);
        document.getElementById("submitBtn").hidden = true;

    } catch (error) {
        const form = document.getElementById("talentForm");
        let p = document.createElement("p");
        p.innerText = "No se ha podido procesar su solicitud";
        p.classList.add("response");
        p.style.color = "red";
        form.appendChild(p);
    }
}