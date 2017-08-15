function detectmob()
{
	if( navigator.userAgent.match(/Android/i)
		|| navigator.userAgent.match(/webOS/i)
		|| navigator.userAgent.match(/iPhone/i)
		|| navigator.userAgent.match(/iPad/i)
		|| navigator.userAgent.match(/iPod/i)
		|| navigator.userAgent.match(/BlackBerry/i)
		|| navigator.userAgent.match(/Windows Phone/i)
	){
		return true;
	}
	else {
		return false;
	}
}
var isSafari = /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || (typeof safari !== 'undefined' && safari.pushNotification));
var iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
var video_playing = false;
var time_coordinates = [];
var items = [];
var cart_items = [];
var current_item = null;
var device_height = ((document.body.clientWidth / 16) * 9);
var device_width = document.body.clientWidth;
var allow_drag = false;
var mousedown = false;
var mouseX = 0;
var scrub_time = 0;
var video_started = false;
var mouseupX = 0;
var has_dragged = false;
var tap_width = device_width * 0.08;
var tap_radius = tap_width / 2;
var down_count = 0;
var down_timer = null;
var video_player = document.getElementById('video');
video_player.addEventListener('ended', function(){
	showCheckout();
});
video_player.addEventListener('playing', function(){
	video_playing = true;
	$('#play_wrapper').hide();
});
video_player.addEventListener('timeupdate', videoTimeUpdate, false);

function resume_playback()
{
	var video = $('#video');

	if(video_playing == false)
	{
		current_item = null;
		video_playing = true;
		$('#line_layer').removeClass('active');
		video.trigger("play");
		$('#products_container').html('');
	}
}

function update_cart_storage(localstorage_obj_index, cart_obj)
{
	if (typeof(Storage) !== "undefined")
	{
		localStorage.setItem(localstorage_obj_index, JSON.stringify(cart_obj) );
	} else {
		return null;
	}
}
$(document).ready(function(){
	device_height = ((document.body.clientWidth / 16) * 9);
	init_acuity(chubbies_json);
	$('#video_wrapper').css('height', device_height +"px");

	$('body').on('click','#dismiss_cart', resume_playback);

	$('body').on('click', '#add_to_cart', function(e){
		if(current_item != null)
		{
			cart_items.push(current_item);
			update_cart_storage("cart_obj", cart_items);
			$('#products_cart').text(cart_items.length);
			setTimeout(resume_playback, 10);
		}
	});

	$('body').on('click', '#replay_button', function(){
		var video = $('#video');
		video.trigger("load").trigger("play");
	});

	$('body').on('mousemove', detect_mousemove).on('touchmove', detect_mousemove);

	$('body').on('mousedown', detect_mousedown ).on('touchstart', detect_mousedown);

	$('body').on('mouseup', detect_mouseup).on('touchend', detect_mouseup);

});

function detect_mousemove(e){
	var video = $('#video');

	if(mousedown == true && allow_drag == true)
	{
		if(down_count < 6)
		{
			video_playing = true;
			video.trigger("play");
			return;
		}
		video[0].playbackRate = 0.25;

		video_playing = false;
		var pageX = (e.type == "touchmove") ? e.originalEvent.changedTouches[0].pageX : e.pageX;
		var move_left = ( mouseX >= pageX );
		var adjusted_scrub_time = scrub_time;
		var time_change = Math.abs( parseFloat(mouseX) - parseFloat(pageX) ) / device_width;
		video.trigger("pause");

		if(move_left)
		{
			adjusted_scrub_time -= (video[0].duration * time_change);
		}
		else
		{
			adjusted_scrub_time += (video[0].duration * time_change);
		}
		adjusted_scrub_time =parseFloat( (adjusted_scrub_time > 0) ? adjusted_scrub_time : 0 );
		video[0].currentTime = adjusted_scrub_time;
		$('#video').trigger("play");

		$('#playback_container').css('width', ((adjusted_scrub_time/video[0].duration) * 100) +"%" );

		if(e.type == "mousemove")
		{
			has_dragged = true;
		}
	}
}

