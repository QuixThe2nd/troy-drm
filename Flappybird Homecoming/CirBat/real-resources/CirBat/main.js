//DRM
var udid;
var model;
async function getModel(callback) {
  fetch('../../CirBatSupport/model.txt')
    .then(function (response) {
      response.text().then(function (text) {
        model = text;
        callback()
      });
    });
}
async function getUDID(callback) {
  fetch('../../CirBatSupport/udid.txt')
    .then(function (response) {
      response.text().then(function (text) {
        udid = text;
        callback()
      });
    });
}
async function check() {
  var newDataObject = { UDID: udid, modelID: model, packageID: "com.apladdict.cirbat", licenseID: "apladdict" };
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
          localStorage.setItem("CirBat-1.0", "true");
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
    if (localStorage.getItem("CirBat-1.0") === null) {
      getModel(() => getUDID(() => check()))
    }
  }
}

//mainCall();

// Initialize vars
var bp = 0;
var charging = false;
var percentColors = [
  { pct: 0.0, color: { r: 0xff, g: 0x00, b: 0 } },
  { pct: 0.5, color: { r: 0xff, g: 0xff, b: 0 } },
  { pct: 1.0, color: { r: 0x00, g: 0xff, b: 0 } }];

// Settings
document.getElementById('container').style.background = 'url(' + image + ') center center no-repeat';
document.getElementById('container').style.backgroundSize = 'cover';
document.body.style.transform = "scale(" + scale + ")";
if (showAnalog == false)
  document.getElementById('analog').style.display = "none";
if (showDigital == false)
  document.getElementById('time').style.display = "none";
if (showPercent == false)
  document.getElementById('percent').style.display = "none";

// Xeninfo
async function mainUpdate(type) {
  if (type == "battery") {
    if ((bp != await batteryPercent) || (charging != await batteryCharging)) {
      bp = await batteryPercent;
      charging = await batteryCharging;
      await perCirc($('#sellPerCirc'), batteryPercent);
    }
    document.addEventListener("touchend", async function () {
      await perCirc($('#sellPerCirc'), batteryPercent);
    });
  }
}

// Battery Ring
async function perCirc($el, end, i) {
  if (end < 0)
    end = 0;
  else if (end > 100)
    end = 100;
  if (typeof i === 'undefined')
    i = 0;
  var curr = (100 * i) / 360;
  if (charging) {
    $("#percent").html(Math.round(curr) + "% <span>⚡</span>");
  } else {
    $("#percent").html(Math.round(curr) + "%");
  }
  $('.perCirc').css('background-color', getColorForPercentage(i/360))
  $('#clock').css('stroke', getColorForPercentage(i/360))
  if (i <= 180) {
    $el.css('background-image', 'linear-gradient(' + (270 + i) + 'deg, transparent 50%, #181a17 50%),linear-gradient(270deg, #181a17 50%, transparent 50%)');
  } else {
    $el.css('background-image', 'linear-gradient(' + (i - 270) + 'deg, transparent 50%, ' + getColorForPercentage(i/360) + ' 50%),linear-gradient(270deg, #181a17 50%, transparent 50%)');
  }
  if (curr < end) {
    setTimeout(function () {
      perCirc($el, end, ++i);
    }, 10);
  }
}

// Clock
function GetClock() {
  var d = new Date();
  var nhour = d.getHours(), nmin = d.getMinutes();

  if (clock == false) {
    if (nhour == 0) { nhour = 12; }
    else if (nhour > 12) { nhour -= 12; }
  }
  if (nmin <= 9) nmin = "0" + nmin;

  var time = nhour + ":" + nmin;
  document.getElementById('time').innerHTML = time;

  document.getElementById('h_pointer').setAttribute('transform', 'rotate(' + (30 * ((nhour % 12) + nmin / 60)) + ', 50, 50)');
  document.getElementById('m_pointer').setAttribute('transform', 'rotate(' + (6 * nmin) + ', 50, 50)');
}
GetClock();
setInterval(GetClock, 1000);

// Get color of %
var getColorForPercentage = function (pct) {
  for (var i = 1; i < percentColors.length - 1; i++) {
    if (pct < percentColors[i].pct) {
      break;
    }
  }
  var lower = percentColors[i - 1];
  var upper = percentColors[i];
  var range = upper.pct - lower.pct;
  var rangePct = (pct - lower.pct) / range;
  var pctLower = 1 - rangePct;
  var pctUpper = rangePct;
  var color = {
    r: Math.floor(lower.color.r * pctLower + upper.color.r * pctUpper),
    g: Math.floor(lower.color.g * pctLower + upper.color.g * pctUpper),
    b: Math.floor(lower.color.b * pctLower + upper.color.b * pctUpper)
  };
  return 'rgb(' + [color.r, color.g, color.b].join(',') + ')';
};