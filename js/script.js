$("div#ie").remove();
$('body').attr('oncontextmenu', 'return false;');
$('img').attr('draggable', 'false');
$('#sliderAudio').attr('oncontextmenu', 'return false;');
$('#sliderAudio').attr('draggable', 'false');
$('#pause-button').hide();

const falloutFmUri = "http://fallout.fm:8000";

const defaultAudioVolume = 0.5;
const defaultStationId = 1;

var actualStationId = 1;
var actualStationName = "";
var actualStationUri = "";
var actualStationVolume = 0.5;

const input = $("#sliderAudio")[0];

const stationList = [
    [
        { id: 1, name: "Main Station", route: "/api/falloutfm1.ogg" }
    ],
    [
        { id: 2, name: "Fallout 76 Classical", route: "/api/falloutfm9.ogg" },
        { id: 3, name: "Fallout 76 General", route: "/api/falloutfm10.ogg" }
    ],
    [
        { id: 4, name: "Fallout 4 Classical Radio", route: "/api/falloutfm7.ogg" },
        { id: 5, name: "Fallout 4 Diamond City Radio", route: "/api/falloutfm6.ogg" },
        { id: 6, name: "Fallout 4 MWTCF", route: "/api/falloutfm8.ogg" }
    ],
    [
        { id: 7, name: "Fallout 3 Galaxy News Radio", route: "/api/falloutfm2.ogg" },
        { id: 8, name: "Fallout NV Radio New Vegas", route: "/api/falloutfm3.ogg" }
    ],
    [
        { id: 9, name: "Fallout 2 OST", route: "/api/falloutfm4.ogg" },
        { id: 10, name: "Fallout 1 OST", route: "/api/falloutfm5.ogg" }
    ]
];

stationList.forEach(group => {
    var stationGroup = "<li>";
    group.forEach(station => {
        $('#station-list-mobile').append("<option value='" + station.id + "'>" + station.name + "</option>");
        stationGroup += "<a onClick=\"playAudio(" + station.id + ",'" + station.name + "','" + station.route + "')\">" + station.name + "</a> ";
    });
    stationGroup += "</li>";
    $('#station-list-pc-tab').append(stationGroup);
});

async function playAudio(id, libelle, audio_flux) {
    try {
        $("audio").remove();
        actualStationId = id;
        actualStationName = libelle;
        if (window.location.href.indexOf("netlify") > -1) {
            actualStationUri = audio_flux;
        }
        else {
            actualStationUri = falloutFmUri + audio_flux.replace('/api', '');
        }
        $("body").append('<audio id="audio" autoplay src="' + actualStationUri + '" />');
        $("#audio").prop("volume", $("#audioLevel").val());
        $('#play-button').hide();
        $('#pause-button').show();
        $("#station-list-mobile").val(id);
        $('text').html(libelle);
        setCookie("station", id, 365);
        console.log('Playing: ' + libelle);
    } catch (ex) {
        console.log('Failed to play: ' + libelle + ', Exception: ' + ex);
    }
}

async function playSelectedAudio() {
    var value = $("#station-list-mobile option:selected").val();
    var targetStation = 0;
    if (value != 0) {
        stationList.forEach(group => {
            group.forEach(station => {
                if (value == station.id) {
                    targetStation = station;
                }
            });
        });
        playAudio(targetStation.id, targetStation.name, targetStation.route);
    }
}

async function stopSelectedAudio() {
    stopAudio();
    $('#pause-button').hide();
    $('#play-button').show();
    $('text').html("No station");
    console.log('Stop audio');
}

