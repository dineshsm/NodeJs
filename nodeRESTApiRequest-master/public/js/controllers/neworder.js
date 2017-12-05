angular.module('orderController', [])

	.controller('neworderController', ['$scope','$http','$filter','Pricebook','Products','OrderItem','Order','$location', function($scope, $http,$filter, Pricebook,Products,OrderItem,Order,$location) {
		$scope.showNavMenu = false;
		$scope.pricebook = {};
		$scope.pricebooks = [];
		$scope.showList = false;
		$scope.selected = false;
		$scope.productSelected = false;
		$scope.selectedPriceBookEntry = [];
		Pricebook.get()
		.success(function(data) {
			$scope.pricebooks = data;
		});
		$scope.products = [];
		$scope.onPricebookSelect =function(pb){
			$scope.selected = true;
			$scope.pricebook = pb;
			$scope.products = [];
			Products.get(pb.sfid)
			.success(function(data) {
				for(var i=0;i< data.length;i++){
					data[i].selected = false;
				}
				$scope.products = data;
				
			});		
		}
		$scope.onProductSelected =function(pb){
		   $scope.productSelected = true;
		   $scope.selectedPriceBookEntry = [];
		   for(var i=0;i < $scope.products.length;i++){
		   	if($scope.products[i].selected){
		   		$scope.products[i].quantity = 0;
		   		$scope.selectedPriceBookEntry.push($scope.products[i]);
		   	}
		   }
			
		}
		$scope.onCreateOrder =function(){
			$scope.input = {};
		   	$scope.order = {};
			if($scope.selectedPriceBookEntry.length > 0){
				$scope.order.pricebook2Id = $scope.selectedPriceBookEntry[0].pricebook2id;
			}
			//item.dateAsString = $filter('date')(item.date, "yyyy-MM-dd");
			$scope.order.EffectiveDate = new Date();
			$scope.order.Status = 'Draft';
			$scope.orderItems =[];
			for(var i=0;i<$scope.selectedPriceBookEntry.length;i++){
				$scope.orderItems.push({
					pricebookentryId : $scope.selectedPriceBookEntry[0].sfid,
					quantity : $scope.selectedPriceBookEntry[0].quantity,
					unitprice : $scope.selectedPriceBookEntry[0].unitprice,
					Description : $scope.selectedPriceBookEntry[0].description
				});
			}
			$scope.input.order = $scope.order;
			$scope.input.orderItems = $scope.orderItems;
			OrderItem.post($scope.input).success(function(data) {
				window.location="/orders";
			});		
		}
	}]);
