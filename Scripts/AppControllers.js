angular.module('App.Controllers')
    .controller('gitRepoListController', function ($scope, $state, git, localCacheService) {
    $scope.searchByValues = ['stars', 'forks', 'size'];
    $scope.defaultStarsValue = 5;
    $scope.defaultForksValue = 10;
    $scope.defaultSizeValue = 150;
    $scope.searchBy = 'stars';
    $scope.searchValue = $scope.defaultStarsValue;
    //restore previous state if saved:
    if (localCacheService !== undefined)
    {
        if (localCacheService.searchBy !== undefined)
        {
            $scope.searchBy = localCacheService.searchBy;
            $scope.searchValue = localCacheService.searchValue;
            $scope.repositories = localCacheService.repositories;
            window.scrollTo(localCacheService.currentScroolPosition);
        }
    }

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

        $state.go('repositories.list', {});

        //save git state:
        if (localCacheService.repositories)
        {
            localCacheService.searchBy = $scope.searchBy;
            localCacheService.searchValue = $scope.searchValue;
            localCacheService.currentScroolPosition = window.scroolTop();
            localCacheService.repositories = $scope.repositories;
        }
    };
})
    .controller('repositoryController', function ($scope, $http) {
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
})
    .controller('gitRepoDetailsController', function($scope, $stateParams, localCacheService, gitRepo, gitRepoContributors) {
        var params = {owner: $stateParams.repo_owner, repo: $stateParams.repo_name};
        var repo_full_name = $stateParams.repo_owner + '/' + $stateParams.repo_name;
        if ($stateParams.repo !== null && $stateParams.repo !== undefined)
        {
            $scope.repo = $stateParams.repo;
        }
        else
        {
            gitRepo.get(params, function(data) {
                $scope.repo = data;
            });
        }
        //check contributors cache, or get it by ajax
        var isContributorsCacheEmpty = localCacheService.contributors === null || localCacheService.contributors === undefined;
        var isRepoChanged = false;
        if (!isContributorsCacheEmpty)
        {
            isRepoChanged = localCacheService.contributors.repo_full_name !== repo_full_name;
        }
        if(isContributorsCacheEmpty || isRepoChanged)
        {
            gitRepoContributors.query(params, function(data) {
                $scope.contributors = data;
                localCacheService.contributors = data;
                localCacheService.contributors.repo_full_name = repo_full_name;
            });
        } else $scope.contributors = localCacheService.contributors;
    });