angular.module('App.Filters',[])
    //Reduce string length to strMaxLength
    .filter('cut', function () {
        return function (str, strMaxLength) {
            if (!str) return '';
            strMaxLength = parseInt(strMaxLength);
            if (!strMaxLength) return str;
            if (str.length <= strMaxLength) return str;
            str = str.substr(0, strMaxLength);
            return str + ' …';
        };
    });
