(function () {
    'use strict';

    angular
        .module('app', [
            'ngStorage',
            'ngSanitize',
            'angularFileUpload',
            "com.2fdevs.videogular",
            "ui.bootstrap.showErrors",
            'ui.router'
        ])
        .constant('RESTRICTED_ROUTES', {
            identifiers: [
                'upload'
            ]
        })
        .factory('Interceptors', [
            '$q',
            '$location',
            '$localStorage',
            'JWTokenizer',
            '$injector',
            function ($q, $location, $localStorage, JWTokenizer, $injector) {
                return {
                    responseError: function (response) {
                        if (response.status === 401 || response.status === 403) {
                            $injector.get('Auth').logout(function () { $location.path('/login'); })
                        }

                        return $q.reject(response);
                    },
                    request: function (config) {
                        config.headers = config.headers || {};

                        JWTokenizer(config.headers);

                        return config;
                    }/*,
                    responseError: function (response) {

                        $injector.get('Auth').logout(function () { $location.path('/login'); })

                        return $q.reject(response);
                    }*/
                };
            }
        ])
        .config(['$stateProvider', '$urlRouterProvider', '$httpProvider', function ($stateProvider, $urlRouterProvider, $httpProvider) {

            $urlRouterProvider.otherwise("/");

            $stateProvider
                .state('state1', {
                    url: "/",
                    templateUrl: "partials/state1.html",
                    controller: 'HomeController',
                    resolve: {
                        user: ['User', function (User) {
                            return User.getUserData();
                        }]
                    }
                }).
                state('state1.login', {
                    url: "login",
                    controller: 'HomeController',
                    templateUrl: 'partials/login.html'
                }).
                state('state1.video', {
                    url: "video",
                    templateUrl: 'partials/video.html',
                    controller: 'VideoController'
                }).
                state('state1.upload', {
                    url: 'upload',
                    templateUrl: 'partials/upload.html',
                    controller: 'UploadController'
                }).
                state('state1.professor', {
                    url: 'professor',
                    templateUrl: 'partials/professor.html',
                    controller: 'ProfessorController',
                    resolve: {
                        professors: ['User', function (User) {
                            return User.getProfessors();
                        }]
                    },
                    id: 'professor'
                }).
                state('state1.discipline', {
                    url: 'discipline/:id',
                    templateUrl: 'partials/discipline.html',
                    controller: 'DisciplineController',
                    resolve: {
                        discipline: ['$stateParams', 'Discipline', function ($stateParams, Discipline) {
                            return Discipline.getDiscipline($stateParams.id);
                        }]
                    },
                    id: 'discipline'
                });

/*            $routeProvider.
                when('/registration', {
                    templateUrl: 'partials/registration.html',
                    controller: 'HomeController',
                    id: 'registration'
                })
*/

            $httpProvider.interceptors.push(
                'Interceptors'
            );
        }])
        .run(function($rootScope, $location, $localStorage, RESTRICTED_ROUTES) {
            $rootScope.$on( "$routeChangeStart", function(event, next) {
                if ($localStorage.token == null) {
                    if (_.indexOf(RESTRICTED_ROUTES.identifiers, next.id) > -1) {
                        $location.path("/login");
                    }
                }
            });
        });
})();