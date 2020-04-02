function mainClock(it) {
    if (it == true) {
        if (language == "italian") {
            var tday = ["Domenica", "Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Domenica"];
            var tmonth = ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"];
        } else if (language == "french") {
            var tday = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
            var tmonth = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
        } else if (language == "portuguese") {
            var tday = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
            var tmonth = ["de Janeiro", "de Fevereiro", "de Março", "de Abril", "de Maio", "de Junho", "de Julho", "de Agosto", "de Setembro", "de Outubro", "de Novembro", "de Dezembro"];
        } else if (language == "german") {
            var tday = ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"];
            var tmonth = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];
        } else {
            var tday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
            var tmonth = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        }
        function GetClock() {
            var d = new Date();
            var nday = d.getDay(), nmonth = d.getMonth(), ndate = d.getDate();
            var nhour = d.getHours(), nmin = d.getMinutes(), ap;
            var nseconds = d.getSeconds()
            if (hideDate) {
                tday = ["", "", "", "", "", "", ""];
                tmonth = ["", "", "", "", "", "", "", "", "", "", "", ""];
                ndate = "";
            }
            if (clock == false) {
                if (nhour == 0) { ap = " AM"; nhour = 12; }
                else if (nhour < 12) { ap = " AM"; }
                else if (nhour == 12) { ap = " PM"; }
                else if (nhour > 12) { ap = " PM"; nhour -= 12; }
            }
            if (nmin <= 9) nmin = "0" + nmin;
            if (nseconds <= 9) nseconds = "0" + nseconds;
            if (seconds) {
                var time = nhour + ":" + nmin + ":" + nseconds;
                if (dayMonth == false) {
                    var date = tday[nday] + "<br>" + tmonth[nmonth] + " " + ndate;
                } else {
                    var date = tday[nday] + "<br>" + ndate + " " + tmonth[nmonth];
                }
            } else {
                var time = nhour + ":" + nmin;
                if (dayMonth == false) {
                    var date = tday[nday] + "<br>" + tmonth[nmonth] + " " + ndate;
                } else {
                    var date = tday[nday] + "<br>" + ndate + " " + tmonth[nmonth];
                }
            }
            document.getElementById('time').innerHTML = time;
            document.getElementById('date').innerHTML = date;
            return nday;
        }
        var weekday = GetClock();
        setInterval(GetClock, 1000);
    }
}