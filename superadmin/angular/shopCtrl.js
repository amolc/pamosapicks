'use strict';
var app = angular.module('shopcart', ['angular-storage', 'angularPayments']);
app.config(['storeProvider', function(storeProvider) {
    storeProvider.setStore('sessionStorage');

}]);
app.controller('orderCtrl', function($scope, $http, $window, $location, $sce, $timeout, store) {
    // //  $window.Stripe.setPublishableKey('pk_test_p9erfK2YBmftkmEd0zM5LJpu');
    // $window.Stripe.setPublishableKey('pk_live_325verdKtnzQhpKw10fVcXSU');



    var baseurl = "https://api.superadmin.shop/api/";


    $scope.allcategories = function(req, res) {

        $http.get(baseurl + 'category/')

        .success(function(res) {
            if (res.status == 'false') {} else {
                $scope.categories = res.data;
                console.log('categories: ', $scope.categories);
            }
        }).error(function() {});
    }



    $scope.redirect = function() {
        //console.log("redirect");
        location.href = 'index.html';
    }
    $scope.orderinit = function() {

        $scope.data = {};

        var paramValue = $window.location.search;

        var param = paramValue.split("=")

        $http.get(baseurl + 'mangodetails/' + param[1]).success(function(res) {
            if (res.status == 'false') {} else {

                $scope.data.productsku = res.productId;
                $scope.data.productname = res.productName;
                $scope.data.productprice = res.productPrice;
                $scope.data.itemprice = $scope.data.productprice * 2;
                $scope.data.paymenttype = "Credit Card";
                $scope.data.qty = "1";
                $scope.data.deliverycharge = res.delivarycharge;
                $scope.data.deliverycharge1 = res.delivarycharge;
                $scope.data.totalprice = $scope.data.productprice * $scope.data.qty + $scope.data.deliverycharge;
                $scope.data.schedule = "0"
                $scope.data.schedulecharge = res.schedulecharge;
                $scope.data.schedulecharge1 = "0";
                $scope.data.orderterms = "false";
                $scope.data.itemprice = $scope.data.productprice * 1;

            }
        }).error(function() {});


        w3IncludeHTML();
        $("#alertmessage").hide();
        $("#orderform").show();
        $("#preview").hide();
        $("#payform").hide();
        $("#thankyou").hide();
        $("#preview1").hide();
        $("#loadingButton").hide();
    }

    $scope.calculate = function() {
        console.log("calculaion");
        if ($scope.data.qty == 1) {
            $scope.data.deliverycharge1 = $scope.data.deliverycharge;
        } else {
            $scope.data.deliverycharge1 = 0;
            $scope.data.itemprice = $scope.data.productprice * $scope.data.qty;
        }

        if ($scope.data.schedule !== "0") {
            console.log($scope.data.schedule);
            console.log($scope.data.schedulecharge);
            $scope.data.schedulecharge1 = $scope.data.schedulecharge;
            console.log($scope.data.schedulecharge1);
        } else {
            $scope.data.schedulecharge1 = 0;
        }

        $scope.data.totalprice = 0;
        $scope.data.itemprice = $scope.data.qty * $scope.data.productprice;
        $scope.data.totalprice = $scope.data.itemprice + $scope.data.schedulecharge1 + $scope.data.deliverycharge1;

    }

    $scope.order = function() {
        $("#alertmessage").hide();
        // $scope.formvalidate ="true" ;
        $scope.alertmessage = "";
        console.log("order called");

        if (typeof $scope.data.ordername === 'undefined') {
            console.log("ordername is null");
            $scope.formvalidate = "false";
            $scope.alertmessage = "Name should not be empty";
            $("#alertmessage").show('slow');
        } else if (typeof $scope.data.orderemail === 'undefined') {
            console.log("Order Email is null");
            $scope.formvalidate = "false";
            $scope.alertmessage = "Email should not be empty";
            $("#alertmessage").show('slow');
        } else if (typeof $scope.data.orderphone === 'undefined') {
            console.log("Order Phone is null");
            $scope.formvalidate = "false";
            $scope.alertmessage = "Phone Number should not be empty";
            $("#alertmessage").show('slow');
        } else if (typeof $scope.data.orderaddress1 === 'undefined') {
            console.log("Address Field is null");
            $scope.formvalidate = "false";
            $scope.alertmessage = "Address should not be empty";
            $("#alertmessage").show('slow');
        } else if (typeof $scope.data.orderpostalcode === 'undefined') {
            console.log("Postalcode is null");
            $scope.formvalidate = "false";
            $scope.alertmessage = "Postalcode should not be empty";
            $("#alertmessage").show('slow');
        } else if ($scope.data.orderterms === 'false') {
            console.log("Terms is not checked");
            $scope.formvalidate = "false";
            $scope.alertmessage = "Terms should be Selected";
            $("#alertmessage").show('slow');
        } else {
            $scope.formvalidate = "true";
        }

        console.log($scope.data);
        console.log('qty', $scope.data.qty);
        console.log('Address2', $scope.data.orderaddress2);
        console.log('price', $scope.data.productprice);
        console.log('totalprice', $scope.data.totalprice);
        console.log('Name', $scope.data.ordername);
        console.log('Email', $scope.data.orderemail);
        console.log('Phone', $scope.data.orderphone);
        console.log('Address1', $scope.data.orderaddress1);
        console.log('Address2', $scope.data.orderaddress2);
        console.log('Address2', $scope.data.paymenttype);
        console.log('Message', $scope.data.ordermessage);
        console.log('Order Terms', $scope.data.orderterms);
        console.log('Schedule Delivery', $scope.data.schedule);
        console.log('Scope Validate ', $scope.formvalidate);

        /* The validation is good */

        if ($scope.formvalidate == "true") {
            // $("#preview").hide();
            // $("#preview1").hide();

            if ($scope.data.paymenttype == "Bank Transfer") {
                //console.log($scope.data.paymenttype);
                $("#orderform").hide();
                $("#preview").show();
                $("#payform").hide();
                $("#thankyou").hide();
                $("#preview1").hide();
            } else if ($scope.data.paymenttype == "Cash In Hand") {
                console.log($scope.data.paymenttype);
                $("#orderform").hide();
                $("#preview").hide();
                $("#payform").hide();
                $("#thankyou").hide();
                $("#preview1").show();

            } else {
                // console.log($scope.data.paymenttype);
                $("#orderform").hide();
                $("#payform").show("slow");
                $("#thankyou").hide();
                $("#preview").hide();
                $("#preview1").hide();
            }

        }
    }

    $scope.stripeCallback = function(code, result) {

        $("#submitButton").hide();
        $("#loadingButton").show();

        if (result.error) {
            $("#submitButton").show();
            $("#loadingButton").hide();
            window.alert('it failed! error: ' + result.error.message);

            $scope.paymessage = result.error.message;
            $scope.transactionid = result.id;
            // console.log("Error");
            // console.log('Name',$scope.ordername);
            // console.log('Email', $scope.orderemail);
            // console.log('Phone', $scope.orderphone);
            // console.log('Address1', $scope.orderaddress1);
            // console.log('Address2', $scope.orderaddress2);
            // console.log('PostalCode', $scope.orderpostalcode);
            // console.log('ProductName' ,$scope.productname);
            // console.log('price' ,$scope.productprice);
            // console.log('qty' , $scope.qty);
            // console.log('deliverycharge' ,$scope.deliverycharge);
            // console.log('price' ,$scope.productprice);
            // console.log('totalprice' ,$scope.totalprice);
            $("#orderform").hide();
            $("#payform").show();
            $("#thankyou").hide();

        } else {

            $scope.data.stripeToken = result.id;

            //                  console.log('qty' , $scope.data.qty);
            //                  console.log('deliverycharge' ,$scope.data.deliverycharge);
            //                  console.log('price' ,$scope.data.productprice);
            //                  console.log('totalprice' ,$scope.data.totalprice);
            //                  console.log('Name',$scope.data.ordername);
            //                  console.log('Email', $scope.data.orderemail);
            //                  console.log('Phone', $scope.data.orderphone);
            //                  console.log('Address1', $scope.data.orderaddress1);
            // console.log('Address2', $scope.data.orderaddress2);
            //console.log('PostalCode', $scope.data.orderpostalcode);
            var d = new Date();
            var utc = d.getTime() + (d.getTimezoneOffset() * 60000);
            var today = new Date(utc + 8);
            var dd = today.getDate();
            var mm = today.getMonth() + 1;
            var yyyy = today.getFullYear();
            $scope.data.recdate = dd + '-' + mm + '-' + yyyy;
            var h = today.getHours();
            var m = today.getMinutes();
            $scope.data.rectime = h + ":" + m;

            $http.post(baseurl + 'addorder', $scope.data).success(function(res) {

                $scope.response = res;

                if (res.statusCode == '402') {
                    $scope.paymessage = res.message;
                    $("#submitButton").show();
                    $("#loadingButton").hide();
                } else {
                    window.alert('success! token: ' + result.id);
                    $scope.message = "Card Successfully Approved."
                    $scope.paymessage = $scope.message;
                    $("#orderform").hide("slow");
                    $("#payform").hide("slow");
                    $("#thankyou").show("slow");
                    $("#submitButton").show();
                    $("#loadingButton").hide();

                    //$location.path("/Cart");
                }
            }).error(function() {
                // alert("Please check your internet connection or data source..");
            });



        }


    };


    $scope.bankorder = function() {

        console.log($scope.data);
        var d = new Date();
        var utc = d.getTime() + (d.getTimezoneOffset() * 60000);
        var today = new Date(utc + 8);
        var dd = today.getDate();
        var mm = today.getMonth() + 1;
        var yyyy = today.getFullYear();
        $scope.data.recdate = dd + '-' + mm + '-' + yyyy;
        var h = today.getHours();
        var m = today.getMinutes();
        $scope.data.rectime = h + ":" + m;

        $http.post(baseurl + 'addbankorder', $scope.data).success(function(res) {
                console.log(res);
                $scope.paymessage = "Order Placed Successfully";
                $("#orderform").hide("slow");
                $("#preview").hide();
                $("#payform").hide("slow");
                $("#thankyou").show("slow");
                // $scope.redirect();
            })
            .error(function() {
                alert("Please check your internet connection or data source..");
            });
    }

    $scope.cashorder = function() {
        console.log($scope.data);
        var d = new Date();
        var utc = d.getTime() + (d.getTimezoneOffset() * 60000);
        var today = new Date(utc + 8);
        var dd = today.getDate();
        var mm = today.getMonth() + 1;
        var yyyy = today.getFullYear();
        $scope.data.recdate = dd + '-' + mm + '-' + yyyy;
        var h = today.getHours();
        var m = today.getMinutes();
        $scope.data.rectime = h + ":" + m;

        $http.post(baseurl + 'cashorder', $scope.data).success(function(res) {
                console.log(res);

                // $scope.redirect();
                $scope.paymessage = "Order Placed Successfully";
                $("#orderform").hide("slow");
                $("#preview1").hide();
                $("#payform").hide("slow");
                $("#thankyou").show("slow");

            })
            .error(function() {
                alert("Please check your internet connection or data source..");
            });
    }


    $scope.mangodetails = function(req, res) {
        var url = window.location.href;
        //console.log(url);
        var parts = url.split("?");
        var urlparams = parts[1].split('=');
        //console.log(urlparams);
        var id = urlparams[1];
        //console.log(id);

        $("#alertmessage").hide();
        $("#orderform").show();
        $("#preview").hide();
        $("#payform").hide();
        $("#thankyou").hide();
        $("#preview1").hide();

        $http.get(baseurl + 'mangodetails/' + id).success(function(res) {
            if (res.status == 'false') {
                //console.log(res);
            } else {
                $scope.data = res;
                //console.log('mangoList: ', $scope.data);
            }
        }).error(function() {

        });

    }





    //orderCtrl ends
});