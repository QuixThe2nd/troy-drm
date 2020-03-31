if (it == true) {
    // Set the date we're counting down to
    var countDownDate = new Date(countMonth + " " + countDay + ", " + countYear + " " + countHour + ":" + countMinute).getTime();
    var x = setInterval(function () {
        var now = new Date().getTime();
        var distance = countDownDate - now;
        // Time calculations for days, hours, minutes and seconds
        var days = Math.floor(distance / (1000 * 60 * 60 * 24));
        var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);
        // Display results
        if (eventName == "") {
            document.getElementById("inner4").innerHTML = "<br>" + days + "<span style='font-size:10px;'>d</span> " + hours + "<span style='font-size:10px;'>h</span> "
                + minutes + "<span style='font-size:10px;'>m</span> " + seconds + "<span style='font-size:10px;'>s</span><br><h6>Countdown to " + countMonth + " " + countDay + ", " + countYear + "</h6>";
        } else {
            document.getElementById("inner4").innerHTML = "<br>" + days + "<span style='font-size:10px;'>d</span> " + hours + "<span style='font-size:10px;'>h</span> "
                + minutes + "<span style='font-size:10px;'>m</span> " + seconds + "<span style='font-size:10px;'>s</span><br><h6>Countdown to " + eventName + "</h6>";
        }
        // If the count down is finished
        if (distance < 0) {
            clearInterval(x);
            document.getElementById("inner4").innerHTML = "<br>Countdown Complete!";
        }
    }, 1000);
}