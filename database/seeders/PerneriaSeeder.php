<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class PerneriaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Crear usuario administrador
        DB::table('users')->insert([
            'name' => 'Administrador',
            'email' => 'admin@perneriaaquimequedo.com',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Crear categorías de productos específicas para pernería
        $categorias = [
            ['name' => 'Pernos', 'description' => 'Pernos de diferentes tamaños y tipos'],
            ['name' => 'Tuercas', 'description' => 'Tuercas hexagonales y especiales'],
            ['name' => 'Arandelas', 'description' => 'Arandelas planas y de presión'],
            ['name' => 'Tornillos', 'description' => 'Tornillos de diferentes cabezas'],
            ['name' => 'Herramientas', 'description' => 'Herramientas manuales y eléctricas'],
            ['name' => 'Cables', 'description' => 'Cables eléctricos y mecánicos'],
            ['name' => 'Pinturas', 'description' => 'Pinturas y accesorios'],
            ['name' => 'Otros', 'description' => 'Otros productos de ferretería'],
        ];

        foreach ($categorias as $categoria) {
            DB::table('categories')->insert([
                'name' => $categoria['name'],
                'description' => $categoria['description'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // Crear marcas populares en pernería
        $marcas = [
            'Stanley',
            'DeWalt',
            'Makita',
            'Bosch',
            'Milwaukee',
            'Ryobi',
            'Craftsman',
            'Husky',
            'Klein Tools',
            'Irwin',
        ];

        foreach ($marcas as $marca) {
            DB::table('brands')->insert([
                'name' => $marca,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // Crear métodos de pago
        $metodosPago = [
            ['name' => 'Efectivo', 'description' => 'Pago en efectivo'],
            ['name' => 'Tarjeta de Crédito', 'description' => 'Pago con tarjeta de crédito'],
            ['name' => 'Tarjeta de Débito', 'description' => 'Pago con tarjeta de débito'],
            ['name' => 'Transferencia', 'description' => 'Transferencia bancaria'],
            ['name' => 'Cheque', 'description' => 'Pago con cheque'],
        ];

        foreach ($metodosPago as $metodo) {
            DB::table('payment_methods')->insert([
                'name' => $metodo['name'],
                'description' => $metodo['description'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // Crear tipos de cliente
        $tiposCliente = [
            ['name' => 'Individual', 'description' => 'Cliente persona individual'],
            ['name' => 'Empresa', 'description' => 'Cliente empresa'],
            ['name' => 'Gobierno', 'description' => 'Cliente gubernamental'],
        ];

        foreach ($tiposCliente as $tipo) {
            DB::table('customer_types')->insert([
                'name' => $tipo['name'],
                'description' => $tipo['description'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // Crear configuración inicial del sistema
        DB::table('settings')->insert([
            'key' => 'company_name',
            'value' => 'Perneria Aqui me quedo',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('settings')->insert([
            'key' => 'company_address',
            'value' => 'Dirección de la pernería',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('settings')->insert([
            'key' => 'company_phone',
            'value' => '+1234567890',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('settings')->insert([
            'key' => 'company_email',
            'value' => 'info@perneriaaquimequedo.com',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('settings')->insert([
            'key' => 'tax_rate',
            'value' => '10.0',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('settings')->insert([
            'key' => 'currency',
            'value' => 'USD',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $this->command->info('Datos iniciales de Perneria Aqui me quedo creados exitosamente!');
    }
}

