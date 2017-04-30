(function($) {
	$(function() {
	  $('.js-select').styler();
	});
})(jQuery);

$('.search-form').submit(function(){
	alert( $(this).serialize() );
	return false;
});

function PopUpShow(id){
	var elem = id;
	console.log(elem);
    $(id).show();
}

function PopUpHide(id){
    $(id).hide();
}

$(".hamburger").click(function() {
  $(this).toggleClass("hamburger-open");
  $('.wrapper__blur').toggleClass("wrapper__blur-open");
});


$('.slider').slider({
	autoPlaySpeed: 3000,
	arrows: true,
	countSlideShow: 1,
	countSlideScroll : 1,
	autoPlay: true,
	infiniteLoop: false,
	enablePaginaton:true,
	nextText : '<a href="#" class="next-section"><p>След. раздел</p><p>Инфраструктура</p></a>',
	prevText : '<a href="#" class="prev-section"><p>Пред. раздел</p><p>Инфраструктура</p></a>'
});

$('.slider__communication').slider({
	autoPlaySpeed: 3000,
	arrows: true,
	countSlideShow: 1,
	countSlideScroll : 1,
	autoPlay: false,
	infiniteLoop: false,
	enablePaginaton:true,
	nextText : '',
	prevText : ''
});
