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
var drag_initiated = false;
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

var video_player =document.getElementById('video');
video_player.addEventListener('ended', function(){
	showCheckout();
});
video_player.addEventListener('playing', function(){
	video_playing = true;
	$('#play_wrapper').hide();
});
video_player.addEventListener('timeupdate', videoTimeUpdate, false);

function videoTimeUpdate(e)
{
	//set controls settings to controls,this make controls show everytime this event is triggered
	video_player.setAttribute("controls","controls");
}

$(document).ready(function(){
	device_height = ((document.body.clientWidth / 16) * 9);
	init_acuity(chubbies_json);
	$('#video_wrapper').css('height', device_height +"px");

	$('#product_modal').on('hidden.bs.modal', function (e) {
		var video = $('#video');

		if(video_playing == false)
		{
			current_item = null;
			video_playing = true;
			$('#line_layer').removeClass('active');
			video.trigger("play");
			$('#products_container').html('');
		}
	});

	$('body').on('click', '#add_to_cart', function(){
		if(current_item != null)
		{
			cart_items.push(current_item);
			$('#products_cart').text(cart_items.length);
		}
	});

	$('body').on('click', '#replay_button', function(){
		var video = $('#video');
		video.trigger("load").trigger("play");
	});

	$('body').on('click', '#video_wrapper', function(e){
		var video = $('#video');
		var currentTime = parseInt(video[0].currentTime * 24) ;

		if(video_started == false)
		{
			video_playing = true;
			video_started = true;
			video.trigger("play");
			return;
		}

		console.log('time: '+ currentTime);
		console.log('PREVIOUS STATE: allow_drag: '+ allow_drag, 'mousedown: '+ mousedown, 'drag_initiated: '+ drag_initiated);
		if(drag_initiated)
		{
			mousedown = false;
			drag_initiated = false;
			allow_drag = false;
			console.log('RESET STATE: allow_drag: '+ allow_drag, 'mousedown: '+ mousedown, 'drag_initiated: '+ drag_initiated);
			return;
		}
		var item_match = checkForProducts(e, currentTime);
		console.log('has match: '+ item_match);

		if( item_match == false)
		{
			if(allow_drag == false)
			{
				allow_drag = true;
				video_playing = false;
				video.trigger("pause");
				console.log('TRIGGER STATE: allow_drag: '+ allow_drag, 'mousedown: '+ mousedown, 'drag_initiated: '+ drag_initiated)
			}
			else
			{
				$('#play_wrapper').hide();
				if(video_playing == false)
				{
					allow_drag = false;
					video_playing = true;
					video.trigger("play");
					console.log('TRIGGER STATE 2: allow_drag: '+ allow_drag, 'mousedown: '+ mousedown, 'drag_initiated: '+ drag_initiated)
					return;
				}
				console.log('TRIGGER STATE 3: allow_drag: '+ allow_drag, 'mousedown: '+ mousedown, 'drag_initiated: '+ drag_initiated)
			}
		}
		else
		{
			allow_drag = false;
			video_playing = false;
			video.trigger("pause");
		}
	});

	$('body').on('mousemove',function(e){
		if(mousedown == true && allow_drag == true)
		{
			e.stopPropagation();
			var pageX = (e.type == "touchmove") ? e.originalEvent.changedTouches[0].pageX : e.pageX;
			var move_left = ( mouseX >= pageX );
			var adjusted_scrub_time = scrub_time;
			var time_change = Math.abs( parseInt(mouseX) - parseInt(pageX) ) / device_width;
			var video = $('#video');
			if(move_left)
			{
				adjusted_scrub_time -= (video[0].duration * time_change);
			}
			else
			{
				adjusted_scrub_time += (video[0].duration * time_change);
			}

			video[0].currentTime = adjusted_scrub_time;
			drag_initiated = true;
		}
	}).on('touchmove',function(e){
		if(mousedown == true && allow_drag == true)
		{
			var pageX = (e.type == "touchmove") ? e.originalEvent.changedTouches[0].pageX : e.pageX;
			var move_left = ( mouseX >= pageX );
			var adjusted_scrub_time = scrub_time;
			var time_change = Math.abs( parseInt(mouseX) - parseInt(pageX) ) / device_width;
			var video = $('#video');
			if(move_left)
			{
				adjusted_scrub_time -= (video[0].duration * time_change);
			}
			else
			{
				adjusted_scrub_time += (video[0].duration * time_change);
			}

			video[0].currentTime = adjusted_scrub_time;
			drag_initiated = true;
		}
	});

	$('body').on('mousedown',function(e){
		if(allow_drag)
		{
			e.stopPropagation();
			mousedown = true;
			var pageX = (e.type == "touchstart") ? e.originalEvent.changedTouches[0].pageX : e.pageX;
			mouseX = pageX;
			var video = $('#video');
			scrub_time = parseInt(video[0].currentTime);
		}
	}).on('touchstart',function(e){
		if(allow_drag)
		{
			e.stopPropagation();
			mousedown = true;
			var pageX = (e.type == "touchstart") ? e.originalEvent.changedTouches[0].pageX : e.pageX;
			mouseX = pageX;
			var video = $('#video');
			scrub_time = parseInt(video[0].currentTime);
		}
	});

	$('body').on('mouseup',function(e){
		if(allow_drag)
		{
			e.stopPropagation();
			mousedown = false;
			mouseX = 0;
		}
	}).on('touchend',function(e){
		e.stopPropagation();
		mousedown = false;
		mouseX = 0;
	});

});

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

			var line_width = device_width * 0.008;
			var modalWidth = 300;
			var modalX = (e.pageX > (device_width/2)) ? e.pageX - (modalWidth + ((device_width*0.1)/2)) : e.pageX + ((device_width*0.1)/2);
			var lineX = (e.pageX > (device_width/2)) ? e.pageX - ((device_width*0.1)/2) : e.pageX + ((device_width*0.1)/2);
			var modalY = e.pageY - (device_height * 0.4);
			modalY = (modalY <= 20) ? 20 : modalY;
			var css_options = {
				'width': modalWidth,
				'left': modalX +'px',
				'top':  modalY +'px',
			}

			var lineX1 = (e.pageX > (device_width/2)) ? lineX - line_width : lineX;
			var lineX2 = (e.pageX > (device_width/2)) ? lineX : lineX + line_width;
			$('#product_modal').find('.modal-dialog').css(css_options);
			var path = "polygon("+ e.pageX +"px "+ e.pageY +"px, "+ (parseFloat(e.pageX)-line_width) +"px "+ (parseFloat(e.pageY)) +"px, "+ parseFloat(lineX1) +"px "+ parseFloat(modalY+25) +"px, "+ parseFloat(lineX2) +"px "+ parseFloat(modalY+25)+"px)";
			$('#line_layer').css("clip-path", path );

			return true;
		}
	}

	return false;
}

function showCheckout()
{
	video_playing = false;
	// var cart_text = (cart_items.length == 1) ? '1 item' : cart_items.length +' items';
	var cart_text = cart_items.length;
	$('#cart_items').text(cart_text);

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
			var tap_width = device_width * 0.08;
			var tap_radius = tap_width / 2;
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