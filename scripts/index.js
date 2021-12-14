const createForm = document.querySelector("#createForm");
const viewSeed = document.querySelector("#viewSeeds");

const create = function (seedName, sowBy, harvestBy, expiration, isPlanted) {
    const newSeed = {
        seedName: seedName,
        sowByMonth: sowBy,
        harvestByMonth: harvestBy,
        expirationDate: expiration,
        isPlanted: isPlanted
    }
    axios.post("http://localhost:8080/create", newSeed)
        .then(res => {

        }).catch(err => console.error(err));
}

createForm.addEventListener("submit", function (event) {
    event.preventDefault;
    create(this.seedName.value, this.plantBy.value, this.harvestBy.value, this.expiration.value,
        this.plantedCheck.checked);
});

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September",
    "October", "November", "December"];

const printSeed = function (seed) {

    const card = document.createElement("div");
    card.classList.add("card", "col-2");
    viewSeed.appendChild(card);

    const cardBody = document.createElement("div");
    cardBody.classList.add("card-body");
    card.appendChild(cardBody);

    const cardTitle = document.createElement("h5");
    cardTitle.classList.add("card-title");
    cardTitle.innerText = seed.seedName;
    cardBody.appendChild(cardTitle);

    const seedName = document.createElement("div");
    seedName.classList.add("card-text");
    seedName.innerText = "Sow by " + months[seed.sowByMonth - 1];
    cardBody.appendChild(seedName);

    const harvestBy = document.createElement("div");
    harvestBy.classList.add("card-text");
    harvestBy.innerText = "Harvest by " + months[seed.harvestByMonth -1];
    cardBody.appendChild(harvestBy);

    const expiration = document.createElement("div");
    expiration.classList.add("card-text");
    expiration.innerText = "Expires: " + seed.expirationDate;
    cardBody.appendChild(expiration);

    let planted = "";

    if (seed.isPlanted) {
        planted = "Planted";
    }
    else {
        planted = "Not yet planted";
    }
    const isPlanted = document.createElement("div");
    isPlanted.classList.add("card-text");
    isPlanted.innerText = planted;
    cardBody.appendChild(isPlanted);
}