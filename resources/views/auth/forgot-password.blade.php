<x-guest-layout>
    <div class="flex flex-col justify-center items-center min-h-screen bg-gray-50">
        <div class="p-6 mt-12 w-full max-w-sm bg-white rounded-md border border-gray-200">
            <h2 class="mb-1 text-xl font-semibold text-center text-gray-800">¿Olvidaste tu contraseña?</h2>
            <div class="mb-6 text-sm text-center text-gray-500">
                No hay problema. Solo proporciona tu dirección de correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
            </div>

            <!-- Session Status -->
            <x-auth-session-status class="mb-4" :status="session('status')" />

            <form method="POST" action="{{ route('password.email') }}">
                @csrf

                <!-- Email Address -->
                <div class="mb-4">
                    <x-input-label for="email" :value="__('Correo electrónico')" />
                    <x-text-input id="email" class="block mt-1 w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500" type="email" name="email" :value="old('email')" required autofocus />
                    <x-input-error :messages="$errors->get('email')" class="mt-2" />
                </div>

                <div class="flex items-center justify-end mt-4">
                    <x-primary-button class="justify-center w-full">
                        Enviar enlace de restablecimiento
                    </x-primary-button>
                </div>
            </form>

            <div class="mt-4 text-center">
                <a href="{{ route('login') }}" class="text-sm text-indigo-600 hover:text-indigo-500">
                    Volver al inicio de sesión
                </a>
            </div>
        </div>
    </div>
</x-guest-layout>
