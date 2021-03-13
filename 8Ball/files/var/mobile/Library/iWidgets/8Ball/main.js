var myPix = new Array('1.png', '2.png', '3.png', '4.png', '5.png');

function shakeEventDidOccur() {
    var randomNum = Math.floor(Math.random() * myPix.length);
    document.getElementById("myPicture").src = myPix[randomNum];
    document.getElementById("myPicture").style.display = "block";
    setTimeout(function () {
        if (alwaysShows != true) {
            document.getElementById("myPicture").style.display = "none";
        }
    }, 5000);
}

var myShakeEvent = new Shake({
    threshold: 5
});
myShakeEvent.start();
window.addEventListener('shake', shakeEventDidOccur, false);

if (alwaysShows) {
    window.onload = shakeEventDidOccur;
} else {
    document.getElementById("myPicture").style.display = "none";
}

document.body.style.transform = "scale(" + scale + ")";