<?php

namespace App\Http\Controllers;

use App\Models\Purchase;
use App\Models\PurchaseDetail;
use App\Models\Product;
use App\Models\Provider;
use App\Models\Company;
use App\Services\PurchaseInventoryService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PurchaseController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $purchase = Purchase::join("typedocuments", "typedocuments.id", "=", "purchases.document_id")
        ->join("providers", "providers.id", "=", "purchases.provider_id")
        ->join("companies", "companies.id", "=", "purchases.company_id")
        ->select("purchases.id AS idpurchase",
            "typedocuments.description AS namedoc",
            "purchases.number",
            "purchases.date",
            "purchases.exenta",
            "purchases.gravada",
            "purchases.iva",
            "purchases.otros",
            "purchases.total",
            "providers.razonsocial AS name_provider")
        ->get();
        return view('purchases.index', array(
            "purchases" => $purchase
        ));
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $request->validate([
            'document' => 'required',
            'provider' => 'required|exists:providers,id',
            'company' => 'required|exists:companies,id',
            'number' => 'required|string',
            'date' => 'required|date',
            'period' => 'required|string',
            'iduser' => 'required|exists:users,id',
            'details' => 'required|array|min:1',
            'details.*.product_id' => 'required|exists:products,id',
            'details.*.quantity' => 'required|integer|min:1',
            'details.*.unit_price' => 'required|numeric|min:0',
            'details.*.expiration_date' => 'nullable|date|after_or_equal:date',
            'details.*.batch_number' => 'nullable|string|max:255',
            'details.*.notes' => 'nullable|string'
        ]);

        DB::beginTransaction();

        try {
            \Log::info('💾 Creando nueva compra');
            \Log::info('📋 Datos recibidos:', [
                'details_count' => count($request->details ?? []),
                'details' => $request->details
            ]);

            // Crear la compra
            $purchase = new Purchase();
            $purchase->document_id = $request->document;
            $purchase->provider_id = $request->provider;
            $purchase->company_id = $request->company;
            $purchase->number = $request->number;
            $purchase->date = $request->date;
            $purchase->fingreso = date('Y-m-d');
            $purchase->periodo = $request->period;
            $purchase->user_id = $request->iduser;
            $purchase->save();

            \Log::info('✅ Compra creada con ID: ' . $purchase->id);

            // Crear los detalles
            $totalExenta = 0;
            $totalGravada = 0;
            $totalIva = 0;
            $totalAmount = 0;

            foreach ($request->details as $index => $detailData) {
                \Log::info("📦 Procesando detalle {$index}:", $detailData);
                $subtotal = $detailData['quantity'] * $detailData['unit_price'];
                $taxAmount = $subtotal * 0.13; // IVA 13%
                $totalDetail = $subtotal + $taxAmount;

                // Manejar fecha de expiración correctamente
                $expirationDate = null;
                if (!empty($detailData['expiration_date'])) {
                    // Asegurar que la fecha se interprete como fecha local, no UTC
                    $expirationDate = \Carbon\Carbon::createFromFormat('Y-m-d', $detailData['expiration_date'])->startOfDay();
                    \Log::info("📅 Fecha de expiración procesada (nueva): {$detailData['expiration_date']} -> {$expirationDate->format('Y-m-d')}");
                }

                $detail = PurchaseDetail::create([
                    'purchase_id' => $purchase->id,
                    'product_id' => $detailData['product_id'],
                    'quantity' => $detailData['quantity'],
                    'unit_price' => $detailData['unit_price'],
                    'subtotal' => $subtotal,
                    'tax_amount' => $taxAmount,
                    'total_amount' => $totalDetail,
                    'expiration_date' => $expirationDate,
                    'batch_number' => $detailData['batch_number'] ?? null,
                    'notes' => $detailData['notes'] ?? null,
                    'user_id' => $request->iduser
                ]);

                \Log::info("✅ Detalle creado con ID: {$detail->id}, Cantidad: {$detail->quantity}");

                // Actualizar fechas de caducidad si el producto tiene configuración
                $product = Product::find($detailData['product_id']);
                if ($product && $product->hasExpirationConfigured() && !$detail->expiration_date) {
                    $expirationDate = $product->calculateExpirationDate($purchase->date);
                    $detail->update(['expiration_date' => $expirationDate]);
                }

                // Generar número de lote si no se proporcionó
                if (!$detail->batch_number) {
                    $batchNumber = sprintf(
                        'LOT-%s-%s-%s',
                        $purchase->date->format('Ymd'),
                        $product->code ?? $product->id,
                        str_pad($detail->id, 4, '0', STR_PAD_LEFT)
                    );
                    $detail->update(['batch_number' => $batchNumber]);
                }

                $totalExenta += $subtotal;
                $totalGravada += $subtotal;
                $totalIva += $taxAmount;
                $totalAmount += $totalDetail;
            }

            // Actualizar totales de la compra
            $purchase->update([
                'exenta' => $totalExenta,
                'gravada' => $totalGravada,
                'iva' => $totalIva,
                'total' => $totalAmount
            ]);

            // ✅ AGREGAR AUTOMÁTICAMENTE AL INVENTARIO
            \Log::info('📦 Agregando compra al inventario automáticamente');
            $inventoryService = new \App\Services\PurchaseInventoryService();
            $inventoryResult = $inventoryService->addPurchaseToInventory($purchase);

            if ($inventoryResult['success']) {
                \Log::info('✅ Compra agregada al inventario: ' . $inventoryResult['message']);
            } else {
                \Log::warning('⚠️ Error agregando al inventario: ' . $inventoryResult['message']);
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Compra creada correctamente',
                'purchase_id' => $purchase->id
            ]);

        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Error al crear la compra: ' . $e->getMessage()
            ], 500);
        }
    }

    public function getpurchaseid($id){
        $purchase = Purchase::find(base64_decode($id));
        return response()->json($purchase);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Purchase  $purchase
     * @return \Illuminate\Http\Response
     */
    public function show(Purchase $purchase)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Purchase  $purchase
     * @return \Illuminate\Http\Response
     */
    public function edit(Purchase $purchase)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Purchase  $purchase
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Purchase $purchase)
    {
        \Log::info('🔄 Actualizando compra', [
            'purchase_id' => $request->idedit,
            'request_data' => $request->all()
        ]);

        try {
            DB::beginTransaction();

            $purchase = Purchase::findOrFail($request->idedit);
            $purchase->document_id = $request->documentedit;
            $purchase->provider_id = $request->provideredit;
            $purchase->company_id = $request->companyedit;
            $purchase->number = $request->numberedit;

            $daterequest = strtotime($request->dateedit);
            $new_date = date('Y-m-d', $daterequest);
            $purchase->date = $new_date;

            $purchase->exenta = $request->exentaedit;
            $purchase->gravada = $request->gravadaedit;
            $purchase->iva = $request->ivaedit;
            $purchase->contrns = $request->contransedit;
            $purchase->fovial = $request->fovialedit;
            $purchase->iretenido = $request->iretenidoedit;
            $purchase->otros = $request->othersedit;
            $purchase->total = $request->totaledit;
            $purchase->periodo = $request->periodedit;

            $purchase->save();

            // Actualizar detalles de productos si se enviaron
            if ($request->has('edit_details')) {
                \Log::info('📦 Actualizando detalles de productos', [
                    'details_count' => count($request->edit_details)
                ]);

                // Eliminar detalles existentes
                $purchase->details()->delete();

                // Crear nuevos detalles
                foreach ($request->edit_details as $index => $detailData) {
                    \Log::info("📦 Procesando detalle editado {$index}:", $detailData);

                    $subtotal = $detailData['quantity'] * $detailData['unit_price'];
                    $taxAmount = $subtotal * 0.13; // IVA 13%
                    $totalDetail = $subtotal + $taxAmount;

                    // Manejar fecha de expiración correctamente
                    $expirationDate = null;
                    if (!empty($detailData['expiration_date'])) {
                        // Asegurar que la fecha se interprete como fecha local, no UTC
                        $expirationDate = \Carbon\Carbon::createFromFormat('Y-m-d', $detailData['expiration_date'])->startOfDay();
                        \Log::info("📅 Fecha de expiración procesada: {$detailData['expiration_date']} -> {$expirationDate->format('Y-m-d')}");
                    }

                    $detail = PurchaseDetail::create([
                        'purchase_id' => $purchase->id,
                        'product_id' => $detailData['product_id'],
                        'quantity' => $detailData['quantity'],
                        'unit_price' => $detailData['unit_price'],
                        'subtotal' => $subtotal,
                        'tax_amount' => $taxAmount,
                        'total_amount' => $totalDetail,
                        'expiration_date' => $expirationDate,
                        'batch_number' => $detailData['batch_number'] ?? null,
                        'notes' => $detailData['notes'] ?? null,
                        'user_id' => $request->iduseredit
                    ]);

                    \Log::info("✅ Detalle editado creado con ID: {$detail->id}, Cantidad: {$detail->quantity}, Precio: {$detail->unit_price}");
                }

                // Recalcular totales de la compra basados en los nuevos detalles
                $newDetails = $purchase->details()->get();
                $totalExenta = 0;
                $totalGravada = 0;
                $totalIva = 0;
                $totalAmount = 0;

                foreach ($newDetails as $detail) {
                    $totalExenta += $detail->subtotal;
                    $totalGravada += $detail->subtotal;
                    $totalIva += $detail->tax_amount;
                    $totalAmount += $detail->total_amount;
                }

                // Actualizar totales de la compra
                $purchase->update([
                    'exenta' => $totalExenta,
                    'gravada' => $totalGravada,
                    'iva' => $totalIva,
                    'total' => $totalAmount
                ]);

                \Log::info('💰 Totales recalculados:', [
                    'exenta' => $totalExenta,
                    'gravada' => $totalGravada,
                    'iva' => $totalIva,
                    'total' => $totalAmount
                ]);

                // ✅ ACTUALIZAR INVENTARIO AUTOMÁTICAMENTE AL EDITAR
                \Log::info('📦 Actualizando inventario después de editar compra');
                $inventoryService = new \App\Services\PurchaseInventoryService();

                // Primero remover la compra anterior del inventario
                $inventoryService->removePurchaseFromInventory($purchase);

                // Luego agregar la versión actualizada
                $inventoryResult = $inventoryService->addPurchaseToInventory($purchase);

                if ($inventoryResult['success']) {
                    \Log::info('✅ Inventario actualizado: ' . $inventoryResult['message']);
                } else {
                    \Log::warning('⚠️ Error actualizando inventario: ' . $inventoryResult['message']);
                }
            }

            \Log::info('✅ Compra actualizada exitosamente', [
                'purchase_id' => $purchase->id
            ]);

            DB::commit();

            // Verificar si es petición AJAX
            if ($request->ajax()) {
                return response()->json([
                    'success' => true,
                    'message' => 'Compra actualizada correctamente',
                    'purchase_id' => $purchase->id
                ]);
            }

            // Si no es AJAX, redirect tradicional
            return redirect()->route('purchase.index')
                ->with('success', 'Compra actualizada correctamente');

        } catch (\Exception $e) {
            DB::rollBack();

            \Log::error('❌ Error actualizando compra: ' . $e->getMessage());

            if ($request->ajax()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Error al actualizar la compra: ' . $e->getMessage()
                ], 500);
            }

            return redirect()->back()
                ->with('error', 'Error al actualizar la compra: ' . $e->getMessage())
                ->withInput();
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Purchase  $purchase
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        DB::beginTransaction();

        try {
            $purchase = Purchase::findOrFail(base64_decode($id));

            // Remover productos del inventario si fueron agregados
            $service = new PurchaseInventoryService();
            $service->removePurchaseFromInventory($purchase);

            // Eliminar la compra (los detalles se eliminan automáticamente por la relación)
            $purchase->delete();

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Compra eliminada correctamente'
            ]);

        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar la compra: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Agregar productos de una compra al inventario
     */
    public function addToInventory($id)
    {
        try {
            $purchase = Purchase::findOrFail(base64_decode($id));
            $service = new PurchaseInventoryService();

            $result = $service->addPurchaseToInventory($purchase);

            return response()->json($result);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al agregar al inventario: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtener detalles de una compra
     */
    public function getDetails($id)
    {
        try {
            $purchase = Purchase::with(['details.product', 'details.product.provider', 'provider', 'company'])
                ->findOrFail(base64_decode($id));

            // Log para verificar las fechas de expiración
            foreach ($purchase->details as $detail) {
                \Log::info("📅 Detalle {$detail->id} - Fecha de expiración: {$detail->expiration_date} (tipo: " . gettype($detail->expiration_date) . ")");
            }

            return response()->json([
                'success' => true,
                'purchase' => $purchase,
                'details' => $purchase->details
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener detalles: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtener productos para el formulario de compras
     */
    public function getProducts()
    {
        try {
            $products = Product::with(['provider', 'marca'])
                ->where('state', true)
                ->get();

            return response()->json([
                'success' => true,
                'products' => $products
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener productos: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtener productos próximos a vencer
     */
    public function getExpiringProducts()
    {
        try {

            $service = new PurchaseInventoryService();
            $expiringProducts = $service->checkExpiringProducts();

            return response()->json([
                'success' => true,
                'data' => $expiringProducts
            ]);

        } catch (\Exception $e) {

            return response()->json([
                'success' => false,
                'message' => 'Error al obtener productos próximos a vencer: ' . $e->getMessage()
            ], 500);
        }
    }

        /**
     * Obtener productos vencidos
     */
    public function getExpiredProducts()
    {
        try {
            $service = new PurchaseInventoryService();
            $expiredProducts = $service->getExpiredProducts();

            return response()->json([
                'success' => true,
                'data' => $expiredProducts
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener productos vencidos: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Mostrar vista de productos próximos a vencer
     */
    public function expiringProductsView()
    {
        return view('purchases.expiring-products');
    }

    /**
     * Generar fechas de expiración automáticamente
     */
    public function generateExpirationDates()
    {
        try {
            $service = new PurchaseInventoryService();
            $count = 0;

            // Obtener productos sin fecha de expiración
            $productsWithoutExpiration = \App\Models\PurchaseDetail::whereNull('expiration_date')
                ->where('quantity', '>', 0)
                ->with(['product', 'purchase'])
                ->get();

            foreach ($productsWithoutExpiration as $detail) {
                // Generar fecha de expiración basada en la fecha de compra + 365 días por defecto
                $purchaseDate = \Carbon\Carbon::parse($detail->purchase->date);
                $expirationDate = $purchaseDate->copy()->addDays(365);
                $detail->update(['expiration_date' => $expirationDate]);
                $count++;
            }

            return response()->json([
                'success' => true,
                'count' => $count,
                'message' => "Se generaron {$count} fechas de expiración"
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al generar fechas de expiración: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Debug: Mostrar datos para depuración
     */
    public function debugData()
    {
        try {
            $purchases = \App\Models\Purchase::count();
            $purchaseDetails = \App\Models\PurchaseDetail::count();
            $detailsWithExpiration = \App\Models\PurchaseDetail::whereNotNull('expiration_date')->count();
            $detailsWithoutExpiration = \App\Models\PurchaseDetail::whereNull('expiration_date')->count();

            $sampleDetails = \App\Models\PurchaseDetail::with(['product', 'purchase'])
                ->orderBy('id', 'desc')
                ->limit(5)
                ->get();

            return response()->json([
                'success' => true,
                'data' => [
                    'total_purchases' => $purchases,
                    'total_purchase_details' => $purchaseDetails,
                    'details_with_expiration' => $detailsWithExpiration,
                    'details_without_expiration' => $detailsWithoutExpiration,
                    'sample_details' => $sampleDetails
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error en debug: ' . $e->getMessage(),
                'error' => $e->getTraceAsString()
            ], 500);
        }
    }

    /**
     * Obtener reporte de utilidades de una compra
     */
    public function getProfitReport($id)
    {
        try {
            $purchase = Purchase::with(['details.product'])
                ->findOrFail(base64_decode($id));

            $report = [
                'purchase_info' => [
                    'id' => $purchase->id,
                    'number' => $purchase->number,
                    'date' => $purchase->date,
                    'provider' => $purchase->provider->razonsocial ?? 'N/A',
                    'total_amount' => $purchase->total
                ],
                'details' => [],
                'summary' => [
                    'total_cost' => 0,
                    'total_sale_value' => 0,
                    'total_profit' => 0,
                    'average_margin' => 0
                ]
            ];

            foreach ($purchase->details as $detail) {
                $profitInfo = $detail->profit_info;

                $report['details'][] = [
                    'product_name' => $detail->product->name ?? 'N/A',
                    'product_code' => $detail->product->code ?? 'N/A',
                    'quantity' => $detail->quantity,
                    'unit_cost' => $detail->unit_price,
                    'sale_price' => $profitInfo['sale_price'],
                    'unit_profit' => $profitInfo['unit_profit'],
                    'total_profit' => $profitInfo['total_profit'],
                    'profit_margin' => round($profitInfo['profit_margin'], 2) . '%',
                    'expiration_date' => $detail->expiration_date,
                    'batch_number' => $detail->batch_number
                ];

                // Actualizar resumen
                $report['summary']['total_cost'] += ($detail->unit_price * $detail->quantity);
                $report['summary']['total_sale_value'] += ($profitInfo['sale_price'] * $detail->quantity);
                $report['summary']['total_profit'] += $profitInfo['total_profit'];
            }

            // Calcular margen promedio
            if ($report['summary']['total_sale_value'] > 0) {
                $report['summary']['average_margin'] =
                    (($report['summary']['total_profit'] / $report['summary']['total_sale_value']) * 100);
            }

            return response()->json([
                'success' => true,
                'report' => $report
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al generar reporte de utilidades: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Debug específico para productos próximos a vencer
     */
    public function debugExpiringProducts()
    {
        try {
            // Método más directo sin depender tanto de la base de datos
            $purchases = Purchase::with(['details.product'])
                ->orderBy('id', 'desc')
                ->limit(10)
                ->get();

            $debug = [
                'purchases_found' => $purchases->count(),
                'purchases_with_details' => 0,
                'total_details' => 0,
                'details_with_expiration' => 0,
                'details_without_expiration' => 0,
                'sample_details' => []
            ];

            foreach ($purchases as $purchase) {
                if ($purchase->details->count() > 0) {
                    $debug['purchases_with_details']++;
                    $debug['total_details'] += $purchase->details->count();

                    foreach ($purchase->details as $detail) {
                        if ($detail->expiration_date) {
                            $debug['details_with_expiration']++;
                        } else {
                            $debug['details_without_expiration']++;
                        }

                        // Agregar ejemplos
                        if (count($debug['sample_details']) < 5) {
                            $debug['sample_details'][] = [
                                'purchase_id' => $purchase->id,
                                'purchase_number' => $purchase->number,
                                'product_name' => $detail->product ? $detail->product->name : 'N/A',
                                'quantity' => $detail->quantity,
                                'unit_price' => $detail->unit_price,
                                'expiration_date' => $detail->expiration_date,
                                'batch_number' => $detail->batch_number,
                                'days_until_expiration' => $detail->expiration_date ?
                                    now()->diffInDays($detail->expiration_date, false) : null
                            ];
                        }
                    }
                }
            }

            return response()->json([
                'success' => true,
                'debug' => $debug
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error en debug expiring: ' . $e->getMessage(),
                'error' => $e->getTraceAsString()
            ], 500);
        }
    }

    /**
     * Test simple para verificar datos básicos
     */
    public function testSimple()
    {
        try {
            // Contar datos básicos
            $purchaseCount = Purchase::count();
            $purchaseDetailCount = PurchaseDetail::count();
            $detailsWithExpiration = PurchaseDetail::whereNotNull('expiration_date')->count();
            $detailsWithoutExpiration = PurchaseDetail::whereNull('expiration_date')->count();

            // Obtener algunos ejemplos
            $sampleDetails = PurchaseDetail::with('product')
                ->whereNotNull('expiration_date')
                ->orderBy('id', 'desc')
                ->limit(5)
                ->get()
                ->map(function($detail) {
                    return [
                        'id' => $detail->id,
                        'product_name' => $detail->product ? $detail->product->name : 'Sin producto',
                        'expiration_date' => $detail->expiration_date,
                        'quantity' => $detail->quantity,
                        'created_at' => $detail->created_at
                    ];
                });

            return response()->json([
                'success' => true,
                'data' => [
                    'purchases' => $purchaseCount,
                    'purchase_details' => $purchaseDetailCount,
                    'with_expiration' => $detailsWithExpiration,
                    'without_expiration' => $detailsWithoutExpiration,
                    'sample_details' => $sampleDetails,
                    'current_date' => now()->format('Y-m-d H:i:s')
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error en test simple: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Verificar estado del inventario y su relación con las compras
     */
    public function getInventoryStatus()
    {
        try {
            $purchases = Purchase::with('details.product')->count();
            $purchaseDetails = \App\Models\PurchaseDetail::count();
            $inventoryRecords = \App\Models\Inventory::count();

            // Verificar productos únicos en compras vs inventario
            $uniqueProductsInPurchases = \App\Models\PurchaseDetail::distinct('product_id')->count();
            $uniqueProductsInInventory = \App\Models\Inventory::distinct('product_id')->count();

            // Obtener algunos ejemplos
            $inventoryExamples = \App\Models\Inventory::with('product')
                ->orderBy('id', 'desc')
                ->limit(5)
                ->get()
                ->map(function($inventory) {
                    return [
                        'inventory_id' => $inventory->id,
                        'product_name' => $inventory->product ? $inventory->product->name : 'Sin producto',
                        'quantity' => $inventory->quantity,
                        'location' => $inventory->location,
                        'expiration_date' => $inventory->expiration_date,
                        'last_updated' => $inventory->updated_at
                    ];
                });

            return response()->json([
                'success' => true,
                'data' => [
                    'purchases' => $purchases,
                    'purchase_details' => $purchaseDetails,
                    'inventory_records' => $inventoryRecords,
                    'unique_products_in_purchases' => $uniqueProductsInPurchases,
                    'unique_products_in_inventory' => $uniqueProductsInInventory,
                    'integration_status' => $uniqueProductsInInventory > 0 ? 'Activa' : 'No configurada',
                    'inventory_examples' => $inventoryExamples,
                    'summary' => [
                        'purchases_vs_inventory' => $uniqueProductsInInventory . '/' . $uniqueProductsInPurchases,
                        'coverage_percentage' => $uniqueProductsInPurchases > 0 ?
                            round(($uniqueProductsInInventory / $uniqueProductsInPurchases) * 100, 2) : 0
                    ]
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al verificar estado del inventario: ' . $e->getMessage()
            ], 500);
        }
    }
}
