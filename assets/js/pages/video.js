var video_playing = false;
var time_coordinates = [];
function init_acuity(data)
{
	var products = data.Products;
	var items = data.Items;
	// var time_coordinates = [];
	for(var p_id in products)
	{
		var product = products[p_id];
		var product_name = Object.keys(product)[0];
		var product_coordinates = product[ product_name ];
		// console.log(product_coordinates);

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
	console.log(time_coordinates);
}

function offsetCoordinates(coords, screenWidth, screenHeight)
{
	var offsetCoords = coords; /*	perform offset according to proportions	*/
	return offsetCoords;
}

$(document).ready(function(){
	init_acuity(chubbies_json);

	$('#video_wrapper').on('click', function(e){
		var video = $('#video');
		if(video_playing == false)
		{
			video_playing = true;
			video.trigger("play");
			// procPauser();
		}
		else
		{
			video_playing = false;
			video.trigger("pause");
			var currentTime = parseInt(video[0].currentTime * 24) ;
			// plotItems( video[0].currentTime, e);

			if( typeof time_coordinates[ currentTime ] != 'undefined')
			{
				findProduct(e, time_coordinates[ currentTime ], function(){
					video_playing = true;
					video.trigger("play");
				});
			}
			else
			{
				console.log('No item found');
			}
		}
	});


});

function plotItems(time, coords)
{
	console.log(time, parseInt(time * 24), coords);
}

function findProduct(e, products_json, callback)
{
	$('#products_wrapper').html("");
	for(var p_id in products_json)
	{
		var product = products_json[p_id];
		console.log(p_id, inside(e, product) );
		var template = '<div style="color: #fff; font-size: 28px; position:absolute; background: blue; left: '+ product.X1 +'px; top: '+ product.Y1 +'px; height: '+ (product.Y2 - product.Y1) +'px; width: '+ (product.X2 - product.X1) +'px;">X1 '+ (product.X1) +': Y1 '+ (product.Y1) +', X2 '+ (product.X2) +': Y2 '+ (product.Y2) +'</div>'
		$('#products_wrapper').append(template);

		if( inside(e, product) )
		{
			var confirm_add = confirm("Add "+ p_id +" to cart?");

			if(confirm_add)
			{
				if(typeof callback == "function")
				{
					callback();
				}
			}
			else
			{
				if(typeof callback == "function")
				{
					callback();
				}
			}
			return ;
		}

	}

	var pos = '<div style="color: #fff; font-size: 28px; position:absolute; background: red; border-radius:100%; left: '+ (parseInt(e.pageX) - 10) +'px; top: '+ (parseInt(e.pageY) - 10) +'px; height: 20px; width: 20px;"></div>';
	$('#products_wrapper').append(pos);
}

function inside(coord1, coord2) {
	return(	coord1.pageX > coord2.X1 && coord1.pageX < coord2.X2 &&
		coord1.pageY > coord2.Y1 && coord1.pageY < coord2.Y2);
}