function increment_count(){
	down_count++;
	down_timer = setTimeout(function(){
		increment_count();
	}, 10);
}

function detect_mousedown(e){
	var video = $('#video');
	var raw_current_time = video[0].currentTime;
	var currentTime = parseInt(raw_current_time * 24) ;
	increment_count();
	if( $(e.target).attr('id') == 'checkout' || $(e.target).hasClass('glyphicon-repeat') )
	{
		if($(e.target).attr('id') == 'checkout')
		{
			location.href = "/checkout.php";
		}

		return;
	}

	if(video[0].duration == raw_current_time)
	{
		return;
	}

	if(video_started == false)
	{
		video_playing = true;
		video_started = true;
		video.prop("volume", 0.25);
		video.trigger("play");
		update_cart_storage("cart_obj", null);
		return;
	}

	if(current_item != null)
	{
		return;
	}

	var has_item_match = checkForProducts(e, currentTime);
	if( has_item_match == false)
	{
		$('#playback_container').addClass('active');

		if(allow_drag == false)
		{
			allow_drag = true;
		}
	}
	else
	{
		allow_drag = false;
		video_playing = false;
		video.trigger("pause");
	}

	if(allow_drag)
	{
		e.stopPropagation();
		mousedown = true;
		var pageX = (e.type == "touchstart") ? e.originalEvent.changedTouches[0].pageX : e.pageX;
		mouseX = pageX;
		var video = $('#video');
		scrub_time = parseInt(video[0].currentTime);
	}
}
function detect_mouseup(e){
	down_count = 0;
	clearTimeout(down_timer);
	var video = $('#video');
	video[0].playbackRate = 1;
	var raw_current_time = video[0].currentTime;
	mousedown = false;
	mouseX = 0;
	$('#playback_container').removeClass('active');

	if(video[0].duration == raw_current_time)
	{
		return;
	}

	if( $(e.target).attr('id') == 'checkout' || $(e.target).hasClass('glyphicon-repeat') )
	{
		mousedown = false;
		allow_drag = false;

		if($(e.target).attr('id') == 'checkout')
		{
			location.href = "/checkout.php";
		}
		return;
	}

	if(e.type == "mouseup")
	{
		e.stopImmediatePropagation();
	}

	if(has_dragged)
	{
		$('#video').trigger("pause");
		has_dragged = false;
	}

	if(allow_drag)
	{
		allow_drag = false;
		video_playing = true;
		// $('#video').trigger("play");
	}
}


function checkForProducts(e, currentTime)
{
	if( typeof time_coordinates[ currentTime ] != 'undefined')
	{
		$('#product_name, #product_price, #products_container').html('');
		var currentProduct = findProduct(e, time_coordinates[ currentTime ]);
		$('#line_layer').removeClass('active');

		if(currentProduct != null)
		{
			$('#line_layer').addClass('active');
			$('#product_name').text(items[currentProduct].Name);
			$('#product_price').text(items[currentProduct].Price);
			current_item = items[currentProduct];

			$('#product_modal').modal({
				backdrop : 'static',
				keyboard : false
			}).modal('show');

			var modalWidth = device_width * 0.4;
			var line_width = device_width * 0.005;
			var lineX = (e.pageX > (device_width/2)) ? e.pageX - ((device_width*0.1)/2) : e.pageX + ((device_width*0.1)/2);
			var lineX1 = (e.pageX > (device_width/2)) ? lineX - line_width : lineX;
			var lineX2 = (e.pageX > (device_width/2)) ? lineX : lineX + line_width;

			// var modalX = (e.pageX > (device_width/2)) ? e.pageX - (modalWidth + ((device_width*0.1)/2)) : e.pageX + ((device_width*0.1)/2);
			var modalX = (e.pageX > (device_width/2)) ? (lineX1 - modalWidth) + line_width : lineX1;
			var modalY = e.pageY - (device_height * 0.4);
			modalY = (modalY <= 20) ? 20 : modalY;
			var css_options = {
				'width': modalWidth,
				'left': modalX +'px',
				'top':  modalY +'px',
			}

			$('#product_modal').find('.modal-dialog').css(css_options);
			var init_y = parseFloat(e.pageY) - tap_radius;
			var path = "polygon("+ e.pageX +"px "+ init_y +"px, "+ (parseFloat(e.pageX)-line_width) +"px "+ init_y +"px, "+ parseFloat(lineX1) +"px "+ parseFloat(modalY+50) +"px, "+ parseFloat(lineX2) +"px "+ parseFloat(modalY+50)+"px)";
			if(isSafari || iOS)
			{
				$('#line_layer').css("webkitClipPath", path );
			}
			else
			{
				$('#line_layer').css("clip-path", path );
			}

			return true;
		}
	}

	return false;
}

