if (document.querySelector('#mood').innerHTML.includes('bright')) {
    document.getElementById("mood").classList.remove('alert-info');
    document.getElementById("mood").classList.remove('alert-warning');
    document.getElementById("mood").classList.add('alert-success');
};

if (document.querySelector('#mood').innerHTML.includes('[no data]')) {
    document.getElementById("mood").classList.remove('alert-warning');
    document.getElementById("mood").classList.remove('alert-success');
    document.getElementById("mood").classList.add('alert-info');
};

if (document.querySelector('#mood').innerHTML.includes('gloomy')) {
    document.getElementById("mood").classList.remove('alert-info');
    document.getElementById("mood").classList.remove('alert-success');
    document.getElementById("mood").classList.add('alert-warning');
};

// ----------------------------

if (document.querySelector('#morning').innerHTML.includes('good')) {
    document.getElementById("morning").classList.remove('alert-secondary');
    document.getElementById("morning").classList.add('alert-success');
};

if (document.querySelector('#evening').innerHTML.includes('good')) {
    document.getElementById("evening").classList.remove('alert-secondary');
    document.getElementById("evening").classList.add('alert-success');
};
