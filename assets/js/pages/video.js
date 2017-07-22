var video_playing = false;
var time_coordinates = [];
var items = [];
var cart_items = [];
var current_item = null;
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

$(document).ready(function(){
	console.log(screen.width, screen.height);
	init_acuity(chubbies_json);
	$('#product_modal').on('hidden.bs.modal', function (e) {
		var video = $('#video');

		if(video_playing == false)
		{
			current_item = null;
			video_playing = true;
			video.trigger("play");
		}

		console.log(cart_items);
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
		var rawTime = video[0].currentTime;
		var currentTime = parseInt(video[0].currentTime * 24) ;
		if(rawTime >= 4)
		{
			video[0].currentTime = 46.75;
			video_playing = true;
			video.trigger("play");
			return;
		}

		if(video_playing == false)
		{
			video_playing = true;
			video.trigger("play");
		}
		else
		{
			video_playing = false;
			video.trigger("pause");

			if( typeof time_coordinates[ currentTime ] != 'undefined')
			{
				var currentProduct = findProduct(e, time_coordinates[ currentTime ]);

				$('#product_name, #product_price').html('');
				if(currentProduct != null)
				{
					$('#product_name').text(items[currentProduct].Name);
					$('#product_price').text(items[currentProduct].Price);
					current_item = items[currentProduct];

					$('#product_modal').modal({
						backdrop : 'static',
						keyboard : false
					}).modal('show');
				}
			}
			else
			{
				console.log('No item found');
			}
		}
	});
});

function showCheckout()
{
	var cart_text = (cart_items.length == 1) ? '1 item' : cart_items.length +' items';
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
			return p_id;
		}
	}

	return null;
}

function inside(coord1, coord2) {
	return(	coord1.pageX > ((coord2.X1 / 100) * document.body.clientWidth) && coord1.pageX < (coord2.X2 / 100) * document.body.clientWidth &&
		coord1.pageY > (coord2.Y1 / 100) * document.body.clientHeight && coord1.pageY < (coord2.Y2 / 100) * document.body.clientHeight);
}