var app = angular.module('StocksApp', []);

app.service("sharedProperties", function() {
  let property;
  let stocks;

  return {
    getProperty: function () {
        return property;
    },
    setProperty: function(value) {
        property = value;
    }
};
})

app.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider
      .when('/Search', {
        templateUrl: 'templates/search.html',
        controller: 'AddOrderController'
    })
      .when('/NewPage/:symbol',  {
        templateUrl: 'templates/new_page.html',
        controller: 'ShowOrdersController'
    })
      .otherwise({ redirectTo: '/Search' });
}]);

app.controller('AddOrderController', function($scope, $http, sharedProperties) {
  $scope.stocks = []
  $scope.query;
  $scope.$watch("query", function() {
      $http.get(`https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${$scope.query}&apikey=MYQFG4XWMMGHGZ3E`).then(function(response) {
          response.data.bestMatches.map((obj, i) => {
            let newObj = {}
            for (key in obj) {
              newObj[key.slice(3)] = obj[key]
            }
            $scope.stocks.push(newObj)
          })
      })
    $scope.sharedProperties = sharedProperties;
    $scope.sharedProperties.stocks = $scope.stocks
  })
});

app.controller('ShowOrdersController', function($scope, $http, sharedProperties, $routeParams) {
  let result = sharedProperties.stocks.filter(obj => obj.symbol === $routeParams.symbol)[0]
  console.log(result)
  $scope.stock = result;
});