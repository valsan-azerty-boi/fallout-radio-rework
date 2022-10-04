async function playAudio(libelle, audio_flux) {
    try {
        $("audio").remove();
        $("body").append('<audio autoplay src="' + audio_flux + '" />'),
            console.log('Playing: ' + libelle);
    } catch (ex) {
        console.log('Failed to play: ' + libelle + ', Exception: ' + ex);
    }
}