<div class="mb-4">
    <p class="text-muted">
        <i class="ti ti-info-circle me-1"></i>
        Actualiza la información de tu perfil y dirección de correo electrónico.
    </p>
</div>

<form id="send-verification" method="post" action="{{ route('verification.send') }}">
    @csrf
</form>

<form method="post" action="{{ route('profile.update') }}" class="space-y-4">
    @csrf
    @method('patch')

    <div class="mb-3">
        <label for="name" class="form-label">
            <i class="ti ti-user me-1"></i>
            Nombre
        </label>
        <input type="text"
               id="name"
               name="name"
               class="form-control @error('name') is-invalid @enderror"
               value="{{ old('name', $user->name) }}"
               required
               autofocus
               autocomplete="name">
        @error('name')
            <div class="invalid-feedback">{{ $message }}</div>
        @enderror
    </div>

    <div class="mb-3">
        <label for="email" class="form-label">
            <i class="ti ti-mail me-1"></i>
            Correo Electrónico
        </label>
        <input type="email"
               id="email"
               name="email"
               class="form-control @error('email') is-invalid @enderror"
               value="{{ old('email', $user->email) }}"
               required
               autocomplete="email">
        @error('email')
            <div class="invalid-feedback">{{ $message }}</div>
        @enderror

        @if ($user instanceof \Illuminate\Contracts\Auth\MustVerifyEmail && ! $user->hasVerifiedEmail())
            <div class="alert alert-warning mt-2">
                <i class="ti ti-alert-triangle me-1"></i>
                <strong>Tu correo electrónico no está verificado.</strong>
                <br>
                <button form="send-verification" class="btn btn-link p-0 text-decoration-none">
                    Haz clic aquí para reenviar el correo de verificación.
                </button>
            </div>

            @if (session('status') === 'verification-link-sent')
                <div class="alert alert-success mt-2">
                    <i class="ti ti-check-circle me-1"></i>
                    Se ha enviado un nuevo enlace de verificación a tu correo electrónico.
                </div>
            @endif
        @endif
    </div>

    <div class="d-flex gap-2">
        <button type="submit" class="btn btn-primary">
            <i class="ti ti-device-floppy me-1"></i>
            Guardar Cambios
        </button>
    </div>
</form>
