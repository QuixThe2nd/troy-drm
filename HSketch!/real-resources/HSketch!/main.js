var udid;
var model;
async function getModel(callback) {
    fetch('../../HSketch!Support/model.txt')
        .then(function (response) {
            response.text().then(function (text) {
                model = text;
                callback()
            });
        });
}
async function getUDID(callback) {
    fetch('../../HSketch!Support/udid.txt')
        .then(function (response) {
            response.text().then(function (text) {
                udid = text;
                callback()
            });
        });
}
async function check() {
    var newDataObject = { UDID: udid, modelID: model, packageID: "com.apladdict.hsketch", licenseID: "apladdict" };
    var authData = Object.keys(newDataObject).map((key) => {
        return encodeURIComponent(key) + '=' + encodeURIComponent(newDataObject[key]);
    }).join('&');

    return await fetch('https://test.cors.workers.dev/?https://iamparsa.com/api/drm/api.php', {
        method: 'POST',
        body: authData, // request-data (~string)
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded' // http-request body-format
        }
    })
        .then(async function (response) {
            let result = await response.json();
            console.log(result["service_status"]);
            if (response.ok) { // 2xx
                if (result["service_status"] === "success") {
                    console.log("200 - success");
                    localStorage.setItem("HSketch!-Paid", "true");
                    return true;
                } else {
                    // Was not success
                    console.log("200 - fail");
                    document.body.innerHTML = "";
                    alert("🏴‍☠️⃠🏴‍☠️⃠🏴‍☠️⃠🏴‍☠️⃠🏴‍☠️⃠🏴‍☠️⃠\n🏴‍☠️⃠\t\t\t\t\n🏴‍☠️⃠\t\t\t\t\n🏴‍☠️⃠\t\t\t\t\n🏴‍☠️⃠\t\t\t\t\n🏴‍☠️⃠🏴‍☠️⃠🏴‍☠️⃠🏴‍☠️⃠\t\t\n🏴‍☠️⃠\t\t\t\t\n🏴‍☠️⃠\t\t\t\t\n🏴‍☠️⃠\t\t\t\t\n🏴‍☠️⃠\t\t\t\t\n");
                    return false;
                }
            } else {
                // 4xx (ook 3xx/5xx)
                console.log("400 - any other error");
                document.body.innerHTML = "";
                alert("🏴‍☠️⃠🏴‍☠️⃠🏴‍☠️⃠🏴‍☠️⃠🏴‍☠️⃠🏴‍☠️⃠\n🏴‍☠️⃠\t\t\t\t\n🏴‍☠️⃠\t\t\t\t\n🏴‍☠️⃠\t\t\t\t\n🏴‍☠️⃠\t\t\t\t\n🏴‍☠️⃠🏴‍☠️⃠🏴‍☠️⃠🏴‍☠️⃠\t\t\n🏴‍☠️⃠\t\t\t\t\n🏴‍☠️⃠\t\t\t\t\n🏴‍☠️⃠\t\t\t\t\n🏴‍☠️⃠\t\t\t\t\n");
                return false;
            }
        })
        .catch(function (error) {
            console.log("Something went wrong!"); // Error!
            console.log(error);
            document.body.innerHTML = "";
            alert("🏴‍☠️⃠🏴‍☠️⃠🏴‍☠️⃠🏴‍☠️⃠🏴‍☠️⃠🏴‍☠️⃠\n🏴‍☠️⃠\t\t\t\t\n🏴‍☠️⃠\t\t\t\t\n🏴‍☠️⃠\t\t\t\t\n🏴‍☠️⃠\t\t\t\t\n🏴‍☠️⃠🏴‍☠️⃠🏴‍☠️⃠🏴‍☠️⃠\t\t\n🏴‍☠️⃠\t\t\t\t\n🏴‍☠️⃠\t\t\t\t\n🏴‍☠️⃠\t\t\t\t\n🏴‍☠️⃠\t\t\t\t\n");
            return false;
        });
}

async function mainCall() {
    if (typeof (Storage) !== "undefined") {
        if (localStorage.getItem("HSketch!-Paid") === null) {
            getModel(() => getUDID(() => check()))
        }
    }
}

mainCall();

