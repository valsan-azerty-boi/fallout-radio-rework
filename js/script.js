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

checkCookie();
