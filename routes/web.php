<?php

use App\Http\Controllers\EconomicactivityController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\CompanyController;
use App\Http\Controllers\ConfigController;
use App\Http\Controllers\ContingenciasController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\MunicipalityController;
use App\Http\Controllers\CountryController;
use App\Http\Controllers\CreditController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\FacturacionElectronicaController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProviderController;
use App\Http\Controllers\PurchaseController;
use App\Http\Controllers\ReportsController;
use App\Http\Controllers\RolController;
use App\Http\Controllers\SaleController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\BarcodeController;
use App\Http\Controllers\PreSaleController;
use App\Http\Controllers\CorrelativoController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\MarcaController;
use App\Http\Controllers\InventoryController;
use App\Http\Controllers\QuotationController;
use App\Http\Controllers\AIController;
use App\Http\Controllers\AIChatPageController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return redirect()->route('login');
});

//Route::get('/dashboard', function () { return view('dashboard');})->middleware(['auth', 'verified'])->name('dashboard');
Route::get('/dashboard', [DashboardController::class, 'home'])->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

Route::group(['prefix' => 'client', 'as' => 'client.'], function(){

    Route::get('index/{company?}', [ClientController::class, 'index'])->name('index');
    Route::get('getclientbycompany/{company}', [ClientController::class, 'getclientbycompany'])->name('getclientbycompany');
    Route::get('view/{client}', [CompanyController::class, 'show'])->name('view');
    Route::get('edit/{client}', [ClientController::class, 'edit'])->name('edit');
    Route::get('getClientid/{client}', [ClientController::class, 'getClientid'])->name('getClientid');
    Route::get('keyclient/{num}/{tpersona}', [ClientController::class, 'keyclient'])->name('keyclient');
    Route::get('keyclient/{num}/{tpersona}/{campo}', [ClientController::class, 'keyclient'])->name('keyclient.field');
    Route::get('keyclient/{num}/{tpersona}/{campo}/{clientId}', [ClientController::class, 'keyclient'])->name('keyclient.edit');
    Route::get('gettypecontri/{client}', [ClientController::class, 'gettypecontri'])->name('gettypecontri');
    Route::patch('update', [ClientController::class, 'update'])->name('update');
    Route::get('create', [ClientController::class, 'create'])->name('create');
    Route::post('store', [ClientController::class, 'store'])->name('store');
    Route::get('destroy/{client}', [ClientController::class, 'destroy'])->name('destroy');

    });

Route::group(['prefix' => 'company', 'as' => 'company.'], function(){

    Route::get('index', [CompanyController::class, 'index'])->name('index');
    Route::get('view/{company}', [CompanyController::class, 'show'])->name('view');
    Route::get('getCompany', [CompanyController::class, 'getCompany'])->name('getCompany');
    Route::get('getCompanybyuser/{iduser}', [CompanyController::class, 'getCompanybyuser'])->name('getCompanybyuser');
    Route::get('gettypecontri/{company}', [CompanyController::class, 'gettypecontri'])->name('gettypecontri');
    Route::get('getCompanytag', [CompanyController::class, 'getCompanytag'])->name('getCompanytag');
    Route::get('getCompanyid/{company}', [CompanyController::class, 'getCompanyid'])->name('getCompanyid');
    Route::post('store', [CompanyController::class, 'store'])->name('store');
    Route::patch('update', [CompanyController::class, 'update'])->name('update');
    Route::get('destroy/{company}', [CompanyController::class, 'destroy'])->name('destroy');

    });

    Route::get('getcountry', [CountryController::class, 'getcountry'])->name('getcountry');
    Route::get('getdepartment/{pais}', [DepartmentController::class, 'getDepartment'])->name('getDepartment');
    Route::get('getmunicipality/{dep}', [MunicipalityController::class, 'getMunicipality'])->name('getmunicipios');
    Route::get('geteconomicactivity/{pais}', [EconomicactivityController::class, 'geteconomicactivity'])->name('geteconomicactivity');
    Route::get('getroles', [RolController::class, 'getRoles'])->name('getroles');

