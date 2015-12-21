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
            states: [
                'state1.upload'
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
                    }
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
                state('state1.watch', {
                    url: "watch/:id",
                    templateUrl: 'partials/watch.html',
                    controller: 'WatchController',
                    resolve: {
                        video: ['$stateParams', 'Video', function ($stateParams, Video) {
                            return Video.getById($stateParams.id);
                        }]
                    }
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
                    }
                }).
                state('state1.videos', {
                    url: 'videos/:id',
                    templateUrl: 'partials/videos.html',
                    controller: 'VideosController',
                    resolve: {
                        videos: ['$stateParams', 'Discipline', function ($stateParams, Discipline) {
                            return Discipline.getDisciplineVideos($stateParams.id);
                        }]
                    }
                }).
                state('state1.registration', {
                    url: 'registration',
                    templateUrl: 'partials/registration.html',
                    controller: 'HomeController'
                });

            $httpProvider.interceptors.push(
                'Interceptors'
            );
        }])
        .run(function($rootScope, $location, $localStorage, RESTRICTED_ROUTES) {
            $rootScope.$on( "$stateChangeStart", function(event, next) {
                if ($localStorage.token == null) {
                    console.log(next);
                    if (_.indexOf(RESTRICTED_ROUTES.states, next.name) > -1) {
                        $location.path("/login");
                    }
                }
            });
        });
})();