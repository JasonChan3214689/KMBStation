let searchBox = document.querySelector("#searchBox");
let submitBtn = document.querySelector("#submitBtn");
let resultWrapper = document.querySelector(".resultWrapper");
let btnWrapper = document.querySelector(".btnWrapper");
let loadingWrapper = document.querySelector(".loadingWrapper");
let counter = 1;

console.log(searchBox);

submitBtn.addEventListener("click", getdata);

function getdata() {
  btnWrapper.innerHTML = "";
  let userInput = searchBox.value;
  fetchMTRData(userInput);
}

const fetchMTRData = async (userInput) => {
  loadingWrapper.style.display = "block";
  resultWrapper.innerHTML = "";
  let Busdata = {};

  let res = await fetch(`https://data.etabus.gov.hk/v1/transport/kmb/route/`);
  const results = await res.json();

  const buttons = [];

  for (let key in results.data) {
    if (results.data[key].route == userInput) {
      console.log(results.data[key]);
      let buttonId = `button_${key}`;
      let resultData = `<button id="${buttonId}">${results.data[key].orig_tc}  往  ${results.data[key].dest_tc}</button> </p> `;
      btnWrapper.innerHTML += resultData;
      buttons.push(buttonId);
      loadingWrapper.style.display = "none";
    }
  }
  if (buttons.length === 0) {
    alert("九巴無呢條線!");
    loadingWrapper.style.display = "none";
  }

  const userInputButtons = [];
  for (let id of buttons) {
    const button = document.querySelector(`#${id}`);
    userInputButtons.push(button);
  }

  userInputButtons.forEach((button) => {
    button.addEventListener("click", async function () {
      resultWrapper.innerHTML = "";
      counter = 1;
      let key = button.id.split("_")[1];
      let checkbound = checkInBoundOut(results.data[key].bound);
      console.log(checkbound);
      let res2 = await fetch(
        `https://data.etabus.gov.hk/v1/transport/kmb/route-stop/${results.data[key].route}/${checkbound}/${results.data[key].service_type}`
      );
      //console.log(res2);
      const results2 = await res2.json();
      for (let key in results2.data) {
        console.log(results2.data[key].stop);
        let res3 = await fetch(
          `https://data.etabus.gov.hk/v1/transport/kmb/stop/${results2.data[key].stop}`
        );
        //console.log(res2);
        const results3 = await res3.json();
        genLine(results3.data.name_tc);
        loadingWrapper.style.display = "none";
      }
    });
  });

  function checkInBoundOut(value) {
    if (value == "I") {
      return "inbound";
    } else {
      return "outbound";
    }
  }

  function genLine(value) {
    loadingWrapper.style.display = "block";
    let resultData = `<div><p>#${counter} - ${value}</p></div>`;
    resultWrapper.innerHTML += resultData;
    counter++;
  }
};
