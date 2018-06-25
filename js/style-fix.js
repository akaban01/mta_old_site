function ieFixes() {
	var isMSIE = '\v' == 'v';
	if (isMSIE) {
		var isResized = false;
		if (screen.systemXDPI === undefined) { //ie < 8
			var rect = document.body.getBoundingClientRect();
			isResized = (rect.right - rect.left) != document.body.clientWidth;
		} else { //ie > 7
			isResized = 96 != screen.deviceXDPI;
		}
		if (isResized) {
			var style_node = document.createElement("style");
			style_node.setAttribute("type", "text/css");
			style_node.setAttribute("media", "screen");

			if (document.styleSheets && document.styleSheets.length > 0) {
				var last_style_node = document.styleSheets[document.styleSheets.length - 1];
				if (typeof(last_style_node.addRule) == "object") {
					last_style_node.addRule('.background', 'filter: none !important;');
				}
			}
		}
	}
}

function getView() {
	var cookie = getCookie('deviceView'),
		isMobile;

	if (window.mobileOptimizationsEnabled) {
		if (cookie) {
			isMobile = cookie == 'mobile';
		} else {
			isMobile = isMobileDevice();
		}
	}

	return isMobile ? 'mobile' : 'desktop';
}

function toggleDeviceView() {
	if (getView() == 'mobile') {
		setCookie('deviceView', 'desktop', 365, true);
	} else {
		setCookie('deviceView', 'mobile', 365, true);
	}

	location.reload();
}

function isMobileDevice() {
	var isMobile = false,
		htmlTagClasses = css_browser_selector(navigator.userAgent),
		resolution,
		mobileResolution = 640; //iPhone

	if (htmlTagClasses.indexOf('mobile') > -1) {
		isMobile = true;
	}

	// Set opera mobile as mobile device.
	if (htmlTagClasses.indexOf('opera') > -1 && htmlTagClasses.indexOf('linux') > -1) {
		isMobile = true;
	}

	if (window.outerHeight) {
		resolution = Math.min(window.outerHeight, window.outerWidth);

		// Set large devices as desktop.
		if (isMobile && resolution > mobileResolution) {
			isMobile = false;
		}
	}

	return isMobile;
}

function showMobileView($) {
	var meta,
		html = $('html');

	// Add viewport meta tag for mobile browsers
	if (!$('meta[name="viewport"]').length) {
		meta = document.createElement('meta');
		meta.name = 'viewport';
		meta.content = 'width=device-width, initial-scale=1, user-scalable=1';
		document.getElementsByTagName('head')[0].appendChild(meta);
	}

	html.addClass('mobile-view');

	// set content before sidebars
	var contentNode = document.getElementById('content');
	contentNode.parentNode.insertBefore(contentNode, contentNode.parentNode.firstChild);

	// Attach mobile navigation to content
	$('ul.navigation a:not([href*="#"])').each(function() {
		var $this = $(this),
			linkPath = $this.attr('href');
		$this.attr('href', linkPath + '#content-content-inner');
	});

	// Some mobile browsers don't handle anchor links. We should force scrolling.
	if (window.location.hash) {
		html.animate({
			scrollTop: $(window.location.hash).offset().top
		}, 750);
	}

	$('.mobile-view-switcher').html(window.mobileSwitcherText);
}

function showDesktopView($) {
	window.fixWatermarkHeightId = $.startFixWatermarkHeight();

	if (typeof fixHeightColumns !== 'undefined' && fixHeightColumns) {
		window.fixWHeightColumnsId = $.startFixHeightColumns();
	}

	$('.mobile-view-switcher').html(window.desktopSwitcherText);
}

function showMobileSwitcher($) {
	$('.mobile-view-switcher')
		.show()
		.click(function (e) {
			e.preventDefault();
			toggleDeviceView();
		});
}

(function($) {
	$(function() {
		if (getView() == 'mobile') {
			showMobileView($);
		} else {
			ieFixes();
			showDesktopView($);
		}

		if (window.mobileOptimizationsEnabled && isMobileDevice()) {
			showMobileSwitcher($);
		}
	});
})(siteBuilderJs);