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