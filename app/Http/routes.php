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
use App\Models\Video;
use App\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Input;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Route;
use Intervention\Image\ImageManager;
use Symfony\Component\HttpFoundation\Request;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Http\Response as HttpResponse;
use Illuminate\Support\Facades\Blade;

Blade::setContentTags('<%', '%>');
Blade::setEscapedContentTags('<%%', '%%>');

Route::get('/', function () {
    return view('spa');
});

Route::post('/createDiscipline', ['middleware' => 'jwt.auth', function () {

    $discipline = new Discipline();
    $discipline->name = Input::get('name');
    $discipline->professor_id = Auth::user()->id;;
    $discipline->save();

    return Response::json($discipline);
}]);

Route::post('/registration', function () {
    $credentials = Input::only('email', 'password', 'name', 'surname', 'patronymic');

    try {
        $user = User::create($credentials);
    } catch (Exception $e) {
        return Response::json(['error' => $e->getMessage()], HttpResponse::HTTP_CONFLICT);
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
            'token' => JWTAuth::fromUser(
                $user,
                [
                    'isAdmin' => $user->getIsAdmin(),
                    'email' => $user->email,
                    'disciplines' => $user->disciplines
                ]
            ),
        ]
    );
});

Route::post(
    '/upload',
    [
        'middleware' => 'jwt.auth',
        /**
         * @param VideoRequest $request
         * @return mixed
         */
        function (VideoRequest $request) {

            /*return Response::json(['fsdfsdfsd' => 'fsdfsdf'], 403);*/

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

            FFMpeg\FFMpeg::create(
                [
                    'ffmpeg.binaries' => base_path() . '/ffmpeg/ffmpeg.exe',
                    'ffprobe.binaries' => base_path() . '/ffmpeg/ffprobe.exe',
                ]
            )
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

            $model = new Video();

            $model->description = $request->description;
            $model->discipline_id = $request->discipline_id;
            $model->title = $request->title;
            $model->user_id = Auth::user()->id;
            $model->file_name = $newBaseFileName;

            $model->save();

            return Response::json(['answer' => 'good']);
        }
    ]
);

Route::get('/professor', function () {
    $models = User::professor()->with('disciplines.videos')->orderBy('name')->get();

    return Response::json($models);
});

Route::get('/video/{id}', function ($id) {
    $model = Video::with(
        [
            'discipline' => function ($q) use ($id) {
                $q->with(
                    [
                        'videos' => function ($q) use ($id) {
                            $q
                                ->orderBy('created_at', 'DESC')
                                ->where('id', '!=', $id)
                                ->limit(3);
                        }
                    ]
                );
            }
        ]
    )->with('user')->find($id);

    return Response::json($model);
});

Route::get('/videos/{discipline_id}', function ($discipline_id) {
    $model = Video::with('discipline')->with('user')->where('discipline_id', '=', $discipline_id)->get();

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

Route::post('/updateToken', [
    'middleware' => 'jwt.auth',
    function () {
        $user = Auth::user();

        return Response::json(
            [
                'token' => JWTAuth::fromUser(
                    $user,
                    [
                        'isAdmin' => $user->getIsAdmin(),
                        'email' => $user->email,
                        'disciplines' => $user->disciplines
                    ]
                ),
            ]
        );
    }
]);