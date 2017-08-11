<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Document</title>
	<meta charset="UTF-8">
	<meta content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0' name='viewport' />
	<title>Acuity | Checkout</title>
	<link rel="stylesheet" href="./assets/css/vendor/bootstrap/bootstrap.css">
	<link rel="stylesheet" href="./assets/css/style.css">
	<link rel="stylesheet" href="./assets/css/checkout.css">
	<script src="./assets/js/vendor/jquery-3.2.1.min.js"></script>
	<script src="./assets/js/vendor/bootstrap/bootstrap.min.js"></script>
	<script src="./assets/js/vendor/moment.js"></script>
</head>
<body>
	<div id="wrapper">
		<div id="header" class="splash"></div>
		<div id="main_container">
			<form action="" id="checkout_form">
				<div id="customer_information_block">
					<div class="breadcrumbs_block">
						<ul class="breadcrumbs_list">
							<li class="breadcrumbs_item"><a href="#">Customer information</a></li>
							<li class="breadcrumbs_item"><a href="#">Shipping method</a></li>
							<li class="breadcrumbs_item"><a href="#">Payment method</a></li>
						</ul>
					</div>
					<h2>Customer information</h2>
					<input type="email" placeholder="Email">
					<h2>Shipping address</h2>
					<ul id="customer_info_list">
						<li>
							<input type="text" placeholder="First name">
							<input type="text" placeholder="Last name">
						</li>
						<li>
							<input type="text" placeholder="Address">
							<input type="text" placeholder="Apt, suite, etc. (optional)">
						</li>
						<li>
							<input type="text" placeholder="City">
						</li>
						<li>
							<select name="" id=""></select>
							<input type="text" placeholder="Postal code">
						</li>
						<li>
							<input type="text" placeholder="Phone (optional)">
						</li>
						<li>
							<input type="submit" id="submit_checkout_button" value="Continue to shipping method" class="btn btn-primary">
						</li>
					</ul>
				</div>
				<div id="products_information_block">
					<ul id="products_list">
						<li>
							<div class="image_block">
								<img src="" alt="">
								<span class="product_count"></span>
							</div>
							<div class="product_details">
								<div class="product_name">The Featherweights (7" inseam)</div>
								<div class="product_size">L</div>
							</div>
							<div class="product_price">$44.50</div>
						</li>
					</ul>
					<div id="code_block">
						<input type="text" placeholder="Gift Card or Reward Code">
						<button type="button" id="apply_button" class="btn">Apply</button>
					</div>
					<table id="checkout_table">
						<tr>
							<td>Subtotal</td>
							<td>$44.50</td>
						</tr>
						<tr>
							<td>Shipping</td>
							<td>-</td>
						</tr>
						<tr id="total_price">
							<td>Total</td>
							<td></td>
						</tr>
					</table>
				</div>
			</form>
		</div>
	</div>
</body>
</html>