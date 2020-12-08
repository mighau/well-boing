var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0');
var yyyy = today.getFullYear();

today = yyyy + '-' + mm + '-' + dd;

const dateControlEvening = document.querySelector('#eveDate');
if (!dateControlEvening.value) dateControlEvening.value = today;