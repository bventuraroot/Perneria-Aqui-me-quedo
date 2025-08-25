<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class Inventory extends Model
{
    use HasFactory;

    protected $table = 'inventory';

    protected $fillable = [
        'product_id',
        'quantity',
        'minimum_stock',
        'location',
        'expiration_date',
        'batch_number',
        'expiring_quantity',
        'expiration_warning_sent',
        'last_expiration_check'
    ];

    protected $casts = [
        'quantity' => 'integer',
        'minimum_stock' => 'integer',
        'expiration_date' => 'date',
        'expiring_quantity' => 'integer',
        'expiration_warning_sent' => 'boolean',
        'last_expiration_check' => 'date'
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function provider()
    {
        return $this->belongsTo(Provider::class);
    }

    /**
     * Verificar si el inventario tiene productos próximos a vencer
     */
    public function hasExpiringProducts($days = 30)
    {
        if (!$this->expiration_date) {
            return false;
        }

        return Carbon::now()->diffInDays($this->expiration_date, false) <= $days;
    }

    /**
     * Verificar si el inventario tiene productos vencidos
     */
    public function hasExpiredProducts()
    {
        if (!$this->expiration_date) {
            return false;
        }

        return Carbon::now()->isAfter($this->expiration_date);
    }

    /**
     * Obtener días restantes hasta la caducidad
     */
    public function getDaysUntilExpiration()
    {
        if (!$this->expiration_date) {
            return null;
        }

        // Usar fecha local para evitar problemas de zona horaria
        $today = Carbon::today();
        $expirationDate = Carbon::parse($this->expiration_date)->startOfDay();
        return $today->diffInDays($expirationDate, false);
    }

    /**
     * Obtener el estado de caducidad
     */
    public function getExpirationStatus()
    {
        if (!$this->expiration_date) {
            return 'no_expiration';
        }

        if ($this->hasExpiredProducts()) {
            return 'expired';
        }

        if ($this->hasExpiringProducts(7)) {
            return 'critical';
        }

        if ($this->hasExpiringProducts(30)) {
            return 'warning';
        }

        return 'ok';
    }

    /**
     * Obtener el color del estado de caducidad
     */
    public function getExpirationStatusColor()
    {
        return match($this->getExpirationStatus()) {
            'expired' => 'danger',
            'critical' => 'danger',
            'warning' => 'warning',
            'ok' => 'success',
            default => 'secondary'
        };
    }

    /**
     * Obtener el texto del estado de caducidad
     */
    public function getExpirationStatusText()
    {
        return match($this->getExpirationStatus()) {
            'expired' => 'Vencido',
            'critical' => 'Crítico',
            'warning' => 'Advertencia',
            'ok' => 'OK',
            default => 'Sin caducidad'
        };
    }
}
