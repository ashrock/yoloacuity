<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
	<meta charset="UTF-8">
	<meta content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0' name='viewport' />
	<title>Acuity</title>
	<link rel="stylesheet" href="./assets/css/qrstyle.css">
	<script src="./assets/js/vendor/jquery-3.2.1.min.js"></script>
	<script src="./assets/js/vendor/bootstrap/bootstrap.min.js"></script>
	<script src="./assets/js/vendor/moment.js"></script>
	<script type="text/javascript" src="./assets/js/vendor/qrcode/qcode-decoder.min.js"></script>
	<script type="text/javascript" src="./assets/js/vendor/capture-video-frame.js"></script>
	<link rel="stylesheet" href="./assets/css/vendor/bootstrap/bootstrap.css">
</head>
<body>
	<script type="text/javascript">
		var chubbies_json = {};
	</script>
	<div id="wrapper">
		<div id="video_container">

			<div id="video_wrapper">
				<video id="video" preload="metadata" playsinline>
					<source src="assets/videos/chubbies-qr-online.mp4" type='video/mp4;'>
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
					<div id="qr_result_container">
						<div id="qr_result">Processing video...</div>
					</div>
				</div>
			</div>
		</div>
		<canvas id="qrcanvas" class=""></canvas>
		<canvas id="adjustment_canvas" class="hidden"></canvas>
		<div id="screenShots" class="hidden"></div>
		<img src="" alt="" id="qrscreenshot">
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
	<script src="./assets/js/pages/qrvideo.js" type="text/javascript"></script>
	<script src="./assets/js/pages/chubbies_data_8.js" type="text/javascript"></script>
	<script type="text/javascript">
		var video_ended = false;
		var show_qr_results = false;
		var video = document.getElementById("video");
		video.addEventListener("loadedmetadata", initScreenshot);
		var screenshot_array = [];
		var qr_results = [];

		var canvas = document.getElementById("qrcanvas");
		var adjustment_canvas = document.getElementById("adjustment_canvas");
		var ctx = canvas.getContext("2d");
		var adjustment_ctx = adjustment_canvas.getContext("2d");
		var videoHeight, videoWidth;
		var drawTimer = null;

		function initScreenshot() {
			console.log("Init Screenshot");
			videoHeight = video.videoHeight;
			videoWidth = video.videoWidth;
			canvas.width = 232;
			canvas.height = 232;
			adjustment_canvas.width = 232;
			adjustment_canvas.height = 232;
			processFrame();
		}

		var video_frames = [];
		var process_timeout = null;
		var frame_count = 0;

		var frame_rate = 24;
		function processFrame()
		{
			video.currentTime = frame_count/frame_rate;
			setTimeout(function(){
				ctx.drawImage(video, 0, 0, 1349, 759);

				adjustment_ctx.drawImage(video,0,0,1349,759);
				// Grab the pixel data from the backing canvas
				var idata = adjustment_ctx.getImageData(0,0,1349,759);
				var data = idata.data;
				// Loop through the pixels, turning them grayscale
				for(var i = 0; i < data.length; i+=4) {
				    var r = data[i];
				    var g = data[i+1];
				    var b = data[i+2];
				    var brightness = (3*r+4*g+b)>>>3;
				    data[i] = brightness;
				    data[i+1] = brightness;
				    data[i+2] = brightness;
				}
				idata.data = data;
				// Draw the pixels onto the visible canvas
				ctx.putImageData(idata,0,0);
				var dataUrl = canvas.toDataURL("image/jpeg",0.25);

				$('#screenShots').append('<img src="'+ dataUrl +'" alt="" id="'+ frame_count/frame_rate +'"/>');
				video_frames.push(dataUrl);

				if(frame_count/frame_rate >= video.duration)
				{
					decodeFrames();
					return;
				}

				frame_count++;
				process_timeout = setTimeout(processFrame, (1000/frame_rate));
			}, (1000/frame_rate));
		}

		function decodeFrames()
		{
			$('#qr_result').html('');
			var frame_count = 0;
			var total_frames = $('#screenShots').find('img').length;
			$('#screenShots').find('img').each(function(){
				var img_tag = $(this);
				var qr = new QCodeDecoder();

				if(frame_count == (total_frames - 1))
				{
					show_qr_results = true;
					video.currentTime = 0;
					console.log(qr_results);
					console.log('Video may now be played.');
					setTimeout(function(){
						video.play();
					}, 10);
					return;
				}
				frame_count++;

				qr.decodeFromImage(img_tag.attr('src'), function (err, result) {
					if (err) {
					}
					else
					{
						qr_results[ Math.round(img_tag.attr('id')) ] = result;
						console.log(img_tag, result);
					}
				});
			});
		}
	</script>
</body>
</html>