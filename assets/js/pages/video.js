var video_playing = false;
var time_coordinates = [];
var items = [];
var cart_items = [];
var current_item = null;
var device_height = ((document.body.clientWidth / 16) * 9);
var device_width = document.body.clientWidth;
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

	$('#video_wrapper').on('click', function(e){
		var video = $('#video');
		var currentTime = parseInt(video[0].currentTime * 24) ;

		if( checkForProducts(e, currentTime) == false)
		{
			$('#play_wrapper').hide();
			if(video_playing == false)
			{
				video_playing = true;
				video.trigger("play");
			}
		}
		else
		{
			video_playing = false;
			video.trigger("pause");
			// checkForProducts(e, currentTime);
		}

	});
});

function checkForProducts(e, currentTime)
{
	if( typeof time_coordinates[ currentTime ] != 'undefined')
	{
		$('#product_name, #product_price, #products_container').html('');
		var currentProduct = findProduct(e, time_coordinates[ currentTime ]);

		if(currentProduct != null)
		{
			$('#product_name').text(items[currentProduct].Name);
			$('#product_price').text(items[currentProduct].Price);
			current_item = items[currentProduct];

			$('#product_modal').modal({
				backdrop : 'static',
				keyboard : false
			}).modal('show');
			var modalWidth = 400;
			var modalX = (e.pageX > (device_width/2)) ? e.pageX - (modalWidth + ((device_width*0.1)/2)) : e.pageX + ((device_width*0.1)/2);
			var modalY = e.pageY - (device_height * 0.3);
			var css_options = {
				'width': modalWidth,
				'left': modalX +'px',
				'top': modalY +'px',
			}
			$('#product_modal').find('.modal-dialog').css(css_options);

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
			var tap_width = device_width * 0.1;
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