<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Schema;

class AlterUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('users', function($table)
        {
            $table->dropColumn('name');
        });

        Schema::table('users', function($table)
        {
            $table->string('name')->nullable();
            $table->string('surname')->nullable();
            $table->string('patronymic')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('users', function($table)
        {
            $table->dropColumn('surname');
            $table->dropColumn('patronymic');
        });
    }
}
