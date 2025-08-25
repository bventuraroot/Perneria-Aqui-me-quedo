<?php

namespace App\Helpers;

use Carbon\Carbon;

class PerneriaHelper
{
    /**
     * Formatear precio en formato de moneda
     */
    public static function formatPrice($price, $currency = 'USD')
    {
        return number_format($price, 2, '.', ',') . ' ' . $currency;
    }

    /**
     * Calcular IVA
     */
    public static function calculateTax($amount, $taxRate = 10.0)
    {
        return $amount * ($taxRate / 100);
    }

    /**
     * Generar número de factura
     */
    public static function generateInvoiceNumber($sequence)
    {
        $year = Carbon::now()->format('Y');
        return "FAC-{$year}-" . str_pad($sequence, 6, '0', STR_PAD_LEFT);
    }

    /**
     * Validar stock mínimo
     */
    public static function checkLowStock($currentStock, $minStock = 5)
    {
        return $currentStock <= $minStock;
    }

    /**
     * Obtener estado de stock
     */
    public static function getStockStatus($currentStock, $minStock = 5, $criticalStock = 2)
    {
        if ($currentStock <= $criticalStock) {
            return 'crítico';
        } elseif ($currentStock <= $minStock) {
            return 'bajo';
        } else {
            return 'normal';
        }
    }

    /**
     * Formatear fecha en formato local
     */
    public static function formatDate($date, $format = 'd/m/Y')
    {
        return Carbon::parse($date)->format($format);
    }

    /**
     * Formatear fecha y hora
     */
    public static function formatDateTime($date, $format = 'd/m/Y H:i:s')
    {
        return Carbon::parse($date)->format($format);
    }

    /**
     * Calcular días transcurridos
     */
    public static function daysElapsed($date)
    {
        return Carbon::parse($date)->diffInDays(Carbon::now());
    }

    /**
     * Validar RUC
     */
    public static function validateRUC($ruc)
    {
        // Validación básica de RUC (formato paraguayo)
        return preg_match('/^\d{7,8}-\d$/', $ruc);
    }

    /**
     * Obtener información de la empresa
     */
    public static function getCompanyInfo()
    {
        return [
            'name' => config('perneria.empresa.nombre'),
            'short_name' => config('perneria.empresa.nombre_corto'),
            'slogan' => config('perneria.empresa.slogan'),
            'address' => config('perneria.empresa.direccion'),
            'phone' => config('perneria.empresa.telefono'),
            'email' => config('perneria.empresa.email'),
            'website' => config('perneria.empresa.website'),
            'ruc' => config('perneria.empresa.ruc'),
            'dv' => config('perneria.empresa.dv'),
        ];
    }

    /**
     * Obtener métodos de pago disponibles
     */
    public static function getPaymentMethods()
    {
        return config('perneria.ventas.metodos_pago', []);
    }

    /**
     * Obtener estados de venta
     */
    public static function getSaleStatuses()
    {
        return config('perneria.ventas.estados', []);
    }

    /**
     * Obtener categorías de productos
     */
    public static function getProductCategories()
    {
        return config('perneria.inventario.categorias_default', []);
    }

    /**
     * Calcular margen de ganancia
     */
    public static function calculateProfitMargin($costPrice, $salePrice)
    {
        if ($costPrice == 0) return 0;
        return (($salePrice - $costPrice) / $costPrice) * 100;
    }

    /**
     * Calcular precio de venta con margen
     */
    public static function calculateSalePrice($costPrice, $profitMargin)
    {
        return $costPrice * (1 + ($profitMargin / 100));
    }

    /**
     * Generar código de barras
     */
    public static function generateBarcode($prefix = 'PER', $sequence = null)
    {
        if (!$sequence) {
            $sequence = time();
        }
        return $prefix . str_pad($sequence, 8, '0', STR_PAD_LEFT);
    }

    /**
     * Validar email
     */
    public static function validateEmail($email)
    {
        return filter_var($email, FILTER_VALIDATE_EMAIL);
    }

    /**
     * Limpiar número de teléfono
     */
    public static function cleanPhoneNumber($phone)
    {
        return preg_replace('/[^0-9+]/', '', $phone);
    }

    /**
     * Obtener versión del sistema
     */
    public static function getSystemVersion()
    {
        return config('perneria.sistema.version', '1.0.0');
    }

    /**
     * Obtener información de contacto de soporte
     */
    public static function getSupportContact()
    {
        return config('perneria.sistema.contacto_soporte', 'soporte@perneriaaquimequedo.com');
    }

    /**
     * Formatear número de documento
     */
    public static function formatDocumentNumber($number, $type = 'RUC')
    {
        switch ($type) {
            case 'RUC':
                return preg_replace('/(\d{7,8})(\d)/', '$1-$2', $number);
            case 'CI':
                return preg_replace('/(\d{1,2})(\d{3})(\d{3})/', '$1.$2.$3', $number);
            default:
                return $number;
        }
    }

    /**
     * Calcular edad desde fecha de nacimiento
     */
    public static function calculateAge($birthDate)
    {
        return Carbon::parse($birthDate)->age;
    }

    /**
     * Obtener período actual (mes/año)
     */
    public static function getCurrentPeriod()
    {
        return Carbon::now()->format('Y-m');
    }

    /**
     * Validar si es fin de semana
     */
    public static function isWeekend($date = null)
    {
        $date = $date ? Carbon::parse($date) : Carbon::now();
        return $date->isWeekend();
    }

    /**
     * Obtener días hábiles entre dos fechas
     */
    public static function getBusinessDays($startDate, $endDate)
    {
        $start = Carbon::parse($startDate);
        $end = Carbon::parse($endDate);

        $businessDays = 0;
        $current = $start->copy();

        while ($current->lte($end)) {
            if (!$current->isWeekend()) {
                $businessDays++;
            }
            $current->addDay();
        }

        return $businessDays;
    }
}

