var app = angular.module('myApp', ["ngRoute","ngStorage"]);
app.config(function($routeProvider) {
    $routeProvider
    .when("/cart", {
        templateUrl : "pages/cart.html"
    })
    .when("/orders", {
        templateUrl : "pages/orderHistory.html"
    })
    .when("/home", {
        templateUrl : "pages/home.html"
    })
    .when("/uiTest", {
        templateUrl : "pages/uiTesting.html"
    })
    .otherwise({
        templateUrl : "pages/home.html"
    });
});