Route::group(['prefix' => 'user', 'as' => 'user.'], function(){
    Route::get('index', [UserController::class, 'index'])->name('index');
    Route::get('getusers', [UserController::class, 'getusers'])->name('getusers');
    Route::get('getuserid/{user}', [UserController::class, 'getuserid'])->name('getuserid');
    Route::get('valmail/{mail}', [UserController::class, 'valmail'])->name('valmail');
    Route::post('store', [UserController::class, 'store'])->name('store');
    Route::patch('update', [UserController::class, 'update'])->name('update');
    Route::get('changedtatus/{user}/status/{status}', [UserController::class, 'changedtatus'])->name('changedtatus');
    Route::get('destroy/{user}', [UserController::class, 'destroy'])->name('destroy');
    Route::post('request-password-reset/{id}', [UserController::class, 'requestPasswordReset'])->name('request-password-reset');

    });

Route::group(['prefix' => 'rol', 'as' => 'rol.'], function(){
    Route::get('index', [RolController::class, 'index'])->name('index');
    Route::patch('update', [RolController::class, 'update'])->name('update');
    Route::post('store', [RolController::class, 'store'])->name('store');

    });

Route::group(['prefix' => 'permission', 'as' => 'permission.'], function(){
    Route::get('index', [PermissionController::class, 'index'])->name('index');
    Route::patch('update', [PermissionController::class, 'update'])->name('update');
    Route::post('store', [PermissionController::class, 'store'])->name('store');
    Route::get('destroy/{id}', [PermissionController::class, 'destroy'])->name('destroy');
    Route::get('getpermission', [PermissionController::class, 'getpermission'])->name('getpermission');
    Route::get('getmenujson', [PermissionController::class, 'getmenujson'])->name('getmenujson');

    // Rutas específicas para permisos de correlativos
    Route::get('correlativos-setup', function() { return view('admin.users.permissions.correlativos'); })->name('correlativos-setup');
    Route::post('create-correlativos-permissions', [PermissionController::class, 'createCorrelativosPermissions'])->name('create-correlativos-permissions');
    Route::post('assign-correlativos-permissions', [PermissionController::class, 'assignCorrelativosPermissions'])->name('assign-correlativos-permissions');

    });

Route::group(['prefix' => 'provider', 'as' => 'provider.'], function(){
        Route::get('index', [ProviderController::class, 'index'])->name('index');
        Route::get('getproviders', [ProviderController::class, 'getproviders'])->name('getproviders');
        Route::get('getproviderid/{id}', [ProviderController::class, 'getproviderid'])->name('getproviderid');
        Route::patch('update', [ProviderController::class, 'update'])->name('update');
        Route::post('store', [ProviderController::class, 'store'])->name('store');
        Route::get('destroy/{id}', [ProviderController::class, 'destroy'])->name('destroy');
        Route::get('getpermission', [ProviderController::class, 'getpermission'])->name('getpermission');

        // Rutas para validación AJAX
        Route::post('validate-ncr', [ProviderController::class, 'validateNCR'])->name('validate-ncr');
        Route::post('validate-nit', [ProviderController::class, 'validateNIT'])->name('validate-nit');

    });

    Route::group(['prefix' => 'marcas', 'as' => 'marcas.'], function(){
        Route::get('index', [MarcaController::class, 'index'])->name('index');
        Route::get('getmarcas', [MarcaController::class, 'getmarcas'])->name('getmarcas');
        Route::get('getmarcaid/{id}', [MarcaController::class, 'getmarcaid'])->name('getmarcaid');
        Route::patch('update', [MarcaController::class, 'update'])->name('update');
        Route::post('store', [MarcaController::class, 'store'])->name('store');
        Route::get('destroy/{id}', [MarcaController::class, 'destroy'])->name('destroy');
        Route::get('getpermission', [MarcaController::class, 'getpermission'])->name('getpermission');

    });



Route::group(['prefix' => 'product', 'as' => 'product.'], function(){
        Route::get('index', [ProductController::class, 'index'])->name('index');
        Route::get('getproductid/{id}', [ProductController::class, 'getproductid'])->name('getproductid');
        Route::get('getproductcode/{code}', [ProductController::class, 'getproductcode'])->name('getproductcode');
        Route::get('getproductall', [ProductController::class, 'getproductall'])->name('getproductall');
        Route::patch('update', [ProductController::class, 'update'])->name('update');
        Route::post('store', [ProductController::class, 'store'])->name('store');
        Route::get('destroy/{id}', [ProductController::class, 'destroy'])->name('destroy');
        Route::post('toggleState/{id}', [ProductController::class, 'toggleState'])->name('toggleState');
        Route::get('getpermission', [ProductController::class, 'getpermission'])->name('getpermission');
        Route::get('expiration-tracking/{productId}', [ProductController::class, 'expirationTracking'])->name('expiration-tracking');
        Route::post('check-code-exists', [ProductController::class, 'checkCodeExists'])->name('check-code-exists');
    });

