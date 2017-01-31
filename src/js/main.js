$(document).ready(function() {

	var windowWidth = document.body.clientWidth;

	// Responsive dropdown navigation menu

	// Toggle navigation menu for small devices
	$('.nav-toggle').click(function(e) {
		e.preventDefault();
		
		$('.navigation').toggleClass('visible');
	});

	adjustMenu(windowWidth);

	// Responsive search field
	adjustSearch(windowWidth);

	
	// Catalogue dropdown menu
	$('.catalogue .dropdown > a').click(function(e) {
		e.preventDefault();
		
		var caret = $(this).find('.caret').children();
		if (caret.hasClass('fa-caret-right')) {
			caret.removeClass('fa-caret-right');
			caret.addClass('fa-caret-down');
		} else if (caret.hasClass('fa-caret-down')) {
			caret.removeClass('fa-caret-down');
			caret.addClass('fa-caret-right');
		}

		$(this).next('.dropdown-menu')
			.slideToggle(300)
			.parent()
			.toggleClass('expanded');

		$(document).on('vmouseup', function(e) {
			var	expanded = $('.catalogue .dropdown.expanded');
			hideDropdown(e, expanded, caret);
		});
	});

	// Catalogue toggle for small devices
	var catalogueToggle = $('.catalogue-toggle');
	var catalogue = $('.catalogue');

	catalogueToggle.click(function() {
		if ($(this).hasClass('open')) {
			catalogue.animate({left: '-263px'}, 400);
			catalogueToggle.animate({
				left: 0,
				zIndex: 1
			}, 400);
			catalogueToggle.removeClass('open');
		} else {
			catalogue.animate({left: 0}, 400);
			catalogueToggle.animate({
				left: '263px',
				zIndex: 20
			}, 400);
			catalogueToggle.addClass('open');
		}
	});
});

$(window).load(function() {
   $('.flexslider').flexslider({
   	animation: "slide",
   	controlsContainer: $(".custom-controls-container"),
    customDirectionNav: $(".custom-navigation a")
   });

	// Slider categories
	$('.slider-menu .category').hover(function() {
		$(this)
			.find('.category-description')
			.stop(false, true)
			.fadeIn(300);
	}, function() {
		$(this)
			.find('.category-description')
			.stop(false, true)
			.fadeOut(300);
	});
 });

$(window).on('resize orientationchange', function() {
	windowWidth = document.body.clientWidth;
	adjustMenu(windowWidth);
	adjustSearch(windowWidth);
});

function adjustMenu(windowWidth) {
	
	var dropdownToggle = $('.navigation .dropdown');

	if (windowWidth < 992) {
		// Dropdown navigation menu for small devices
		dropdownToggle.off('mouseenter mouseleave')
		
		dropdownToggle
			.children('a')
			.off('click') // preventing of the multiple 
										// event handler attaching 
										// when the window resize
			.on('click', function(e) {
				e.preventDefault();

				$(this)
					.next('.dropdown-menu')
					.slideToggle(300)
					.parent()
					.toggleClass('expanded');		
			});

		$(document).on('vmouseup', function(e) {
			var	expanded = $('.navigation .dropdown.expanded');
			hideDropdown(e, expanded);
		});
      
	} else {
		// Dropdown navigation menu for desktops
		dropdownToggle.children('a').off('click');

		dropdownToggle
			.off('mouseenter mouseleave') // preventing of the multiple 
																		// event handler attaching 
																		// when the window resize
			.on('mouseenter', function() {
				$(this)
					.children('.dropdown-menu')
					.stop(false, true)
					.fadeIn(300);
			})
			.on('mouseleave', function() {
				$(this)
					.children('.dropdown-menu')
					.stop(false, true)
					.fadeOut(300);
			});
	}
}

function hideDropdown(event, expanded, caret) {
	caret = caret || [];

	if (!expanded.is(event.target) 
		&& (!expanded.has(event.target).length)) {

		expanded
			.removeClass('expanded')
			.children('.dropdown-menu')
			.slideUp(300);

		if (caret.length) {
			caret.removeClass('fa-caret-down');
			caret.addClass('fa-caret-right');
		}
	}
}

function adjustSearch(windowWidth) {
	if (windowWidth < 992) {
		// Expanding search field

		var submitIcon = $('.search-icon');
		var inputBox = $('.search-input');
		var searchForm = $('.search-form');
		var isOpen = searchForm.hasClass('open');
		
		submitIcon
			.off('click') // preventing of the multiple 
										// event handler attaching 
										// when the window resize
			.on('click', function() {
				if(!isOpen) {
					searchForm.addClass('open');
		      inputBox.val('');
					inputBox.focus();
					submitIcon
						.addClass('active')
						.children()
						.removeClass('fa-search')
						.addClass('fa-times');
					isOpen = true;
				}
				else {
					searchForm.removeClass('open');
					inputBox.val('');
					inputBox.blur();
					submitIcon
						.removeClass('active')
						.children()
						.removeClass('fa-times')
						.addClass('fa-search');
					isOpen = false;
				}
			});

		// Hide the search icon and
		// activate the submit button
		// when enter text to the search input
	  inputBox.keyup(function() {
	    var inputVal = inputBox.val();
	    inputVal = $.trim(inputVal).length;

	    if(inputVal) {
	      submitIcon.addClass('disabled');
	    } 
	    else {
	      inputBox.val('');
	      submitIcon.removeClass('disabled');
	    }
	  });

	  // Collapse the search form
	  // when click to any other page area
		$(document).on('vmouseup', function(e) {
	    if (!(searchForm.is(e.target))
	        && (!searchForm.has(e.target).length)
	        && isOpen) {
	      submitIcon.removeClass('disabled');
	      submitIcon.click();
	    }
	  });
	}
}