if (typeof (Storage) !== "undefined") {
    if (localStorage.getItem("HSketch!-1.1.1") === null) {
        window.location.href = "setup.html";
    }
}
if (defaultColor) {
    var color = defaultColor;
} else {
    var color = "black";
}
if (defaultSize) {
    var size = defaultSize;
} else {
    var size = "20";
}
var cancelled = false;
var pen = true;

window.onload = function () {
    var canvas = document.getElementById("draw");
    var ctx = canvas.getContext("2d");
    resize();
    getArt();

    var myShakeEvent = new Shake({
        threshold: 15
    });
    myShakeEvent.start();
    window.addEventListener('shake', shakeEventDidOccur, false);
    function shakeEventDidOccur() {
        if (confirm('To save your drawing press "Ok" \n To reset your canvas press "Cancel"')) {
            var dataURL = canvas.toDataURL('image/png');
            document.getElementById("text").value = dataURL;
            document.getElementById("text").setAttribute("type", "text");
            document.getElementById("text").style.display = "block";
            document.getElementById("text").select();
            document.getElementById("draw").style.display = "none";
            alert("Copy the URL below⤵ and paste it into your browser to retrieve your artwork!\nTo draw again pinch in.");
        } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            getArt();
        }
    }
    function getArt() {
        if (defaultArt) {
            var image = new Image();
            image.src = defaultArt;
            image.onload = function () {
                var scale = Math.min(canvas.width / image.width, canvas.height / image.height);
                var x = (canvas.width / 2) - (image.width / 2) * scale;
                var y = (canvas.height / 2) - (image.height / 2) * scale;
                if (pen == false) ctx.globalCompositeOperation = 'source-over';
                ctx.drawImage(image, x, y, image.width * scale, image.height * scale);
                if (pen == false) ctx.globalCompositeOperation = 'destination-out';
            }
        }
    }

    document.addEventListener('gestureend', function (e) {
        if (e.scale < 1.0) {
            if (document.getElementById("text").style.display == "block") {
                document.getElementById("text").style.display = "none";
                document.getElementById("text").setAttribute("type", "hidden");
                document.getElementById("draw").style.display = "block";
            } else {
                menu();
            }
        } else if (e.scale > 1.0) {
            if (pen) {
                ctx.globalCompositeOperation = 'destination-out';
                pen = false;
            } else {
                ctx.globalCompositeOperation = 'source-over';
                pen = true;
            }
        }
    }, false);

    function resize() {
        ctx.canvas.width = window.innerWidth;
        ctx.canvas.height = window.innerHeight;
    }

    document.ontouchmove = function (e) { e.preventDefault(); }

    var lastx;
    var lasty;
    ctx.lineCap = "round";

    function dot(x, y) {
        if (cancelled) {
            cancelled = false;
            return;
        }
        ctx.lineWidth = size;
        ctx.strokeStyle = color;
        ctx.beginPath();
        ctx.fillStyle = "#000000";
        ctx.arc(x, y, 1, 0, Math.PI * 2, true);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
    }

    function line(fromx, fromy, tox, toy) {
        if (cancelled) {
            cancelled = false;
            return;
        }
        ctx.lineWidth = size;
        ctx.strokeStyle = color;
        ctx.beginPath();
        ctx.moveTo(fromx, fromy);
        ctx.lineTo(tox, toy);
        ctx.stroke();
        ctx.closePath();
    }

    document.ontouchstart = function (event) {
        if (cancelled) {
            cancelled = false;
            return;
        }
        event.preventDefault();
        ctx.lineWidth = size;
        ctx.strokeStyle = color;
        lastx = event.touches[0].clientX;
        lasty = event.touches[0].clientY;
        dot(lastx, lasty);
    }

    document.ontouchmove = function (event) {
        if (cancelled) {
            cancelled = false;
            return;
        }
        event.preventDefault();
        ctx.lineWidth = size;
        ctx.strokeStyle = color;
        var newx = event.touches[0].clientX;
        var newy = event.touches[0].clientY;
        line(lastx, lasty, newx, newy);
        lastx = newx;
        lasty = newy;
    }

    function menu() {
        cancelled = true;
        var cSize = prompt("What size pen would u like to use?", "20");
        if (cSize != null) {
            size = cSize;
        }
        var cColor = prompt("What color would you like to draw in?", "red");
        if (cColor != null) {
            color = cColor;
        }
    }
}