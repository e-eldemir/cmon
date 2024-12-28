// var stats = new Stats();
// stats.showPanel(1); // 0: fps, 1: ms, 2: mb, 3+: custom
// document.body.appendChild(stats.dom)

// function animate() {

//     stats.begin();

//     // monitored code goes here

//     stats.end();

//     requestAnimationFrame(animate);

// }

// requestAnimationFrame(animate);

const config = {
    video: {
        width: 640,
        height: 480,
        fps: 32
    }
};


const landmarkColors = {
    thumb: 'red',
    indexFinger: 'blue',
    middleFinger: 'yellow',
    ringFinger: 'green',
    pinky: 'pink',
    palmBase: 'white'
};

// parmaklarin ebatlari
const landmarkSize = 6;
// var baslangicZamani;
var baslangicMenuZamani = new Date().getTime();
var menuGoster = false;
// document.getElementById("overlay").style.left = '-2000px';
// 
async function main() {
    const video = document.querySelector("#pose-video");
    const canvas = document.querySelector("#pose-canvas");
    const ctx = canvas.getContext("2d");

    const knownGestures = [
        fp.Gestures.VictoryGesture,
        fp.Gestures.ThumbsUpGesture,
        fp.Gestures.RaisedGesture
    ];
    const GE = new fp.GestureEstimator(knownGestures);
    // load handpose model
    const model = await handpose.load();
    console.log("Handpose model loaded");





    let timeoutId;


    const estimateHands = async() => {


        ctx.clearRect(0, 0, config.video.width, config.video.height);

        const predictions = await model.estimateHands(video, true);

        if (predictions.length > 0) {



            for (let i = 0; i < predictions.length; i++) {
                // draw colored dots at each predicted joint position
                for (let part in predictions[i].annotations) {
                    for (let point of predictions[i].annotations[part]) {
                        drawPoint(ctx, point[0], point[1], landmarkSize, landmarkColors[part]);
                    }
                }

                const indexFinger = predictions[0].annotations.indexFinger;
                const tip = indexFinger[3];

                const est = GE.estimate(predictions[i].landmarks, 1);

                if (est.gestures.length > 0) {
                    // find gesture with highest match score
                    let result = est.gestures.reduce((p, c) => {
                        return (p.score > c.score) ? p : c;
                    });
                    // resultLayer.innerText = gestureStrings[result.name];
                    // callVideo(result.name);
                    console.log(result.name);
                    if (result.name == 'raised') {
                        callVideo(result.name);
                        // console.log('eli bulduk');

                        /*
                                                if (menuGoster == false) {

                                                    if (new Date().getTime() - baslangicMenuZamani >= 300) {
                                                        // console.log("500 milisaniye geçti!");

                                                        menuGoster = true;
                                                        document.getElementById("overlay").style.left = '0px';
                                                        // 

                                                    } else {
                                                        // console.log("500 milisaniye geçmedi.");
                                                        // drawMyButtons(ctx, [0, 0]);
                                                        document.getElementById("overlay").style.left = '-2000px';
                                                        menuGoster = false;
                                                    }
                                                } else {
                                                    drawMyButtons(ctx, tip);
                                                    baslangicMenuZamani = new Date().getTime();
                                                }
                        */
                    } else {

                        //
                        //document.getElementById("overlay").style.left = '-2000px';
                        //                      menuGoster = false;

                    }


                }

            }

            // baslangicZamani = new Date().getTime();

        } else {



            if (new Date().getTime() - baslangicMenuZamani >= 300) {


                menuGoster = false;
                // baslangicMenuZamani = new Date().getTime();
                drawMyButtons(ctx, [0, 0]);
                document.getElementById("overlay").style.left = '-2000px';
            }


        }

        setTimeout(() => {
            estimateHands();
        }, 500 / config.video.fps);

    };
    estimateHands();

}


let waitXsecond = false;
let waitDuration = 3000;
var lastCommand = '';
var _jsArray = [];
const maxArrayElement = 7;

const allEqual = arr => arr.every(v => v === arr[0]);

function callVideo(result) {

    _jsArray.push(result);

    if (_jsArray.length >= maxArrayElement) {
        _jsArray.shift();
    } else {
        return;
    }
    console.log(_jsArray);
    // let emre = allEqual([1, 1, 1, 1]);
    if (allEqual(_jsArray) === true) {
        // butun array uyeleri ayni... demekki ayni isaretteyiz..
        if (waitXsecond == false) {
            console.log('butun uyeler ayni');
            _jsArray = [];
            waitXsecond = true;
            if (result == 'raised') {
                // showHand("✋");
                console.log('raised');
                // pauseVideo();
            }
            lastCommand = result;
            setTimeout(function() {
                console.log("I'm ready new order ;) ");
                waitXsecond = false;
            }, waitDuration);
        } else {
            return;
        }
    } else {
        console.log('butun uyeler farkli');
        return;
    }
    // waitXsecond = true;
    // setTimeout(function() {
    //     // function code goes here
    //     waitXsecond = false;
    // }, waitDuration);
}

