// When the HTML document is ready (rendered)
$(document).ready(function () {
    // Store the markup element with the id jq-notification for ajax notifications in a variable
    var successMessage = $("#jq-notification");

    // Capture the click event on the 'add to cart' button
    $(document).on("click", ".add-to-cart", function (e) {
        // Block its default action
        e.preventDefault();

        // Get the counter element in the cart icon and retrieve its value
        var goodsInCartCount = $("#goods-in-cart-count");
        var cartCount = parseInt(goodsInCartCount.text() || 0);

        // Get the product id from the data-product-id attribute
        var product_id = $(this).data("product-id");

        // Get the link to the django controller from the href attribute
        var add_to_cart_url = $(this).attr("href");

        // Make a POST request via ajax without reloading the page
        $.ajax({
            type: "POST",
            url: add_to_cart_url,
            data: {
                product_id: product_id,
                csrfmiddlewaretoken: $("[name=csrfmiddlewaretoken]").val(),
            },
            success: function (data) {
                // Display the message
                successMessage.html(data.message);
                successMessage.fadeIn(400);
                // Hide the message after 7 seconds
                setTimeout(function () {
                    successMessage.fadeOut(400);
                }, 7000);

                // Increase the number of items in the cart (render in the template)
                cartCount++;
                goodsInCartCount.text(cartCount);

                // Update the cart contents with the response from django (newly rendered cart fragment)
                var cartItemsContainer = $("#cart-items-container");
                cartItemsContainer.html(data.cart_items_html);

            },

            error: function (data) {
                console.log("Error when adding product to cart");
            },
        });
    });

    // Capture the click event on the 'remove from cart' button
    $(document).on("click", ".remove-from-cart", function (e) {
        // Block its default action
        e.preventDefault();

        // Get the counter element in the cart icon and retrieve its value
        var goodsInCartCount = $("#goods-in-cart-count");
        var cartCount = parseInt(goodsInCartCount.text() || 0);

        // Get the cart id from the data-cart-id attribute
        var cart_id = $(this).data("cart-id");
        // Get the link to the django controller from the href attribute
        var remove_from_cart = $(this).attr("href");

        // Make a POST request via ajax without reloading the page
        $.ajax({

            type: "POST",
            url: remove_from_cart,
            data: {
                cart_id: cart_id,
                csrfmiddlewaretoken: $("[name=csrfmiddlewaretoken]").val(),
            },
            success: function (data) {
                // Display the message
                successMessage.html(data.message);
                successMessage.fadeIn(400);
                // Hide the message after 7 seconds
                setTimeout(function () {
                    successMessage.fadeOut(400);
                }, 7000);

                // Decrease the number of items in the cart (render)
                cartCount -= data.quantity_deleted;
                goodsInCartCount.text(cartCount);

                // Update the cart contents with the response from django (newly rendered cart fragment)
                var cartItemsContainer = $("#cart-items-container");
                cartItemsContainer.html(data.cart_items_html);

            },

            error: function (data) {
                console.log("Error when adding product to cart");
            },
        });
    });

    // Now for the +/- product quantity
    // Event handler for decreasing the value
    $(document).on("click", ".decrement", function () {
        // Get the link to the django controller from the data-cart-change-url attribute
        var url = $(this).data("cart-change-url");
        // Get the cart id from the data-cart-id attribute
        var cartID = $(this).data("cart-id");
        // Find the closest input with the quantity
        var $input = $(this).closest('.input-group').find('.number');
        // Get the current quantity value
        var currentValue = parseInt($input.val());
        // If the quantity is greater than one, decrease by 1
        if (currentValue > 1) {
            $input.val(currentValue - 1);
            // Call the function defined below
            // with arguments (cart id, new quantity, quantity decreased or increased, url)
            updateCart(cartID, currentValue - 1, -1, url);
        }
    });

    // Event handler for increasing the value
    $(document).on("click", ".increment", function () {
        // Get the link to the django controller from the data-cart-change-url attribute
        var url = $(this).data("cart-change-url");
        // Get the cart id from the data-cart-id attribute
        var cartID = $(this).data("cart-id");
        // Find the closest input with the quantity
        var $input = $(this).closest('.input-group').find('.number');
        // Get the current quantity value
        var currentValue = parseInt($input.val());

        $input.val(currentValue + 1);

        // Call the function defined below
        // with arguments (cart id, new quantity, quantity decreased or increased, url)
        updateCart(cartID, currentValue + 1, 1, url);
    });

    function updateCart(cartID, quantity, change, url) {
        $.ajax({
            type: "POST",
            url: url,
            data: {
                cart_id: cartID,
                quantity: quantity,
                csrfmiddlewaretoken: $("[name=csrfmiddlewaretoken]").val(),
            },

            success: function (data) {
                // Display the message
                successMessage.html(data.message);
                successMessage.fadeIn(400);
                // Hide the message after 7 seconds
                setTimeout(function () {
                    successMessage.fadeOut(400);
                }, 7000);

                // Update the number of items in the cart
                var goodsInCartCount = $("#goods-in-cart-count");
                var cartCount = parseInt(goodsInCartCount.text() || 0);
                cartCount += change;
                goodsInCartCount.text(cartCount);

                // Update the cart contents
                var cartItemsContainer = $("#cart-items-container");
                cartItemsContainer.html(data.cart_items_html);

            },
            error: function (data) {
                console.log("Error when adding product to cart");
            },
        });
    }

    // Get the markup element by id - notifications from django
    var notification = $('#notification');
    // Hide it after 7 seconds
    if (notification.length > 0) {
        setTimeout(function () {
            notification.alert('close');
        }, 7000);
    }

    // When clicking on the cart icon, open the popup (modal) window
    $('#modalButton').click(function () {
        $('#exampleModal').appendTo('body');

        $('#exampleModal').modal('show');
    });

    // Click event for the cart window close button
    $('#exampleModal .btn-close').click(function () {
        $('#exampleModal').modal('hide');
    });

    // Event handler for selecting the delivery method radio button
    $("input[name='requires_delivery']").change(function () {
        var selectedValue = $(this).val();
        // Show or hide the delivery address input field
        if (selectedValue === "1") {
            $("#deliveryAddressField").show();
        } else {
            $("#deliveryAddressField").hide();
        }
    });

    // Phone number input formatting in the form (xxx) xxx-xxxx
    document.getElementById('id_phone_number').addEventListener('input', function (e) {
        var x = e.target.value.replace(/\D/g, '').match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
        e.target.value = !x[2] ? x[1] : '(' + x[1] + ') ' + x[2] + (x[3] ? '-' + x[3] : '');
    });

    // Client-side phone number validation in the form xxx-xxx-xx-xx
    $('#create_order_form').on('submit', function (event) {
        var phoneNumber = $('#id_phone_number').val();
        var regex = /^\(\d{3}\) \d{3}-\d{4}$/;

        if (!regex.test(phoneNumber)) {
            $('#phone_number_error').show();
            event.preventDefault();
        } else {
            $('#phone_number_error').hide();

            // Clean the phone number from parentheses and dashes before submitting the form
            var cleanedPhoneNumber = phoneNumber.replace(/[()\-\s]/g, '');
            $('#id_phone_number').val(cleanedPhoneNumber);
        }
    });
});
