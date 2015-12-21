(function () {
    'use strict';

    angular.module('app')
        .controller('HomeController', ['$rootScope', '$scope', '$location', '$localStorage', 'Auth', 'user',
            function ($rootScope, $scope, $location, $localStorage, Auth, user) {

                $scope.user = user;

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
                        password: $scope.password
                    };

                    Auth.register(formData, successAuth, function (res) {
                        $rootScope.error = res.error || 'Failed to sign up.';
                    })
                };

                $scope.logout = function () {
                    Auth.logout(function () {
                        window.location = "/"
                    });
                };
            }])
        .controller('VideoController', ['$sce', '$scope', function ($sce, $scope) {
            $scope.config = {
                preload: "none",
                sources: [
                    {src: "/uploads/file.mp4", type: "video/mp4"}
                ],
                theme: {
                    url: "http://www.videogular.com/styles/themes/default/latest/videogular.css"
                }
            };
        }])
        .controller('ProfessorController', ['$scope', 'professors', function ($scope, professors) {
            $scope.professors = professors.data;
        }])
        .controller('DisciplineController', ['$scope', 'discipline', function ($scope, discipline) {
            console.log(discipline.data);
            $scope.discipline = discipline.data;
        }])
        .controller(
            'UploadController',
            [
                '$scope',
                'FileUploader',
                'JWTokenizer',
                'Discipline',
                'Auth',
                function ($scope, FileUploader, JWTokenizer, Discipline, Auth) {

                    Discipline.getProfessorDisciplines($scope.user.id).then(function (result) {
                        $scope.disciplines = result.data;
                    });

                    var uploader = $scope.uploader = new FileUploader({
                            queueLimit: 1,
                            url: '/upload'
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
                            $injector.get('Auth').logout(function () { $location.path('/login'); })
                        }
                    }
                }
            ]
        );
})();