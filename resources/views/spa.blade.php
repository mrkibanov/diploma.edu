<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>Laravel 5 / AngularJS JWT example</title>

    <link rel="stylesheet" href="/css/main.css">

    <script src="http://nervgh.github.io/js/es5-shim.min.js"></script>
    <script src="http://nervgh.github.io/js/es5-sham.min.js"></script>

    <script>paceOptions = {ajax: {trackMethods: ['GET', 'POST']}};</script>

    <!-- HTML5 shim and Respond.js IE8 support of HTML5 elements and media queries -->
    <!--[if lt IE 9]>
    <script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>
    <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
    <![endif]-->

    <script src="/js/main.js"></script>
</head>

<body ng-app="app" ng-controller="HomeController">

    <div class="wrap">
        <nav class="navbar-inverse navbar-fixed-top navbar" role="navigation"  bs-navbar>
            <div class="container">
                <div class="navbar-header">
                    <button ng-init="navCollapsed = true" ng-click="navCollapsed = !navCollapsed" type="button" class="navbar-toggle">
                        <span class="sr-only">Toggle navigation</span>
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span></button>
                    <a class="navbar-brand" href="#/">YouTube</a>
                </div>
                <div ng-class="!navCollapsed && 'in'" ng-click="navCollapsed=true" class="collapse navbar-collapse" >
                    <ul class="navbar-nav navbar-right nav">
                        <li data-match-route="/professor">
                            <a href="#/professor">Professors</a>
                        </li>
                        <li data-match-route="/video">
                            <a href="#/video">Video</a>
                        </li>
                        <li data-match-route="/dashboard" ng-show="token" class="ng-hide">
                            <a href="#/dashboard">Dashboard</a>
                        </li>
                        <li data-match-route="/upload" ng-show="token">
                            <a href="#/upload">Upload</a>
                        </li>
                        <li ng-class="{active:isActive('/logout')}" ng-show="token" ng-click="logout()"  class="ng-hide">
                            <a href="">Logout({{this.user.email}})</a>
                        </li>
                        <li data-match-route="/login" ng-hide="token">
                            <a href="#/login">Login</a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>

        <div class="container">
            <div ng-view></div>
        </div>
    </div>

    <footer class="footer">
        <div class="container">
            <p class="pull-left">&copy; YouTube LP</p>

            <p class="pull-right">Laravel</p>
        </div>
    </footer>

    <script src="/scripts/app.js"></script>
    <script src="/scripts/controllers.js"></script>
    <script src="/scripts/services.js"></script>
</body>
</html>