function videoTimeUpdate(e)
{
	//set controls settings to controls,this make controls show everytime this event is triggered
	// video_player.setAttribute("controls","controls");
}

function init_acuity(data)
{
	var products = data.Products;
	items = data.Items;
	// var time_coordinates = [];
	for(var p_id in products)
	{
		var product = products[p_id];
		var product_name = Object.keys(product)[0];
		var product_coordinates = product[ product_name ];

		for(var t_id in product_coordinates)
		{
			if(typeof time_coordinates[ product_coordinates[t_id].FrameNum ] == 'undefined')
			{
				time_coordinates[ product_coordinates[t_id].FrameNum ] = {};
			}

			if(!time_coordinates[ product_coordinates[t_id].FrameNum ].hasOwnProperty( product_name ))
			{
				time_coordinates[ product_coordinates[t_id].FrameNum ][ product_name ] = offsetCoordinates( product_coordinates[t_id] );
			}
		}
	}
}

function offsetCoordinates(coords)
{
	var offsetCoords = {
		"X1" : (coords.X1 / 1920).toFixed(2) * 100,
		"X2" : (coords.X2 / 1920).toFixed(2) * 100,
		"Y1" : (coords.Y1 / 1080).toFixed(2) * 100,
		"Y2" : (coords.Y2 / 1080).toFixed(2) * 100
	}
	return offsetCoords;
}

function showCheckout()
{
	video_playing = false;
	// var cart_text = (cart_items.length == 1) ? '1 item' : cart_items.length +' items';
	var cart_text = cart_items.length;
	$('#cart_items').text(cart_text);
	video_started = false;
	$('#checkout_modal').modal({
		backdrop : 'static',
		keyboard : false
	}).modal('show');
}

function findProduct(e, products_json)
{
	for(var p_id in products_json)
	{
		var product = products_json[p_id];

		if( inside(e, product) )
		{

			// var template = '<div style="position: absolute; left: '+ parseFloat(product.X1) +'%; top: '+ parseFloat(product.Y1) +'%; width: '+ (parseFloat(product.X2) - parseFloat(product.X1)) +'%; height: '+ (parseFloat(product.Y2) - parseFloat(product.Y1)) +'%; border: 2px solid yellow; z-index: 1500;"></div>';
			var template = '<div style="position: absolute; left: calc('+ e.pageX +'px - '+ tap_radius +'px); top: calc('+ e.pageY +'px - '+ tap_radius +'px); width: '+ tap_width +'px; height: '+ tap_width +'px; border: 4px solid white; background: rgba(255,255,255,0.5); border-radius: 100%; z-index: 1500;"></div>';
			$('#products_container').html(template);

			return p_id;
		}
	}

	return null;
}

function inside(coord1, coord2) {
	return(	coord1.pageX > ((coord2.X1 / 100) * document.body.clientWidth) && coord1.pageX < (coord2.X2 / 100) * document.body.clientWidth &&
		coord1.pageY > (coord2.Y1 / 100) * document.body.clientHeight && coord1.pageY < (coord2.Y2 / 100) * document.body.clientHeight);
}