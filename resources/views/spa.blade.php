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

    <script>
        paceOptions = {
            document: true, // disabled
            eventLag: true,
            restartOnPushState: true,
            restartOnRequestAfter: true,
            ajax: {
                trackMethods: [ 'POST','GET']
            }
        };
    </script>

    <!-- HTML5 shim and Respond.js IE8 support of HTML5 elements and media queries -->
    <!--[if lt IE 9]>
    <script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>
    <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
    <![endif]-->

    <script src="/js/main.js"></script>
</head>

<body ng-app="app" ui-view></body>

<script src="/scripts/app.js"></script>
<script src="/scripts/controllers.js"></script>
<script src="/scripts/services.js"></script>

</html>