// Function to convert JSON object to query string
function jsonToQueryString(params) {
  return Object.keys(params)
      .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(params[key]))
      .join('&');
}

app.controller(
  "indexCtrl",
  function ($scope, $http, $window, $location, $sce, $timeout, store, config) {
    $scope.init = function () {
      $scope.baseurl = config.baseurl;
      $scope.cartTotal = 100;
      $scope.search = null;
      $scope.categoryFilter = null;

      const isCustomerLoggedIn = localStorage.getItem('isCustomerLoggedIn');
      $scope.isCustomerLoggedIn = isCustomerLoggedIn === '1';

      $scope.urlParams = Object.fromEntries(
        new URLSearchParams(window.location.search)
      );

      if ($scope.urlParams.hasOwnProperty('search')) {
        $scope.search = $scope.urlParams.search;
      }

      $scope.productlist();
      $scope.categorylist();

      // Initialize cart from localStorage
      $scope.cart = JSON.parse(localStorage.getItem("cart")) || [];
      $scope.updateCartTotal();
    };

    // Fetch the list of products
    $scope.productlist = function () {
      $scope.fetchingProductList = true;

      let url = '';

      if ($scope.urlParams.length == 0) {
        url = `${config.baseurl}product/products/`;
      } else {
        const queryString = jsonToQueryString($scope.urlParams);
        url = `${config.baseurl}product/products?${queryString}`;
      }

      $http.get(url)
          .then(function (response) {
              if (response.data.status === 'false') {
                  console.error("Error fetching product list:", response.data.message);
              } else {
                $scope.productdataset = response.data.data;
                $scope.num_products = $scope.productdataset.length;
                $scope.num_pages = response.data.num_pages;
                $scope.start_index = response.data.start_index;
                $scope.end_index = response.data.end_index;
                $scope.current_page = response.data.page;
              }
          })
          .catch(function (error) {
              console.error("Error fetching product list:", error);
          }).finally(() => {
            $scope.fetchingProductList = false;
          });
    };

    $scope.navigateToPage = page => {
      const url = new URL(window.location.href);
      url.searchParams.set('page', page);
      window.location.assign(url);
    }

    $scope.fetchingCategoryList = true;
    $scope.categorylist = function() {
      $http.get(`${config.baseurl}category/category/`)
          .then(function (response) {
              if (response.data.status === 'false') {
                  console.error("Error fetching category list:", response.data.message);
              } else {
                $scope.categorydataset = response.data;

                if ($scope.urlParams.hasOwnProperty('category_id')) {
                  $scope.categorydataset.forEach(category => {
                    if (category.id === parseInt($scope.urlParams['category_id'])) {
                      $scope.categoryFilter = category.category_name;
                    }
                  });
                }
              }
          })
          .catch(function (error) {
              console.error("Error fetching category list:", error);
          }).finally(() => {
            $scope.fetchingCategoryList = false;
          });
    }

    $scope.addToCart = function (id, product_name, qty, price, discount_price, image) {
      qty = Number(qty);
      price = Number(price);
      discount_price = discount_price ? Number(discount_price) : 0;

      const product = {
        id: id,
        product_name: product_name,
        quantity: qty,
        price: price, // Ensure price is stored as a number
        discount_price: discount_price,
        product_image: image,
        subtotal: price,
        discount_subtotal: discount_price
      };

      // Check if the product already exists in the cart
      let existingProduct = $scope.cart.find((item) => item.id === id);

      if (existingProduct) {
        existingProduct.quantity += qty; // Increment quantity
        $scope.updateProductTotal(id);
      } else {
        $scope.cart.push(product);
        localStorage.setItem("cart", JSON.stringify($scope.cart));
        $scope.updateCartTotal();
      }
    };

    $scope.checkIfProductInCart = id => {
      let product = $scope.cart.find((item) => item.id === id);

      if(product) {
        return true;
      }
    };

    $scope.clearCart = () => {
      localStorage.setItem("cart", JSON.stringify([]));
      $scope.updateCartTotal();
    }

    $scope.updateQuantity = function (id, delta) {
      let product = $scope.cart.find((item) => item.id === id);
      if (product) {
        product.quantity = Math.max(1, product.quantity + delta); // Ensure quantity doesn't go below 1
        localStorage.setItem("cart", JSON.stringify($scope.cart));

        $scope.updateProductTotal(id);
      }
    };

    $scope.removeItem = function (id) {
      $scope.cart = $scope.cart.filter((item) => item.id !== id);
      localStorage.setItem("cart", JSON.stringify($scope.cart));

      $scope.updateCartTotal();
    };

    $scope.updateProductTotal = id => {
      let product = $scope.cart.find((item) => item.id === id);
      
      if (product) {
        const subtotal = product.quantity * product.price;
        const discount_subtotal = product.discount_price ?
          product.quantity * product.discount_price :
          product.discount_subtotal;

        product.subtotal = subtotal;
        product.discount_subtotal = discount_subtotal;

        localStorage.setItem("cart", JSON.stringify($scope.cart));
        $scope.updateCartTotal();
      }
    }

    $scope.updateCartTotal = function () {
      $scope.cart = JSON.parse(localStorage.getItem("cart")) || [];
      let total = 0;
      $scope.cart.forEach(cartItem => {
        total += cartItem.subtotal;
      });
      $scope.cartTotal = total;
    };

    $scope.initializePlugins = () => {
      var windowOn = $(window);
  
      // 01. z-index to top for product items
      var democol = $('.tpproduct__shop-item .col');
      democol.on({
          mouseenter: function () {
              $(this).siblings().stop().css('z-index', '-1');
          },
          mouseleave: function () {
              $(this).siblings().stop().css('z-index', '1');
          }
      });
  
      // 02. z-index to top for sidebar products
      var sidebarCol = $('.sidebar-product-hover .tpproduct');
      sidebarCol.on({
          mouseenter: function () {
              $(this).siblings().stop().css('z-index', '-1');
          },
          mouseleave: function () {
              $(this).siblings().stop().css('z-index', '1');
          }
      });
  
      // 03. Cart quantity controls
      $('.cart-minus').on('click', function () {
          var $input = $(this).parent().find('input');
        var count = Math.max(1, parseInt($input.val()) - 1);
        $input.val(count).change();
        return false;
      });
  
      $('.cart-plus').on('click', function () {
        var $input = $(this).parent().find('input');
        $input.val(parseInt($input.val()) + 1).change();
        return false;
      });
  
      // 04. Show Login Toggle
      $('#showlogin').on('click', function () {
        $('#checkout-login').slideToggle(900);
      });
  
      // 05. Show Coupon Toggle
      $('#showcoupon').on('click', function () {
        $('#checkout_coupon').slideToggle(900);
      });
  
      // 06. Create An Account Toggle
      $('#cbox').on('click', function () {
        $('#cbox_info').slideToggle(900);
      });
  
      // 07. Shipping Box Toggle
      $('#ship-box').on('click', function () {
        $('#ship-box-info').slideToggle(1000);
      });
  
      // 08. Scroll to top functionality
      windowOn.on('scroll', function () {
        $('.scroll-to-target').toggleClass('open', windowOn.scrollTop() >= 245);
      });
  
      // 09. Scroll Up functionality
      $(".scroll-to-target").on('click', function () {
        var target = $(this).attr('data-target');
        $('html, body').animate({ scrollTop: $(target).offset().top }, 1000);
      });
  
      // 10. Nice Select initialization
      $('select').niceSelect();
  
      // 11. Data CSS initialization for background images
      $("[data-background]").each(function () {
        $(this).css("background-image", "url(" + $(this).attr("data-background") + ")");
      });
  
      // 12 & 13. Sticky Header functionality
      windowOn.on('scroll', function () {
        $("#header-sticky, #header-sticky-2").toggleClass("header-sticky", windowOn.scrollTop() >= 250);
      });
  
      // 14. Parallax effect initialization for multiple elements
      for (let i = 1; i <= 6; i++) {
        if ($(`.pera${i}`).length) {
          new Parallax($(`.pera${i}`).get(0));
        }
      }
  
      // 15 & 16. Header Search and Sidebar toggle functionality
      $(".header-search").on('click', function () { $(".search-popup-wrap").slideToggle(); });
      
      $(".search-close, .search-body-overlay").on("click", function () { $(".search-popup-wrap").slideUp(500); });
      
      $(".tp-search-toggle").on("click", function () { $(".tp-sidebar-area").addClass("tp-searchbar-opened"); });
      
      $(".tpsearchbar__close, .search-body-overlay").on("click", function () { 
        $(".tp-sidebar-area").removeClass("tp-searchbar-opened");
        $(".search-body-overlay").removeClass("opened");
      });
      
      $('[data-countdown]').each(function () {
        var $this = $(this),
        finalDate = $this.data('countdown');
        
        $this.countdown(finalDate, function (event) {
          $this.html(event.strftime('<span class="cdown days"><span class="time-count">%-D</span> <p>Days</p></span> <span class="cdown hour"><span class="time-count">%-H</span> <p>Hour</p></span> <span class="cdown minutes"><span class="time-count">%M</span> <p>Minute</p></span> <span class="cdown second"><span><span class="time-count">%S</span> <p>Second</p></span>'));
        });
      });
  
      // Magnific Popup initialization for video and images
      $(".popup-video").magnificPopup({ type: "iframe" });
      $('.popup-image').magnificPopup({ type: 'image', gallery: { enabled: true } });
       
      // Initialize Swipers (Sliders)
      const swiperConfigs = [
          { selector: '.category-active', slidesPerView: 8 },
          { selector: '.inner-category-active', slidesPerView: 7 },
          { selector: '.inner-category-two', slidesPerView: 9 },
          { selector: '.inner-category-three', slidesPerView: 9 },
          { selector: '.tpproduct-active', slidesPerView: 6, loop: true },
          { selector: '.tpblog-active', slidesPerView: 4 },
          { selector: '.slider-active', slidesPerView: 1, fadeEffect: true }
          // Add other swiper configurations as needed...
      ];
  
      swiperConfigs.forEach(config => {
        new Swiper(config.selector, {
          loop: config.loop || false,
          slidesPerView: config.slidesPerView,
          spaceBetween: 20,
          autoplay: { delay: config.autoplayDelay || 3500, disableOnInteraction: true },
          navigation: config.navigation || {},
          pagination: config.pagination || {}
        });
      });
    };
  }
);
