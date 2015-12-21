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
        .factory('Video', ['$http', function ($http) {
            return {
                getById: function (id) {
                    return $http.get('video/' + id);
                }
            }
        }])
        .factory('Auth', ['$http', '$localStorage', '$q', function ($http, $localStorage, $q) {

            var logout = function (success) {
                delete $localStorage.token;
                success();
            };

            var isLoggedIn = function () {
                return $localStorage.token != null;
            };

            var getTokenClaims = function () {
                var token = $localStorage.token;
                var deferred = $q.defer();

                if (isLoggedIn()) {

                    return $http.post('checkToken').then(
                        function(response){

                            if (response.data === true) {

                                return JSON.parse(urlBase64Decode(token.split('.')[1]));
                            }

                            logout(function () {})
                        },
                        function() {
                            logout(function () {})
                        }
                    );
                }

                deferred.resolve({});

                return deferred.promise;
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
                updateClaims: function () {
                    return $http
                        .post('updateToken')
                        .then(function (response) {
                            $localStorage.token = response.data.token;
                        });
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
                getTokenClaims: getTokenClaims,
                logout: logout,
                isLoggedIn: isLoggedIn
            };
        }
        ])
        .factory('Discipline', ['$http', 'Auth', function ($http, Auth) {
            return {
                getDisciplineVideos: function (id) {
                    return $http.get('videos/' + id);
                },
                getProfessorDisciplines: function (professorId) {
                    return $http.get('professorDisciplines/' + professorId);
                },
                addDiscipline: function (data) {
                    return $http.post('createDiscipline', data)
                        .then(function() {
                            return Auth.updateClaims()
                        });
                }
            };
        }])
        .factory('User', ['Auth', '$http', '$q', function (Auth, $http, $q) {
            return {
                getUserData: function () {
                    var data = {
                        email: '',
                        isAdmin: false,
                        disciplines: [],
                        id: 0
                    };

                    return Auth.getTokenClaims().then(
                        function (response) {
                            _.forEach(response, function(claim, key) {

                                if (!_.isUndefined(data[key])) {
                                    data[key] = claim;
                                }
                            });

                            data.id = response.sub || 0;

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