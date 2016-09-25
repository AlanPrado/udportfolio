var MAIN = (function() {
	var pizzaFlavors = 100,
		movingPizza = document.querySelector("#movingPizzas1"),
		container,
		randomPizzas = document.querySelector("#randomPizzas"),
		pizzaSizeSelector = document.querySelector("#pizzaSize"),
		moverSelector = [];

    var getContainer = function() {
        if(!container) container = document.querySelectorAll(".randomPizzaContainer");
        return container;
    };

	var createAllPizzas = function() {
		for (var i = pizzaFlavors; i > 2; i--) {
			randomPizzas.appendChild(PIZZA_FACTORY.createPizza(i));
		}
	};

	var generateSlidingPizzas = function() {
		var cols = 6;
		var lineHeight = 256;
		var backgroundPizzas = Math.ceil(window.innerHeight / lineHeight) * cols * 3;
	    for (var i = 0; i < backgroundPizzas; i++) {
			var l = (i % cols) * lineHeight;
			var t = (Math.floor(i / cols) * lineHeight) + 'px';
			moverSelector[i] = PIZZA_FACTORY.createPizzaImg(l, t);
			movingPizza.appendChild(moverSelector[i]);
		}
	};

	var updatePositions = function() {
		var top = document.body.scrollTop / 1250;
		var j = 0;
		for (var i = 0, max = moverSelector.length; i < max; i++) {
		    var selector = moverSelector[i];
            var left = selector.basicLeft + 100 * Math.sin(top + j);
            selector.style.left = left + 'px';
            j = j == 4 ? 0 : j++;
		}
	};

	var resizePizzas = function(size) {
		var pizzaSize = PIZZA_FACTORY.pizzaSize(size);
		if(pizzaSize) {
			pizzaSizeSelector.innerHTML = pizzaSize.label;
			PIZZA_FACTORY.changePizzaSize(getContainer(), pizzaSize.size);
		}
    };
	return {
		"createAllPizzas": createAllPizzas,
		"generateSlidingPizzas": generateSlidingPizzas,
		"updatePositions": updatePositions,
		"resizePizzas": resizePizzas
	};
}());


var resizePizzas = function (size) {
	LOG_HELPER.measureTime(
	   "mark_start_resize", 
	   "mark_end_resize", 
	   "measure_pizza_resize",
       function() { MAIN.resizePizzas(size); },
       function(time) { 
          console.log("Time to resize pizzas: " + time[time.length - 1].duration + "ms")
       });
};

var updatePositions = function() {
	LOG_HELPER.measureTime(
	   "mark_start_frame", 
	   "mark_end_frame", 
	   "measure_frame_duration",
       function() {
       	  LOG_HELPER.incFrame();
       	  MAIN.updatePositions();
       },
       function(time) { LOG_HELPER.logAverageFrame(time); });
};

window.addEventListener('scroll', updatePositions);

document.addEventListener('DOMContentLoaded', function () {
	LOG_HELPER.measureTime(
	   "mark_start_generating", 
	   "mark_end_generating", 
	   "measure_pizza_generation",
       MAIN.createAllPizzas,
       function(time) { 
          console.log("Time to generate pizzas on load: " + time[0].duration + "ms"); 
       });

	MAIN.generateSlidingPizzas();
	updatePositions();
});