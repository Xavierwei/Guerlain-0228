/*
 * page base action
 */
LP.use(['jquery', 'api', 'easing', 'skrollr', 'flash-detect', 'hammer', 'transit'] , function( $ , api ){
    'use strict'

	var windWidth = $(window).width() - 90;

	var sideDirection;
	$('body').hammer()
		.on("release dragleft dragright swipeleft swiperight", function(ev) {
			switch(ev.type) {
				case 'swipeleft':
					break;
				case 'dragleft':
					sideDirection = 'right';
					$('body').bind('touchmove', function(e){e.preventDefault()});
					break;
				case 'swiperight':
					break;
				case 'dragright':
					sideDirection = 'left';
					$('body').bind('touchmove', function(e){e.preventDefault()});
					break;
				case 'release':
					$('body').unbind('touchmove');
					if(sideDirection && !$('.inner').is(':visible') || sideDirection == 'right' && !$('.side').hasClass('closed')) {
						if(Math.abs(ev.gesture.deltaX) < 160 && sideDirection == 'left') {
							return;
						}
						LP.triggerAction('toggle_side_bar', sideDirection);
						sideDirection = '';
					}
					break;
				default:
					sideDirection = '';
			}
		}
	);

    $('body').delegate('video','click',function(){
        $(this)[0].pause();
    })

	$('.mobile_nav a').on('click', function(e){
		e.preventDefault();
		LP.triggerAction('toggle_side_bar', 'left');
		var _this = $(this);
		setTimeout(function(){
			var href = _this.attr('href');
			window.location = href;
		}, 700);

	});


	LP.use('video-js' , function(){
		videojs( "inner-video" , {}, function(){
		});
	});

	LP.action('toggle_side_bar', function(type){
		var $side = $('.mobile_options');
		var $wrap = $('.wrap');
		if($side.hasClass('moving')) return;
		$side.addClass('moving');
		setTimeout(function(){
			$side.removeClass('moving');
		}, 800);
		if(typeof type == 'string') {
			if(type == 'right') {
				if(!$side.hasClass('closed')) return;
				$side.css({x:windWidth+3}).show().removeClass('closed').transit({x:0}, 500);
				$wrap.transit({x:-windWidth}, 500);
			}
			else {
				$side.addClass('closed').transit({x:windWidth+3}, 500);
				$wrap.transit({x:0}, 500);
			}
		}
		else {
			if($side.hasClass('closed')) {
				$side.css({x:windWidth+3}).show().removeClass('closed').transit({x:0}, 500);
				$wrap.transit({x:-windWidth}, 500);
			}
			else {
				$side.addClass('closed').transit({x:windWidth+3}, 500);
				$wrap.transit({x:0}, 500);
			}
		}
	});

	LP.action('toggle_share', function(){
		$('.mobile_share').fadeIn();
	});

    LP.action('open_more_info', function(){
        $('.page2share').fadeIn();
        $('.pop-rule').css({top:'-50%'}).fadeIn().dequeue().animate({top:'50%'}, 500, 'easeOutQuart');
    });

    LP.action('share_weixin', function(){
        $('.page2share').fadeIn();
        $('.pop-weixin').css({top:'-50%'}).fadeIn().dequeue().animate({top:'50%'}, 500, 'easeOutQuart');
    });

    LP.action('close_popup', function(){
        $('.page2share').fadeOut();
        $('.page2pop').fadeOut();
    });



    var init = function(){
        var s = skrollr.init({
            smoothScrollingDuration:200,
            smoothScrolling:true,
            easing:'outCubic'
        });
    }

    init();

});


