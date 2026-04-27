"use strict";

const url = "https://www.padelfip.com/es/wp-json/fip/v1/rankings" +
        "/?category=4fa3a8c3-c5fb-457a-a793-c0c3b5cfbc79&circuit=6ea3dc15-" +
        "1c19-42ad-99b7-bab78d9fb871&category_name=Master&"

const urlParams = {
    gender: "male",
    offset: 0,  
    country: "",
    limit: 10
}

const info = {
  male: [],
  female: []
}

const infoFiltered = {
  male: [],
  female: []
}

const offset = {
  male: 0,
  female: 0
}

let infoMaleToFilter = [];
let infoFemaleToFilter = [];

let search_for = "name";

window.onload = function() {
  urlParams.limit = 10;
  load()
};

async function load() {
    [info.male, info.female] = await Promise.all([
      doFetch("male"),
      doFetch("female")
    ]);

    fill("male", info.male);
    fill("female", info.female);
}

async function doFetch(gender) {
    const loading = gender == "male"? document.getElementById("loading_m") : document.getElementById("loading_f");
    const fill_list = document.getElementById("list_" + gender);
    fill_list.innerHTML = "";
    loading.innerText = "Cargando...";  

    urlParams.gender = gender;
    
    const params = new URLSearchParams(urlParams).toString();

    try {
      const response = await fetch(
        url + params,
        { method: "GET",
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      const data = await response.json();

      loading.innerText = data.length < 1? "Sin resultados" : "";

      return data;
    } catch (error) {
        console.log(error);
    }
}

function fill(gender, info) {
    const fill_list = document.getElementById("list_" + gender);
    const loading = gender == "male"? document.getElementById("loading_m") : document.getElementById("loading_f");

    if (info.length > 0) {
    
      arrows(gender, info);

      fill_list.innerHTML = "";

      info.forEach(player => {
        let newProfile = document.createElement("article");
          newProfile.innerHTML = `<div class="card">
            <div class="profile">
              <div class="ranking">
                <p class="nro_ranking">${player.rank}</p>
              </div>
              <a
                class="photo_container" 
                target="_blank"
                href="${player.url}"
                aria-label="${player.name + " " + player.surname }" 
                title="${player.name + " " + player.surname }"
              >
                <img
                  class="photo"
                  src="${player.slider != "/wp-content/themes/padelfiptheme/assets/img/placeholder.png"? player.slider : "../img/placeholder.png"}"
                  alt="${player.name + " " + player.surname }"
                  height="209"
                  width="210" 
                />
              </a>
            </div>
            <div class="player_name_container">
              <a
                class="player_name"
                href="${player.url}"
                aria-label="${player.name + " " + player.surname }"
                title="${player.name + " " + player.surname }"
                >${player.name + " " + player.surname }</a
              >
            </div>
            <div class="info_container">
              <span class="move" id="move_${player.player_id}">${player.move > 0? "+" + player.move : player.move < 0? player.move : ""}</span>
              <div class="nation_container">
                <img
                  class="img_nation"
                  src="${player.country_flag}"
                  alt="${player.country_flag}"
                />
                <p class="sig_nation">${player.country_name}</p>
              </div>
              <div class="points_container">
                <span class="points_title">Puntos</span>
                <span class="points">${player.points}</span>
              </div>
            </div>
          </div>`;
          fill_list.appendChild(newProfile);
          
          let move = document.getElementById("move_" + player.player_id);
          if (player.move < 0) {
              move.style.background = "rgba(255, 0, 0, 0.5)";
          }
      });
      loading.innerText = "";
    } else {
      fill_list.innerHTML = "";
      loading.innerText = "Sin resultados";
    }
}

async function changePage(genderUpDown) {
  switch (genderUpDown) {
    case "male-":
      offset.male -= 10;
      urlParams.offset = offset.male;
      fill("male", await doFetch("male"));
      break;
    case "male+":
      offset.male += 10;
      urlParams.offset = offset.male;
      fill("male", await doFetch("male"));
      break;
    case "female-":
      offset.female -= 10;
      urlParams.offset = offset.female;
      fill("female", await doFetch("female"));
      break;
    case "female+":
      offset.female += 10;
      urlParams.offset = offset.female;
      fill("female", await doFetch("female"));
      break;
  }
}

function arrows(gender, info) {
  if (offset[gender] == 0) {
    document.getElementById("uparrow_" + gender).childNodes[1].src = "img/uparrow_disabled.svg";
    document.getElementById("uparrow_" + gender).disabled = true;
  } else {
    document.getElementById("uparrow_" + gender).childNodes[1].src = "img/uparrow.svg";
    document.getElementById("uparrow_" + gender).disabled = false;
  }
  if (urlParams.limit != "") {
    if (info.length < urlParams.limit ){
      document.getElementById("downarrow_" + gender).childNodes[1].src = "img/downarrow_disabled.svg";
      document.getElementById("downarrow_" + gender).disabled = true;
    } else {
      document.getElementById("downarrow_" + gender).childNodes[1].src = "img/downarrow.svg";
      document.getElementById("downarrow_" + gender).disabled = false;
    } 
  } else {
    document.getElementById("downarrow_" + gender).childNodes[1].src = "img/downarrow_disabled.svg";
    document.getElementById("downarrow_" + gender).disabled = true;
  }
}

async function filterPlayers(searchInput) {
  offset.male = 0;
  offset.female = 0;
  
  if (searchInput.value == "") {
    urlParams.limit = 10;
    load();
  } else {
    switch (search_for) {
      case "name":
        urlParams.limit = "";
        urlParams.country = "";
        urlParams.rank = "";

        [info.male, info.female] = await Promise.all([
          doFetch("male"),
          doFetch("female")
        ]);

        infoFiltered.male = info.male.filter(player => 
            player.name.toLowerCase().includes(searchInput.value.toLowerCase()) || player.surname.toLowerCase().includes(searchInput.value.toLowerCase())
        );
        fill("male", infoFiltered.male);
        
        infoFiltered.female = info.female.filter(player => 
            player.name.toLowerCase().includes(searchInput.value.toLowerCase()) || player.surname.toLowerCase().includes(searchInput.value.toLowerCase())
        );
        fill("female", infoFiltered.female);
        
        break;

      case "country":
        const countrySelected = document.getElementById("countrySelect").options[document.getElementById("countrySelect").selectedIndex].value;
        urlParams.limit = "";
        urlParams.name = "";
        urlParams.rank = "";

        urlParams.country = countrySelected == "all"? "" : countrySelected;
        
        load();
        break;

      case "ranking":
        urlParams.limit = "";
        urlParams.country = "";
        urlParams.name = "";

        [info.male, info.female] = await Promise.all([
          doFetch("male"),
          doFetch("female")
        ]);

        infoFiltered.male = info.male.filter(player => player.rank == searchInput.value);
        fill("male", infoFiltered.male);
        
        infoFiltered.female = info.female.filter(player => player.rank == searchInput.value);
        fill("female", infoFiltered.female);
        
      default:
        break;
    }
  }
}

async function changeType(element) {
  const selected = element.options[element.selectedIndex].value;
  
  switch (selected) {
    case "name":
      search_for = "name";
      urlParams.country = "";
      document.getElementById("search").hidden = false;
      document.getElementById("countrySelect").hidden = true;
      document.getElementById("search_rank").hidden = true;
      const searchInput = document.getElementById("search");
      searchInput.value = "";
      filterPlayers(searchInput);
      break;
  
    case "nation":
      search_for = "country";
      document.getElementById("search").hidden = true;
      document.getElementById("search_rank").hidden = true;
      
      urlParams.limit = "";
      await load();
      let countries = new Set(info.male.map((player) => player.country_name));
      countries = [...new Set(info.female.map((player) => player.country_name))];

      let countrySelect = document.getElementById("countrySelect");

      countrySelect.innerHTML = "";
      countrySelect.innerHTML = "<option value='all'>Todos</option>";
      countries.forEach(country => {
        let newCountry = `<option value="${country}">${country}</option>`;
        countrySelect.innerHTML += newCountry;
      });
      countrySelect.hidden = false;
      break;
    
    case "ranking":
      search_for = "ranking";
      document.getElementById("search").hidden = true;
      document.getElementById("countrySelect").hidden = true;
      document.getElementById("search_rank").hidden = false;
      const searchRank = document.getElementById("search_rank");
      searchRank.value = "";
      filterPlayers(searchRank);

      break;
  }
}