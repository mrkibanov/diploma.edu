<?php

namespace App\Http\Requests;

use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class VideoRequest extends Request
{
    public function response(array $errors)
    {
        return new JsonResponse($errors, 422);
    }

    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'file'          => ['required', 'max:200000', 'mimes:mp4'],
            'title'         => ['required', 'string', 'max:255'],
            'description'   => ['required', 'string'],
            'discipline_id' => ['required', 'integer', 'min:1', 'authUserDiscipline'],
        ];
    }

    /**
     * @inheritdoc
     */
    public function messages()
    {
        return [
            'discipline_id.min' => 'Forbidden value for discipline.'
        ];
    }

    public function getValidatorInstance()
    {

        Validator::extend('authUserDiscipline', function($attribute, $value, $parameters)
        {
            return Auth::user()->disciplines()->lists('id')->contains($value);
        });

        return parent::getValidatorInstance();
    }
}
