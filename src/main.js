import './style.css'

let divdata = document.querySelector(".data")

let divPokemon1 = document.querySelector(".pokemon1")
let divPokemon2 = document.querySelector(".pokemon2")
let titleofBattle = document.querySelector(".title")
let rulesContainer = document.querySelector(".rulesContainer")
let butonContainer = document.querySelector(".butonContainer")
let Winner = document.querySelector(".Winner")
let pokemons = document.querySelector(".pokemons")

let buttonnewBattle = document.querySelector(".newBatlle")

buttonnewBattle.addEventListener("click", async () => {
  divPokemon1.innerHTML = "";
  divPokemon2.innerHTML = "";
  Winner.textContent = "";
  pokemons.textContent = "";

  let numberRandom1, numberRandom2;
  let datospokemon1, datospokemon2;

  try {
    numberRandom1 = Math.floor(Math.random() * 125) + 1;
    numberRandom2 = Math.floor(Math.random() * 125) + 1;

    const [data1, data2] = await Promise.all([
      fetch(`https://pokeapi.co/api/v2/pokemon/${numberRandom1}`).then(r => r.json()),
      fetch(`https://pokeapi.co/api/v2/pokemon/${numberRandom2}`).then(r => r.json())
    ]);

    datospokemon1 = data1;
    datospokemon2 = data2;

    let img = document.createElement("img");

    let nameEl = document.createElement("p");
    nameEl.textContent = datospokemon1.name;

    let hpEl = document.createElement("p");
    hpEl.textContent = "HP: " + datospokemon1.stats[1].base_stat;

    img.src = datospokemon1.sprites.front_default;
    img.addEventListener("mouseover", () => {
      img.src = datospokemon1.sprites.back_default;
    });
    img.addEventListener("mouseout", () => {
      img.src = datospokemon1.sprites.front_default;
    });

    divPokemon1.append(nameEl, img, hpEl);

    let img2 = document.createElement("img");

    let nameEl2 = document.createElement("p");
    nameEl2.textContent = datospokemon2.name;

    let hpEl2 = document.createElement("p");
    hpEl2.textContent = "HP: " + datospokemon2.stats[1].base_stat;

    img2.src = datospokemon2.sprites.front_default;
    img2.addEventListener("mouseover", () => {
      img2.src = datospokemon2.sprites.back_default;
    });
    img2.addEventListener("mouseout", () => {
      img2.src = datospokemon2.sprites.front_default;
    });

    divPokemon2.append(nameEl2, img2, hpEl2);

  } catch (error) {
    console.error(error);
    divPokemon1.innerHTML = "<p>Error fetching data</p>";
    divPokemon2.innerHTML = "<p>Error fetching data</p>";
    return;
  }

  titleofBattle.innerHTML = datospokemon1.name + " VS " + datospokemon2.name

  rulesContainer.innerHTML = "";
  let rules = document.createElement("p");
  rules.textContent = "Winner is the one with higher HP stat!";
  rulesContainer.appendChild(rules)

  butonContainer.innerHTML = ""
  let butonBattle = document.createElement("button")
  butonBattle.textContent = "Battle"
  butonContainer.appendChild(butonBattle)

  function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  butonBattle.addEventListener("click", async () => {
    butonBattle.disabled = true;

    butonBattle.textContent = "Fighting";
    for (let i = 0; i < 3; i++) {
      await delay(500);
      butonBattle.textContent += ".";
    }

    butonBattle.disabled = false;
    butonBattle.textContent = "Battle";

    Winner.textContent = "";
    let Winnertext = document.createElement("p");
    let typeWinner;
    if (datospokemon1.stats[1].base_stat > datospokemon2.stats[1].base_stat) {
      Winnertext.textContent = datospokemon1.name + "!\n Type: " + datospokemon1.types[0].type.name;
      typeWinner = datospokemon1.types[0].type.name;
    } else if (datospokemon1.stats[1].base_stat < datospokemon2.stats[1].base_stat) {
      Winnertext.textContent = datospokemon2.name + "!\n Type: " + datospokemon2.types[0].type.name;
      typeWinner = datospokemon2.types[0].type.name;
    } else {
      Winnertext.textContent = "It's a tie!";
    }
    Winner.appendChild(Winnertext);

    if (typeWinner) {
      const response = await fetch(`https://pokeapi.co/api/v2/type/${typeWinner}`);
      const data = await response.json();
      pokemons.textContent = "";

      let indices = [];
      while (indices.length < 3) {
        let rand = Math.floor(Math.random() * data.pokemon.length);
        if (!indices.includes(rand)) indices.push(rand);
      }

      for (let i of indices) {
        const pokeDataResponse = await fetch(data.pokemon[i].pokemon.url);
        const pokeData = await pokeDataResponse.json();
        let img = document.createElement("img");
        img.src = pokeData.sprites.front_default;
        pokemons.appendChild(img);
      }
    }
  });
})