Route::group(['prefix' => 'sale', 'as' => 'sale.'], function(){
        Route::get('index', [SaleController::class, 'index'])->name('index');
        Route::get('create', [SaleController::class, 'create'])->name('create');
        Route::get('getproductid/{id}', [SaleController::class, 'getproductid'])->name('getproductid');
        Route::get('getproductbyid/{id}', [SaleController::class, 'getproductbyid'])->name('getproductbyid');
        Route::get('getdatadocbycorr/{corr}', [SaleController::class, 'getdatadocbycorr'])->name('getdatadocbycorr');
        Route::get('getdatadocbycorr2/{corr}', [SaleController::class, 'getdatadocbycorr2'])->name('getdatadocbycorr2');
        Route::get('updateclient/{idsale}/{clientid}', [SaleController::class, 'updateclient'])->name('updateclient');
        Route::patch('update', [SaleController::class, 'update'])->name('update');
        Route::post('store', [SaleController::class, 'store'])->name('store');
        Route::get('createdocument/{corr}/{amount}', [SaleController::class, 'createdocument'])->name('createdocument');
        Route::get('impdoc/{corr}', [SaleController::class, 'impdoc'])->name('impdoc');
        Route::get('ticket/{id}', [SaleController::class, 'printTicket'])->name('ticket');
        Route::get('ticket-direct/{id}', [SaleController::class, 'printTicketDirect'])->name('ticket-direct');
        Route::get('ticket-print/{id}', [SaleController::class, 'printTicketDirectToprinter'])->name('ticket-print');
        Route::get('ticket-raw/{id}', [SaleController::class, 'printTicketRaw'])->name('ticket-raw');
        Route::get('ticket-test/{id?}', function($id = 1) {
            return "Test ticket para venta ID: $id - <a href='" . route('sale.ticket', $id) . "' target='_blank'>Abrir Ticket</a>";
        })->name('ticket-test');
        Route::get('printer-info', [SaleController::class, 'getPrinterInfo'])->name('printer-info');
        Route::get('destroy/{id}', [SaleController::class, 'destroy'])->name('destroy');
        Route::get('savefactemp/{idsale}/{clientid}/{productid}/{cantida}/{price}/{nosujeto}/{exento}/{gravado}/{iva}/{renta}/{retenido}/{acuenta}/{fpago}/{fee}/{reserva}/{ruta}/{destino}/{linea}/{canal}', [SaleController::class, 'savefactemp'])->name('savefactemp');
        Route::get('newcorrsale/{typedocument}', [SaleController::class, 'newcorrsale'])->name('newcorrsale');
        Route::get('getdetailsdoc/{corr}', [SaleController::class, 'getdetailsdoc'])->name('getdetailsdoc');
        Route::get('destroysaledetail/{idsaledetail}', [SaleController::class, 'destroysaledetail'])->name('destroysaledetail');
        Route::get('ncr/{id_sale}', [SaleController::class, 'ncr'])->name('ncr');
        Route::get('envia_correo', [SaleController::class, 'envia_correo'])->name('envia_correo');
        Route::post('enviar_correo_offline', [SaleController::class, 'enviar_correo_offline'])->name('enviar_correo_offline');
        Route::post('enviar-factura-correo', [SaleController::class, 'enviarFacturaPorCorreo'])->name('enviar-factura-correo');
        Route::get('enviar-factura-correo-ejemplo', function() {
            return view('sales.enviar-factura-correo');
        })->name('enviar-factura-correo-ejemplo');
        Route::get('print/{id}', [SaleController::class, 'print'])->name('print');
        Route::get('destinos', [SaleController::class, 'destinos'])->name('destinos');
        Route::get('linea', [SaleController::class, 'linea'])->name('linea');
        Route::get('get-draft-preventa/{id}', [SaleController::class, 'getDraftPreventaData'])->name('get-draft-preventa');
        Route::post('recalculate-totals', [SaleController::class, 'recalculateSalesTotals'])->name('recalculate-totals');

    });

