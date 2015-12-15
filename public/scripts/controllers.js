(function () {
    'use strict';

    angular.module('app')
        .controller('HomeController', ['$rootScope', '$scope', '$location', '$localStorage', 'Auth', 'User',
            function ($rootScope, $scope, $location, $localStorage, Auth, User) {
                $scope.user = User.getUserData();

                console.log($scope.user);

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
                $scope.token = $localStorage.token;
                $scope.tokenClaims = Auth.getTokenClaims();
            }])

        .controller('RestrictedController', ['$rootScope', '$scope', 'Data', function ($rootScope, $scope, Data) {
            Data.getRestrictedData(function (res) {
                $scope.data = res.data;
            }, function () {
                $rootScope.error = 'Failed to fetch restricted content.';
            });
            Data.getApiData(function (res) {
                $scope.api = res.data;
            }, function () {
                $rootScope.error = 'Failed to fetch restricted API content.';
            });
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
        .controller('ProfessorController', ['User', '$scope', 'professors', function (User, $scope, professors) {



            $scope.professors = professors;
            console.log ($scope.professors);
        }])
        .controller('UploadController', ['$scope', 'FileUploader', function ($scope, FileUploader) {
            var uploader = $scope.uploader = new FileUploader({
                url: '/upload'
            });

            uploader.filters.push({
                name: 'customFilter',
                fn: function(item /*{File|FileLikeObject}*/, options) {
                    return this.queue.length < 10;
                }
            });

            uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
                console.info('onWhenAddingFileFailed', item, filter, options);
            };
            uploader.onAfterAddingFile = function(fileItem) {
                console.info('onAfterAddingFile', fileItem);
            };
            uploader.onAfterAddingAll = function(addedFileItems) {
                console.info('onAfterAddingAll', addedFileItems);
            };
            uploader.onBeforeUploadItem = function(item) {
                console.info('onBeforeUploadItem', item);
            };
            uploader.onProgressItem = function(fileItem, progress) {
                console.info('onProgressItem', fileItem, progress);
            };
            uploader.onProgressAll = function(progress) {
                console.info('onProgressAll', progress);
            };
            uploader.onSuccessItem = function(fileItem, response, status, headers) {
                console.info('onSuccessItem', fileItem, response, status, headers);
            };
            uploader.onErrorItem = function(fileItem, response, status, headers) {
                console.info('onErrorItem', fileItem, response, status, headers);
            };
            uploader.onCancelItem = function(fileItem, response, status, headers) {
                console.info('onCancelItem', fileItem, response, status, headers);
            };
            uploader.onCompleteItem = function(fileItem, response, status, headers) {
                console.info('onCompleteItem', fileItem, response, status, headers);
            };
            uploader.onCompleteAll = function() {
                console.info('onCompleteAll');
            };

            console.info('uploader', uploader);
        }]);
})();