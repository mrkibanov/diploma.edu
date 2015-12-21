var elixir = require('laravel-elixir'),
    gulp = require('gulp'),
    resourcesPath = 'resources/assets',
    resourcesJsPath = resourcesPath + '/js/',
    resourcesCssPath = resourcesPath + '/css/',
    publicPath = 'public',
    publicJsPath = publicPath + '/js/',
    publicCssPath = publicPath + '/css/';

/**
 * Copy any needed files.
 *
 * Do a 'gulp copyfiles' after bower updates
 */
gulp.task("copyfiles", function() {

    var bowerPath = 'vendor/bower_dl/';

    gulp.src(bowerPath + "jquery/dist/jquery.min.js")
     .pipe(gulp.dest(resourcesJsPath));

    gulp.src(bowerPath + "bootstrap/dist/css/bootstrap.min.css")
     .pipe(gulp.dest(resourcesCssPath));

    gulp.src(bowerPath + "bootstrap/dist/js/bootstrap.min.js")
     .pipe(gulp.dest(resourcesJsPath));

    gulp.src(bowerPath + "bootstrap/dist/fonts/**")
     .pipe(gulp.dest(publicPath + "/fonts"));

    gulp.src(bowerPath + "angular/angular.min.js")
        .pipe(gulp.dest(resourcesJsPath));

    gulp.src(bowerPath + "ngstorage/ngStorage.min.js")
        .pipe(gulp.dest(resourcesJsPath));

    gulp.src(bowerPath + "angular-sanitize/angular-sanitize.min.js")
        .pipe(gulp.dest(resourcesJsPath));

    gulp.src(bowerPath + "videogular/videogular.min.js")
        .pipe(gulp.dest(resourcesJsPath));

/*    gulp.src(bowerPath + "angular-route/angular-route.min.js")
        .pipe(gulp.dest(resourcesJsPath));*/

    gulp.src(bowerPath + "angular-strap/dist/angular-strap.min.js")
        .pipe(gulp.dest(resourcesJsPath));

    gulp.src(bowerPath + "angular-file-upload/dist/angular-file-upload.min.js")
        .pipe(gulp.dest(resourcesJsPath));

    gulp.src(bowerPath + "pace/themes/red/pace-theme-minimal.css")
        .pipe(gulp.dest(resourcesCssPath));

    gulp.src(bowerPath + "pace/pace.min.js")
        .pipe(gulp.dest(resourcesJsPath));

    gulp.src(bowerPath + "lodash/lodash.min.js")
        .pipe(gulp.dest(resourcesJsPath));

    gulp.src(bowerPath + "ng-table/dist/ng-table.min.js")
        .pipe(gulp.dest(resourcesJsPath));

    gulp.src(bowerPath + "ng-table/dist/ng-table.min.css")
        .pipe(gulp.dest(resourcesCssPath));

    gulp.src(bowerPath + "angular-bootstrap-show-errors/src/showErrors.min.js")
        .pipe(gulp.dest(resourcesJsPath));

    gulp.src(bowerPath + "angular-ui-router/release/angular-ui-router.min.js")
        .pipe(gulp.dest(resourcesJsPath));
});

gulp.task("copyjssources", function() {
    gulp.src(resourcesJsPath + "jquery.min.js")
        .pipe(gulp.dest(publicJsPath));

    gulp.src(resourcesJsPath + "bootstrap.min.js")
        .pipe(gulp.dest(publicJsPath));

    gulp.src(resourcesJsPath + "angular.min.js")
        .pipe(gulp.dest(publicJsPath));

    gulp.src(resourcesJsPath + "ngStorage.min.js")
        .pipe(gulp.dest(publicJsPath));

    gulp.src(resourcesJsPath + "angular-sanitize.min.js")
        .pipe(gulp.dest(publicJsPath));

    gulp.src(resourcesJsPath + "videogular.min.js")
        .pipe(gulp.dest(publicJsPath));

/*    gulp.src(resourcesJsPath + "angular-route.min.js")
        .pipe(gulp.dest(publicJsPath));*/

    gulp.src(resourcesJsPath + "angular-strap.min.js")
        .pipe(gulp.dest(publicJsPath));

    gulp.src(resourcesJsPath + "angular-file-upload.min.js")
        .pipe(gulp.dest(publicJsPath));

    gulp.src(resourcesJsPath + "pace.min.js")
        .pipe(gulp.dest(publicJsPath));

    gulp.src(resourcesJsPath + "lodash.min.js")
        .pipe(gulp.dest(publicJsPath));

    gulp.src(resourcesJsPath + "ng-table.min.js")
        .pipe(gulp.dest(publicJsPath));

    gulp.src(resourcesJsPath + "showErrors.min.js")
        .pipe(gulp.dest(publicJsPath));

    gulp.src(resourcesJsPath + "angular-ui-router.min.js")
        .pipe(gulp.dest(publicJsPath));
});

/*
 |--------------------------------------------------------------------------
 | Elixir Asset Management
 |--------------------------------------------------------------------------
 |
 | Elixir provides a clean, fluent API for defining some basic Gulp tasks
 | for your Laravel application. By default, we are compiling the Sass
 | file for our application, as well as publishing vendor resources.
 |
 */

elixir(function(mix) {
    // Combine scripts
    mix.scripts([
            'js/jquery.min.js',
            'js/bootstrap.min.js',
            'js/pace.min.js',
            'js/angular.min.js',
            'js/lodash.min.js',
            'js/angular-sanitize.min.js',
            'js/videogular.min.js',
            'js/ngStorage.min.js',
            /*'js/angular-route.min.js',*/
            'js/angular-strap.min.js',
            'js/angular-file-upload.min.js',
            'js/ng-table.min.js',
            'js/showErrors.min.js',
            'js/angular-ui-router.min.js'
        ],
        publicJsPath + 'main.js',
        resourcesPath
    );

    mix.styles([
            'css/bootstrap.min.css',
            'css/pace-theme-minimal.css',
            'css/ng-table.min.css',
            'css/style.css'
        ],
        publicCssPath + 'main.css',
        resourcesPath
    );
});
