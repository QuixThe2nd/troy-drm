var stopwatch = document.getElementById('stopwatch'),
    start = document.getElementById('start'),
    timeout, lastTap = 0,
    seconds = 0,
    minutes = 0,
    hours = 0,
    t, on = false;

if (localStorage.getItem('seconds') !== null) {
    seconds = localStorage.getItem('seconds');
    display();
}
if (localStorage.getItem('minutes') !== null) {
    minutes = localStorage.getItem('minutes');
    display();
}
if (localStorage.getItem('hours') !== null) {
    hours = localStorage.getItem('hours');
    display();
}

function add() {
    seconds++;
    if (seconds >= 60) {
        seconds = 0;
        minutes++;
        if (minutes >= 60) {
            minutes = 0;
            hours++;
        }
    }

    save();
    display();
    timer();
}

function display() {
    stopwatch.textContent = (hours ? (hours > 9 ? hours : "0" + hours) : "00") + ":" + (minutes ? (minutes > 9 ? minutes : "0" + minutes) : "00") + ":" + (seconds > 9 ? seconds : "0" + seconds);
}

function timer() {
    t = setTimeout(add, 1000);
}

function toggle() {
    if (on) {
        clearTimeout(t);
        on = false;
    } else {
        timer();
        on = true;
    }
}

function save() {
    localStorage.setItem('seconds', seconds);
    localStorage.setItem('minutes', minutes);
    localStorage.setItem('hours', hours);
}

function clear() {
    stopwatch.textContent = "00:00:00";
    seconds = 0;
    minutes = 0;
    hours = 0;
    save();
    clearTimeout(t);
    on = false;
}

start.onclick = toggle();

start.ondblclick = function () {
    clear();
}

start.addEventListener('touchend', function (event) {
    var currentTime = new Date().getTime();
    var tapLength = currentTime - lastTap;
    clearTimeout(timeout);
    if (tapLength < 500 && tapLength > 0) {
        clear();
        event.preventDefault();
    } else {
        toggle();
        timeout = setTimeout(function () {
            clearTimeout(timeout);
        }, 500);
    }
    lastTap = currentTime;
});

if (customBackgroundColor) {
    start.style.backgroundColor = customBackgroundColor;
}
start.style.transform = "scale(" + scale + ")";
start.style.color = color;