Route::group(['prefix' => 'purchase', 'as' => 'purchase.'], function(){
        Route::get('index', [PurchaseController::class, 'index'])->name('index');
        Route::post('store', [PurchaseController::class, 'store'])->name('store');
        Route::patch('update', [PurchaseController::class, 'update'])->name('update');
        Route::get('getpurchaseid/{id}', [PurchaseController::class, 'getpurchaseid'])->name('getpurchaseid');
        Route::get('destroy/{id}', [PurchaseController::class, 'destroy'])->name('destroy');

        // Nuevas rutas para el sistema mejorado
        Route::get('details/{id}', [PurchaseController::class, 'getDetails'])->name('details');
        Route::post('add-to-inventory/{id}', [PurchaseController::class, 'addToInventory'])->name('add-to-inventory');
        Route::get('products', [PurchaseController::class, 'getProducts'])->name('products');
        Route::get('expiring-products', [PurchaseController::class, 'getExpiringProducts'])->name('expiring-products');
        Route::get('expired-products', [PurchaseController::class, 'getExpiredProducts'])->name('expired-products');
        Route::get('expiring-products-view', [PurchaseController::class, 'expiringProductsView'])->name('expiring-products-view');
        Route::post('generate-expiration-dates', [PurchaseController::class, 'generateExpirationDates'])->name('generate-expiration-dates');
        Route::get('debug-data', [PurchaseController::class, 'debugData'])->name('debug-data');
        Route::get('profit-report/{id}', [PurchaseController::class, 'getProfitReport'])->name('profit-report');
        Route::get('debug-expiring', [PurchaseController::class, 'debugExpiringProducts'])->name('debug-expiring');
        Route::get('test-simple', [PurchaseController::class, 'testSimple'])->name('test-simple');
        Route::get('inventory-status', [PurchaseController::class, 'getInventoryStatus'])->name('inventory-status');
    });


    Route::group(['prefix' => 'credit', 'as' => 'credit.'], function(){
        Route::get('index', [CreditController::class, 'index'])->name('index');
        Route::post('store', [CreditController::class, 'store'])->name('store');
        Route::patch('update', [CreditController::class, 'update'])->name('update');
        Route::patch('addpay', [CreditController::class, 'addpay'])->name('addpay');
        Route::get('getinfocredit/{id}', [CreditController::class, 'getinfocredit'])->name('getinfocredit');
        Route::get('destroy/{id}', [CreditController::class, 'destroy'])->name('destroy');
    });

Route::group(['prefix' => 'report', 'as' => 'report.'], function(){
        Route::get('sales', [ReportsController::class, 'sales'])->name('sales');
        Route::get('purchases', [ReportsController::class, 'purchases'])->name('purchases');
        Route::get('reportsales/{company}/{year}/{period}', [ReportsController::class, 'reportsales'])->name('reportsales');
        Route::get('reportpurchases/{company}/{year}/{period}', [ReportsController::class, 'reportpurchases'])->name('reportpurchases');
        Route::get('contribuyentes', [ReportsController::class, 'contribuyentes'])->name('contribuyentes');
        Route::get('reportyear', [ReportsController::class, 'reportyear'])->name('reportyear');
        Route::post('yearsearch', [ReportsController::class, 'yearsearch'])->name('yearsearch');
        Route::post('contribusearch', [ReportsController::class, 'contribusearch'])->name('contribusearch');
        Route::get('directas', [ReportsController::class, 'directas'])->name('directas');
        Route::get('consumidor', [ReportsController::class, 'consumidor'])->name('consumidor');
        Route::post('consumidorsearch', [ReportsController::class, 'consumidorsearch'])->name('consumidorsearch');
        Route::get('bookpurchases', [ReportsController::class, 'bookpurchases'])->name('bookpurchases');
        Route::post('comprassearch', [ReportsController::class, 'comprassearch'])->name('comprassearch');
    });

Route::group(['prefix' => 'factmh', 'as' => 'factmh.'], function(){

        Route::get('mostrar_cola', [FacturacionElectronicaController::class, 'mostrar_cola'])->name('show_queue');
        Route::get('procesa_cola', [FacturacionElectronicaController::class, 'procesa_cola'])->name('run_queue');
        Route::get('muestra_enviados', [FacturacionElectronicaController::class, 'muestra_enviados'])->name('show_sends');
        Route::get('muestra_rechazados', [FacturacionElectronicaController::class, 'muestra_rechazados'])->name('show_rejected');
        Route::get('prueba_certificado', [FacturacionElectronicaController::class, 'prueba_certificado'])->name('test_crt');
});

