const stationList = [
    { id: 1, name: "Main Station", route: "/api/falloutfm1.ogg" },
    { id: 2, name: "Fallout 76 Classical", route: "/api/falloutfm9.ogg" },
    { id: 3, name: "Fallout 76 General", route: "/api/falloutfm10.ogg" },
    { id: 4, name: "Fallout 4 Classical Radio", route: "/api/falloutfm7.ogg" },
    { id: 5, name: "Fallout 4 Diamond City Radio", route: "/api/falloutfm6.ogg" },
    { id: 6, name: "Fallout 4 MWTCF", route: "/api/falloutfm8.ogg" },
    { id: 7, name: "Fallout 3 Galaxy News Radio", route: "/api/falloutfm2.ogg" },
    { id: 8, name: "Fallout NV Radio New Vegas", route: "/api/falloutfm3.ogg" },
    { id: 9, name: "Fallout 2 OST", route: "/api/falloutfm4.ogg" },
    { id: 10, name: "Fallout 1 OST", route: "/api/falloutfm5.ogg" }
];

const falloutFmUri = "http://fallout.fm:8000";
var actualStationId = null;
var index = -1;

async function clicChangeStation() {
    var uri = "";

    if (actualStationId == null || actualStationId < 0) {
        index = 0;
    } else if (stationList.length == index + 1) {
        index = 0;
    }
    else {
        index = index + 1;
    }

    actualStationId = stationList[index].id;

    if (window.location.href.indexOf("netlify") > -1) {
        uri = stationList[index].route;
    }
    else {
        uri = falloutFmUri + stationList[index].route.replace('/api', '');
    }

    try {
        $("audio").remove();
        $("body").append('<audio id="audio" autoplay src="' + uri + '" />');
        $("#audio").prop("volume", $("#audioLevel").val());
    } catch (ex) {
        console.log('Failed to play: ' + stationList[index].name + ', Exception: ' + ex);
    }
}

async function clicChangeVolume() {
    try {
        var $input = $('#audioLevel');
        $input.val(+$input.val() + 0.1);
        if ($input.val() > 1)
            $input.val(0);
        $("#audio").prop("volume", $input.val());
        setCookie("audioLevel", $input.val(), 365);
    } catch (ex) {
        console.log('Failed to turn up audio level, Exception: ' + ex);
    }
}

async function playAudio(libelle, audio_flux) {
    try {
        $("audio").remove();
        $("body").append('<audio id="audio" autoplay src="' + audio_flux + '" />');
        $("#audio").prop("volume", $("#audioLevel").val());
        console.log('Playing: ' + libelle);
    } catch (ex) {
        console.log('Failed to play: ' + libelle + ', Exception: ' + ex);
    }
}

async function upAudio() {
    try {
        var $input = $('#audioLevel');
        $input.val(+$input.val() + 0.1);
        if ($input.val() > 1)
            $input.val(1);
        $("#audio").prop("volume", $input.val());
        setCookie("audioLevel", $input.val(), 365);
    } catch (ex) {
        console.log('Failed to turn up audio level, Exception: ' + ex);
    }
}

async function downAudio() {
    try {
        var $input = $('#audioLevel');
        $input.val(+$input.val() - 0.1);
        if ($input.val() < 0)
            $input.val(0);
        $("#audio").prop("volume", $input.val());
        setCookie("audioLevel", $input.val(), 365);
    } catch (ex) {
        console.log('Failed to turn down audio level, Exception: ' + ex);
    }
}

async function stopAudio() {
    try {
        $("audio").remove();
    } catch (ex) {
        console.log('Failed to turn stop audio, Exception: ' + ex);
    }
}

function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function checkCookie() {
    let audioLevel = getCookie("audioLevel");
    if (audioLevel != "") {
        $('#audioLevel').val(audioLevel);
    } else {
        setCookie("audioLevel", 0.5, 365);
    }
}

function checkAudioPaused() {
    if (!$("#audio").paused) {
        console.log("audio on");
    } else {
        console.log("audio off");
    }

}

async function sleep(ms) {
    await new Promise(
        resolve => setTimeout(resolve, ms)
    );
}

checkCookie();

$("#year").text(new Date().getFullYear());

$(document).ready(function (e) {
    $('img[usemap]').rwdImageMaps();
});

var tooltipSpanVolumeMouse = document.getElementById('tooltip-span-volume-mouse');
var tooltipSpanStationMouse = document.getElementById('tooltip-span-station-mouse');

window.onmousemove = function (e) {
    var x = (e.clientX - 40) + 'px',
        y = (e.clientY - 40) + 'px';
    tooltipSpanVolumeMouse.style.top = y;
    tooltipSpanVolumeMouse.style.left = x;
    tooltipSpanStationMouse.style.top = y;
    tooltipSpanStationMouse.style.left = x;
};
