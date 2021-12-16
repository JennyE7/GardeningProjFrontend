const createForm = document.querySelector("#createForm");
const viewSeed = document.querySelector("#viewSeeds");
const search = document.querySelector("#searchButton");
const resetButton = document.querySelector("#resetButton");
const editForm = document.querySelector("#editForm");
const editCancel = document.querySelector("#editCancel");
const searchName = document.querySelector("#searchNameButton");

let updateId;

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
            viewSeeds();
        }).catch(err => console.error(err));
}

createForm.addEventListener("submit", function (event) {
    event.preventDefault;
    create(this.seedName.value, this.plantBy.value, this.harvestBy.value, this.expiration.value,
        this.plantedCheck.checked);
});

const deleteSeedFunc = function(id) {
    axios.delete(`http://localhost:8080/delete/${id}`)
    .then(res => {
        viewSeeds();
    }).catch(err => console.error(err));
}

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September",
    "October", "November", "December"];

const printSeed = function (seed) {

    const card = document.createElement("div");
    card.id = "card" + seed.id; 
    card.classList.add("card", "col-3");
    viewSeed.appendChild(card);

    const cardBody = document.createElement("div");
    cardBody.classList.add("card-body");
    card.appendChild(cardBody);

    const cardTitle = document.createElement("h5");
    cardTitle.classList.add("card-title");
    cardTitle.style.display = "flex";
    cardTitle.style.justifyContent = "center";
    cardTitle.innerText = seed.seedName;
    cardBody.appendChild(cardTitle);

    const harvest = document.createElement("div");
    harvest.style.justifyContent = "center";
    harvest.innerText = "Sow by " + months[seed.sowByMonth - 1];
    cardBody.appendChild(harvest);

    const harvestBy = document.createElement("div");
    harvestBy.classList.add("card-text");
    harvestBy.innerText = "Harvest by " + months[seed.harvestByMonth - 1];
    cardBody.appendChild(harvestBy);

    const dd = seed.expirationDate.substring(8);
    const mm = seed.expirationDate.substring(4,8);
    const yyyy = seed.expirationDate.substring(0,4);
    const formattedDate = dd + mm + yyyy;

    const expiration = document.createElement("div");
    expiration.classList.add("card-text");
    expiration.innerText = "Expires: " + formattedDate;
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

    const d = new Date();
    const month = d.getMonth() + 1;

    let plantOrHarvest = "";
    let textColour = "";
    if (seed.isPlanted && month == seed.harvestByMonth) {
        plantOrHarvest = "Harvest me this month!";
        textColour = "blue";
    }
    if (!seed.isPlanted && month == seed.sowByMonth) {
        plantOrHarvest = "Plant me this month!"
        textColour = "blue";
    }
    if ((new Date(seed.expirationDate + "Z") < d) && (!seed.isPlanted)) {
        plantOrHarvest = "I'm expired";
        card.classList.add("bg-warning");
        textColour = "red";
    }

    const plantOrHarv = document.createElement("div");
    plantOrHarv.classList.add("card-text");
    plantOrHarv.innerText = plantOrHarvest;
    plantOrHarv.style.color = textColour;
    cardBody.appendChild(plantOrHarv);

    const buttonDiv = document.createElement("div");
    buttonDiv.style.display = "flex";
    buttonDiv.style.justifyContent = "center";

    const edit = document.createElement("input");
    edit.type = "button";
    edit.classList.add("card-text", "inputBtn");
    edit.value = "Edit";
    edit.id = seed.id;
    buttonDiv.appendChild(edit)
    cardBody.appendChild(buttonDiv);
    edit.addEventListener("click", function(event){
        document.querySelector("#editSeedName").value = seed.seedName;
        document.querySelector("#editPlantBy").value = seed.sowByMonth;
        document.querySelector("#editHarvestBy").value = seed.harvestByMonth;
        document.querySelector("#editExpiration").value = seed.expirationDate;
        updateId = this.id;
        document.querySelector("#editDiv").style.display = "block";
    })

    const deleteSeed = document.createElement("input");
    deleteSeed.type = "button";
    deleteSeed.classList.add("card-text", "inputBtn");
    deleteSeed.value = "Delete";
    deleteSeed.id = seed.id;
    buttonDiv.appendChild(deleteSeed);
    deleteSeed.addEventListener("click", function(event){
        deleteSeedFunc(this.id);
    })
}

const viewSeeds = function () {
    axios.get("http://localhost:8080/getAll")
        .then(res => {
            viewSeed.innerHTML = "";
            let seeds = res.data;
            for (let seed of seeds) {
                printSeed(seed);
            }
        }).catch(err => console.error(err));
}

viewSeeds();

const viewbyId = function (id, ) {
    axios.get(`http://localhost:8080/get/${id}`)
        .then(res => {
            let seed = res.data;
            viewSeed.innerHTML = "";
            printSeed(seed);
        }).catch(err => console.error(err));
}

search.addEventListener("click", function (event) {
    event.preventDefault();
    viewbyId(document.querySelector("#searchId").value);
})

resetButton.addEventListener("click", function (event) {
    event.preventDefault();
    viewSeeds();
})

const updateSeed = function(id, seedName, sowBy, harvestBy, expiration, isPlanted) {
    const newSeed = {
        seedName: seedName,
        sowByMonth: sowBy,
        harvestByMonth: harvestBy,
        expirationDate: expiration,
        isPlanted: isPlanted
    }
    axios.put(`http://localhost:8080/update/${id}`, newSeed)
    .then(res => {
        document.querySelector("#editDiv").style.display = "none";
        viewSeeds();
    }).catch(err => console.error(err));
}

editForm.addEventListener("submit", function(event) {
    event.preventDefault();
    updateSeed(updateId, this.editSeedName.value, this.editPlantBy.value, this.editHarvestBy.value,
        this.editExpiration.value, this.editPlantedCheck.checked);
});

editCancel.addEventListener("click", function(event) {
    event.preventDefault();
    document.querySelector("#editDiv").style.display = "none";
});

const searchByName = function(name) {
    axios.get(`http://localhost:8080/getName/${name}`)
    .then(res => {
        viewSeed.innerHTML = "";
        let seeds = res.data;
        for (let seed of seeds) {
            printSeed(seed);
        }
    }).catch(err => console.error(err));
}

searchName.addEventListener("click", function(event) {
    event.preventDefault();
    searchByName(document.querySelector("#searchName").value);
})