Route::group(['prefix' => 'config', 'as' => 'config.'], function(){

    Route::get('index', [ConfigController::class, 'index'])->name('index');
    Route::post('store', [ConfigController::class, 'store'])->name('store');
    Route::get('update', [ConfigController::class, 'update'])->name('update');
    Route::get('getconfigid/{id}', [ConfigController::class, 'getconfigid'])->name('getconfigid');
    Route::get('destroy/{id}', [ConfigController::class, 'destroy'])->name('destroy');
});

Route::group(['prefix' => 'factmh', 'as' => 'factmh.'], function(){

    Route::get('contingencias', [ContingenciasController::class, 'contingencias'])->name('contingencias');
    Route::post('store', [ContingenciasController::class, 'store'])->name('store');
    Route::get('autoriza_contingencia/{empresa}/{id}', [ContingenciasController::class, 'autoriza_contingencia'])->name('autoriza_contingencia');
    Route::get('procesa_contingencia/{id}', [ContingenciasController::class, 'procesa_contingencia'])->name('procesa_contingencia');
    Route::get('muestra_lote/{id}', [ContingenciasController::class, 'muestra_lote'])->name('muestra_lote');
    Route::get('update', [ConfigController::class, 'update'])->name('update');
    Route::get('getconfigid/{id}', [ConfigController::class, 'getconfigid'])->name('getconfigid');
    Route::get('destroy/{id}', [ConfigController::class, 'destroy'])->name('destroy');
});

Route::get('/generate-barcode/{code}', [BarcodeController::class, 'generate'])->name('generate.barcode');
Route::get('/barcode/{code}', [BarcodeController::class, 'generate'])->name('barcode.generate');

// Rutas de pre-ventas
Route::group(['prefix' => 'presales', 'as' => 'presales.'], function(){
    Route::get('index', [PreSaleController::class, 'index'])->name('index');
    Route::post('start-session', [PreSaleController::class, 'startSession'])->name('start-session');
    Route::post('search-product', [PreSaleController::class, 'searchProduct'])->name('search-product');
    Route::post('add-product', [PreSaleController::class, 'addProduct'])->name('add-product');
    Route::post('get-details', [PreSaleController::class, 'getSaleDetails'])->name('get-details');
    Route::post('remove-product', [PreSaleController::class, 'removeProduct'])->name('remove-product');
    Route::post('finalize', [PreSaleController::class, 'finalizeSale'])->name('finalize');
    Route::post('cancel', [PreSaleController::class, 'cancelSale'])->name('cancel');
    Route::get('daily-stats', [PreSaleController::class, 'getDailyStats'])->name('daily-stats');
    Route::get('print-receipt', [PreSaleController::class, 'printReceipt'])->name('print-receipt');
    Route::get('clients', [PreSaleController::class, 'getClients'])->name('clients');
    Route::get('session-info', [PreSaleController::class, 'getSessionInfo'])->name('session-info');
    Route::post('cleanup-expired', [PreSaleController::class, 'cleanupExpiredSessions'])->name('cleanup-expired');
});

// Rutas de inventario (solo requieren autenticación)
Route::resource('inventory', InventoryController::class);

Route::group(['prefix' => 'inve', 'as' => 'inve.'], function(){
    Route::post('store', [InventoryController::class, 'store'])->name('store');
    Route::get('edit/{id}', [InventoryController::class, 'show'])->name('edit');
    Route::put('edit/{id}', [InventoryController::class, 'update'])->name('edit.update');
    Route::delete('edit/{id}', [InventoryController::class, 'destroy'])->name('edit.destroy');
    Route::get('export', [InventoryController::class, 'export'])->name('export');
    Route::get('providers', [InventoryController::class, 'getProviders'])->name('providers');
    Route::get('list', [InventoryController::class, 'list'])->name('list');
    Route::post('toggle-state/{id}', [InventoryController::class, 'toggleState'])->name('toggle-state');
});

