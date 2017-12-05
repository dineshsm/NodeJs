angular.module('orderController', [])

	.controller('vieworderController', ['$scope','$http','$filter', function($scope, $http,$filter) {
		$scope.showNavMenu = false;
		$scope.orderDetail = {};
	}]);
