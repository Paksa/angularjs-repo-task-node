var App = angular.module('App', ['ngResource']);

App.filter('cut', function () {
    return function (string, strMaxLength) {
        if (!string) return '';
        strMaxLength = parseInt(strMaxLength);
        if (!strMaxLength) return string;
        if (string.length <= strMaxLength) return string;
        string = string.substr(0, strMaxLength);
        return string + ' …';
    };
});

App.factory("git", function($resource) {
    return $resource("https://api.github.com/search/repositories?q=stars=:starsCountParam&size=:sizeKbParam&forks=:forksCountParam");
});

App.controller('repositoryController', function ($scope, $http) {
    $http.get('repositories.json')
         .then(function (res) {
            $scope.repositories = res.data;
            $scope.filter = 'id';
            $scope.filters = [
                { 'filter': 'id' },
                { 'filter': 'name' },
                { 'filter': 'full_name'},
                { 'filter': 'owner.login'},
                { 'filter': 'owner.id'}
            ];
            $scope.filterNames = [
                { 'lookupCode': 'id', 'description': 'Identificator (ID)' },
                { 'lookupCode': 'name', 'description': 'Repo Short Name' },
                { 'lookupCode': 'full_name', 'description': 'Repo Full Name' },
                { 'lookupCode': 'owner.login', 'description': 'Owner Login' },
                { 'lookupCode': 'owner.id', 'description': 'Owner Identificator (ID)' }];
            $scope.reverse = 'false';
            $scope.reverses = [{ 'reverse': 'true' }, { 'reverse': 'false' }];
            $scope.reverseNames = [
                { 'lookupCode': 'true', 'description': 'Ascending' },
                { 'lookupCode': 'false', 'description': 'Descending' }];
            $scope.limit = 100;
            $scope.onLimitChange = function() {
                if ($scope.limit === '0') {
                    $scope.limit = Infinity;
                }
            };
    });
});

App.controller('gitController', function ($scope, git) {
    $scope.searchByValues = ['stars', 'forks', 'size'];
    $scope.defaultStarsValue = 5;
    $scope.defaultForksValue = 10;
    $scope.defaultSizeValue = 150;
    $scope.searchBy = 'stars';
    $scope.searchValue = $scope.defaultStarsValue;

    $scope.onSearchTypeChanged = function() {
        if ($scope.searchBy === "stars") {
            $scope.searchValue = $scope.defaultStarsValue;
        }
        if ($scope.searchBy === "forks") {
            $scope.searchValue = $scope.defaultForksValue;
        }
        if ($scope.searchBy === "size") {
            $scope.searchValue = $scope.defaultSizeValue;
        }
    }

    $scope.onSearchButtonClickHandler = function() {
        var params = {};
        if ($scope.searchBy === "stars") {
            if ($scope.searchValue < 0) {
                alert("Search value for searching by stars must be greater than zero");
                return;
            };
            params.starsCountParam = $scope.searchValue;
        };
        if ($scope.searchBy === "forks") {
            if ($scope.searchValue < 0) {
                alert("Search value for searching by forks number must be greater or equal to 0");
                return;
            };
            params.forkCountParam = $scope.searchValue;
        };
        if ($scope.searchBy === "size") {
            if ($scope.searchValue <= 0) {
                alert("Search value for searching by size must be greater than 0");
                return;
            };
            params.sizeKbParam = $scope.searchValue;
        };
        
        git.get(params, function (data) {
            $scope.repositories = data.items;
        });
    };

    
});