<!DOCTYPE html>
<html lang="en">
<head>
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
							<li class="breadcrumbs_item"><a href="#">Customer information</a><svg class="icon-svg icon-svg--size-10 breadcrumb__chevron-icon rtl-flip" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10"><path d="M2 1l1-1 4 4 1 1-1 1-4 4-1-1 4-4"></path></svg></li>
							<li class="breadcrumbs_item"><a href="#">Shipping method</a><svg class="icon-svg icon-svg--size-10 breadcrumb__chevron-icon rtl-flip" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10"><path d="M2 1l1-1 4 4 1 1-1 1-4 4-1-1 4-4"></path></svg></li>
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
							<input type="text" placeholder="Address" class="address">
							<input type="text" placeholder="Apt, suite, etc. (optional)" class="address_optional">
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
							<a href="#">Return to Chubbies</a>
							<input type="submit" id="submit_checkout_button" value="Continue to shipping method" class="btn btn-primary">
						</li>
					</ul>
				</div>
				<div id="products_information_block">
					<ul id="products_list">
						<li><h5>No items in cart.</h5></li>
					</ul>
					<div id="code_block">
						<input type="text" placeholder="Gift Card or Reward Code">
						<button type="button" id="apply_button" class="btn">Apply</button>
					</div>
					<table id="checkout_table">
						<tbody>
							<tr>
								<td>Subtotal</td>
								<td>$<span class="sub_total_value">0.00</span></td>
							</tr>
							<tr>
								<td>Shipping</td>
								<td>-</td>
							</tr>
						</tbody>
						<tfoot>
							<tr id="total_price_block">
								<td>Total</td>
								<td id="total_price">$0.00</td>
							</tr>
						</tfoot>
					</table>
				</div>
			</form>
			<div class="hidden">
				<ul>
					<li id="products_list_item_clone">
						<div class="image_block">
							<div class="image_content">
								<span class="product_count">1</span>
								<img src="" alt="">
							</div>
						</div>
						<div class="product_details">
							<div class="product_name"></div>
							<div class="product_size">M</div>
						</div>
						<div class="product_price">$<span class="product_price_value"></span></div>
					</li>
				</ul>
			</div>
		</div>
	</div>
	<script type="text/javascript">
		function populate_products_list(product_items, last_index){
			var sub_total_price = 0;
			for(var i_id in product_items)
			{
				var product_item = product_items[i_id];

				var products_item_clone = $("#products_list_item_clone").clone();
				products_item_clone.removeAttr('id');
				products_item_clone
					.find('img').attr('src', product_item.Url).end()
					.find('.product_name').text(product_item.Name).end()
					.find('.product_price_value').text(product_item.Price).end()
					.find('.product_count').text(product_item.count);
				sub_total_price += parseFloat(product_item.Price) * product_item.count;
				$('#products_list').append(products_item_clone);

				$('.sub_total_value').text(sub_total_price.toFixed(2));
				$('#total_price').text(sub_total_price.toFixed(2));
			}
		}

		if (typeof(Storage) !== "undefined")
		{
			var cart_items = localStorage.getItem("cart_obj");
			var cart_items_obj = JSON.parse(cart_items);
			if(cart_items_obj.length > 0)
			{
				var product_items = [];
				for(var i_id in cart_items_obj)
				{
					var product_item = cart_items_obj[i_id];

					if(typeof product_items[ product_item.Name ] == "undefined")
					{
						product_items[ product_item.Name ] = product_item;
						product_items[ product_item.Name ].count = 1;
					}
					else
					{
						product_items[ product_item.Name ].count += 1;
					}

					if(cart_items_obj.length - 1 == i_id)
					{
						$('#products_list').html("");
						populate_products_list(product_items, product_item.Name);
					}
				}
			}
		} else {
			console.log( Storage );
		}
	</script>
</body>
</html>