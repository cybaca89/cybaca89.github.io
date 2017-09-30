
var _TimerMilliSecToSecCoef = 1 / 1000;

function Timer() {
    this.interval = 1;
    this.stopped = false;

    this.lastTime = 0.0;
    this.deltaTime = 0.0;
    this.totalTime = 0.0;
    this.totalFrames = 0;
    this.fps = 0;
    this.frameCount = 0;

    this.pauseLastTime = 0.0;
    this.pauseDeltaTime = 0.0;
    this.pauseTotalTime = 0.0;
    this.pauseTotalFrames = 0;
    this.pauseFps = 0;
    this.pauseFrameCount = 0;
};

Timer.prototype.tick = function()
{
    if (!this.stopped) {
        var now = Date.now();
        var delta = (now - this.lastTime) * _TimerMilliSecToSecCoef;

        this.totalTime += delta;
        this.lastTime = now;
        this.deltaTime = delta;
        this.totalFrames++;
        this.frameCount++;

        if (this.totalTime >= this.interval) {
            this.fps = this.frameCount;
            this.frameCount = 0;
            this.totalTime = 0;
        }
    } else {
        var now = Date.now();
        var delta = (now - this.pauseLastTime) * _TimerMilliSecToSecCoef;

        this.pauseTotalTime += delta;
        this.pauseLastTime = now;
        this.pauseDeltaTime = delta;
        this.pauseTotalFrames++;
        this.pauseFrameCount++;
        if (this.pauseTotalTime >= this.interval) {
            this.pauseFps = this.pauseFrameCount;
            this.pauseFrameCount = 0;
            this.pauseTotalTime = 0;

        }
    }
};

// 1 for 60 fps, 0.5 for 30 fps, 2 for 120 fps, etc ...
Timer.prototype.setInterval = function(n)
{
    this.interval = n;
};

Timer.prototype.pause = function()
{
    this.stopped = true;
};

Timer.prototype.resume = function()
{
    this.stopped = false;
};

/*
Timer.prototype.getTime = function()
{
    return this.delta;
};

Timer.prototype.getTotalTime = function()
{
    return this.totalTime;
};
*/
