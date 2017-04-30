(function($) {
	$.slider = function(slider, options) {
		var element = this;
		element.options = option = $.extend({}, $.slider.defaults, options);

		// initial conditions

		var infiniteLoop = option.infiniteLoop;
		var slideVisible 	= option.slideVisible;
		var slideToScroll = option.slideToScroll;
		var arrows = option.arrows;
		var enablePaginaton = option.enablePaginaton;
		var autoPlay = option.autoPlay;
		var autoPlaySpeed = option.autoPlaySpeed;
		var slidePosition = option.index;
		var prevText = option.prevText;
		var nextText = option.nextText;

		// create DOM
		$(slider).wrap('<div class="wrapper__slider"></div>');
		var parentSlider = $(slider).parent();
		var parentSlides = parentSlider.children('ul');
		parentSlider.wrap('<div class="parentSlider"></div>');
		var slider = parentSlider.parent();
		var slides = parentSlides.children('li');
		var pagination;
		var slidesPagination;

		var countSlides = slides.length;
		var widthSlide = slides.innerWidth();
		var widthSlider;
		var heightSlide = slides.height();
		var parentSlidesWidth = parentSlides.innerWidth();
		var relativeWidthSlide = (100/countSlides);
		slides.css('width', relativeWidthSlide+'%');

		var slidePositionOrigin = 1;
		var countSlidesOrigin = countSlides;

		var autoPlayTimer;
		var copyLastItem = false;

		var multipleSlideShow = (slideVisible > 1)? true : false;

		//initialization plugin
		element.initSlider = function() {
			if (arrows && countSlides > slideVisible) {
				slider.append('<div class="arrow-prev slider-arrow">' + prevText + '</div><div class="arrow-next slider-arrow">' + nextText + '</div>');
				var prev = slider.children('.arrow-prev');
				var next = slider.children('.arrow-next');

				next.on('click', function(e){
					element.nextSlide();
					e.preventDefault();
				});

				prev.on('click', function(e){
					if (multipleSlideShow) {
						if (slidePosition <= 1) {
							parentSlides.animate({'left':-(parentSlidesWidth-(widthSlide*slideToScroll))}, 'slow', function(){});
							slidePosition = countSlides-2;
							element.updatePagination();
						} else {
							element.moveToPrev();
						}
					} else {
						if (slidePosition <= 1) {
							parentSlides.animate({'left':-(parentSlidesWidth-(widthSlide*slideToScroll))}, 'slow', function(){});
							slidePosition = countSlides;
							element.updatePagination();
						} else {
							element.moveToPrev();
						}
					}
					e.preventDefault();
					element.autoPlay();
				});
			}
            
			if (enablePaginaton ) {
				slider.append('<ul class="slider__pagination"></ul>');
				slidesPagination = slider.children('.slider__pagination');
				slides.each(function(i){
					var classPagination = 'sliderPaginationItem';
					if (i == 0 || (multipleSlideShow && i-slideVisible  <= -1)) classPagination = 'active';
						slidesPagination.append('<li class="'+ classPagination +'"></li>');
					})

				slidesPagination.children('li').on('click', function(){
					element.goToSlide(slidesPagination.children().index($(this)));
				})
			}

			if (infiniteLoop) {
				$('.wrapper__slider ul li:first').before($('.wrapper__slider ul li:last'));
				if (countSlides == slideVisible+1) {
					$('.wrapper__slider ul li:last').after($('.wrapper__slider ul li:first').clone());
					slides = parentSlides.children('li');
					countSlides = slides.length;
					relativeWidthSlide = (100/countSlides);
					slides.css('width', relativeWidthSlide+'%');
					copyLastItem = true;
				}
				slidePosition = 2;
			}

			if (autoPlay) {
				element.autoPlay();
			}

			element.updateSlider();
		}

		element.autoPlay = function(){
			if (autoPlay) {
				clearInterval(autoPlayTimer);
				autoPlayTimer = setInterval(function(){
					element.nextSlide();
				}, autoPlaySpeed);
			}
		}

		element.autoPlayStop = function(){
			clearInterval(autoPlayTimer);
		}	

		element.nextSlide = function(){
			if (autoPlay) element.autoPlayStop();
			if (multipleSlideShow) {
				if (slidePosition >= countSlides-(slideVisible-1)) {
					parentSlides.animate({'left':'0'}, 'slow');
					slidePosition = 1;
					element.updatePagination();
				} else {
					element.moveToNext();
				}
			} else {
				if (slidePosition >= countSlides) {
					parentSlides.animate({'left':'0'}, 'slow');
					slidePosition = 1;
					element.updatePagination();
				} else {
					element.moveToNext();
				}
			}
			element.updatePagination();
			element.autoPlay();
		}

		element.moveToNext = function() {
			parentSlides.animate({'left':'-=' +slideToScroll*widthSlide}, 'slow', function(){
				if (infiniteLoop) {
					if (copyLastItem) {
						$('.wrapper__slider ul li:last').after($('.wrapper__slider ul li').eq(1));
					} else {
						$('.wrapper__slider ul li:last').after($('.wrapper__slider ul li:first'));
					}
					parentSlides.css({'left':'-'+slideToScroll*widthSlide+'px'});
					slidePosition = 1;
					slidePositionOrigin++;
					if (slidePositionOrigin > countSlidesOrigin) {
						slidePositionOrigin = 1;
					}
				}
				slidePosition++;
			
				element.updatePagination();
			});
		}

		element.moveToPrev = function() {
			parentSlides.animate({'left':'+='+widthSlide*slideToScroll}, 'slow', function(){
				if (infiniteLoop) {
					if (copyLastItem) {
						$('.wrapper__slider ul li:first').before($('.wrapper__slider ul li').eq(countSlides-2));
					} else {
						$('.wrapper__slider ul li:first').before($('.wrapper__slider ul li:last'));
					}
					parentSlides.css({'left':'-'+widthSlide*slideToScroll+'px'});
					slidePosition = 3;
				}
				slidePosition--;
				slidePositionOrigin--;
				if (slidePositionOrigin < 1) {
					slidePositionOrigin = countSlidesOrigin;
				}
				element.updatePagination();
			});
		}

		element.goToSlide = function(countSlide){
			var countSlide;
			if (autoPlay) element.autoPlayStop();
			if (multipleSlideShow) {
				if (infiniteLoop) {
					element.goToSlideInifinite(countSlide);
				} else {
					if (countSlide>(countSlidesOrigin-slideVisibleOrigin)) {
						var pos = (countSlidesOrigin-slideVisibleOrigin);
						slidePosition = pos + 1;
						slidePositionOrigin = pos+1;
					} else {
						slidePosition = countSlide+1;
						slidePositionOrigin = countSlide+1;
					}
					parentSlides.animate({'left':-(widthSlide*slideToScroll*(slidePosition-1))}, 'slow');
				}
			} else {
				if (infiniteLoop) {
					element.goToSlideInifinite(countSlide);
				} else {
					slidePosition = countSlide + 1;
					slidePositionOrigin = countSlide + 1;
					parentSlides.animate({'left':-(widthSlide*slideToScroll*(slidePosition-1))}, 'slow');
				}
			}
			element.updatePagination();
			element.autoPlay();
		}

		element.goToSlideInifinite = function(countSlide){
			var countSlide;
			var delay = (countSlide+1)-slidePositionOrigin;
			if (delay < 0) {
				if (delay < -1) {
					if (slidePositionOrigin == countSlidesOrigin && delay == (0-(countSlidesOrigin-1))) {
						element.nextSlide();
					} else {
						for (var j=-1; j>=delay; j--) {
							element.moveToPrev();
						}
					}
				} else {
					element.moveToPrev();
				}
			} else {
				if (delay > 1) {
					if (slidePositionOrigin == 1 && delay == (countSlidesOrigin-1)) {
						element.moveToPrev();
					} else {
						for (var j=1; j<=delay; j++) {
							element.nextSlide();
						}
					}
				} else {
					element.nextSlide();
				}
			}
		}

		element.updatePagination = function(){
			pagination = slider.children('.slider__pagination').children('li');
			pagination.removeClass('active');
			if (enablePaginaton) {
				slides = parentSlides.children('li');
				var positionpagination = slidePosition-1;
				if (multipleSlideShow) {
					if (infiniteLoop) {
						var posSlide = slidePositionOrigin-1;
						var resteSlide = ((slidePositionOrigin-1)+slideVisible)-countSlidesOrigin;
						for(var pos=0; pos < slideVisible; pos++) {
							pagination.children().eq(posSlide+pos).addClass('active');
						}
						if (resteSlide > 0) {
							for(var pos=0;pos<resteSlide;pos++) {
								pagination.children().eq(pos).addClass('active');
							}
						}
					} else {
						for(var pos=0;pos<slideVisible;pos++) {
							pagination.children().eq(positionpagination+pos).addClass('active');
						}
					}
				} else {
					if (infiniteLoop) {
						pagination.eq(slidePositionOrigin-1).addClass('active');
					} else {
						pagination.eq(positionpagination).addClass('active');
					} 
				}
			}
		}

		element.updateSlider = function(){
			slides = parentSlides.children('li');
			widthSlide = slides.innerWidth();
			heightSlide = slides.height();
			widthSlider = widthSlide*slideVisible;
			parentSlider.width(widthSlider);
			parentSlider.height(heightSlide);

			if (multipleSlideShow) {
				if (slidePosition >= countSlides-(slideVisible-1)) {
					positionParentSlides = -(parentSlidesWidth-(widthSlide*slideVisible));
				} else {
					positionParentSlides = -(widthSlide*(slidePosition-1));
				}
			} else {
				positionParentSlides = -(widthSlide*(slidePosition-1));
			}
			parentSlides.css({'left':positionParentSlides});
		}
				
		element.initSlider();

		$(window).on("resize", function(){
			element.updateSlider();
		});
	}

	$.slider.defaults = {
		autoPlaySpeed	: 5000,
		slideVisible 	: 1,
		arrows          : false,
		slideToScroll: 1,
		autoPlay 		: false,
		infiniteLoop 	: false,
		enablePaginaton: true,
		nextText : '',
		prevText : '',
		index : 1
	};

	$.fn.slider = function(options, callback) {
		return this.each(function(){
			new $.slider(this, options);
		});
	};
})(jQuery);