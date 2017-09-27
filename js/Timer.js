

function Timer() {
    this.now = -1;
    this.delta = 0.0;
    this.last = 0.0;
    this.interval = 60;
    // this.actual_delta = 0.0;
    // this.actual_last = 0.0;
    // this.count = 0;
};

Timer.prototype.checkpoint = function()
{
    this.now = new Date().getTime();
    this.delta = this.now - this.last;
    if (this.delta < this.interval) {
        return false;
    }
    this.last = this.now;
    return true;
};

Timer.prototype.setInterval = function(n)
{
    this.interval = n;
};