// Rutas de correlativos
Route::group(['prefix' => 'correlativos', 'as' => 'correlativos.'], function(){
    // Rutas CRUD principales
    Route::get('/', [\App\Http\Controllers\CorrelativoController::class, 'index'])->name('index');
    Route::get('create', [\App\Http\Controllers\CorrelativoController::class, 'create'])->name('create');
    Route::post('/', [\App\Http\Controllers\CorrelativoController::class, 'store'])->name('store');
    Route::get('{id}', [\App\Http\Controllers\CorrelativoController::class, 'show'])->name('show');
    Route::get('{id}/edit', [\App\Http\Controllers\CorrelativoController::class, 'edit'])->name('edit');
    Route::put('{id}', [\App\Http\Controllers\CorrelativoController::class, 'update'])->name('update');
    Route::delete('{id}', [\App\Http\Controllers\CorrelativoController::class, 'destroy'])->name('destroy');

    // Rutas específicas
    Route::get('estadisticas/view', [\App\Http\Controllers\CorrelativoController::class, 'estadisticas'])->name('estadisticas');
    Route::post('{id}/reactivar', [\App\Http\Controllers\CorrelativoController::class, 'reactivar'])->name('reactivar');
    Route::patch('{id}/estado', [\App\Http\Controllers\CorrelativoController::class, 'cambiarEstado'])->name('cambiar-estado');

    // Rutas AJAX
    Route::get('por-empresa/ajax', [\App\Http\Controllers\CorrelativoController::class, 'porEmpresa'])->name('por-empresa');
});

// Rutas API para correlativos
Route::group(['prefix' => 'api/correlativos', 'as' => 'correlativos.api.'], function(){
    Route::post('siguiente-numero', [\App\Http\Controllers\CorrelativoController::class, 'apiSiguienteNumero'])->name('siguiente-numero');
    Route::post('validar-disponibilidad', [\App\Http\Controllers\CorrelativoController::class, 'apiValidarDisponibilidad'])->name('validar-disponibilidad');
    Route::get('estadisticas', [\App\Http\Controllers\CorrelativoController::class, 'apiEstadisticas'])->name('estadisticas');
    Route::get('por-empresa', [\App\Http\Controllers\CorrelativoController::class, 'porEmpresa'])->name('por-empresa-api');
});

// Rutas de Cotizaciones
Route::group(['prefix' => 'cotizaciones', 'as' => 'cotizaciones.'], function(){
    // Rutas CRUD principales
    Route::get('index', [QuotationController::class, 'index'])->name('index');
    Route::get('create', [QuotationController::class, 'create'])->name('create');
    Route::post('store', [QuotationController::class, 'store'])->name('store');
    Route::get('show/{id}', [QuotationController::class, 'show'])->name('show');
    Route::get('edit/{id}', [QuotationController::class, 'edit'])->name('edit');
    Route::patch('update/{id}', [QuotationController::class, 'update'])->name('update');
    Route::get('destroy/{id}', [QuotationController::class, 'destroy'])->name('destroy');

    // Rutas para cambiar estado
    Route::patch('change-status/{id}', [QuotationController::class, 'changeStatus'])->name('changeStatus');

    // Rutas para PDF
    Route::get('pdf/{id}', [QuotationController::class, 'generatePDF'])->name('pdf');
    Route::get('download/{id}', [QuotationController::class, 'downloadPDF'])->name('download');

    // Rutas para correo
    Route::post('send-email/{id}', [QuotationController::class, 'sendEmail'])->name('sendEmail');

    // Rutas AJAX
    Route::get('get-quotations', [QuotationController::class, 'getQuotations'])->name('getQuotations');
    Route::get('get-quotation/{id}', [QuotationController::class, 'getQuotation'])->name('getQuotation');
});

// Rutas de IA
Route::group(['prefix' => 'ai', 'as' => 'ai.'], function(){
    Route::post('chat', [AIController::class, 'chat'])->name('chat');
    Route::post('analyze', [AIController::class, 'analyze'])->name('analyze');
    Route::get('settings', [AIController::class, 'getSettings'])->name('settings');
    Route::post('settings', [AIController::class, 'updateSettings'])->name('updateSettings');
    Route::get('conversations', [AIController::class, 'getConversations'])->name('conversations');
});

// Rutas del módulo de Chat IA (página dedicada)
Route::group(['prefix' => 'ai-chat', 'as' => 'ai-chat.'], function(){
    Route::get('/', [AIChatPageController::class, 'index'])->name('index');
    Route::post('send', [AIChatPageController::class, 'sendMessage'])->name('send');
    Route::get('history', [AIChatPageController::class, 'getHistory'])->name('history');
    Route::get('conversation/{id}', [AIChatPageController::class, 'getConversation'])->name('conversation');
    Route::delete('conversation/{id}', [AIChatPageController::class, 'deleteConversation'])->name('delete-conversation');
    Route::delete('clear-history', [AIChatPageController::class, 'clearHistory'])->name('clear-history');
    Route::post('settings', [AIChatPageController::class, 'updateSettings'])->name('settings');
});




});



require __DIR__.'/auth.php';