async function stopAudio() {
    try {
        $("audio").remove();
    } catch (ex) {
        console.log('Failed to stop audio, Exception: ' + ex);
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
    if (audioLevel != null && audioLevel != "") {
        actualStationVolume = audioLevel;
        $('#audioLevel').val(audioLevel);
    } else {
        actualStationVolume = 0.5;
        setCookie("audioLevel", 0.5, 365);
    }

    let station = getCookie("station");
    if (station != null && station != "" && station != 0) {
        actualStationId = station;
    } else {
        actualStationId = 1;
        setCookie("station", 1, 365);
    }

    stationList.forEach(group => {
        group.forEach(station => {
            if (actualStationId == station.id) {
                actualStationName = station.name;
                actualStationUri = station.route;
            }
        });
    });
    $("#station-list-mobile").val(actualStationId);
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

async function setAudio(value) {
    try {
        actualStationVolume = value;
        var $input = $('#audioLevel');
        $input.val(value);
        $("#audio").prop("volume", value);
        $("input[type=range]").val(value * 20);
        input.style.setProperty("--thumb-rotate", `${value * 720}deg`);
        setCookie("audioLevel", value, 365);
    } catch (ex) {
        console.log('Failed to set audio level, Exception: ' + ex);
    }
}

checkCookie();
setAudio(actualStationVolume);

input.addEventListener("input", event => {
    const value = Number(input.value) / 20;
    input.style.setProperty("--thumb-rotate", `${value * 720}deg`);
    actualStationVolume = value;
    var $input = $('#audioLevel');
    $input.val(value);
    $("#audio").prop("volume", value);
    setCookie("audioLevel", value, 365);
});

console.log("Volume on page load is: " + actualStationVolume);

$("#year").text(new Date().getFullYear());

$(document).ready(function (e) {
    $('img[usemap]').rwdImageMaps();
});

function isWindow(obj) {
    return obj != null && obj === obj.window;
}
function getWindow(elem) {
    return isWindow(elem) ? elem : elem.nodeType === 9 && elem.defaultView;
}
function offset(elem) {

    var docElem, win,
        box = { top: 0, left: 0 },
        doc = elem && elem.ownerDocument;

    docElem = doc.documentElement;

    if (typeof elem.getBoundingClientRect !== typeof undefined) {
        box = elem.getBoundingClientRect();
    }
    win = getWindow(doc);
    return {
        top: box.top + win.pageYOffset - docElem.clientTop,
        left: box.left + win.pageXOffset - docElem.clientLeft
    };
};

var is_touch_device = (('ontouchstart' in window) ||
    (navigator.maxTouchPoints > 0) ||
    (navigator.msMaxTouchPoints > 0));

var has_mouse_support = false;
document.addEventListener("pointermove", function (evt) {
    var pointerType = evt.pointerType;
    /*** Safari quirk  ***/
    if (pointerType === "touch" && evt.height === 117.97119140625
        && evt.height === evt.width) pointerType = "mouse";
    /*** Safari quirk  ***/
    has_mouse_support = (pointerType === "mouse");
});

if (has_mouse_support || !is_touch_device) {
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
} else {
    $("img#radio").attr("src", "img/radio-touch-device.png");
    $("img").on("taphold", function (event) {
        event.preventDefault();
        event.stopImmediatePropagation();
    })
};

(function ($, window, document) {
    var pluginName = 'fatNavVolume',
        defaults = {};

    function Plugin(options) {
        this.settings = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.init();
    }

    $.extend(Plugin.prototype, {
        init: function () {
            var self = this;
            var $nav = this.$nav = $('.nav-volume');
            var $hamburger = this.$hamburger = $('#areaChangeVolume');

            if (navigator.userAgent.match(/(iPad|iPhone|iPod)/g)) {
                $nav.children().css({
                    'height': '110%',
                    'transform': 'translateY(-5%)'
                });
            }

            $().add($hamburger).on('click', function (e) {
                self.toggleNav();
            });
        },

        toggleNav: function () {
            var self = this;
            this.$nav.fadeToggle(400);
            self.toggleBodyOverflow();
            $().add(this.$hamburger).add(this.$nav).toggleClass('active');
        },

        toggleBodyOverflow: function () {
            var self = this;
            var $body = $('body');
            var isNavOpen = $body.hasClass('no-scroll');
            $body.css('overflow', isNavOpen ? 'hidden' : self._bodyOverflow);
        }

    });

    if (typeof $[pluginName] === 'undefined') {
        $[pluginName] = function (options) {
            return new Plugin(this, options);
        };
    }
}(jQuery, window, document));

(function () {
    $.fatNavVolume();
}());

(function ($, window, document) {
    var pluginName = 'fatNavStation',
        defaults = {};

    function Plugin(options) {
        this.settings = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.init();
    }

    $.extend(Plugin.prototype, {
        init: function () {
            var self = this;
            var $nav = this.$nav = $('.nav-station');
            var $hamburger = this.$hamburger = $('#areaChangeStation');

            if (navigator.userAgent.match(/(iPad|iPhone|iPod)/g)) {
                $nav.children().css({
                    'height': '110%',
                    'transform': 'translateY(-5%)'
                });
            }

            $().add($hamburger).on('click', function (e) {
                self.toggleNav();
            });
        },

        toggleNav: function () {
            var self = this;
            this.$nav.fadeToggle(400);
            self.toggleBodyOverflow();
            $().add(this.$hamburger).add(this.$nav).toggleClass('active');
        },

        toggleBodyOverflow: function () {
            var self = this;
            var $body = $('body');
            var isNavOpen = $body.hasClass('no-scroll');
            $body.css('overflow', isNavOpen ? 'hidden' : self._bodyOverflow);
        }

    });

    if (typeof $[pluginName] === 'undefined') {
        $[pluginName] = function (options) {
            return new Plugin(this, options);
        };
    }
}(jQuery, window, document));

(function () {
    $.fatNavStation();
}());

function closeFullscreenMenu(idMenuToClose) {
    $('#' + idMenuToClose).hide();
}

function switchFullscreenMenu(idMenuToClose, idMenuToOpen) {
    $('#' + idMenuToClose).hide();
    $('#' + idMenuToOpen).show();
}

document.body.addEventListener('keypress', function (e) {
    if (e.key == "Escape") {

    }
});

document.onkeydown = function (evt) {
    evt = evt || window.event;
    var isEscape = false;
    if ("key" in evt) {
        isEscape = (evt.key === "Escape" || evt.key === "Esc");
    } else {
        isEscape = (evt.keyCode === 27);
    }
    if (isEscape) {
        closeFullscreenMenu("nav-menu-volume");
        closeFullscreenMenu("nav-menu-station");
    }
};

function onDeviceReady() {
    document.addEventListener("backbutton", onBackKeyDown, false);
}

function onBackKeyDown(e) {
    if ($('#nav-menu-volume').is(':visible') || $('#nav-menu-station').is(':visible')) {
        e.preventDefault();
        closeFullscreenMenu("nav-menu-volume");
        closeFullscreenMenu("nav-menu-station");
    }
};

$(document).ready(function () {
    if (window.matchMedia("(max-width: 767px)").matches) {
        closeFullscreenMenu("nav-menu-volume");
        closeFullscreenMenu("nav-menu-station");
        $('.pc-tab').hide();
        $("#sliderAudio").appendTo("#sliderAudioMobileLi");
        $('.mobile').show();
    } else {

        $('.mobile').hide();
        $("#sliderAudio").appendTo("#sliderAudioPcTabLi");
        $('.pc-tab').show();
    }
});

$(window).bind('orientationchange', check);
function check() {
    if (document.documentElement.clientWidth >= 767) {
        $('.mobile').hide();
        $("#sliderAudio").appendTo("#sliderAudioPcTabLi");
        $('.pc-tab').show();
    } else {
        closeFullscreenMenu("nav-menu-volume");
        closeFullscreenMenu("nav-menu-station");
        $('.pc-tab').hide();
        $("#sliderAudio").appendTo("#sliderAudioMobileLi");
        $('.mobile').show();
    }
};

$(window).resize(function () {
    if (document.documentElement.clientWidth >= 767) {
        $('.mobile').hide();
        $("#sliderAudio").appendTo("#sliderAudioPcTabLi");
        $('.pc-tab').show();
    } else {
        closeFullscreenMenu("nav-menu-volume");
        closeFullscreenMenu("nav-menu-station");
        $('.pc-tab').hide();
        $("#sliderAudio").appendTo("#sliderAudioMobileLi");
        $('.mobile').show();
    }
}).resize();

