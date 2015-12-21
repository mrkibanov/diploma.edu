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

use App\Http\Requests\VideoRequest;
use App\Models\Discipline;
use App\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Input;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Route;
use Intervention\Image\ImageManager;
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

Route::post(
    '/upload',
    [
        'middleware' => 'jwt.auth',
        function (VideoRequest $request) {

            return Response::json(['fsdfsdfsd' => 'fsdfsdf'], 403);

            ini_set('upload_max_filesize', '2000M');
            ini_set('post_max_size', '2000M');
            ini_set('max_input_time', 1000);
            ini_set('max_execution_time', 1000);

            $nameArray = explode('.', Input::file('file')->getClientOriginalName());
            $extension = end($nameArray);
            $newBaseFileName = time() . uniqid();
            $newFileName = $newBaseFileName . '.' . $extension;
            $basePath = public_path() . '/uploads/';
            $videoPath = $basePath . 'video';
            $framePath = $basePath . 'frames/' . $newBaseFileName . '.jpg';

            Input::file('file')->move($videoPath , $newFileName);

            FFMpeg\FFMpeg::create()
                ->open($videoPath . '/' . $newFileName)
                ->frame(FFMpeg\Coordinate\TimeCode::fromSeconds(5))
                ->save($framePath);

            $manager = new ImageManager(array('driver' => 'imagick'));

            $manager
                ->make($framePath)
                ->resize(150, null, function ($constraint) {
                    $constraint->aspectRatio();
                })
                ->save($framePath);


            return Response::json(['answer' => 'good']);
        }
    ]
);

Route::get('/professor', function () {
    $models = User::professor()->with('disciplines')->orderBy('name')->get();

    return Response::json($models);
});

Route::get('/discipline/{id}', function ($id) {
    $model = Discipline::with('videos')->find($id);

    return Response::json($model);
});

Route::get('/professorDisciplines/{professorId}', function ($professorId) {

    $user = User::find($professorId);
    $disciplines = $user->disciplines;

    return Response::json($disciplines);
});

Route::post('/checkToken', [
    'before' => 'jwt-auth',
    function () {
        return Response::json(true);
    }
]);