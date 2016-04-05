// import style root
require('./styles/main.scss');

// impory js modules
import * as gallery from './js/gallery.js';

import * as nav from './js/nav.js';

// init gallery
gallery.initPhotoSwipeFromDOM('.gallery');

nav.init({
	navbarId: 'navbar',
	navbarOptionsId: 'navbar-menu-options',
	toggleButtonId: 'navbar-menu-icon'
});
