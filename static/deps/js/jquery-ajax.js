// When the HTML document is ready (rendered)
$(document).ready(function () {
    // Assign the markup element with the id jq-notification to a variable for AJAX notifications

    var successMessage = $("#jq-notification");

// Catch the click event on the add to cart button
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
                // Message
                successMessage.html(data.message);
                successMessage.fadeIn(400);
                // Remove the message after 7 seconds
                setTimeout(function () {
                    successMessage.fadeOut(400);
                }, 7000);

                // Increase the number of items in the cart (render in the template)
                cartCount++;
                goodsInCartCount.text(cartCount);

                // Update the cart content with the response from django (newly rendered cart fragment)
                var cartItemsContainer = $("#cart-items-container");
                cartItemsContainer.html(data.cart_items_html);

            },

            error: function (data) {
                console.log("Error while adding the product to the cart");
            },
        });
    });


    // // Ловим собыитие клика по кнопке удалить товар из корзины
    // $(document).on("click", ".remove-from-cart", function (e) {
    //     // Блокируем его базовое действие
    //     e.preventDefault();

    //     // Берем элемент счетчика в значке корзины и берем оттуда значение
    //     var goodsInCartCount = $("#goods-in-cart-count");
    //     var cartCount = parseInt(goodsInCartCount.text() || 0);

    //     // Получаем id корзины из атрибута data-cart-id
    //     var cart_id = $(this).data("cart-id");
    //     // Из атрибута href берем ссылку на контроллер django
    //     var remove_from_cart = $(this).attr("href");

    //     // делаем post запрос через ajax не перезагружая страницу
    //     $.ajax({

    //         type: "POST",
    //         url: remove_from_cart,
    //         data: {
    //             cart_id: cart_id,
    //             csrfmiddlewaretoken: $("[name=csrfmiddlewaretoken]").val(),
    //         },
    //         success: function (data) {
    //             // Сообщение
    //             successMessage.html(data.message);
    //             successMessage.fadeIn(400);
    //             // Через 7сек убираем сообщение
    //             setTimeout(function () {
    //                 successMessage.fadeOut(400);
    //             }, 7000);

    //             // Уменьшаем количество товаров в корзине (отрисовка)
    //             cartCount -= data.quantity_deleted;
    //             goodsInCartCount.text(cartCount);

    //             // Меняем содержимое корзины на ответ от django (новый отрисованный фрагмент разметки корзины)
    //             var cartItemsContainer = $("#cart-items-container");
    //             cartItemsContainer.html(data.cart_items_html);

    //         },

    //         error: function (data) {
    //             console.log("Ошибка при добавлении товара в корзину");
    //         },
    //     });
    // });


    // // Теперь + - количества товара
    // // Обработчик события для уменьшения значения
    // $(document).on("click", ".decrement", function () {
    //     // Берем ссылку на контроллер django из атрибута data-cart-change-url
    //     var url = $(this).data("cart-change-url");
    //     // Берем id корзины из атрибута data-cart-id
    //     var cartID = $(this).data("cart-id");
    //     // Ищем ближайшеий input с количеством 
    //     var $input = $(this).closest('.input-group').find('.number');
    //     // Берем значение количества товара
    //     var currentValue = parseInt($input.val());
    //     // Если количества больше одного, то только тогда делаем -1
    //     if (currentValue > 1) {
    //         $input.val(currentValue - 1);
    //         // Запускаем функцию определенную ниже
    //         // с аргументами (id карты, новое количество, количество уменьшилось или прибавилось, url)
    //         updateCart(cartID, currentValue - 1, -1, url);
    //     }
    // });

    // // Обработчик события для увеличения значения
    // $(document).on("click", ".increment", function () {
    //     // Берем ссылку на контроллер django из атрибута data-cart-change-url
    //     var url = $(this).data("cart-change-url");
    //     // Берем id корзины из атрибута data-cart-id
    //     var cartID = $(this).data("cart-id");
    //     // Ищем ближайшеий input с количеством 
    //     var $input = $(this).closest('.input-group').find('.number');
    //     // Берем значение количества товара
    //     var currentValue = parseInt($input.val());

    //     $input.val(currentValue + 1);

    //     // Запускаем функцию определенную ниже
    //     // с аргументами (id карты, новое количество, количество уменьшилось или прибавилось, url)
    //     updateCart(cartID, currentValue + 1, 1, url);
    // });

    // function updateCart(cartID, quantity, change, url) {
    //     $.ajax({
    //         type: "POST",
    //         url: url,
    //         data: {
    //             cart_id: cartID,
    //             quantity: quantity,
    //             csrfmiddlewaretoken: $("[name=csrfmiddlewaretoken]").val(),
    //         },

    //         success: function (data) {
    //              // Сообщение
    //             successMessage.html(data.message);
    //             successMessage.fadeIn(400);
    //              // Через 7сек убираем сообщение
    //             setTimeout(function () {
    //                  successMessage.fadeOut(400);
    //             }, 7000);

    //             // Изменяем количество товаров в корзине
    //             var goodsInCartCount = $("#goods-in-cart-count");
    //             var cartCount = parseInt(goodsInCartCount.text() || 0);
    //             cartCount += change;
    //             goodsInCartCount.text(cartCount);

    //             // Меняем содержимое корзины
    //             var cartItemsContainer = $("#cart-items-container");
    //             cartItemsContainer.html(data.cart_items_html);

    //         },
    //         error: function (data) {
    //             console.log("Ошибка при добавлении товара в корзину");
    //         },
    //     });
    // }

    // We take the element from the markup by id - notifications from django
    var notification = $('#notification');
    // And after 7 seconds, remove it
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

    // Event click on the close button of the cart window
    $('#exampleModal .btn-close').click(function () {
        $('#exampleModal').modal('hide');
    });

    // Event handler for the radio button to select the delivery method
    $("input[name='requires_delivery']").change(function () {
        var selectedValue = $(this).val();
        // Hide or show the input field for the delivery address
        if (selectedValue === "1") {
            $("#deliveryAddressField").show();
        } else {
            $("#deliveryAddressField").hide();
        }
    });

});