if (('mediaSession' in navigator)) {
    navigator.mediaSession.metadata = new MediaMetadata({});
    navigator.mediaSession.metadata.title = "fallout-radio-rework";
    navigator.mediaSession.metadata.album = " ";
    navigator.mediaSession.metadata.artist = " ";
    navigator.mediaSession.metadata.artwork = [{ src: '../img/icons-512.png' }];

    $("audio")[0].session = navigator.mediaSession;

    const actionHandlers = [
        ['play', async () => { console.log("Keypress on media button: play"); }],
        ['pause', async () => { console.log("Keypress on media button: pause"); }],
        ['stop', async () => { console.log("Keypress on media button: stop"); }]
    ]

    for (const [action, handler] of actionHandlers) {
        try {
            navigator.mediaSession.setActionHandler(action, handler);
        } catch (error) {
            console.log(`The media session action "${action}" is not supported yet.`);
        }
    }
}

function ensurePlayingStation() {
    var actualAudio = $('audio');
    if (($('#actualPlayingStationMobile').text() != noStationPlayingText
        || $('#actualPlayingStationPcTab').text() != noStationPlayingText) &&
        actualAudio[0] != null && isPlaying
    ) {
        actualAudio[0].play();
    }
    else {
        actualAudio[0].pause();
    }
}
ensurePlayingStation();
setInterval(ensurePlayingStation, 20);
