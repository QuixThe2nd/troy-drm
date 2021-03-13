if (MK1_ARG.includes("terminal")) {
    var command = MK1_ARG.split(/-(.+)/)[1];
    shellrun(command, (code, stdout, stderr) => {
        if (stdout) {
            alert("Terminal", command + ": " + stdout);
        }
    });
} else {
    if (MK1_ARG == "airplanemode") {
        if (airplaneMode.isEnabled()) {
            airplaneMode.setEnabled(false);
        } else {
            airplaneMode.setEnabled(true);
        }
    } else if (MK1_ARG == "wifi") {
        if (wifi.isEnabled()) {
            wifi.setEnabled(false);
        } else {
            wifi.setEnabled(true);
        }
    } else if (MK1_ARG == "wifim") {
        if (wifi.isEnabled()) {
            alert("WControl - WiFi Info", "Network: " + wifi.networkName() + "\nRSSI: " + wifi.signalRSSI());
        }
    } else if (MK1_ARG == "bluetooth") {
        if (bluetooth.isEnabled()) {
            bluetooth.setEnabled(false);
        } else {
            bluetooth.setEnabled(true);
        }
    } else if (MK1_ARG == "devices") {
        var state = "";
        if (device.batteryState() == 2) {
            state = "charging"
        }
        var message = device.name() + ": " + Math.round(device.batteryLevel() * 100) + "% " + state + "\n";
        var devices = bluetooth.connectedDevices();
        devices.forEach(battery);

        function battery(item) {
            message += bluetoothDevice.name(item) + ": " + bluetoothDevice.batteryLevel(item) + "%\n";
        }
        alert("WControl - Battery Levels", message);
    } else if (MK1_ARG == "data") {
        if (cellularData.isEnabled()) {
            cellularData.setEnabled(false);
        } else {
            cellularData.setEnabled(true);
        }
    } else if (MK1_ARG == "toggleview") {
        systemStyle.toggle();
    } else if (MK1_ARG == "orientation") {
        if (orientationLock.isEnabled()) {
            orientationLock.setEnabled(false);
        } else {
            orientationLock.setEnabled(true);
        }
    } else if (MK1_ARG == "ringer") {
        if (volume.getRinger() == 1.0) {
            volume.setRinger(0.000000000);
        } else {
            volume.setRinger(1);
        }
    } else if (MK1_ARG == "lpm") {
        if (lpm.isEnabled()) {
            lpm.setEnabled(false);
        } else {
            lpm.setEnabled(true);
        }
    } else if (MK1_ARG == "respring") {
        device.respring();
    } else if (MK1_ARG == "power") {
        confirm("WControl", "Are you sure you would like to shut down your device?", c => {
            if (c) device.shutdown();
        });
    } else if (MK1_ARG == "safemode") {
        confirm("WControl", "Are you sure you would like to enter safe mode?", c => {
            if (c) device.safemode();
        });
    } else if (MK1_ARG == "lock") {
        device.lock();
    } else if (MK1_ARG == "flashlight") {
        if (flashlight.getLevel() == 1) {
            flashlight.setLevel(0);
        } else {
            flashlight.setLevel(1);
        }
    } else if (MK1_ARG == "volumeup") {
        volume.setMedia(volume.getMedia() + .06);
    } else if (MK1_ARG == "volumedown") {
        volume.setMedia(volume.getMedia() - .06);
    } else if (MK1_ARG == "last") {
        media.previousTrack();
    } else if (MK1_ARG == "next") {
        media.nextTrack();
    } else if (MK1_ARG == "play") {
        media.getNowPlayingInfo(info => {
            if ((info["kMRMediaRemoteNowPlayingInfoPlaybackRate"] == null) || (info["kMRMediaRemoteNowPlayingInfoPlaybackRate"] == 0)) {
                media.play();
            } else {
                media.pause();
            }
        });
    } else if (MK1_ARG == "media") {
        media.getNowPlayingInfo(info => {
            if (!info) {} else {
                title = info["kMRMediaRemoteNowPlayingInfoTitle"];
                artist = info["kMRMediaRemoteNowPlayingInfoArtist"];
                album = info["kMRMediaRemoteNowPlayingInfoAlbum"];

                alert("Song Title:" + title + "\nArtist: " + artist + "\nAlbum: " + album)
            }
        });
    } else if (MK1_ARG == "prefs") {
        openApp("com.apple.Preferences");
    }
}