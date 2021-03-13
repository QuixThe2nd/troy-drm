var udid;
var model;
async function getModel(callback) {
    fetch('../../HS13Support/model.txt')
        .then(function (response) {
            response.text().then(function (text) {
                model = text;
                callback()
            });
        });
}
async function getUDID(callback) {
    fetch('../../HS13Support/udid.txt')
        .then(function (response) {
            response.text().then(function (text) {
                udid = text;
                callback()
            });
        });
}
async function check() {
    var newDataObject = { UDID: udid, modelID: model, packageID: "com.beta.apladdict.hs13", licenseID: "apladdict" };
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
                    localStorage.setItem("HS13-1.7", "true");
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
        if (localStorage.getItem("HS13-1.7") === null) {
            getModel( () => getUDID( () => check()))
        }
    }
}


mainCall();
if (importSettings) {
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.src = importSettings;
    script.type = 'text/javascript';
    head.append(script);
}
if (fontURL) {
    var fontArray = fontURL.split(".");
    var newStyle = document.createElement('style');
    if ((fontURL) && (fontArray[fontArray.length - 1] === "ttf")) {
        newStyle.appendChild(document.createTextNode("\
    @font-face {\
        font-family: customFont;\
        src: url('" + fontURL + "') format('truetype');\
    }\
    "));
    } else {
        newStyle.appendChild(document.createTextNode("\
    @font-face {\
        font-family: customFont;\
        src: url('" + fontURL + "') format('" + fontArray[fontArray.length - 1] + "');\
    }\
    "));
    }
    document.head.appendChild(newStyle);
    document.getElementById("body").style.fontFamily = "customFont";
}
if (stockIcons) {
    document.getElementById('next').src = '../HS13/assets/stock/next.png';
    document.getElementById('prev').src = '../HS13/assets/stock/last.png';
    document.getElementById('next').style.marginTop = "-60px";
    document.getElementById('prev').style.marginTop = "-60px";
    document.getElementById('next').style.marginBottom = "18px";
    document.getElementById('prev').style.marginBottom = "18px";
}
document.getElementById("inner1").style.display = "none";
if (defaultPage <= 4) {
    document.getElementById("inner" + defaultPage).style.display = "block";
} else if (defaultPage == 5) {
    document.getElementById("inner5").style.display = "block";
    document.getElementById("hours").style.display = "block";
} else if (defaultPage == 6) {
    document.getElementById("inner5").style.display = "block";
    document.getElementById("hours").style.display = "none";
    document.getElementById("days").style.display = "block";
}
if (infoAlign == "right") {
    document.getElementById('inner3').style.textAlign = "right";
} else if (infoAlign == "center") {
    document.getElementById('inner3').style.textAlign = "center";
} else {
    document.getElementById('inner3').style.textAlign = "left";
} if (borderWidth) {
    document.getElementById('art').style.width = 153 - borderWidth - borderWidth + "px";
    document.getElementById('art').style.height = 153 - borderWidth - borderWidth + "px";
}
function toggle() {
    if (pageSwitch) {
        if (notes) {
            if (countdown == false) {
                if (document.getElementById("inner1").style.display == "block") {
                    document.getElementById("inner1").style.display = "none";
                    document.getElementById("inner2").style.display = "block";
                } else if (document.getElementById("inner2").style.display == "block") {
                    document.getElementById("inner2").style.display = "none";
                    document.getElementById("inner3").style.display = "block";
                } else if (document.getElementById("inner3").style.display == "block") {
                    document.getElementById("inner3").style.display = "none";
                    document.getElementById("notes").style.display = "block";
                } else if (document.getElementById("notes").style.display == "block") {
                    document.getElementById("notes").style.display = "none";
                    document.getElementById("inner1").style.display = "block";
                }
            } else {
                if (document.getElementById("inner1").style.display == "block") {
                    document.getElementById("inner1").style.display = "none";
                    document.getElementById("inner2").style.display = "block";
                } else if (document.getElementById("inner2").style.display == "block") {
                    document.getElementById("inner2").style.display = "none";
                    document.getElementById("inner3").style.display = "block";
                } else if (document.getElementById("inner3").style.display == "block") {
                    document.getElementById("inner3").style.display = "none";
                    document.getElementById("inner4").style.display = "block";
                } else if (document.getElementById("inner4").style.display == "block") {
                    document.getElementById("notes").style.display = "block";
                    document.getElementById("inner4").style.display = "none";
                } else if (document.getElementById("notes").style.display == "block") {
                    document.getElementById("inner1").style.display = "block";
                    document.getElementById("notes").style.display = "none";
                }
            }
        } else {
            if (countdown == false) {
                if (document.getElementById("inner1").style.display == "block") {
                    document.getElementById("inner1").style.display = "none";
                    document.getElementById("inner2").style.display = "block";
                } else if (document.getElementById("inner2").style.display == "block") {
                    document.getElementById("inner2").style.display = "none";
                    document.getElementById("inner3").style.display = "block";
                } else if (document.getElementById("inner3").style.display == "block") {
                    document.getElementById("inner3").style.display = "none";
                    document.getElementById("inner1").style.display = "block";
                }
            } else {
                if (document.getElementById("inner1").style.display == "block") {
                    document.getElementById("inner1").style.display = "none";
                    document.getElementById("inner2").style.display = "block";
                } else if (document.getElementById("inner2").style.display == "block") {
                    document.getElementById("inner2").style.display = "none";
                    document.getElementById("inner3").style.display = "block";
                } else if (document.getElementById("inner3").style.display == "block") {
                    document.getElementById("inner3").style.display = "none";
                    document.getElementById("inner4").style.display = "block";
                } else if (document.getElementById("inner4").style.display == "block") {
                    document.getElementById("inner1").style.display = "block";
                    document.getElementById("inner4").style.display = "none";
                }
            }
        }
    }
}
function toggle2() {
    if (pageSwitch) {
        document.getElementById("inner1").style.display = "block";
        document.getElementById("inner2").style.display = "none";
        document.getElementById("inner3").style.display = "none";
        document.getElementById("inner5").style.display = "none";
    }
}
function toggle3() {
    if (pageSwitch) {
        document.getElementById("inner1").style.display = "none";
        document.getElementById("inner2").style.display = "none";
        document.getElementById("inner5").style.display = "block";
    }
}
function toggle4() {
    if (pageSwitch) {
        document.getElementById("hours").style.display = "none";
        document.getElementById("days").style.display = "block";
    }
}
function toggle5() {
    if (pageSwitch) {
        document.getElementById("days").style.display = "none";
        document.getElementById("hours").style.display = "block";
    }
}
function toggle6() {
    if (pageSwitch) {
        document.getElementById("inner1").style.display = "block";
        document.getElementById("inner2").style.display = "none";
        document.getElementById("inner3").style.display = "none";
        document.getElementById("hours").style.display = "block";
        document.getElementById("days").style.display = "none";
        document.getElementById("inner5").style.display = "none";
    }
}
if (refresh > 0) {
    setTimeout(function () {
        if (window.getComputedStyle(document.getElementById("inner6")).display === "none")
            window.location.reload(1);
    }, refresh * 1000);
}
document.getElementById("box").style.borderRadius = radius;
document.body.style.transform = "scale(" + scale + ")";

