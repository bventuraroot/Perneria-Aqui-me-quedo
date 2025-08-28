<div class="mb-4">
    <p class="text-muted">
        <i class="ti ti-alert-triangle me-1"></i>
        Una vez que tu cuenta sea eliminada, todos sus recursos y datos serán eliminados permanentemente. Antes de eliminar tu cuenta, descarga cualquier dato o información que desees conservar.
    </p>
</div>

<div class="alert alert-danger">
    <i class="ti ti-exclamation-circle me-2"></i>
    <strong>¡Advertencia!</strong> Esta acción no se puede deshacer.
</div>

<form id="delete-user-form" method="post" action="{{ route('profile.destroy') }}" class="space-y-4">
    @csrf
    @method('delete')

    <div class="mb-3">
        <label for="password" class="form-label">
            <i class="ti ti-lock me-1"></i>
            Contraseña para Confirmar
        </label>
        <input type="password"
               id="password"
               name="password"
               class="form-control @error('password', 'userDeletion') is-invalid @enderror"
               placeholder="Ingresa tu contraseña para confirmar"
               required>
        @error('password', 'userDeletion')
            <div class="invalid-feedback">{{ $message }}</div>
        @enderror
        <div class="form-text">
            <i class="ti ti-info-circle me-1"></i>
            Ingresa tu contraseña actual para confirmar que deseas eliminar tu cuenta permanentemente.
        </div>
    </div>

    <div class="d-flex gap-2">
        <button type="button" class="btn btn-danger" onclick="confirmDeleteAccount()">
            <i class="ti ti-trash me-1"></i>
            Eliminar Cuenta
        </button>
    </div>
</form>
