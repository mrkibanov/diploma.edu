(function () {
    'use strict';

    angular
        .module('app', [
            'ngStorage',
            'ngRoute',
            'ngSanitize',
            'angularFileUpload',
            "com.2fdevs.videogular",
            'ngTable'
        ])
        .config(['$routeProvider', '$httpProvider', function ($routeProvider, $httpProvider) {
            $routeProvider.
                when('/', {
                    templateUrl: 'partials/home.html',
                    controller: 'HomeController'
                }).
                when('/login', {
                    templateUrl: 'partials/login.html',
                    controller: 'HomeController'
                }).
                when('/registration', {
                    templateUrl: 'partials/registration.html',
                    controller: 'HomeController'
                }).
                when('/restricted', {
                    templateUrl: 'partials/restricted.html',
                    controller: 'RestrictedController'
                }).
                when('/video', {
                    templateUrl: 'partials/video.html',
                    controller: 'VideoController'
                }).
                when('/upload', {
                    templateUrl: 'partials/upload.html',
                    controller: 'UploadController'
                }).
                when('/professor', {
                    templateUrl: 'partials/professor.html',
                    controller: 'ProfessorController',
                    resolve: {
                        professors: ['$route', 'User', function ($route, User) {
                            return User.getProfessors();
                        }]
                    }
                }).
                otherwise({
                    redirectTo: '/'
                });

            $httpProvider.interceptors.push(['$q', '$location', '$localStorage', function ($q, $location, $localStorage) {
                return {
                    'request': function (config) {
                        config.headers = config.headers || {};

                        if ($localStorage.token) {
                            config.headers.Authorization = 'Bearer ' + $localStorage.token;
                            console.log('token: ', $localStorage.token)
                        }
                        return config;
                    },
                    'responseError': function (response) {
                        if (response.status === 401 || response.status === 403) {
                            delete $localStorage.token;
                            $location.path('/login');
                        }
                        return $q.reject(response);
                    }
                };
            }]);
        }])
        .run(function($rootScope, $location, $localStorage) {
            $rootScope.$on( "$routeChangeStart", function(event, next) {
                if ($localStorage.token == null) {
                    if ( next.templateUrl === "partials/restricted.html") {
                        $location.path("/login");
                    }
                }
            });
        });
})();