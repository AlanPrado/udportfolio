var LOG_HELPER = {
    performance: window.performance,
	frame: 0,
    frames: 10,
    logAverageFrame: function(times) {
    	//console.log("current frame: " + this.frame);
		if (this.frame % this.frames === 0) {
			var sum = 0;
			for (var i = times.length - 1, min = i - this.frames; i > min; i--) {
				sum += times[i].duration;
			}
			console.log("Average time to generate last " + this.frames + " frames: " + sum / this.frames + "ms");
		}
    },
    measureTime: function(start, end, measure, action, logBack) {
        performance.mark(start);
        action();
        performance.mark(end);
        performance.measure(measure, start, end);
        var timeToResize = performance.getEntriesByName(measure);
        logBack(timeToResize);    
    },
    incFrame: function() {
    	this.frame++;
    }
};