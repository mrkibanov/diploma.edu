(function () {
    'use strict';

    angular.module('app')
        .factory('Auth', ['$http', '$localStorage', function ($http, $localStorage) {
            function urlBase64Decode(str) {
                var output = str.replace('-', '+').replace('_', '/');
                switch (output.length % 4) {
                    case 0:
                        break;
                    case 2:
                        output += '==';
                        break;
                    case 3:
                        output += '=';
                        break;
                    default:
                        throw 'Illegal base64url string!';
                }
                return window.atob(output);
            }

            function getClaimsFromToken() {
                var token = $localStorage.token;
                var user = {};
                if (typeof token !== 'undefined') {
                    var encoded = token.split('.')[1];
                    user = JSON.parse(urlBase64Decode(encoded));
                }
                return user;
            }

            var tokenClaims = getClaimsFromToken();

            return {
                register: function (data, success, error) {
                    $http.post('registration', data).success(success).error(error)
                },
                login: function (data) {

                    $http
                        .post('login', data)
                        .success(function (res) {
                            $localStorage.token = res.token;
                            window.location = "/";
                        })
                        .error(function () {
                            $rootScope.error = 'Invalid credentials.';
                        });
                },
                logout: function (success) {
                    tokenClaims = {};
                    delete $localStorage.token;
                    success();
                },
                getTokenClaims: function () {
                    return tokenClaims;
                }
            };
        }
        ])
        .factory('Data', ['$http', function ($http) {

            return {
                getRestrictedData: function (success, error) {
                    $http.get('restricted').success(success).error(error)
                },
                getApiData: function (success, error) {
                    $http.get('restricted').success(success).error(error)
                }
            };
        }
        ])
        .factory('User', ['Auth', '$http', function (Auth, $http) {
            var data = {
                    email: '',
                    isAdmin: false
                },
                claims = Auth.getTokenClaims();

            var isLoggedIn = function (claims) {
                return !_.isEmpty(claims);
            };

            if (isLoggedIn(claims)) {

                _.forEach(claims, function(claim, key) {

                    if (!_.isUndefined(data[key])) {
                        data[key] = claim;
                    }
                });
            }

            return {
                getUserData: function () {
                    return data;
                },
                getProfessors: function() {
                    return $http.get('professor');
                }
            };
        }]);
})();