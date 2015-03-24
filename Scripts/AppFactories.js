angular.module('App.Factories')
    .factory("git", function($resource) {
        return $resource("https://api.github.com/search/repositories?q=stars=:starsCountParam&size=:sizeKbParam&forks=:forksCountParam");
    })
    .factory("gitRepo", function($resource) {
        return $resource("https://api.github.com/repos/:owner/:repo/");
    })
    .factory("gitRepoContributors", function($resource) {
        return $resource("https://api.github.com/repos/:owner/:repo/contributors");
    })
    .factory('localCacheService', [function() {
        var data = {};
        return data;
    }]);


