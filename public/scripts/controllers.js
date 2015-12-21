(function () {
    'use strict';

    angular.module('app')
        .controller('HomeController', ['$rootScope', '$scope', '$location', '$localStorage', 'Auth', 'user',
            function ($rootScope, $scope, $location, $localStorage, Auth, user) {

                $scope.user = user;

                console.log($scope.user);

                $scope.isLoggedIn = Auth.isLoggedIn;

                $scope._ = _;

                $scope.login = function () {

                    Auth.login({
                        email: $scope.email,
                        password: $scope.password
                    })
                };

                $scope.register = function () {
                    var formData = {
                        email: $scope.email,
                        password: $scope.password,
                        name: $scope.name,
                        surname: $scope.surname,
                        patronymic: $scope.patronymic
                    };

                    Auth.register(
                        formData,
                        function (res) {
                            window.location = "/";
                        },
                        function (res) {
                            $rootScope.error = res.error || 'Failed to sign up.';
                        }
                    )
                };

                $scope.logout = function () {
                    Auth.logout(function () {
                        window.location = "/"
                    });
                };
            }])
        .controller('WatchController', ['$sce', '$scope', 'video', function ($sce, $scope, video) {
            $scope.video = video.data;
            console.log($scope.video)
            $scope.config = {
                preload: "none",
                sources: [
                    {src: "/uploads/video/" + video.data.file_name + ".mp4", type: "video/mp4"}
                ],
                theme: {
                    url: "http://www.videogular.com/styles/themes/default/latest/videogular.css"
                }
            };
        }])
        .controller('ProfessorController', ['$scope', 'professors', function ($scope, professors) {
            $scope.professors = professors.data;
        }])
        .controller('DisciplinesController', ['$scope', 'Discipline', 'Auth', 'User', function ($scope, Discipline, Auth, User) {

            $scope.submit = function () {

                Discipline.addDiscipline({name: $scope.title}).then(function () {
                        User.getUserData().then(function (response) {
                            $scope.$parent.user = response;
                            console.log('u:', $scope.$parent.user);
                        })
                });
            }
        }])
        .controller('VideosController', ['$scope', 'videos', function ($scope, videos) {
            console.log(videos.data);
            $scope.videos = videos.data;
        }])
        .controller(
            'UploadController',
            [
                '$scope',
                'FileUploader',
                'JWTokenizer',
                'Discipline',
                'Auth',
                '$location',
                function ($scope, FileUploader, JWTokenizer, Discipline, Auth, $location) {

                    Discipline.getProfessorDisciplines($scope.user.id).then(function (result) {
                        $scope.disciplines = result.data;
                    });

                    var uploader = $scope.uploader = new FileUploader({
                            queueLimit: 1,
                            url: '/upload'
                        });

                    uploader.filters.push({
                        name: 'videoFilter',
                        fn: function(item, options) {
                            var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                            return '|mp4|'.indexOf(type) !== -1;
                        }
                    });

                    $scope.submit = function () {
                        $scope.$broadcast('show-errors-check-validity');

                        if ($scope.videoForm.$invalid) {
                            return;
                        }

                        uploader.uploadAll();
                    };

                    $scope.form = {
                        description: { value: '', error: ''},
                        title: { value: '', error: ''},
                        discipline_id: { value: '', error: ''}
                    };

                    uploader.onBeforeUploadItem = function(item) {
                        item.formData = [
                            {title: $scope.form.title.value},
                            {discipline_id: $scope.form.discipline_id.value},
                            {description: $scope.form.description.value}
                        ];

                        JWTokenizer(item.headers);
                    };

                    uploader.onErrorItem = function (item, response, status, headers) {
                        if (status === 401 || status === 403) {
                            Auth.logout(function () { $location.path('/login'); })
                        }
                    }
                }
            ]
        );
})();