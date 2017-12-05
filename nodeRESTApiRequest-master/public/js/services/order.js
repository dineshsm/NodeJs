angular.module('orderService', [])

	// super simple service
	// each function returns a promise object 
	.factory('Order', ['$http',function($http) {
		return {
			get : function() {
				return $http.get('/api/order');
			}
		}
	}]).factory('OrderItem', ['$http',function($http) {
		return {
			post : function(data) {
				var input = $.param({
            					json: JSON.stringify(data)
				});
				return $http.post('/api/orderitem',JSON.stringify(data));
			}
		}
	}])/*.factory('Contracts', ['$http',function($http) {
		return {
			get : function() {
				return $http.get('/api/contracts');
			}
		}
	}])*/
	.factory('Pricebook', ['$http',function($http) {
		return {
			get : function() {
				return $http.get('/api/pricebook');
			}
		}
	}]).factory('Products', ['$http',function($http) {
		return {
			get : function(pbId) {
				return $http.get('/api/products/'+pbId);
			}
		}
	}]);
