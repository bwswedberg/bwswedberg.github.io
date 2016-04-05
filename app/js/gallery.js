import PhotoSwipe from 'photoswipe';
import PhotoSwipeUI from 'photoswipe/dist/photoswipe-ui-default.js';

export function initPhotoSwipeFromDOM (gallerySelector) {
	function childNodesToArray (el) {
		const childNodes = [];
		for (let i = 0; i < el.childNodes.length; i += 1) {
			if (el.childNodes[i].nodeType === 1) {
				childNodes.push(el.childNodes[i]);
			}
		}
		return childNodes;
	}
    // parse slide data (url, title, size ...) from DOM elements
    // (children of gallerySelector)
	const parseThumbnailElements = function (el) {
		return childNodesToArray(el).map(function (figureEl) {
			const linkEl = figureEl.children[0];
			const size = linkEl.getAttribute('data-size').split('x');
			let title = '';
			let msrc = '';

			if (figureEl.children.length > 1) {
				// <figcaption> content
				title = figureEl.children[1].innerHTML;
			}

			if (linkEl.children.length > 0) {
				// <img> thumbnail element, retrieving thumbnail url
				msrc = linkEl.children[0].getAttribute('src');
			}

			return {
				el: figureEl,
				title: title,
				src: linkEl.getAttribute('href'),
				msrc: msrc,
				w: parseInt(size[0], 10),
				h: parseInt(size[1], 10)
			};
		});
	};

    // find nearest parent element
	function closest (el, fn) {
		return el && ( fn(el) ? el : closest(el.parentNode, fn) );
	}

	// parse picture index and gallery index from URL (#&pid=1&gid=2)
	const photoswipeParseHash = function () {
		const hash = window.location.hash.substring(1);
		const params = {};

		if (hash.length < 5) {
			return params;
		}

		const vars = hash.split('&');
		for (let i = 0; i < vars.length; i++) {
			if (!vars[i]) {
				continue;
			}
			const pair = vars[i].split('=');
			if (pair.length < 2) {
				continue;
			}
			params[pair[0]] = pair[1];
		}

		if (params.gid) {
			params.gid = parseInt(params.gid, 10);
		}

		return params;
	};

	const openPhotoSwipe = function (index, galleryElement, disableAnimation, fromUrl) {
		const pswpElement = document.querySelectorAll('.pswp')[0];

		const items = parseThumbnailElements(galleryElement);

        // define options (if needed)
		const options = {

			index: index, //parseInt(index, 10) - 1,

			shareEl: false,

            // define gallery index (for URL)
			galleryUID: galleryElement.getAttribute('data-pswp-uid'),

			getThumbBoundsFn: function (thumbIndex) {
                // See Options -> getThumbBoundsFn section of documentation for more info
				const thumbnail = items[thumbIndex].el.getElementsByTagName('img')[0];
				const pageYScroll = window.pageYOffset || document.documentElement.scrollTop;
				const rect = thumbnail.getBoundingClientRect();

				return {
					x: rect.left,
					y: rect.top + pageYScroll,
					w: rect.width
				};
			}

		};

		// PhotoSwipe opened from URL
		if (fromUrl) {
			if (options.galleryPIDs) {
				// parse real index when custom PIDs are used
				// http://photoswipe.com/documentation/faq.html#custom-pid-in-url
				for (let j = 0; j < items.length; j++) {
					if (items[j].pid === index) {
						options.index = j;
						break;
					}
				}
			} else {
				// in URL indexes start from 1
				options.index = parseInt(index, 10) - 1;
			}
		} else {
			options.index = parseInt(index, 10);
		}

        // exit if index not found
		if (isNaN(options.index)) {
			return;
		}

		if (disableAnimation) {
			options.showAnimationDuration = 0;
		}

        // Pass data to PhotoSwipe and initialize it
		const gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI, items, options);
		gallery.init();
	};

    // triggers when user clicks on thumbnail
	const onThumbnailsClick = function (e) {
		const event = e || window.event;

		if (event.preventDefault) {
			event.preventDefault();
		} else {
			event.returnValue = false;
		}

		const eventTarget = event.target || event.srcElement;

        // find root element of slide
		const clickedListItem = closest(eventTarget, function (el) {
			return (el.tagName && el.tagName.toUpperCase() === 'FIGURE');
		});

		if (!clickedListItem) {
			return;
		}

        // find index of clicked item by looping through all child nodes
        // alternatively, you may define index via data- attribute
		const itemIndex = childNodesToArray(clickedListItem.parentNode).indexOf(clickedListItem);

		if (itemIndex >= 0) {
            // open PhotoSwipe if valid index found
			openPhotoSwipe(itemIndex, clickedListItem.parentNode);
		}
		return;
	};

    // loop through all gallery elements and bind events
	const galleries = document.querySelectorAll(gallerySelector);
	for (let i = 0; i < galleries.length; i += 1) {
		galleries[i].setAttribute('data-pswp-uid', i + 1);
		galleries[i].onclick = onThumbnailsClick;
	}

	// Parse URL and open gallery if it contains #&pid=3&gid=1
	const hashData = photoswipeParseHash();
	if (hashData.pid && hashData.gid) {
		openPhotoSwipe(hashData.pid, galleries[hashData.gid - 1], true);
	}
}
