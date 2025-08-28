@extends('layouts/layoutMaster')

@section('title', 'Perfil de Usuario')

@section('vendor-style')
    <link rel="stylesheet" href="{{ asset('assets/vendor/libs/sweetalert2/sweetalert2.css') }}" />
@endsection

@section('page-style')
<style>
    .profile-section {
        background: white;
        border-radius: 0.5rem;
        box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
        margin-bottom: 1.5rem;
        border: 1px solid #d9dee3;
    }

    .profile-section .card-header {
        background-color: #f8f9fa;
        border-bottom: 1px solid #dee2e6;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem 0.5rem 0 0;
        font-weight: 600;
    }

    .profile-section .card-body {
        padding: 1.5rem;
    }

    .form-control:focus {
        border-color: #696cff;
        box-shadow: 0 0 0 0.2rem rgba(105, 108, 255, 0.25);
    }

    .btn-primary {
        background-color: #696cff;
        border-color: #696cff;
    }

    .btn-primary:hover {
        background-color: #5f62e6;
        border-color: #5f62e6;
    }

    .btn-danger {
        background-color: #dc3545;
        border-color: #dc3545;
    }

    .btn-danger:hover {
        background-color: #c82333;
        border-color: #bd2130;
    }

    .alert {
        border: none;
        border-radius: 0.5rem;
    }

    .alert-success {
        background-color: #d1e7dd;
        color: #0f5132;
        border: 1px solid #badbcc;
    }

    .alert-danger {
        background-color: #f8d7da;
        color: #721c24;
        border: 1px solid #f5c6cb;
    }

    .text-muted {
        color: #6c757d !important;
    }

    .form-label {
        font-weight: 500;
        color: #566a7f;
        margin-bottom: 0.5rem;
    }

    .form-text {
        font-size: 0.875rem;
        color: #6c757d;
    }
</style>
@endsection

@section('content')
<div class="container-xxl flex-grow-1 container-p-y">
    <div class="row">
        <div class="col-12">
            <div class="card">
                <div class="card-header">
                    <h4 class="card-title">
                        <i class="ti ti-user me-2"></i>
                        Perfil de Usuario
                    </h4>
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="mx-auto col-md-8">
                            <!-- Información del Perfil -->
                            <div class="profile-section">
                                <div class="card-header">
                                    <h5 class="mb-0">
                                        <i class="ti ti-user-edit me-2"></i>
                                        Información del Perfil
                                    </h5>
                                </div>
                                <div class="card-body">
                                    @include('profile.partials.update-profile-information-form')
                                </div>
                            </div>

                            <!-- Cambiar Contraseña -->
                            <div class="profile-section">
                                <div class="card-header">
                                    <h5 class="mb-0">
                                        <i class="ti ti-lock me-2"></i>
                                        Cambiar Contraseña
                                    </h5>
                                </div>
                                <div class="card-body">
                                    @include('profile.partials.update-password-form')
                                </div>
                            </div>

                            <!-- Eliminar Cuenta -->
                            <!--<div class="profile-section">
                                <div class="card-header">
                                    <h5 class="mb-0">
                                        <i class="ti ti-trash me-2"></i>
                                        Eliminar Cuenta
                                    </h5>
                                </div>
                                <div class="card-body">
                                    @include('profile.partials.delete-user-form')
                                </div>
                            </div>--dd>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection

@section('vendor-script')
    <script src="{{ asset('assets/vendor/libs/sweetalert2/sweetalert2.js') }}"></script>
@endsection

@section('page-script')
<script>
    // Configuración para SweetAlert2
    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true
    });

    // Función para mostrar mensajes de éxito
    function showSuccess(message) {
        Toast.fire({
            icon: 'success',
            title: message
        });
    }

    // Función para mostrar mensajes de error
    function showError(message) {
        Toast.fire({
            icon: 'error',
            title: message
        });
    }

    // Función para confirmar eliminación de cuenta
    function confirmDeleteAccount() {
        Swal.fire({
            title: '¿Estás seguro?',
            text: "Esta acción no se puede deshacer. Tu cuenta será eliminada permanentemente.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#dc3545',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Sí, eliminar cuenta',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                document.getElementById('delete-user-form').submit();
            }
        });
    }

    // Mostrar mensajes de sesión si existen
    @if(session('status') === 'profile-updated')
        showSuccess('Perfil actualizado correctamente');
    @endif

    @if(session('status') === 'password-updated')
        showSuccess('Contraseña actualizada correctamente');
    @endif

    @if(session('status') === 'verification-link-sent')
        showSuccess('Se ha enviado un nuevo enlace de verificación a tu correo electrónico');
    @endif

    @if($errors->any())
        showError('Por favor, corrige los errores en el formulario');
    @endif
</script>
@endsection
