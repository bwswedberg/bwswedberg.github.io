import gumshoe from 'gumshoe/dist/js/gumshoe.js';
import Velocity from 'velocity-animate';
require('velocity-animate/velocity.ui.js'); // no namespace

function showMenu (options) {
	const toggleButton = document.getElementById(options.toggleButtonId);
	const navbarOptions = document.getElementById(options.navbarOptionsId);

	Velocity(navbarOptions, 'transition.slideDownIn', {duration: 500, display: 'inline-block'});
	//Velocity(toggleButton, {duration: 500, opacity: 0.1});
}

function hideMenu (options) {
	const toggleButton = document.getElementById(options.toggleButtonId);
	const navbarOptions = document.getElementById(options.navbarOptionsId);

	Velocity(navbarOptions, 'transition.slideUpOut', {duration: 500, display: 'none'});
	//Velocity(toggleButton, {duration: 500, opacity: 1});
}

function initToggleMenu (options) {
	const toggleButton = document.getElementById(options.toggleButtonId);
	const navbarOptions = document.getElementById(options.navbarOptionsId);

	toggleButton.addEventListener('click', function (event) {
		event.preventDefault();
		if (navbarOptions.style.display !== 'none') {
			hideMenu(options);
		} else {
			showMenu(options);
		}
	});
}

export function init (options) {
	initToggleMenu(options);

	// add listener to menu buttons for show and hide
	gumshoe.init({offset: 20});
}
