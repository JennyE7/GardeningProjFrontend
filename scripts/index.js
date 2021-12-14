const createForm = document.querySelector("#createForm");

const create = function(seedName, sowBy, harvestBy, expiration, isPlanted) {
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

createForm.addEventListener("submit", function(event) {
    event.preventDefault;
    create(this.seedName.value, this.plantBy.value, this.harvestBy.value, this.expiration.value,
        this.plantedCheck.checked);
});