var insideRect1 = false;
var insideRect2 = false;
// var timeout;
var lastButton;

var rect1 = { x: 50, y: 50, width: 150, height: 50, color: "#FF000080", action: "Rewind" }; // Kırmızı renk
var rect2 = { x: 250, y: 50, width: 150, height: 50, color: "#00FF0080", action: "Forward" }; // Yeşil renk


function drawMyButtons(ctx, tip) {

    insideRect1 = tip[0] >= rect1.x && tip[0] <= rect1.x + rect1.width &&
        tip[1] >= rect1.y && tip[1] <= rect1.y + rect1.height;

    insideRect2 = tip[0] >= rect2.x && tip[0] <= rect2.x + rect2.width &&
        tip[1] >= rect2.y && tip[1] <= rect2.y + rect2.height;

    // console.log(tip[0], tip[1]);
    checkMouseInRect();

    Playbutton(rect1, ctx);
    Playbutton(rect2, ctx);
}

var lastClickedTime = new Date().getTime();

function checkMouseInRect() {
    // 
    if (new Date().getTime() - lastClickedTime >= 2000) {


        if (insideRect1) {
            if (lastButton != 1) {
                lastButton = 1;
                console.log("Rect 1 Color:", rect1.action);
                rewind();
                lastClickedTime = new Date().getTime();
            }
        } else if (insideRect2) {
            if (lastButton != 2) {
                lastButton = 2;
                console.log("Rect 2 Color:", rect2.action);
                forward();
                lastClickedTime = new Date().getTime();
            }
        } else {
            lastButton = 0;
        }

    }
}

// İki dikdörtgeni çiz
function drawRect(rect, ctx) {
    ctx.fillStyle = rect.color;
    ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
}

function Playbutton(rect, ctx) {
    ctx.beginPath();
    ctx.rect(rect.x, rect.y, rect.width, rect.height);
    ctx.fillStyle = rect.color;
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = rect.color;
    ctx.stroke();
    ctx.closePath();
    ctx.font = '20pt Kremlin Pro Web';
    ctx.fillStyle = '#000000';
    ctx.fillText(rect.action, rect.x + rect.width / 4, rect.y + 30);
}

function drawPoint(ctx, x, y, r, color) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    // ctx.fillStyle = color;
    // context.fillStyle="#FFFFFF";
    ctx.fillStyle = 'rgba(10, 200, 100, .8)';
    ctx.fill();
}


// [2]
async function initCamera(width, height, fps) {
    const constraints = {
        audio: false,
        video: {
            facingMode: "user",
            width: width,
            height: height,
            frameRate: {
                max: fps
            }
        }
    };
    const video = document.querySelector("#pose-video");
    video.width = width;
    video.height = height;
    // get video stream
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    video.srcObject = stream;
    return new Promise(resolve => {
        video.onloadedmetadata = () => {
            resolve(video)
        };
    });
}


// [1] DOM yuklenince...!
window.addEventListener("DOMContentLoaded", () => {
    var loadedmetadata = false;
    if (window.addEventListener) {
        window.addEventListener('loadedmetadata', function(ev) {
            loadedmetadata = true;
        }, true);
    }
    if (loadedmetadata === true && videoPlayer.techName === 'html5') {
        // call the callback you would have attached to
        // the event listener.
    } else {
        // add event listener here
    }
    initCamera(
        config.video.width, config.video.height, config.video.fps
    ).then(video => {
        video.play();
        video.addEventListener("loadeddata", event => {
            console.log("Camera is ready");

            main();
        });
    }).catch((error) => {
        console.error(`onRejected function called: ${error.message}`);
    })
    const canvas = document.querySelector("#pose-canvas");
    canvas.width = config.video.width;
    canvas.height = config.video.height;
    console.log("Canvas initialized");
    const ctx = canvas.getContext("2d");





    var overlay = document.getElementById("overlay");
    var timer; // Hareketsizlik zamanlayıcısı

    // Mouse hareketini dinle
    document.addEventListener('mousemove', function() {
        // Eğer canvas görünürse, gizle ve zamanlayıcıyı sıfırla
        if (overlay.style.left === '0px') {
            overlay.style.left = '-2000px';
            clearTimeout(timer);
        }

        // Mouse hareket ettiğinde, 5 saniye sonra canvas'i göster
        timer = setTimeout(function() {
            overlay.style.left = '0px';
        }, 3000); // 5 saniye
    });
    document.addEventListener('click', function() {
        // Eğer canvas görünürse, gizle ve zamanlayıcıyı sıfırla
        if (overlay.style.left === '0px') {
            overlay.style.left = '-2000px';
            clearTimeout(timer);
        }

        // Mouse hareket ettiğinde, 5 saniye sonra canvas'i göster
        timer = setTimeout(function() {
            overlay.style.left = '0px';
        }, 3000); // 5 saniye
    });


});


const bc = new BroadcastChannel("cmon_channel");
const secondaryReady = false;

bc.onmessage = (event) => {

    console.log(event);
    if (event.data == "ImReady")
        secondaryReady = true;
};