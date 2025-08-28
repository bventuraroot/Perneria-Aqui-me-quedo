<div class="mb-4">
    <p class="text-muted">
        <i class="ti ti-shield-lock me-1"></i>
        Asegúrate de que tu cuenta use una contraseña larga y segura para mantener la seguridad.
    </p>
</div>

<form method="post" action="{{ route('password.update') }}" class="space-y-4">
    @csrf
    @method('put')

    <div class="mb-3">
        <label for="current_password" class="form-label">
            <i class="ti ti-lock me-1"></i>
            Contraseña Actual
        </label>
        <input type="password"
               id="current_password"
               name="current_password"
               class="form-control @error('current_password', 'updatePassword') is-invalid @enderror"
               autocomplete="current-password">
        @error('current_password', 'updatePassword')
            <div class="invalid-feedback">{{ $message }}</div>
        @enderror
    </div>

    <div class="mb-3">
        <label for="password" class="form-label">
            <i class="ti ti-key me-1"></i>
            Nueva Contraseña
        </label>
        <input type="password"
               id="password"
               name="password"
               class="form-control @error('password', 'updatePassword') is-invalid @enderror"
               autocomplete="new-password">
        @error('password', 'updatePassword')
            <div class="invalid-feedback">{{ $message }}</div>
        @enderror
    </div>

    <div class="mb-3">
        <label for="password_confirmation" class="form-label">
            <i class="ti ti-key-off me-1"></i>
            Confirmar Nueva Contraseña
        </label>
        <input type="password"
               id="password_confirmation"
               name="password_confirmation"
               class="form-control @error('password_confirmation', 'updatePassword') is-invalid @enderror"
               autocomplete="new-password">
        @error('password_confirmation', 'updatePassword')
            <div class="invalid-feedback">{{ $message }}</div>
        @enderror
    </div>

    <div class="d-flex gap-2">
        <button type="submit" class="btn btn-primary">
            <i class="ti ti-device-floppy me-1"></i>
            Actualizar Contraseña
        </button>
    </div>
</form>
