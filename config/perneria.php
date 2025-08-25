<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Configuración de Perneria Aqui me quedo
    |--------------------------------------------------------------------------
    |
    | Configuraciones específicas para el sistema de la pernería
    |
    */

    'empresa' => [
        'nombre' => 'Perneria Aqui me quedo',
        'nombre_corto' => 'Perneria',
        'slogan' => 'Aqui me quedo',
        'direccion' => 'Dirección de la pernería',
        'telefono' => '+1234567890',
        'email' => 'info@perneriaaquimequedo.com',
        'website' => 'www.perneriaaquimequedo.com',
        'ruc' => '12345678-9',
        'dv' => '9',
    ],

    'sistema' => [
        'version' => '1.0.0',
        'descripcion' => 'Sistema de gestión para pernería',
        'desarrollador' => 'Equipo de Desarrollo',
        'contacto_soporte' => 'soporte@perneriaaquimequedo.com',
    ],

    'facturacion' => [
        'tipo_documento' => 'FACTURA',
        'prefijo' => 'FAC',
        'formato_numero' => 'FAC-{YEAR}-{SEQUENCE}',
        'moneda' => 'USD',
        'impuesto' => 10.0, // 10% IVA
        'decimales' => 2,
    ],

    'inventario' => [
        'stock_minimo' => 5,
        'stock_critico' => 2,
        'alertas_stock' => true,
        'categorias_default' => [
            'Pernos',
            'Tuercas',
            'Arandelas',
            'Tornillos',
            'Herramientas',
            'Otros',
        ],
    ],

    'ventas' => [
        'metodos_pago' => [
            'efectivo' => 'Efectivo',
            'tarjeta' => 'Tarjeta de Crédito/Débito',
            'transferencia' => 'Transferencia Bancaria',
            'cheque' => 'Cheque',
        ],
        'estados' => [
            'pendiente' => 'Pendiente',
            'pagado' => 'Pagado',
            'cancelado' => 'Cancelado',
            'anulado' => 'Anulado',
        ],
    ],

    'clientes' => [
        'tipos' => [
            'individual' => 'Persona Individual',
            'empresa' => 'Empresa',
            'gobierno' => 'Gobierno',
        ],
        'categorias' => [
            'regular' => 'Cliente Regular',
            'premium' => 'Cliente Premium',
            'mayorista' => 'Mayorista',
        ],
    ],

    'reportes' => [
        'formato_fecha' => 'd/m/Y',
        'formato_hora' => 'H:i:s',
        'formato_moneda' => '$ #,##0.00',
        'formato_porcentaje' => '#,##0.00%',
    ],

    'correo' => [
        'asunto_factura' => 'Factura - Perneria Aqui me quedo',
        'asunto_cotizacion' => 'Cotización - Perneria Aqui me quedo',
        'asunto_recordatorio' => 'Recordatorio de Pago - Perneria Aqui me quedo',
        'firma' => 'Atentamente,\nEl equipo de Perneria Aqui me quedo',
    ],

    'ai' => [
        'habilitado' => true,
        'modelo' => 'gpt-3.5-turbo',
        'max_tokens' => 1000,
        'temperatura' => 0.7,
        'prompt_base' => 'Eres un asistente virtual especializado en pernería y ferretería. Ayudas a los clientes con información sobre productos, precios, disponibilidad y recomendaciones técnicas.',
    ],
];

