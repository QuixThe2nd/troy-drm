window.addEventListener("load", function() {
    document.body.style.width = '100%';
    document.body.style.height = '100%';
}, false);

function updateClock() {
    var currentTime = new Date();
    var currentHours = currentTime.getHours();
    var currentMinutes = currentTime.getMinutes() < 10 ? '0' + currentTime.getMinutes() : currentTime.getMinutes();
    var currentSeconds = currentTime.getSeconds() < 10 ? '0' + currentTime.getSeconds() : currentTime.getSeconds();
    var currentDate = currentTime.getDate() < 10 ? '0' + currentTime.getDate() : currentTime.getDate();
    var currentYear = currentTime.getFullYear();
    timeOfDay = (currentHours < 12) ? "am" : "pm";

    if (Clock == false) {
        timeOfDay = "";
        currentHours = (currentHours < 10 ? "0" : "") + currentHours;
        currentTimeString = currentHours + ":" + currentMinutes;
    }
    if (Clock == true) {
        currentHours = (currentHours < 10 ? "0" : "") + currentHours;
        currentHours = (currentHours == 0) ? "12" : currentHours;
        currentHours = (currentHours == 13) ? "01" : currentHours;
        currentHours = (currentHours == 14) ? "02" : currentHours;
        currentHours = (currentHours == 15) ? "03" : currentHours;
        currentHours = (currentHours == 16) ? "04" : currentHours;
        currentHours = (currentHours == 17) ? "05" : currentHours;
        currentHours = (currentHours == 18) ? "06" : currentHours;
        currentHours = (currentHours == 19) ? "07" : currentHours;
        currentHours = (currentHours == 20) ? "08" : currentHours;
        currentHours = (currentHours == 21) ? "09" : currentHours;
        currentHours = (currentHours == 22) ? "10" : currentHours;
        currentHours = (currentHours == 23) ? "11" : currentHours;
        currentHours = (currentHours == 24) ? "12" : currentHours;
        currentTimeString = currentHours + ":" + currentMinutes;
    }


    document.getElementById("hour").innerHTML = hourtext[currentTime.getHours()];
    document.getElementById("minute").innerHTML = currentMinutes;
    document.getElementById("second").innerHTML = currentSeconds;
    document.getElementById("weekday").innerHTML = shortdays[currentTime.getDay()];
    document.getElementById("date").innerHTML = currentDate
    document.getElementById("year").innerHTML = currentYear;
    document.getElementById("month").innerHTML = shortmonths[currentTime.getMonth()];
}

function init() {
    updateClock();
    setInterval("updateClock();", 1000);
}

function run() {
    document.getElementById("userInput").innerHTML += document.getElementById("command").value + "<br>" + document.getElementById("custom").innerHTML + ":~ mobile$ ";
    window.location = "mk1://runscript/apladdict/terminal-" + document.getElementById("command").value;
    document.getElementById("command").value = "";
}