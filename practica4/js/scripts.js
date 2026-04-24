// "use strict";

let infoMale = [];
let infoFemale = [];
let offsetMale = 0;
let offsetFemale = 0;
let info = [];
let limit = 10;

window.onload = function() {
  load()
};

function load() {
  doFetch("male");
  doFetch("female");
}

function doFetch(gender) {
    let loading = gender == "male"? document.getElementById("loading_m") : document.getElementById("loading_f");
    let offset = gender == "male"? offsetMale : offsetFemale;
    loading.innerText = "Cargando...";    
    
    fetch(
    "https://www.padelfip.com/es/wp-json/fip/v1/rankings" +
      "/?category=4fa3a8c3-c5fb-457a-a793-c0c3b5cfbc79&circuit=6ea3dc15-" +
      "1c19-42ad-99b7-bab78d9fb871&category_name=Master&gender=" + gender + "&offset=" + offset + "&limit=" + limit,
    { method: "GET",
      headers: {
        'Content-Type': 'application/json'
      }
    },
    )
    .then((response) => { 
        if (response.ok) {
          return response.json();
        } else {
          loading.innerText = "Error en el servidor";
          return [];
        }
      })
    .then((res) => {
        try {
          loading.innerText = "";
          if (gender == "male") {
            infoMale = res;
            filterPlayers(gender, infoMale);
          } else {
            infoFemale = res;
            filterPlayers(gender, infoFemale);
          }
        } catch (error) {
          
        }
    });
}

function fill(gender, info) {
    let fill_list = gender == "male"? document.getElementById("listMale") : document.getElementById("listFemale");
    let offset = gender == "male"? offsetMale : offsetFemale;
    
    arrows(gender, offset, info);

    fill_list.innerHTML = "";

    for(let i = 0 ; i <= info.length; i++) {
        let newProfile = document.createElement("article");
        newProfile.innerHTML = `<div class="card">
          <div class="profile">
            <div class="ranking">
              <p class="nro_ranking">${info[i].rank}</p>
            </div>
            <a
              class="photo_container"
              href="${info[i].url}"
              aria-label="${info[i].name + " " + info[i].rank }" 
              title="${info[i].name + " " + info[i].rank }"
            >
              <img
                class="photo"
                src="${info[i].slider != "/wp-content/themes/padelfiptheme/assets/img/placeholder.png"? info[i].slider : "../img/placeholder.png"}"
                alt="${info[i].name + " " + info[i].rank }"
                height="209"
                width="210"
              />
            </a>
          </div>
          <div class="player_name_container">
            <a
              class="player_name"
              href="${info[i].url}"
              aria-label="${info[i].name + " " + info[i].rank }"
              title="${info[i].name + " " + info[i].rank }"
              >${info[i].name + " " + info[i].rank }</a
            >
          </div>
          <div class="info_container">
            <span class="move" id="move_${info[i].player_id}">${info[i].move > 0? "+" + info[i].move : info[i].move < 0? info[i].move : ""}</span>
            <div class="nation_container">
              <img
                class="img_nation"
                src="${info[i].country_flag}"
                alt="${info[i].country_flag}"
              />
              <p class="sig_nation">${info[i].country_name}</p>
            </div>
            <div class="points_container">
              <span class="points_title">Puntos</span>
              <span class="points">${info[i].points}</span>
            </div>
          </div>
        </div>`;
        fill_list.appendChild(newProfile);
        
        let move = document.getElementById("move_" + info[i].player_id);
        if (info[i].move < 0) {
            move.style.color = "red";
        }
    }
    
}

function changePage(genderUpDown) {
  switch (genderUpDown) {
    case "male-":
      offsetMale -= 10;
      doFetch("male");
      break;
    case "male+":
      offsetMale += 10;
      doFetch("male");
      break;
    case "female-":
      offsetFemale -= 10;
      doFetch("female");
      break;
    case "female+":
      offsetFemale += 10;
      doFetch("female");
      break;
  }
}

function arrows(gender, offset, info) {
  if (gender == "male") {
      if (offset == 0) {
        document.getElementById("uparrow_male").childNodes[1].src = "img/uparrow_disabled.svg";
        document.getElementById("uparrow_male").disabled = true;
      } else {
        document.getElementById("uparrow_male").childNodes[1].src = "img/uparrow.svg";
        document.getElementById("uparrow_male").disabled = false;
      }
      if (info.length < 10 ){
        document.getElementById("downarrow_male").childNodes[1].src = "img/downarrow_disabled.svg";
        document.getElementById("downarrow_male").disabled = true;
      } else {
        document.getElementById("downarrow_male").childNodes[1].src = "img/downarrow.svg";
        document.getElementById("downarrow_male").disabled = false;
      }
    } else {
      if (offset == 0) {
        document.getElementById("uparrow_female").childNodes[1].src = "img/uparrow_disabled.svg";
        document.getElementById("uparrow_female").disabled = true;
      } else {
        document.getElementById("uparrow_female").childNodes[1].src = "img/uparrow.svg";
        document.getElementById("uparrow_female").disabled = false;
      }
      if (info.length < 10 ){
        document.getElementById("downarrow_female").childNodes[1].src = "img/downarrow_disabled.svg";
        document.getElementById("downarrow_female").disabled = true;
      } else {
        document.getElementById("downarrow_female").childNodes[1].src = "img/downarrow.svg";
        document.getElementById("downarrow_female").disabled = false;
      }
    }
}

function filterPlayers(gender, info) {
  let searchInput = document.getElementById("search").value;

  if (searchInput == "") {
    limit = 10;
    fill(gender, info);
  } else {
    offsetMale = 0;
    offsetFemale = 0;
    limit = "";
    let infoFiltered = info.filter(player => player.name.toLowerCase().includes(searchInput.toLowerCase()));
    fill(gender, infoFiltered);
  }

}
