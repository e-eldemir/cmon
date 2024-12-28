var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var player;

function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        // height: '360',
        // width: '100%',
        videoId: 'WW_iOXWCGLE',
        playerVars: {
            'playsinline': 1,
            'autoplay': 0,
            'controls': 1,
            'rel': 0,
            'ecver': 2,
            'showinfo': 0,
            'modestbranding': 1,
            'autohide': 1,
            'enablejsapi': 1,
            'html5': 1
        },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}

function onPlayerReady(event) {
    // event.target.playVideo();
    //player.pauseVideo();
}

function onPlayerStateChange(event) {
    // Video oynarken
    if (event.data == YT.PlayerState.PLAYING) {

    }
}

const forwardRewindDuration = 10;

function forward() {
    let cur = player.getCurrentTime();
    console.log(cur);
    player.seekTo(cur + forwardRewindDuration);
    cur = player.getCurrentTime();
    player.playVideo();

}

function rewind() {
    let cur = player.getCurrentTime();
    console.log(cur);
    player.seekTo(cur - forwardRewindDuration);
    cur = player.getCurrentTime();
    player.playVideo();

    // console.log(cur);
}