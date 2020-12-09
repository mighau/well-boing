var xhttp = new XMLHttpRequest();

var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0');
var yyyy = today.getFullYear();
const firstDayOfYear = new Date(today.getFullYear(), 0, 1);
const pastDaysOfYear = (today - firstDayOfYear) / 86400000;
week = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7); // inspired from TArch64 from GitHub

const monthOfToday = yyyy + '-' + mm;
const weekOfToday = yyyy + '-W' + week;



if (!document.querySelector("#month").value) document.querySelector("#month").value = monthOfToday;
if (!document.querySelector("#week").value) document.querySelector("#week").value = weekOfToday;


const refreshData = async() => {
    const retrieveData = {
        "month": document.querySelector("#month").value.slice(5),
        "week": document.querySelector("#week").value.slice(6)
    }
    const response = await fetch('/behavior/summary/refresh', {
        method: 'POST',
        body: JSON.stringify(retrieveData)
    });
    const json = await response.json();
    console.log(json);
    document.querySelector('#monSport').innerHTML = `${json.month.avgMonSport} hours`;
    document.querySelector('#monSleep').innerHTML = `${json.month.avgMonSleep} hours`;
    document.querySelector('#monSleepQ').innerHTML = `${json.month.avgMonSleepQuality} / 5`;
    document.querySelector('#monStudy').innerHTML = `${json.month.avgMonStudy} hours`;
    document.querySelector('#monMood').innerHTML = `${json.month.avgMonMood} / 5`;
    document.querySelector('#weekSleep').innerHTML = `${json.week.avgWeeSleep} hours`;
    document.querySelector('#weekSleepQ').innerHTML = `${json.week.avgWeeSleepQuality} / 5`;
    document.querySelector('#weekSport').innerHTML = `${json.week.avgWeeSport} hours`;
    document.querySelector('#weekStudy').innerHTML = `${json.week.avgWeeStudy} hours`;
    document.querySelector('#weekMood').innerHTML = `${json.week.avgWeeMood} / 5`;

    console.log(json.month.avgMonSport);
 
 
    /*    var xhr; 
    if (window.XMLHttpRequest) 
        xhr = new XMLHttpRequest(); 
    else if (window.ActiveXObject) 
        xhr = new ActiveXObject("Msxml2.XMLHTTP");
    else 
        throw new Error("Ajax is not supported by your browser");
    
    xhr.onreadystatechange = function () {
        if (xhr.readyState < 4){
            document.querySelector('.table #monsleep').innerHTML = "Loading...";
            document.querySelector('#monSleepQ').innerHTML = "Loading...";
            document.querySelector('#monSport').innerHTML = "Loading...";
            document.querySelector('#monStudy').innerHTML = "Loading...";
            document.querySelector('#monMood').innerHTML = "Loading...";
            document.querySelector('#weekSleep').innerHTML = "Loading...";
            document.querySelector('#weekSleepQ').innerHTML = "Loading...";
            document.querySelector('#weekSport').innerHTML = "Loading...";
            document.querySelector('#weekStudy').innerHTML = "Loading...";
            document.querySelector('#weekMood').innerHTML = "Loading...";
        }
        else if (xhr.readyState === 4) {
            if (xhr.status == 200 && xhr.status < 300) 
                console.log(xhr.responseText);
        }
    }
    
    /* xhr.open('POST', '/behavior/summary/refresh', true);
    xhr.send(retrieveData); */
    // 3. Specify your action, location and Send to the server - End

}