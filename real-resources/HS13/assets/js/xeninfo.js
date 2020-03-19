var page = 0;
document.getElementById("box").style.backgroundSize = "cover";
var doc = document,
    media = {
        play: function () {
            window.location = 'xeninfo:playpause';
        },
        next: function () {
            window.location = 'xeninfo:nexttrack';
        },
        prev: function () {
            window.location = 'xeninfo:prevtrack';
        }
    },
    artDiv = doc.getElementById('art');
doc.getElementById('button').addEventListener('touchstart', function (el) {
    if (el.target.id == 'play') {
        window.location = 'xeninfo:openapp:' + musicApp;
    }
    media[el.target.id]();
});

function mainUpdate(type) {
    var artworkPreload;
    if (type == 'music') {
        if (isplaying) {
            if (playingIcon) {
                document.getElementById('playing').style.display = 'block';
            }
            if (stockIcons) {
                document.getElementById('play').src = '../HS13/assets/stock/pause.png';
            } else {
                document.getElementById('play').src = '../HS13/assets/pause.png';
            }
            document.getElementById('title').innerHTML = "&nbsp;&nbsp;" + title;
            document.getElementById('line2').innerHTML = "&nbsp;" + artist + "<br>&nbsp;" + album;
            artworkPreload = new Image();
            artworkPreload.onload = function () {
                getImageLightness(this.src, function (brightness) { });
                if (backgroundArt) {
                    document.getElementById("box").style.backgroundImage = "url(" + this.src + ")";
                    document.getElementById("box").style.backgroundPosition = "center";
                    document.getElementById("box").style.backgroundSize = "cover";
                }
                if (showArt) {
                    artDiv.style.backgroundImage = "url(" + this.src + ")";
                    document.getElementById("art").style.borderRadius = radius + " 0px 0px " + radius;
                }
            };
            artworkPreload.src = "file:///var/mobile/Documents/Artwork.jpg?" + (new Date()).getTime();
            if (showArt) {
                artDiv.style.display = "block";
                artDiv.style.textAlign = "left";
            } else {
                artDiv.style.textAlign = "center";
                artDiv.style.display = "none";
            }
        } else {
            if (showArt) {
                artDiv.style.display = "block";
                artDiv.style.textAlign = "left";
                artDiv.style.backgroundImage = "url(http://" + musicIcon + ")";
                document.getElementById("art").style.borderRadius = radius + " 0px 0px " + radius;
            } else {
                artDiv.style.display = "none";
            }
            document.getElementById('playing').style.display = 'none';
            if (stockIcons) {
                document.getElementById('play').src = '../HS13/assets/stock/play.png';
            } else {
                document.getElementById('play').src = '../HS13/assets/play.png';
            }
            document.getElementById('title').innerHTML = "&nbsp;&nbsp;Music";
            document.getElementById('line2').innerHTML = "<br /><br />";
            if (backgroundArt) {
                document.getElementById("box").style.backgroundImage = 'none';
                invert(0);
                toggleMode();
            }
        }
    }

    if (type == 'weather') {
        today();
        hours();
        days();
        if (hideWeather) {
            document.getElementById('city').style.display = "none";
            document.getElementById('weatherIcon').style.opacity = "0";
            document.getElementById('high').innerHTML = "<br><br><br><br>";
        } else {
            document.getElementById('weatherIcon').style.opacity = "1";
            document.getElementById('high').style.display = "<br><br>";
            document.getElementById("weather").style.display = "block";
            document.getElementById("city").style.display = "block";
            document.getElementById('high').innerHTML = weather.high + "&deg; / ";

            document.getElementById('low').innerHTML = weather.low + "&deg;";

            document.getElementById('city').innerHTML = weather.city;

            document.getElementById('weatherIcon').src = '../HS13/assets/' + 'images' + '/' + weather.conditionCode + '.png';
            if (feelsLike) {
                document.getElementById('temp').innerHTML = " " + weather.feelsLike + "&deg;";
            } else {
                document.getElementById('temp').innerHTML = " " + weather.temperature + "&deg;";
            }
        }
    } else if (type == "system") {
        document.getElementById('system').innerHTML = deviceType + " iOS " + systemVersion;
    } else if (type == 'statusbar') {
        var wifi = "WiFi: " + wifiName + " " + wifiBars + " bars<br>"
        document.getElementById('statusbar').innerHTML = signalName + " " + signalBars + " bars " + signalNetworkType + "<br>" + wifi;
    } else if (type == "battery") {
        if (batteryCharging == 0) {
            var battery = "Not Charging";
        } else {
            var battery = "Charging";
        }
        document.getElementById('battery').innerHTML = batteryPercent + "% Battery, " + battery + "<br>Free Ram: " + ramFree + "<br>Used Ram: " + ramUsed;
    }
}
function today() {
    document.getElementById("weatherIconToday").src = '../HS13/assets/' + 'images' + '/' + weather.conditionCode + '.png';
    document.getElementById('highlowToday').innerHTML = weather.high + "&deg; / " + weather.low + "&deg;";
    document.getElementById("cityToday").innerHTML = weather.city;
    document.getElementById("tempToday").innerHTML = weather.temperature + "&deg;";
    document.getElementById("rain").innerHTML = weather.chanceofrain + "% Chance Of Rain";
}
function days() {
    document.getElementById("weatherIcon1").src = '../HS13/assets/images/' + weather.dayForecasts[1].icon + '.png';
    document.getElementById("day1").innerHTML = tday[weather.dayForecasts[1].dayOfWeek - 1].substring(0, 3);
    document.getElementById("highlow1").innerHTML = weather.dayForecasts[1].high + '&deg; / ' + weather.dayForecasts[1].low + '&deg;';


    document.getElementById("weatherIcon2").src = '../HS13/assets/images/' + weather.dayForecasts[2].icon + '.png';
    document.getElementById("day2").innerHTML = tday[weather.dayForecasts[2].dayOfWeek - 1].substring(0, 3);
    document.getElementById("highlow2").innerHTML = weather.dayForecasts[2].high + '&deg; / ' + weather.dayForecasts[2].low + '&deg;';


    document.getElementById("weatherIcon3").src = '../HS13/assets/images/' + weather.dayForecasts[3].icon + '.png';
    document.getElementById("day3").innerHTML = tday[weather.dayForecasts[3].dayOfWeek - 1].substring(0, 3);
    document.getElementById("highlow3").innerHTML = weather.dayForecasts[3].high + '&deg; / ' + weather.dayForecasts[3].low + '&deg;';


    document.getElementById("weatherIcon4").src = '../HS13/assets/images/' + weather.dayForecasts[4].icon + '.png';
    document.getElementById("day4").innerHTML = tday[weather.dayForecasts[4].dayOfWeek - 1].substring(0, 3);
    document.getElementById("highlow4").innerHTML = weather.dayForecasts[4].high + '&deg; / ' + weather.dayForecasts[4].low + '&deg;';


    document.getElementById("weatherIcon5").src = '../HS13/assets/images/' + weather.dayForecasts[5].icon + '.png';
    document.getElementById("day5").innerHTML = tday[weather.dayForecasts[5].dayOfWeek - 1].substring(0, 3);
    document.getElementById("highlow5").innerHTML = weather.dayForecasts[5].high + '&deg; / ' + weather.dayForecasts[5].low + '&deg;';
    // /Days
}
function hours() {
    document.getElementById("hweatherIcon1").src = '../HS13/assets/images/' + weather.hourlyForecasts[1].conditionCode + '.png';
    document.getElementById("hday1").innerHTML = formatTime(weather.hourlyForecasts[1].time);
    document.getElementById("hhighlow1").innerHTML = weather.hourlyForecasts[1].temperature + '&deg;<br>' + weather.hourlyForecasts[1].percentPrecipitation + '% Rain';


    document.getElementById("hweatherIcon2").src = '../HS13/assets/images/' + weather.hourlyForecasts[2].conditionCode + '.png';
    document.getElementById("hday2").innerHTML = formatTime(weather.hourlyForecasts[2].time);
    document.getElementById("hhighlow2").innerHTML = weather.hourlyForecasts[2].temperature + '&deg;<br>' + weather.hourlyForecasts[2].percentPrecipitation + '% Rain';


    document.getElementById("hweatherIcon3").src = '../HS13/assets/images/' + weather.hourlyForecasts[3].conditionCode + '.png';
    document.getElementById("hday3").innerHTML = formatTime(weather.hourlyForecasts[3].time);
    document.getElementById("hhighlow3").innerHTML = weather.hourlyForecasts[3].temperature + '&deg;<br>' + weather.hourlyForecasts[3].percentPrecipitation + '% Rain';


    document.getElementById("hweatherIcon4").src = '../HS13/assets/images/' + weather.hourlyForecasts[4].conditionCode + '.png';
    document.getElementById("hday4").innerHTML = formatTime(weather.hourlyForecasts[4].time);
    document.getElementById("hhighlow4").innerHTML = weather.hourlyForecasts[4].temperature + '&deg;<br>' + weather.hourlyForecasts[4].percentPrecipitation + '% Rain';


    document.getElementById("hweatherIcon5").src = '../HS13/assets/images/' + weather.hourlyForecasts[5].conditionCode + '.png';
    document.getElementById("hday5").innerHTML = formatTime(weather.hourlyForecasts[5].time);
    document.getElementById("hhighlow5").innerHTML = weather.hourlyForecasts[5].temperature + '&deg;<br>' + weather.hourlyForecasts[5].percentPrecipitation + '% Rain';
    // /hours
}
function formatTime(time) {
    var hour = time.split(":")[0];
    var ap = '';
    if (hour == 0) { ap = " AM"; hour = 12; }
    else if (hour < 12) { ap = " AM"; }
    else if (hour == 12) { ap = " PM"; }
    else if (hour > 12) { ap = " PM"; hour -= 12; }
    if (hour.toString()[0] == 0) {
        hour = hour.toString()[1];
    }
    return hour + ap;
}
function getImageLightness(imageSrc, callback) {
    var img = document.createElement("img");
    img.src = imageSrc;
    img.style.display = "none";
    document.body.appendChild(img);

    var colorSum = 0;

    img.onload = function () {
        // create canvas
        var canvas = document.createElement("canvas");
        canvas.width = this.width;
        canvas.height = this.height;

        var ctx = canvas.getContext("2d");
        ctx.drawImage(this, 0, 0);

        var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        var data = imageData.data;
        var r, g, b, avg;

        for (var x = 0, len = data.length; x < len; x += 4) {
            r = data[x];
            g = data[x + 1];
            b = data[x + 2];

            avg = Math.floor((r + g + b) / 3);
            colorSum += avg;
        }

        var brightness = Math.floor(colorSum / (this.width * this.height));
        if ((brightness > 100) && (backgroundArt) && (invert)) {
            invert(1);
        } else if ((backgroundArt) && (invert)) {
            invert(0);
        }
        callback(brightness);
    }
}
function invert(i) {
    doc.getElementById('button').style.filter = 'invert(' + i + ')';
    document.getElementById('weatherIconToday').style.filter = 'invert(' + i + ')';
    document.getElementById('weatherIcon').style.filter = 'invert(' + i + ')';
    document.getElementById('weatherIcon1').style.filter = 'invert(' + i + ')';
    document.getElementById('weatherIcon2').style.filter = 'invert(' + i + ')';
    document.getElementById('weatherIcon3').style.filter = 'invert(' + i + ')';
    document.getElementById('weatherIcon4').style.filter = 'invert(' + i + ')';
    document.getElementById('weatherIcon5').style.filter = 'invert(' + i + ')';
    document.getElementById('hweatherIcon1').style.filter = 'invert(' + i + ')';
    document.getElementById('hweatherIcon2').style.filter = 'invert(' + i + ')';
    document.getElementById('hweatherIcon3').style.filter = 'invert(' + i + ')';
    document.getElementById('hweatherIcon4').style.filter = 'invert(' + i + ')';
    document.getElementById('hweatherIcon5').style.filter = 'invert(' + i + ')';
    if (i == 0) {
        document.getElementById('days').style.borderTopColor = 'white';
        document.getElementById('hours').style.borderTopColor = 'white';
        document.getElementById('box').style.color = 'white';
    } else if (i == 1) {
        document.getElementById('days').style.borderTopColor = 'black';
        document.getElementById('hours').style.borderTopColor = 'black';
        document.getElementById('box').style.color = 'black';
    }
}