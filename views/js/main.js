var MAIN = (function() {
	var pizzaFlavors = 100,
		randomPizzas = document.getElementById("randomPizzas"),
		movingPizza = document.querySelector("#movingPizzas1"),
		container = document.querySelectorAll(".randomPizzaContainer"),
		randomPizzas = document.querySelector("#randomPizzas"),
		pizzaSizeSelector = document.querySelector("#pizzaSize"),
		moverSelector = [];

	var createAllPizzas = function() {
		for (var i = 2; i < pizzaFlavors; i++) {
			randomPizzas.appendChild(PIZZA_FACTORY.createPizza(i));
		}
	};

	var generateSlidingPizzas = function() {
		for (var i = 0, cols = 8, s = 256; i < 200; i++) {
			var l = (i % cols) * s;
			var t = (Math.floor(i / cols) * s) + 'px';
			var pizzaImg = PIZZA_FACTORY.createPizzaImg(l, t);
			moverSelector.push(pizzaImg);
			movingPizza.appendChild(pizzaImg);
		}
	};

	var updatePositions = function() {
		var top = document.body.scrollTop / 1250;
		for (var i = 0, max = moverSelector.length; i < max; i++) {
			var selector = moverSelector[i];
			var phase = Math.sin(top + (i % 5));
			selector.style.left = selector.basicLeft + 100 * phase + 'px';
		}
	};

	var resizePizzas = function(size) {
		var pizzaSize = PIZZA_FACTORY.pizzaSize(size);
		if(pizzaSize) {
			pizzaSizeSelector.innerHTML = pizzaSize.label;
			PIZZA_FACTORY.changePizzaSize(pizzaSize.size, container, randomPizzas.offsetWidth);
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
       function(time) { console.log("Time to resize pizzas: " + time[0].duration + "ms")});
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
       function(time) { console.log("Time to generate pizzas on load: " + time[0].duration + "ms"); });

	MAIN.generateSlidingPizzas();
	updatePositions();
});