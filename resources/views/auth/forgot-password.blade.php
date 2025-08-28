@php
    $customizerHidden = 'customizer-hide';
@endphp

@extends('layouts/layoutMaster')

@section('title', 'Restablecer contraseña')

@section('page-style')
    <link rel="stylesheet" href="{{ asset('assets/vendor/css/pages/page-auth.css') }}">
@endsection

@section('content')
    <div class="container-xxl">
        <div class="authentication-wrapper authentication-basic container-p-y">
            <div class="py-4 authentication-inner">
                <div class="card">
                    <div class="card-body">
                        <div class="mt-2 mb-4 app-brand justify-content-center">
                            <a href="{{ url('/') }}" class="gap-2 app-brand-link">
                                <span class="app-brand-logo">@include('_partials.macros', [
                                    'height' => 30,
                                    'withbg' => 'fill: #fff;',
                                ])</span>
                            </a>
                        </div>
                        <h4 class="pt-1 mb-1 app-brand justify-content-center">¿Olvidaste tu contraseña?</h4>
                        <p class="mb-4 text-center">Ingresa tu correo y te enviaremos un enlace para restablecerla.</p>

                        @if (session('status'))
                            <div class="alert alert-success" role="alert">
                                {{ session('status') }}
                            </div>
                        @endif

                        <form method="POST" action="{{ route('password.email') }}">
                            @csrf

                            <div class="mb-3">
                                <x-input-label for="email" :value="__('Correo electrónico')" />
                                <x-text-input id="email" class="form-control" type="email" name="email" :value="old('email')" required autofocus />
                                <x-input-error :messages="$errors->get('email')" class="mt-2" />
                            </div>

                            <x-primary-button class="btn btn-primary d-grid w-100">
                                {{ __('Enviar enlace de restablecimiento') }}
                            </x-primary-button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection
