<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
	<meta charset="UTF-8">
	<meta content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0' name='viewport' />
	<title>Acuity</title>
	<link rel="stylesheet" href="./assets/css/style.css">
	<script src="./assets/js/vendor/jquery-3.2.1.min.js"></script>
	<script src="./assets/js/vendor/bootstrap/bootstrap.min.js"></script>
	<script src="./assets/js/vendor/moment.js"></script>
	<link rel="stylesheet" href="./assets/css/vendor/bootstrap/bootstrap.css">
</head>
<body>
	<script type="text/javascript">
		var chubbies_json = {};
		/*var prompt_password = prompt("Enter site password");

		$.post('check_password.php', {password : prompt_password} , function(data){
			if(data.status == false)
			{
				$('html').remove();
			}
		}, 'json');*/
	</script>
	<div id="wrapper">
		<div id="video_container">
			<div id="video_wrapper">
				<video id="video" preload="metadata" playsinline>
					<source src="assets/videos/chubbies-marshup-2017.mp4" type='video/mp4;'>
				</video>
				<div id="play_wrapper">
					<div id="play_button" class="glyphicon glyphicon-play"></div>
				</div>
				<div id="products_wrapper">
					<div id="line_layer"></div>
					<div id="cart_toggle_block">
						<input type="checkbox" id="cart_toggle_checkbox">
						<label for="cart_toggle_checkbox" id="toggle_color">
							<div id="products_cart" class="glyphicon glyphicon-shopping-cart">0</div>
						</label>
					</div>
					<div id="debugger">
						<div id="down"></div>
						<div id="has_dragged"></div>
					</div>
					<div id="products_container"></div>
					<div id="playback_container" class="active"></div>
				</div>
			</div>
		</div>
		<div class="modal" id="product_modal" tabindex="-1" role="dialog">
			<div class="modal-dialog" role="document">
				<div class="modal-content">
					<div class="modal-body">
						<span id="product_name"></span>
						<span class="price">
							<span class="price_tag"></span><span>$</span><span id="product_price"></span>
						</span>
					</div>
					<div class="modal-footer">
						<button type="button" class="btn btn-primary" id="add_to_cart" data-dismiss="modal">Add to Cart</button>
						<button type="button" class="btn btn-default" id="dismiss_cart" data-dismiss="modal">Dismiss</button>
					</div>
				</div>
			</div>
		</div>
		<div class="modal fade" id="checkout_modal" tabindex="-1" role="dialog">
			<div class="modal-dialog" role="document">
				<div class="modal-content">
					<div class="modal-header">
						<button type="button" class="btn btn-primary" id="checkout"><span class="glyphicon glyphicon-shopping-cart"></span> <span id="cart_items"></span> Checkout</button>
						<button type="button" class="btn btn-default" id="replay_button" data-dismiss="modal"><span class="glyphicon glyphicon-repeat"></span></button>
					</div>
					<div class="modal-body">
						In-video shopping powered by <strong>Acuity.ai</strong>
					</div>
				</div>
			</div>
		</div>
	</div>
	<div id="warning-message">
		<div id="mobile_message">This website is only viewable in landscape mode</div>
	</div>
	<script src="./assets/js/pages/video.js" type="text/javascript"></script>
	<script src="./assets/js/pages/chubbies_data_8.js" type="text/javascript"></script>
</body>
</html>