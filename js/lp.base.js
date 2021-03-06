/*
 * page base action
 */
LP.use(['jquery', 'api', 'easing', 'skrollr', 'flash-detect', 'hammer', 'transit', 'queryloader'] , function( $ , api ){
    'use strict'

    var isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > 0;
	var isIphone = navigator.userAgent.toLowerCase().indexOf('iphone') > 0;
    var isIpad = navigator.userAgent.toLowerCase().indexOf('ipad') > 0;
	var windWidth = $(window).width() - 90;

    if(isIpad) {
        $('body').addClass('ipad');
        $('meta[name=viewport]').attr('content','width=980, minimum-scale=1, maximum-scale=1, target-densityDpi=290,user-scalable=no');
    }

    if (navigator.userAgent.match(/IEMobile\/10\.0/)) {
        var msViewportStyle = document.createElement("style");
        msViewportStyle.appendChild(
            document.createTextNode(
                "@-ms-viewport{width:auto!important}"
            )
        );
        document.getElementsByTagName("head")[0].
            appendChild(msViewportStyle);
    }
    
    $(window).bind('orientationchange', function() {
        var o = window.orientation;
        if(!isIpad) {
            if (o != 90 && o != -90) {
                $('.turn_device').hide();
            } else {
                $('.turn_device').show();
            }
        }
        else {
            if (o != 90 && o != -90) {
                $('.turn_device').show();
            } else {
                $('.turn_device').hide();
            }
        }
    });

    $(window).trigger('orientationchange');


	var sideDirection;
    if($('html').hasClass('touch')) {
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
    }


    $('body').delegate('video','click',function(){
        $(this)[0].pause();
    });




  	$('.mobile_nav a').on('click', function(e){
		e.preventDefault();
        if($(this).hasClass('mshare')) return;
		LP.triggerAction('toggle_side_bar', 'left');
		var _this = $(this);
		setTimeout(function(){
			var href = _this.attr('href');
			window.location = href;
		}, 700);

	});


    if($('body').hasClass('video-page')) {
        if($('html').hasClass('video') && !isFirefox) {
            LP.compile( 'html5-player-template' , {} , function( html ){
                $('.page1video').html(html);
                if($(window).width() <= 640) {
                    $('.page1video video').attr('poster', './imgMobile/page1video.jpg');
					if(isIphone) {
						$('.page1video video').width(640).height(360);
					}
                }
                else {
                    LP.use('video-js' , function(){
                        videojs( "inner-video" , {}, function(){
                            if(getQueryString('video')) {
                                $('video').attr('autoplay','autoplay');
                            }
                            $('.vjs-big-play-button').on('click',function(){
                                $('video').attr('poster','');
                            });

                            $('video').on('ended', function(){
                                $('.vjs-poster').show();
                                $(window).trigger('resize');
                            });
                        });
                    });
                }
            });
        }
        else {
            if(getQueryString('video')) {
                LP.compile( 'flash-player-auto-template' , {} , function( html ){
                    $('.page1video').html(html);
                    var height = $(window).width()*0.9 / (1280/720);
                    $('.page1video').height(height);
                });
            }
            else {
                LP.compile( 'flash-player-template' , {} , function( html ){
                    $('.page1video').html(html);
                    var height = $(window).width()*0.9 / (1280/720);
                    $('.page1video').height(height);
                });
            }

        }
    }


    $(window).resize(function(){
        var height = $(window).width()*0.9 / (1280/720);
        $('.page1video, .vjs-poster').height(height);
    });


	LP.action('toggle_side_bar', function(type){
        if($(window).width() > 640) {
            return;
        }
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
        $(document.body).queryLoader2({
            onLoading : function( percentage ){
                var per = parseInt(percentage);
                $('.loading-percentage').html(per+'%');
                $('.loading-line').css({'width':per+'%'});
            },
            onComplete : function(){
                $('.hide-bar').hide();
                $('.page3-background-cover').delay(400).fadeOut();
                $('.page-wrap').fadeIn(600);
                $('.nav').fadeIn(600);
                $('.share').fadeIn(600);
                /* for animation */
                var isUglyIe = $.browser.msie && $.browser.version <= 8;
                if(isUglyIe && $('#scheme').length > 0)
                    return;
                var ANIMATE_NAME = "data-animate";
                $('[' + ANIMATE_NAME + ']')
                    .each(function(){
                        var $dom = $(this);
                        var tar = $dom.data('animate');
                        var browser = $dom.data('browser');
                        var style = $dom.data('style');
                        var time = parseInt( $dom.data('time') );
                        var delay = $dom.data('delay') || 0;
                        var easing = $dom.data('easing');
                        var begin = $dom.data('begin');
                        tar = tar.split(';');
                        var tarCss = {} , tmp;
                        if(browser == 'uglyie' && isUglyIe) {
                            return;
                        }
                        for (var i = tar.length - 1; i >= 0; i--) {
                            tmp = tar[i].split(':');
                            if( tmp.length == 2 )
                                tarCss[ tmp[0] ] = $.trim(tmp[1]);
                        }
                        if( isUglyIe && tarCss.opacity !== undefined ){
                            delete tarCss.opacity;
                        }


                        style = style.split(';');
                        var styleCss = {} , tmp;
                        for (var i = style.length - 1; i >= 0; i--) {
                            tmp = style[i].split(':');
                            if( tmp.length == 2 )
                                styleCss[ tmp[0] ] = $.trim(tmp[1]);
                        }
                        if( isUglyIe && styleCss.opacity !== undefined ){
                            delete styleCss.opacity;
                        }
                        $dom.css(styleCss).delay( delay )
                            .animate( tarCss , time , easing );
                        if( begin ){
                            setTimeout(function(){
                                animation_begins[begin].call( $dom );
                            } , delay);
                        }
                    });

                if($('html').hasClass('touch')) {
                    return;
                }
                var timeoffset = isUglyIe?0:0;
                setTimeout(function(){
                    var s = skrollr.init({
                        smoothScrollingDuration:200,
                        smoothScrolling:true
                    });

                },timeoffset);
            }
        });
    }

    if($(window).width() >= 640) {
        init();
        $('.header .logo img').ensureLoad(function(){
            $(this).fadeIn(1000);
        });
    }

    jQuery.fn.extend({
        ensureLoad: function(handler) {
            return this.each(function() {
                if(this.complete) {
                    handler.call(this);
                } else {
                    $(this).load(handler);
                }
            });
        }
    });


    function getQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]); return null;
    }


    $('.logo').click(function(){
        _smq.push(['custom','homepage','01Logo']);
        ga('send', 'custom', 'homepage', '01Logo', '01Logo');
    });

    $('.navlink1').click(function(){
        _smq.push(['custom','NAV','02video1']);
        ga('send', 'custom', 'NAV', '02video1', '02video1');
    });

    $('.navlink2').click(function(){
        _smq.push(['custom','NAV','03product1']);
        ga('send', 'custom', 'NAV', '03product1', '03product1');
    });

    $('.navlink3').click(function(){
        _smq.push(['custom','NAV','04countent1']);
        ga('send', 'custom', 'NAV', '04countent1', '04countent1');
    });

    $('.share a').eq(0).click(function(){
        _smq.push(['custom','SocialShare','05sina']);
        ga('send', 'custom', 'SocialShare', '05sina', '05sina');
    });

    $('.share a').eq(1).click(function(){
        _smq.push(['custom','SocialShare','06tencent']);
        ga('send', 'custom', 'SocialShare', '06tencent', '06tencent');
    });

    $('.share a').eq(2).click(function(){
        _smq.push(['custom','SocialShare','07wechat']);
        ga('send', 'custom', 'SocialShare', '07wechat', '07wechat');
    });

    $('.indexbtn').click(function(){
        _smq.push(['custom','homepage','08video2']);
        ga('send', 'custom', 'homepage', '08video2', '08video2');
    });

    $('.page1btn').click(function(){
        _smq.push(['custom','video1','10product2']);
        ga('send', 'custom', 'video1', '10product2', '10product2');
    });

    $('.page1video').click(function(){
        _smq.push(['custom','video1','09play']);
        ga('send', 'custom', 'video1', '09play', '09play');
    });

    $('.modintrobtn').click(function(){
        _smq.push(['custom','product1','11store']);
        ga('send', 'custom', 'product1', '11store', '11store');
    });

    $('.modintrobtn2').click(function(){
        _smq.push(['custom','product1','12huati']);
        ga('send', 'custom', 'product1', '12huati', '12huati');
    });

    $('.page3btn1').click(function(){
        _smq.push(['custom','countent1','13collection']);
        ga('send', 'custom', 'countent1', '13collection', '13collection');
    });

    $('.page3btn2').click(function(){
        _smq.push(['custom','countent1','14buy']);
        ga('send', 'custom', 'countent1', '14buy', '14buy');
    });


});


