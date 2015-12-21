(function () {
    'use strict';

    angular.module('app')
        .factory('JWTokenizer', ['$localStorage', function ($localStorage) {

            return function (headers) {

                if ($localStorage.token) {
                    headers.Authorization = 'Bearer ' + $localStorage.token;
                }
            }
        }])
        .factory('Auth', ['$http', '$localStorage', '$q', function ($http, $localStorage, $q) {
            var tokenClaims = null;

            var logout = function (success) {
                delete $localStorage.token;
                success();
            };

            var isLoggedIn = function () {
                return $localStorage.token != null;
            };

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
                getTokenClaims: function () {
                    var token = $localStorage.token;
                    var deferred = $q.defer();

                    if (tokenClaims !== null) {
                        deferred.resolve(tokenClaims);

                        return deferred.promise;
                    }

                    if (isLoggedIn()) {

                        return $http.post('checkToken').then(
                            function(response){

                                if (response.data === true) {
                                    tokenClaims = JSON.parse(urlBase64Decode(token.split('.')[1]));

                                    return tokenClaims;
                                }

                                logout(function () {})
                            },
                            function() {
                                logout(function () {})
                            }
                        );
                    }

                    tokenClaims = {};

                    deferred.resolve(tokenClaims);

                    return deferred.promise;
                },
                logout: logout,
                isLoggedIn: isLoggedIn
            };
        }
        ])
        .factory('Discipline', ['$http', function ($http) {
            return {
                getDisciplineVideos: function (id) {
                    return $http.get('videos/' + id);
                },
                getProfessorDisciplines: function (professorId) {
                    return $http.get('professorDisciplines/' + professorId);
                }
            };
        }])
        .factory('User', ['Auth', '$http', '$q', function (Auth, $http, $q) {
            return {
                getUserData: function () {
                    var data = {
                        email: '',
                        isAdmin: false,
                        id: 0
                    },
                        requested = false;

                    if (requested) {
                        var deferred = $q.defer();

                        deferred.resolve(data);

                        return deferred.promise;
                    }

                    return Auth.getTokenClaims().then(
                        function (response) {
                            _.forEach(response, function(claim, key) {

                                if (!_.isUndefined(data[key])) {
                                    data[key] = claim;
                                }
                            });

                            data.id = response.sub || 0;

                            requested = true;

                            return data;
                        }
                    );
                },
                getProfessors: function() {
                    return $http.get('professor');
                }
            };
        }]);
})();