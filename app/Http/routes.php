<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/

use App\User;
use Illuminate\Support\Facades\Input;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Http\Response as HttpResponse;
use Illuminate\Support\Facades\Blade;

Blade::setContentTags('<%', '%>');
Blade::setEscapedContentTags('<%%', '%%>');

Route::get('/', function () {
    return view('spa');
});

Route::post('/registration', function () {
    $credentials = Input::only('email', 'password');

    try {
        $user = User::create($credentials);
    } catch (Exception $e) {
        return Response::json(['error' => 'User already exists.'], HttpResponse::HTTP_CONFLICT);
    }

    $token = JWTAuth::fromUser($user);

    return Response::json(compact('token', 'user'));
});

Route::post('/login', function () {
    $credentials = Input::only('email', 'password');

    if ( ! $token = JWTAuth::attempt($credentials)) {
        return Response::json(false, HttpResponse::HTTP_UNAUTHORIZED);
    }

    $user = JWTAuth::toUser($token);

    return Response::json(
        [
            'token' => JWTAuth::fromUser($user, ['isAdmin' => $user->getIsAdmin(), 'email' => $user->email]),
        ]
    );
});

Route::post('/upload', function () {
    ini_set('upload_max_filesize', '2000M');
    ini_set('post_max_size', '2000M');
    ini_set('max_input_time', 1000);
    ini_set('max_execution_time', 1000);

    Input::file('file')->move(public_path() . '/uploads' ,'file.mp4');

    return ['answer' => 'good'];

});

Route::get('/professor', function () {
    $models = User::professor()->orderBy('name')->get();

    return Response::json($models);
});

Route::get('/restricted', [
    'before' => 'jwt-auth',
    function () {
        $token = JWTAuth::getToken();
        $user = JWTAuth::toUser($token);

        return Response::json([
            'data' => [
                'email' => $user->email,
                'registered_at' => $user->created_at->toDateTimeString()
            ]
        ]);
    }
]);