@extends('layouts/layoutMaster')

@section('title', 'Perfil')

@section('content')
<div class="container-xxl container-p-y">
    <div class="row">
        <div class="col-12">
            <div class="card mb-4">
                <div class="card-header">
                    <h5 class="mb-0">Información del perfil</h5>
                </div>
                <div class="card-body">
                    @include('profile.partials.update-profile-information-form')
                </div>
            </div>

            <div class="card mb-4">
                <div class="card-header">
                    <h5 class="mb-0">Actualizar contraseña</h5>
                </div>
                <div class="card-body">
                    @include('profile.partials.update-password-form')
                </div>
            </div>

            <!--
            <div class="card">
                <div class="card-header">
                    <h5 class="mb-0">Eliminar cuenta</h5>
                </div>
                <div class="card-body">
                    @include('profile.partials.delete-user-form')
                </div>
            </div>
            -->
        </div>
    </div>
</div>
@endsection