function onDarkModeChange(callback) {
    if (!window.matchMedia("(prefers-color-scheme: dark)").matches) {
        return;
    }
    darkModeMatcher.addListener(({ matches }) => callback(matches));
}

function toggleMode() {
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        if (borderWidth) {
            document.getElementById('art').style.border = borderWidth + "px solid " + darkBorderColor;
        }
        if (darkCustomColor) {
            document.getElementById('box').style.background = darkCustomColor;
            document.getElementById('box').style.opacity = darkOpacity;
        } else if (darkLightBackground) {
            document.getElementById('box').style.background = "rgba(255, 255, 255, " + darkOpacity + ")";
        } else {
            document.getElementById('box').style.background = "rgba(0, 0, 0, " + darkOpacity + ")";
        }
        if (darkPickColor) {
            document.getElementById('box').style.color = darkPickColor;
        }
        if (darkTimeColor) {
            document.getElementById('time').style.cssText = 'color: ' + darkTimeColor + '!important';
        }
        if (darkDateColor) {
            document.getElementById('date').style.cssText = 'color: ' + darkDateColor + '!important';
        }
        if (darkTempColor) {
            document.getElementById('temp').style.cssText = 'color: ' + darkTempColor + '!important';
            document.getElementById('tempToday').style.cssText = 'color: ' + darkTempColor + '!important';
        }
        if (darkHighLowColor) {
            document.getElementById('high').style.cssText = 'color: ' + darkHighLowColor + '!important';
            document.getElementById('low').style.cssText = 'color: ' + darkHighLowColor + '!important';

            document.getElementById('highlowToday').style.cssText = 'color: ' + darkHighLowColor + '!important';

            document.getElementById('highlow1').style.cssText = 'color: ' + darkHighLowColor + '!important';
            document.getElementById('highlow2').style.cssText = 'color: ' + darkHighLowColor + '!important';
            document.getElementById('highlow3').style.cssText = 'color: ' + darkHighLowColor + '!important';
            document.getElementById('highlow4').style.cssText = 'color: ' + darkHighLowColor + '!important';
            document.getElementById('highlow5').style.cssText = 'color: ' + darkHighLowColor + '!important';
            document.getElementById('hhighlow1').style.cssText = 'color: ' + darkHighLowColor + '!important';
            document.getElementById('hhighlow2').style.cssText = 'color: ' + darkHighLowColor + '!important';
            document.getElementById('hhighlow3').style.cssText = 'color: ' + darkHighLowColor + '!important';
            document.getElementById('hhighlow4').style.cssText = 'color: ' + darkHighLowColor + '!important';
            document.getElementById('hhighlow5').style.cssText = 'color: ' + darkHighLowColor + '!important';
        }
        if (darkCityColor) {
            document.getElementById('city').style.cssText = 'color: ' + darkCityColor + '!important';
            document.getElementById('cityToday').style.cssText = 'color: ' + darkCityColor + '!important';
        }
        if (darkDayHourColor) {
            document.getElementById('day1').style.cssText = 'color: ' + darkDayHourColor + '!important';
            document.getElementById('day2').style.cssText = 'color: ' + darkDayHourColor + '!important';
            document.getElementById('day3').style.cssText = 'color: ' + darkDayHourColor + '!important';
            document.getElementById('day4').style.cssText = 'color: ' + darkDayHourColor + '!important';
            document.getElementById('day5').style.cssText = 'color: ' + darkDayHourColor + '!important';
            document.getElementById('hday1').style.cssText = 'color: ' + darkDayHourColor + '!important';
            document.getElementById('hday2').style.cssText = 'color: ' + darkDayHourColor + '!important';
            document.getElementById('hday3').style.cssText = 'color: ' + darkDayHourColor + '!important';
            document.getElementById('hday4').style.cssText = 'color: ' + darkDayHourColor + '!important';
            document.getElementById('hday5').style.cssText = 'color: ' + darkDayHourColor + '!important';
        }
        if (darkTodayRainColor) {
            document.getElementById('rain').style.cssText = 'color: ' + darkTodayRainColor + '!important';
        }
        if (darkNotesColor) {
            document.getElementById('note').style.color = darkNotesColor;
        }
        document.getElementById("box").style.backgroundImage = "url('" + darkImage + "')";
    } else if (window.matchMedia("(prefers-color-scheme: light)").matches) {
        if (borderWidth) {
            document.getElementById('art').style.border = borderWidth + "px solid " + borderColor;
        }
        if (customColor) {
            document.getElementById('box').style.background = customColor;
            document.getElementById('box').style.opacity = opacity;
        } else if (LightBackground) {
            document.getElementById('box').style.background = "rgba(255, 255, 255, " + opacity + ")";
        } else {
            document.getElementById('box').style.background = "rgba(0, 0, 0, " + opacity + ")";
        }
        if (PickColor) {
            document.getElementById('box').style.color = PickColor;
        }
        if (timeColor) {
            document.getElementById('time').style.cssText = 'color: ' + timeColor + '!important';
        }
        if (dateColor) {
            document.getElementById('date').style.cssText = 'color: ' + dateColor + '!important';
        }
        if (tempColor) {
            document.getElementById('temp').style.cssText = 'color: ' + tempColor + '!important';
            document.getElementById('tempToday').style.cssText = 'color: ' + tempColor + '!important';
        }
        if (highLowColor) {
            document.getElementById('high').style.cssText = 'color: ' + highLowColor + '!important';
            document.getElementById('low').style.cssText = 'color: ' + highLowColor + '!important';

            document.getElementById('highlowToday').style.cssText = 'color: ' + highLowColor + '!important';

            document.getElementById('highlow1').style.cssText = 'color: ' + highLowColor + '!important';
            document.getElementById('highlow2').style.cssText = 'color: ' + highLowColor + '!important';
            document.getElementById('highlow3').style.cssText = 'color: ' + highLowColor + '!important';
            document.getElementById('highlow4').style.cssText = 'color: ' + highLowColor + '!important';
            document.getElementById('highlow5').style.cssText = 'color: ' + highLowColor + '!important';
            document.getElementById('hhighlow1').style.cssText = 'color: ' + highLowColor + '!important';
            document.getElementById('hhighlow2').style.cssText = 'color: ' + highLowColor + '!important';
            document.getElementById('hhighlow3').style.cssText = 'color: ' + highLowColor + '!important';
            document.getElementById('hhighlow4').style.cssText = 'color: ' + highLowColor + '!important';
            document.getElementById('hhighlow5').style.cssText = 'color: ' + highLowColor + '!important';
        }
        if (cityColor) {
            document.getElementById('city').style.cssText = 'color: ' + cityColor + '!important';
            document.getElementById('cityToday').style.cssText = 'color: ' + cityColor + '!important';
        }
        if (dayHourColor) {
            document.getElementById('day1').style.cssText = 'color: ' + dayHourColor + '!important';
            document.getElementById('day2').style.cssText = 'color: ' + dayHourColor + '!important';
            document.getElementById('day3').style.cssText = 'color: ' + dayHourColor + '!important';
            document.getElementById('day4').style.cssText = 'color: ' + dayHourColor + '!important';
            document.getElementById('day5').style.cssText = 'color: ' + dayHourColor + '!important';
            document.getElementById('hday1').style.cssText = 'color: ' + dayHourColor + '!important';
            document.getElementById('hday2').style.cssText = 'color: ' + dayHourColor + '!important';
            document.getElementById('hday3').style.cssText = 'color: ' + dayHourColor + '!important';
            document.getElementById('hday4').style.cssText = 'color: ' + dayHourColor + '!important';
            document.getElementById('hday5').style.cssText = 'color: ' + dayHourColor + '!important';
        }
        if (todayRainColor) {
            document.getElementById('rain').style.cssText = 'color: ' + todayRainColor + '!important';
        }
        if (notesColor) {
            document.getElementById('note').style.color = notesColor;
        }
        document.getElementById("box").style.backgroundImage = "url('" + image + "')";
    } else {
        alert("You browser doesn't support window.matchMedia");
    }
}
toggleMode();
window.matchMedia("(prefers-color-scheme: dark)").addListener(e => e.matches && toggleMode())
window.matchMedia("(prefers-color-scheme: light)").addListener(e => e.matches && toggleMode())

if (exportSettings) {
    document.getElementById("inner1").style.display = "none";
    document.getElementById("inner2").style.display = "none";
    document.getElementById("inner3").style.display = "none";
    document.getElementById("inner4").style.display = "none";
    document.getElementById("inner5").style.display = "none";
    document.getElementById("inner6").style.display = "block";
}

function save() {
    localStorage.setItem("ntext", document.getElementById("note").value);
}
document.getElementById("note").value = localStorage.getItem("ntext");