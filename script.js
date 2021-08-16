var fps = 30,
    interval     =    1000/fps,
    lastTime     =    (new Date()).getTime(),
    currentTime  =    0,
    delta = 0;

async function main(){
    const game = document.game = new Game();
    window.requestAnimationFrame(loop);
}

function loop(t) {
    window.requestAnimationFrame(loop);

    currentTime = (new Date()).getTime();
    delta = (currentTime-lastTime);

    if(delta > interval) {
        document.game.update(t);
    }
}