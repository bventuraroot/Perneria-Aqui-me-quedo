/**
 * Page Purchase List - Módulo completamente reescrito
 */

'use strict';

// ========================================
// VARIABLES GLOBALES
// ========================================

let products = [];
let selectedProducts = [];
let productRowIndex = 0;
let currentRowIndex = undefined;

// Variables para edición
let editSelectedProducts = [];
let editProductRowIndex = 0;

// ========================================
// INICIALIZACIÓN DATATABLES Y SELECT2
// ========================================

$(function () {
  let borderColor, bodyBg, headingColor;

  if (isDarkStyle) {
    borderColor = config.colors_dark.borderColor;
    bodyBg = config.colors_dark.bodyBg;
    headingColor = config.colors_dark.headingColor;
  } else {
    borderColor = config.colors.borderColor;
    bodyBg = config.colors.bodyBg;
    headingColor = config.colors.headingColor;
  }

  // Select2 configurations
  $('.select2purchase').each(function() {
    $(this).wrap('<div class="position-relative"></div>').select2({
   placeholder: 'Seleccionar Periodo',
      dropdownParent: $(this).parent()
 });
  });

  $('.select2purchaseedit').each(function() {
    $(this).wrap('<div class="position-relative"></div>').select2({
   placeholder: 'Seleccionar Periodo',
      dropdownParent: $(this).parent()
 });
  });

  $('.select2company').each(function() {
    $(this).wrap('<div class="position-relative"></div>').select2({
   placeholder: 'Seleccionar Empresa',
      dropdownParent: $(this).parent()
 });
  });

  $('.select2companyedit').each(function() {
    $(this).wrap('<div class="position-relative"></div>').select2({
   placeholder: 'Seleccionar Empresa',
      dropdownParent: $(this).parent()
 });
  });

  $('.select2provider').each(function() {
    $(this).wrap('<div class="position-relative"></div>').select2({
   placeholder: 'Seleccionar Proveedor',
      dropdownParent: $(this).parent()
 });
  });

  $('.select2provideredit').each(function() {
    $(this).wrap('<div class="position-relative"></div>').select2({
   placeholder: 'Seleccionar Proveedor',
      dropdownParent: $(this).parent()
 });
  });

  // DataTable configuration
  var dt_purchase_table = $('.datatables-purchase');
  if (dt_purchase_table.length) {
    var dt_purchase = dt_purchase_table.DataTable({
      columnDefs: [
        {
          className: 'control',
          searchable: false,
          orderable: false,
          responsivePriority: 0,
          targets: 0,
          render: function (data, type, full, meta) {
            return '';
          }
        },
        {
            responsivePriority: 1,
            targets: 10
          }
      ],
      order: [[2, 'desc']],
      dom:
        '<"row me-2"' +
        '<"col-md-2"<"me-3"l>>' +
        '<"col-md-10"<"dt-action-buttons text-xl-end text-lg-start text-md-end text-start d-flex align-items-center justify-content-end flex-md-row flex-column mb-3 mb-md-0"fB>>' +
        '>t' +
        '<"row mx-2"' +
        '<"col-sm-12 col-md-6"i>' +
        '<"col-sm-12 col-md-6"p>' +
        '>',
      language: {
        sLengthMenu: '_MENU_',
        search: '',
        searchPlaceholder: 'Buscar'
      },
      buttons: [
        {
          extend: 'collection',
          className: 'btn btn-label-secondary dropdown-toggle mx-3',
          text: '<i class="ti ti-screen-share me-1 ti-xs"></i>Export',
          buttons: [
            {
              extend: 'print',
              text: '<i class="ti ti-printer me-2" ></i>Print',
              className: 'dropdown-item',
              exportOptions: { columns: [1, 2, 3, 4, 5] }
            },
            {
              extend: 'csv',
              text: '<i class="ti ti-file-text me-2" ></i>Csv',
              className: 'dropdown-item',
              exportOptions: { columns: [1, 2, 3, 4, 5] }
            },
            {
              extend: 'excel',
              text: '<i class="ti ti-file-spreadsheet me-2"></i>Excel',
              className: 'dropdown-item',
              exportOptions: { columns: [1, 2, 3, 4, 5] }
            },
            {
              extend: 'pdf',
              text: '<i class="ti ti-file-code-2 me-2"></i>Pdf',
              className: 'dropdown-item',
              exportOptions: { columns: [1, 2, 3, 4, 5] }
            }
          ]
        },
        {
          text: '<i class="ti ti-report-money ti-tada me-0 me-sm-1 ti-xs"></i><span class="d-none d-sm-inline-block">Nueva Compra</span>',
          className: 'add-new btn btn-primary',
          attr: {
            'data-bs-toggle': 'modal',
            'data-bs-target': '#addPurchaseModal'
          }
        }
      ],
      responsive: {
        details: {
          display: $.fn.dataTable.Responsive.display.modal({
            header: function (row) {
              var data = row.data();
              return 'Detalles compra ' + data[0] + ' ' + data[1];
            }
          }),
          type: 'column',
          renderer: function (api, rowIdx, columns) {
            var data = $.map(columns, function (col, i) {
              return col.title !== ''
                ? '<tr data-dt-row="' + col.rowIndex + '" data-dt-column="' + col.columnIndex + '">' +
                    '<td>' + col.title + ':</td> ' +
                    '<td>' + col.data + '</td>' +
                    '</tr>'
                : '';
            }).join('');
            return data ? $('<table class="table"/><tbody />').append(data) : false;
          }
        }
      }
    });
  }

  // Filter form control to default size
  setTimeout(() => {
    $('.dataTables_filter .form-control').removeClass('form-control-sm');
    $('.dataTables_length .form-select').removeClass('form-select-sm');
  }, 300);
});

// ========================================
// INICIALIZACIÓN DEL SISTEMA DE PRODUCTOS
// ========================================

$(document).ready(function() {
    console.log('🚀 Inicializando sistema de productos...');

    // Reset variables globales
    products = [];
    selectedProducts = [];
    productRowIndex = 0;
    currentRowIndex = undefined;
    editSelectedProducts = [];
    editProductRowIndex = 0;

    // Verificar elementos necesarios
    if (!$('#productModal').length) {
        console.error('❌ Modal de productos no encontrado');
        return;
    }

    if (!$('#productSelectionTable').length) {
        console.error('❌ Tabla de selección de productos no encontrada');
        return;
    }

    // Inicializar
    initializeProductSystem();

    console.log('✅ Sistema de productos inicializado correctamente');
});

function initializeProductSystem() {
    // Cargar productos
    loadProducts();

    // Configurar eventos
    setupEventListeners();

    // No crear fila inicial - el usuario debe hacer click en "Agregar Producto"
    console.log('🎯 Tabla lista - usuario debe hacer click en "Agregar Producto" para comenzar');
}

function setupEventListeners() {
    // Botón agregar producto
    $('#addProductBtn').off('click').on('click', function() {
        console.log('➕ Botón agregar producto clickeado - abriendo modal directamente');
        currentRowIndex = undefined; // Nueva compra
        $('#productModal').modal('show');
    });

    // Búsqueda de productos
    $('#productSearch').off('input').on('input', filterProducts);

    // Botón agregar producto en edición
    $('#addEditProductBtn').off('click').on('click', function() {
        console.log('➕ Botón agregar producto en edición clickeado');
        addEditProductRow();
    });

    // Formulario nueva compra (index.blade.php)
    $('#addpurchaseForm').off('submit').on('submit', handleFormSubmit);

    // Formulario crear compra (create.blade.php)
    $('#purchaseForm').off('submit').on('submit', handleCreateFormSubmit);

    // Formulario editar compra (index.blade.php)
    $('#updatepurchaseForm').off('submit').on('submit', handleUpdateFormSubmit);

    // Eventos del modal de nueva compra
    $('#addPurchaseModal').off('hidden.bs.modal').on('hidden.bs.modal', function() {
        console.log('🎭 Modal de nueva compra cerrado - limpiando formulario');
        resetPurchaseForm();
    });

    $('#addPurchaseModal').off('show.bs.modal').on('show.bs.modal', function() {
        console.log('🎭 Modal de nueva compra abierto - inicializando');
        initializePurchaseForm();
    });

    // Eventos del modal de edición
    $('#updatePurchaseModal').off('hidden.bs.modal').on('hidden.bs.modal', function() {
        console.log('🎭 Modal de edición cerrado - limpiando datos');
        editSelectedProducts = [];
        editProductRowIndex = 0;
    });

    $('#updatePurchaseModal').off('show.bs.modal').on('show.bs.modal', function() {
        console.log('🎭 Modal de edición abierto');
    });
}

// ========================================
// GESTIÓN DE PRODUCTOS
// ========================================

function loadProducts() {
    console.log('📦 Cargando productos...');

    $.ajax({
        url: '/purchase/products',
        method: 'GET',
        success: function(response) {
        if (response.success) {
            products = response.products;
                console.log(`✅ ${products.length} productos cargados`);
                renderProductSelectionTable();
        } else {
                console.error('❌ Error al cargar productos:', response.message);
                showError('Error al cargar productos: ' + response.message);
            }
        },
        error: function(xhr, status, error) {
            console.error('❌ Error en petición de productos:', error);
            showError('Error al cargar productos. Revisa la consola.');
        }
    });
}

function renderProductSelectionTable() {
    console.log('🎨 Renderizando tabla de productos...');
    const tbody = $('#productSelectionTable tbody');
    tbody.empty();

    if (products.length === 0) {
        tbody.append('<tr><td colspan="5" class="text-center">No hay productos disponibles</td></tr>');
        return;
    }

    products.forEach(product => {
        const row = `
            <tr>
                <td>${product.code || 'N/A'}</td>
                <td>${product.name}</td>
                <td>${product.provider ? product.provider.razonsocial : 'N/A'}</td>
                <td>$${parseFloat(product.price || 0).toFixed(2)} <small class="text-muted">(Precio venta)</small></td>
                <td>
                    <button type="button" class="btn btn-sm btn-primary select-product-btn"
                            data-product-id="${product.id}">
                        <i class="ti ti-plus"></i> Seleccionar
                    </button>
                </td>
            </tr>
        `;
        tbody.append(row);
    });

    // Event listeners para botones de selección
    $('.select-product-btn').off('click').on('click', function() {
        const productId = parseInt($(this).data('product-id'));
        console.log(`🎯 Producto seleccionado: ${productId}`);
        selectProduct(productId);
    });

    // Eventos del modal de productos
    $('#productModal').off('show.bs.modal').on('show.bs.modal', function() {
        console.log('🎭 Modal de productos abriéndose...');
        console.log('📍 currentRowIndex:', currentRowIndex);
    });

    $('#productModal').off('hidden.bs.modal').on('hidden.bs.modal', function() {
        console.log('🎭 Modal de productos cerrado');
        currentRowIndex = undefined;
    });
}

function filterProducts() {
    const searchTerm = $('#productSearch').val().toLowerCase();
    const rows = $('#productSelectionTable tbody tr');

    rows.each(function() {
        const text = $(this).text().toLowerCase();
        $(this).toggle(text.includes(searchTerm));
    });
}

function selectProduct(productId) {
    console.log(`🔍 Buscando producto con ID: ${productId}`);

    const product = products.find(p => p.id === productId);
    if (!product) {
        console.error('❌ Producto no encontrado');
        showError('Producto no encontrado');
        return;
    }

    console.log(`✅ Producto encontrado: ${product.name} - Precio venta: $${product.price}`);

    // Detectar modo
    const isEditMode = $('#updatePurchaseModal').is(':visible');
    console.log(`📝 Modo edición: ${isEditMode}`);

    if (isEditMode) {
        handleEditModeSelection(product);
        } else {
        handleNewModeSelection(product);
        }

    // Cerrar modal y mostrar confirmación
        $('#productModal').modal('hide');

    // Mostrar información sobre utilidad potencial
    const salePrice = parseFloat(product.price || 0);
    showSuccess(`"${product.name}" agregado. Precio venta: $${salePrice.toFixed(2)}. Ingresa el costo de compra para calcular utilidad.`);
}

function handleNewModeSelection(product) {
    if (currentRowIndex !== undefined) {
        console.log(`🔄 Actualizando fila existente: ${currentRowIndex}`);
        updateProductRow(currentRowIndex, product);
    } else {
        console.log('➕ Creando nueva fila con producto desde modal');
        addProductRowWithData(product);
    }
}

function handleEditModeSelection(product) {
    console.log('📝 Agregando producto en modo edición');
    addEditProductRow(product);
}

// ========================================
// GESTIÓN DE FILAS DE PRODUCTOS
// ========================================

function addEmptyProductRow() {
    console.log('➕ Creando fila vacía');

    const isIndexView = isIndexViewStructure();
    const rowHtml = generateEmptyRowHtml(productRowIndex, isIndexView);

    $('#productsTableBody').append(rowHtml);
    productRowIndex++;

    console.log(`✅ Fila vacía creada (index: ${productRowIndex - 1})`);
}

function addProductRowWithData(product) {
    console.log(`➕ Creando fila con producto: ${product.name} (Precio venta: $${product.price})`);

    const isIndexView = isIndexViewStructure();
    const rowHtml = generateProductRowHtml(productRowIndex, product, isIndexView);

    $('#productsTableBody').append(rowHtml);

    // Registrar producto seleccionado - usar precio como costo inicial, pero permitir edición
    selectedProducts[productRowIndex] = {
        product_id: parseInt(product.id),
        quantity: 1,
        unit_price: parseFloat(product.price || 0), // Costo inicial basado en precio, pero editable
        expiration_date: null,
        batch_number: null,
        notes: null
    };

    // Calcular totales
    calculateRowTotal(productRowIndex);
    productRowIndex++;

    console.log(`✅ Fila con producto creada (index: ${productRowIndex - 1}) - Costo inicial: $${product.price}`);
}

function updateProductRow(rowIndex, product) {
    console.log(`🔄 Actualizando fila ${rowIndex} con producto: ${product.name}`);

    const row = $(`#productRow_${rowIndex}`);

    // Actualizar campos
    row.find('.product-name').val(product.name);
    row.find('.product-id').val(product.id);
    row.find('.unit-price').val(product.price);

    // Registrar producto seleccionado
    const quantity = parseInt(row.find('.quantity').val()) || 1;
    selectedProducts[rowIndex] = {
        product_id: parseInt(product.id),
        quantity: quantity,
        unit_price: parseFloat(product.price || 0),
        expiration_date: row.find('.expiration-date').val() || null,
        batch_number: row.find('.batch-number').val() || null,
        notes: row.find('.notes').val() || null
    };

    // Calcular totales
    calculateRowTotal(rowIndex);

    console.log(`✅ Fila ${rowIndex} actualizada`);
}

function removeProductRow(rowIndex) {
    console.log(`🗑️ Eliminando fila: ${rowIndex}`);

    $(`#productRow_${rowIndex}`).remove();
    delete selectedProducts[rowIndex];
    calculateAllTotals();

    // Asegurar que siempre haya una fila vacía
    setTimeout(() => {
        if ($('#productsTableBody tr').length === 0) {
            addEmptyProductRow();
        }
    }, 100);
}

function showProductModal(rowIndex) {
    console.log(`🎯 Abriendo modal para fila: ${rowIndex}`);
    currentRowIndex = rowIndex;
    $('#productModal').modal('show');
}

// ========================================
// GENERACIÓN DE HTML
// ========================================

function generateEmptyRowHtml(index, isIndexView) {
    if (isIndexView) {
        return `
            <tr id="productRow_${index}">
            <td>
                <input type="text" class="form-control product-name" readonly
                           placeholder="Haga clic para seleccionar producto"
                           onclick="showProductModal(${index})">
                    <input type="hidden" class="product-id" value="">
            </td>
            <td>
                <input type="number" class="form-control quantity" min="1" value="1"
                           onchange="calculateRowTotal(${index})" placeholder="Cantidad">
            </td>
            <td>
                <input type="number" class="form-control unit-price" min="0" step="0.01" value="0.00"
                           onchange="calculateRowTotal(${index})" placeholder="Costo de compra">
            </td>
                <td><span class="subtotal">$0.00</span></td>
            <td>
                    <input type="date" class="form-control expiration-date"
                           onchange="updateSelectedProduct(${index})">
            </td>
                <td>
                    <input type="text" class="form-control batch-number"
                           onchange="updateSelectedProduct(${index})">
                </td>
                <td>
                    <button type="button" class="btn btn-sm btn-danger" onclick="removeProductRow(${index})">
                        <i class="ti ti-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    } else {
        return `
            <tr id="productRow_${index}">
                <td>
                    <input type="text" class="form-control product-name" readonly
                           placeholder="Haga clic para seleccionar producto"
                           onclick="showProductModal(${index})">
                    <input type="hidden" class="product-id" value="">
                </td>
                <td>
                    <input type="number" class="form-control quantity" min="1" value="1"
                           onchange="calculateRowTotal(${index})">
                </td>
                <td>
                    <input type="number" class="form-control unit-price" min="0" step="0.01" value="0.00"
                           onchange="calculateRowTotal(${index})">
                </td>
                <td><span class="subtotal">$0.00</span></td>
                <td><span class="iva">$0.00</span></td>
                <td><span class="total">$0.00</span></td>
            <td>
                <input type="date" class="form-control expiration-date"
                           onchange="updateSelectedProduct(${index})">
            </td>
            <td>
                <input type="text" class="form-control batch-number"
                           onchange="updateSelectedProduct(${index})">
            </td>
            <td>
                    <input type="text" class="form-control notes"
                           onchange="updateSelectedProduct(${index})">
                </td>
                <td>
                    <button type="button" class="btn btn-sm btn-danger" onclick="removeProductRow(${index})">
                    <i class="ti ti-trash"></i>
                </button>
            </td>
        </tr>
    `;
    }
}

function generateProductRowHtml(index, product, isIndexView) {
    if (isIndexView) {
        return `
            <tr id="productRow_${index}">
                <td>
                    <input type="text" class="form-control product-name" readonly
                           value="${product.name}"
                           onclick="showProductModal(${index})">
                    <input type="hidden" class="product-id" value="${product.id}">
                </td>
                <td>
                    <input type="number" class="form-control quantity" min="1" value="1"
                           onchange="calculateRowTotal(${index})">
                </td>
                <td>
                    <input type="number" class="form-control unit-price" min="0" step="0.01"
                           value="${product.price || 0}"
                           onchange="calculateRowTotal(${index})">
                </td>
                <td><span class="subtotal">$0.00</span></td>
                <td>
                    <input type="date" class="form-control expiration-date"
                           onchange="updateSelectedProduct(${index})">
                </td>
                <td>
                    <input type="text" class="form-control batch-number"
                           onchange="updateSelectedProduct(${index})">
                </td>
                <td>
                    <button type="button" class="btn btn-sm btn-danger" onclick="removeProductRow(${index})">
                        <i class="ti ti-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    } else {
        return `
            <tr id="productRow_${index}">
                <td>
                    <input type="text" class="form-control product-name" readonly
                           value="${product.name}"
                           onclick="showProductModal(${index})">
                    <input type="hidden" class="product-id" value="${product.id}">
                </td>
                <td>
                    <input type="number" class="form-control quantity" min="1" value="1"
                           onchange="calculateRowTotal(${index})">
                </td>
                <td>
                    <input type="number" class="form-control unit-price" min="0" step="0.01"
                           value="${product.price || 0}"
                           onchange="calculateRowTotal(${index})">
                </td>
                <td><span class="subtotal">$0.00</span></td>
                <td><span class="iva">$0.00</span></td>
                <td><span class="total">$0.00</span></td>
                <td>
                    <input type="date" class="form-control expiration-date"
                           onchange="updateSelectedProduct(${index})">
                </td>
                <td>
                    <input type="text" class="form-control batch-number"
                           onchange="updateSelectedProduct(${index})">
                </td>
                <td>
                    <input type="text" class="form-control notes"
                           onchange="updateSelectedProduct(${index})">
                </td>
                <td>
                    <button type="button" class="btn btn-sm btn-danger" onclick="removeProductRow(${index})">
                        <i class="ti ti-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    }
}

// ========================================
// CÁLCULOS Y TOTALES
// ========================================

function calculateRowTotal(rowIndex) {
    console.log(`🧮 Calculando total para fila ${rowIndex}...`);

    const row = $(`#productRow_${rowIndex}`);
    const quantity = parseInt(row.find('.quantity').val()) || 0;
    const unitPrice = parseFloat(row.find('.unit-price').val()) || 0;

    console.log(`📊 Fila ${rowIndex}: Cantidad=${quantity}, Precio=${unitPrice}`);

    const subtotal = quantity * unitPrice;
    const iva = subtotal * 0.13;
    const total = subtotal + iva;

    // Actualizar displays
    row.find('.subtotal').text(`$${subtotal.toFixed(2)}`);

    if (row.find('.iva').length) {
        row.find('.iva').text(`$${iva.toFixed(2)}`);
    }

    if (row.find('.total').length) {
        row.find('.total').text(`$${total.toFixed(2)}`);
    }

    // IMPORTANTE: Actualizar datos del producto PRIMERO
    updateSelectedProduct(rowIndex);

    // Luego calcular totales generales
    calculateAllTotals();

    console.log(`✅ Fila ${rowIndex} actualizada: Subtotal=${subtotal.toFixed(2)}`);
}

function updateSelectedProduct(rowIndex) {
    console.log(`🔄 Actualizando producto en fila ${rowIndex}...`);

    const row = $(`#productRow_${rowIndex}`);

    const productId = parseInt(row.find('.product-id').val());
    if (!productId) {
        console.log(`⚠️ Fila ${rowIndex} no tiene producto seleccionado`);
        return; // Fila vacía
    }

    const quantity = parseInt(row.find('.quantity').val()) || 0;
    const unitPrice = parseFloat(row.find('.unit-price').val()) || 0;
    const expirationDate = row.find('.expiration-date').val() || null;
    const batchNumber = row.find('.batch-number').val() || null;
    const notes = row.find('.notes').val() || null;

    selectedProducts[rowIndex] = {
        product_id: productId,
        quantity: quantity,
        unit_price: unitPrice,
        expiration_date: expirationDate,
        batch_number: batchNumber,
        notes: notes
    };

    console.log(`✅ Producto ${rowIndex} actualizado:`, {
        product_id: productId,
        quantity: quantity,
        unit_price: unitPrice,
        expiration_date: expirationDate,
        batch_number: batchNumber
    });

    console.log(`📦 Array selectedProducts actual:`, selectedProducts);
}

function calculateAllTotals() {
    let subtotal = 0;
    let totalIva = 0;
    let totalAmount = 0;

    Object.values(selectedProducts).forEach(product => {
        if (product && product.product_id) {
        const rowSubtotal = product.quantity * product.unit_price;
        const rowIva = rowSubtotal * 0.13;

        subtotal += rowSubtotal;
        totalIva += rowIva;
            totalAmount += rowSubtotal + rowIva;
        }
    });

    const isIndexView = isIndexViewStructure();

    if (isIndexView) {
        // Para modal "Ingresar compra" - actualizar campos
        $('#gravada').val(subtotal.toFixed(2));
        $('#iva').val(totalIva.toFixed(2));
        calculateTotals(); // Función existente para calcular total general
    } else {
        // Para vista create - actualizar displays
        $('#subtotal').text(`$${subtotal.toFixed(2)}`);
        $('#totalIva').text(`$${totalIva.toFixed(2)}`);
        $('#totalAmount').text(`$${totalAmount.toFixed(2)}`);
    }

    console.log(`💰 Totales calculados: Subtotal: ${subtotal}, IVA: ${totalIva}, Total: ${totalAmount}`);
}

function calculateTotals() {
    // Delegar al archivo forms-purchase.js
    if (typeof suma === 'function') {
        suma();
    }
}

// Función global para el botón "Calcular Totales"
function calculateTotalsFromProducts() {
    console.log('🧮 Calculando totales desde productos...');
    calculateAllTotals();
}

// ========================================
// GESTIÓN DEL FORMULARIO
// ========================================

function resetPurchaseForm() {
    console.log('🧹 Limpiando formulario de compra...');

    // Limpiar tabla de productos
    $('#productsTableBody').empty();

    // Reset variables
    selectedProducts = [];
    productRowIndex = 0;
    currentRowIndex = undefined;

    // Limpiar campos del formulario
    $('#addpurchaseForm')[0].reset();

    // Reset campos de totales
    $('#exenta, #gravada, #iva, #contrans, #fovial, #cesc, #iretenido, #others, #total').val('0.00');

    // Reset Select2 si existen
    $('.select2purchase, .select2company, .select2provider').val(null).trigger('change');

    console.log('✅ Formulario limpiado correctamente');
}

function initializePurchaseForm() {
    console.log('🔄 Inicializando formulario de compra...');

    // Asegurar que las variables estén limpias
    selectedProducts = [];
    productRowIndex = 0;
    currentRowIndex = undefined;

    // No crear fila inicial - el usuario debe usar el botón "Agregar Producto"
    console.log('🎯 Modal listo - usuario debe hacer click en "Agregar Producto"');

    console.log('✅ Formulario inicializado correctamente');
}

// ========================================
// UTILIDADES
// ========================================

function formatDateForInput(dateString) {
    if (!dateString) return '';

    try {
        // Si la fecha ya viene en formato Y-m-d, usarla directamente
        if (typeof dateString === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
            console.log(`📅 Fecha ya en formato Y-m-d, usando directamente: "${dateString}"`);
            return dateString;
        }

        // Si viene como objeto Date o string ISO, convertir
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return '';

        // Usar la fecha local en lugar de UTC para evitar problemas de zona horaria
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        const result = `${year}-${month}-${day}`; // Formato YYYY-MM-DD
        console.log(`📅 Fecha convertida de "${dateString}" a "${result}"`);
        return result;
    } catch (error) {
        console.error('❌ Error formateando fecha:', dateString, error);
        return '';
    }
}

function formatDateForDisplay(dateString) {
    if (!dateString) return 'N/A';

    try {
        // Si la fecha ya viene en formato Y-m-d, usarla directamente
        if (typeof dateString === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
            const [year, month, day] = dateString.split('-');
            return `${day}/${month}/${year}`;
        }

        // Si viene como objeto Date o string ISO, convertir
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return 'N/A';

        // Usar fecha local para evitar problemas de zona horaria
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();

        return `${day}/${month}/${year}`; // Formato DD/MM/YYYY
    } catch (error) {
        console.error('❌ Error formateando fecha para display:', dateString, error);
        return 'N/A';
    }
}

function isIndexViewStructure() {
    const columnCount = $('#productsTable thead tr th').length;
    return columnCount === 7; // 7 columnas = index.blade.php (modal compra), 10 = create.blade.php (página completa)
}

function showError(message) {
    Swal.fire({
        title: 'Error',
        text: message,
        icon: 'error',
        confirmButtonText: 'Ok'
    });
}

function showSuccess(message) {
    Swal.fire({
        title: 'Producto Agregado',
        text: message,
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
    });
}

// ========================================
// MANEJO DE FORMULARIOS
// ========================================

function handleFormSubmit(e) {
    e.preventDefault();
    console.log('📋 Enviando formulario nueva compra...');

    // Verificar que hay productos
    const validProducts = Object.values(selectedProducts).filter(p => p && p.product_id);
    if (validProducts.length === 0) {
        showError('Debe agregar al menos un producto. Haga click en "Agregar Producto" para comenzar.');
        return;
    }

    console.log(`📦 Enviando ${validProducts.length} productos`);
    submitForm();
}

function handleCreateFormSubmit(e) {
    e.preventDefault();
    console.log('📋 Enviando formulario crear compra...');

    const validProducts = Object.values(selectedProducts).filter(p => p && p.product_id);
    if (validProducts.length === 0) {
        showError('Debe agregar al menos un producto. Haga click en "Agregar Producto" para comenzar.');
        return;
    }

    // Preparar datos
    const details = validProducts.map(product => ({
        product_id: product.product_id,
        quantity: parseInt(product.quantity),
        unit_price: parseFloat(product.unit_price),
        expiration_date: product.expiration_date || null,
        batch_number: product.batch_number || null,
        notes: product.notes || null
    }));

    $('#detailsInput').val(JSON.stringify(details));
    submitForm();
}

function handleUpdateFormSubmit(e) {
    e.preventDefault();
    console.log('📋 Enviando formulario editar compra...');

    // Obtener datos del formulario
    const formData = new FormData($('#updatepurchaseForm')[0]);

    // Agregar productos editados si existen
    if (Object.keys(editSelectedProducts).length > 0) {
        const validEditProducts = Object.values(editSelectedProducts).filter(p => p && p.product_id);

        console.log('📦 Productos a editar:', validEditProducts);

        validEditProducts.forEach((product, index) => {
            formData.append(`edit_details[${index}][product_id]`, product.product_id);
            formData.append(`edit_details[${index}][quantity]`, product.quantity);
            formData.append(`edit_details[${index}][unit_price]`, product.unit_price);
            formData.append(`edit_details[${index}][expiration_date]`, product.expiration_date || '');
            formData.append(`edit_details[${index}][batch_number]`, product.batch_number || '');
            formData.append(`edit_details[${index}][notes]`, product.notes || '');

            console.log(`📝 Agregando producto ${index}:`, {
                product_id: product.product_id,
                quantity: product.quantity,
                unit_price: product.unit_price,
                expiration_date: product.expiration_date,
                batch_number: product.batch_number
            });

            // Log específico para fecha de expiración
            if (product.expiration_date) {
                console.log(`📅 Fecha de expiración enviada: "${product.expiration_date}" (tipo: ${typeof product.expiration_date})`);
            }
        });

        console.log(`📦 Agregando ${validEditProducts.length} productos editados`);
    }

    // Debug: Mostrar datos que se van a enviar
    console.log('🚀 DATOS DE EDICIÓN A ENVIAR:');
    for (let pair of formData.entries()) {
        console.log(pair[0] + ':', pair[1]);
    }

    // Enviar con AJAX
    $.ajax({
        url: $('#updatepurchaseForm').attr('action'),
        method: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        headers: {
            'X-Requested-With': 'XMLHttpRequest' // Marcar como AJAX
        },
        success: function(response) {
            console.log('✅ Respuesta del servidor:', response);

            if (response.success) {
                // Cerrar modal
                $('#updatePurchaseModal').modal('hide');

                // Mostrar mensaje de éxito
                Swal.fire({
                    title: '¡Éxito!',
                    text: response.message || 'Compra actualizada correctamente',
                    icon: 'success',
                    confirmButtonText: 'Ok'
                }).then(() => {
                    // Recargar la página para actualizar la lista
                    location.reload();
                });

                console.log('✅ Compra actualizada exitosamente');
            } else {
                console.error('❌ Error del servidor:', response.message);
                showError(response.message || 'Error al actualizar la compra');
            }
        },
        error: function(xhr) {
            console.error('❌ Error en petición AJAX:', xhr);

            let message = 'Error al actualizar la compra';
            if (xhr.responseJSON && xhr.responseJSON.message) {
                message = xhr.responseJSON.message;
            } else if (xhr.responseText) {
                try {
                    const errorData = JSON.parse(xhr.responseText);
                    message = errorData.message || message;
                } catch (e) {
                    // Si no es JSON válido, usar mensaje por defecto
                }
            }

            showError(message);
        }
    });
}

function submitForm() {
    const formData = new FormData($('#addpurchaseForm')[0] || $('#purchaseForm')[0]);

    // Debug: Verificar productos antes de enviar
    console.log('🚀 DATOS ANTES DE ENVIAR:');
    console.log('selectedProducts:', selectedProducts);

    const validProducts = Object.values(selectedProducts).filter(p => p && p.product_id);
    console.log('validProducts:', validProducts);

    // Agregar productos si es formulario simple
    if ($('#addpurchaseForm').length) {
        let productIndex = 0;
        Object.values(selectedProducts).forEach((product) => {
        if (product && product.product_id) {
                console.log(`🔍 Agregando producto ${productIndex}:`, product);

                formData.append(`details[${productIndex}][product_id]`, product.product_id);
                formData.append(`details[${productIndex}][quantity]`, product.quantity);
                formData.append(`details[${productIndex}][unit_price]`, product.unit_price);
                formData.append(`details[${productIndex}][expiration_date]`, product.expiration_date || '');
                formData.append(`details[${productIndex}][batch_number]`, product.batch_number || '');
                formData.append(`details[${productIndex}][notes]`, product.notes || '');

                productIndex++;
            }
        });

        console.log(`📦 Total productos agregados al FormData: ${productIndex}`);
    }

    // Debug: Verificar FormData
    console.log('📋 CONTENIDO DEL FORMDATA:');
    for (let pair of formData.entries()) {
        console.log(pair[0] + ':', pair[1]);
    }

    const form = $('#addpurchaseForm').length ? $('#addpurchaseForm') : $('#purchaseForm');

    $.ajax({
        url: form.attr('action'),
        method: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        success: function(response) {
            if (response.success) {
                // Cerrar modal antes de mostrar confirmación
                $('#addPurchaseModal').modal('hide');

                Swal.fire({
                    title: '¡Éxito!',
                    text: 'Compra creada correctamente',
                    icon: 'success',
                    confirmButtonText: 'Ok'
                }).then(() => {
                    // Recargar la página para actualizar la lista
                        location.reload();
                });

                console.log('✅ Compra creada exitosamente');
            } else {
                console.error('❌ Error del servidor:', response.message);
                showError(response.message || 'Error al crear la compra');
            }
        },
        error: function(xhr) {
            console.error('❌ Error en petición AJAX:', xhr);
            const message = xhr.responseJSON?.message || 'Error al crear la compra';

            // No cerrar el modal en caso de error para que el usuario pueda corregir
            showError(message);
        }
    });
}

// ========================================
// FUNCIONES PARA EDICIÓN (COMPATIBILIDAD)
// ========================================

function addEditProductRow(product = null) {
    if (!product) {
        showEditProductModal(editProductRowIndex);
        return;
    }

    const row = `
        <tr id="editProductRow_${editProductRowIndex}">
            <td>
                <input type="text" class="form-control product-name" readonly
                       value="${product.name}"
                       onclick="showEditProductModal(${editProductRowIndex})">
                <input type="hidden" class="product-id" value="${product.id}">
            </td>
            <td>
                <input type="number" class="form-control quantity" min="1" value="1"
                       onchange="calculateEditRowTotal(${editProductRowIndex})">
            </td>
            <td>
                <input type="number" class="form-control unit-price" min="0" step="0.01"
                       value="${product.price || 0}"
                       onchange="calculateEditRowTotal(${editProductRowIndex})">
            </td>
            <td><span class="subtotal">$0.00</span></td>
            <td>
                <input type="date" class="form-control expiration-date"
                       onchange="updateEditSelectedProduct(${editProductRowIndex})">
            </td>
            <td>
                <input type="text" class="form-control batch-number"
                       onchange="updateEditSelectedProduct(${editProductRowIndex})">
            </td>
            <td>
                <button type="button" class="btn btn-sm btn-danger" onclick="removeEditProductRow(${editProductRowIndex})">
                    <i class="ti ti-trash"></i>
                </button>
            </td>
        </tr>
    `;

    $('#editProductsTableBody').append(row);

    // Actualizar producto seleccionado inmediatamente
    if (product) {
        updateEditSelectedProduct(editProductRowIndex);
        calculateEditRowTotal(editProductRowIndex);
    }

    editProductRowIndex++;
}

function showEditProductModal(rowIndex) {
    currentRowIndex = rowIndex;
    $('#productModal').modal('show');
}

function calculateEditRowTotal(rowIndex) {
    const row = $(`#editProductRow_${rowIndex}`);
    const quantity = parseInt(row.find('.quantity').val()) || 0;
    const unitPrice = parseFloat(row.find('.unit-price').val()) || 0;
    const subtotal = quantity * unitPrice;

    row.find('.subtotal').text(`$${subtotal.toFixed(2)}`);
    updateEditSelectedProduct(rowIndex);
    calculateEditTotalsFromProducts();
}

function updateEditSelectedProduct(rowIndex) {
    const row = $(`#editProductRow_${rowIndex}`);
    const expirationDate = row.find('.expiration-date').val() || null;

    editSelectedProducts[rowIndex] = {
        product_id: parseInt(row.find('.product-id').val()),
        quantity: parseInt(row.find('.quantity').val()) || 0,
        unit_price: parseFloat(row.find('.unit-price').val()) || 0,
        expiration_date: expirationDate,
        batch_number: row.find('.batch-number').val() || null,
        notes: null
    };

    console.log(`📝 Actualizando producto ${rowIndex}:`, editSelectedProducts[rowIndex]);

    // Log específico para fecha de expiración
    if (expirationDate) {
        console.log(`📅 Fecha capturada del input: "${expirationDate}" (tipo: ${typeof expirationDate})`);
    }
}

function removeEditProductRow(rowIndex) {
    $(`#editProductRow_${rowIndex}`).remove();
    delete editSelectedProducts[rowIndex];
    calculateEditTotalsFromProducts();
}

function calculateEditTotalsFromProducts() {
    console.log('💰 Calculando totales en modo edición...');

    let subtotal = 0;
    let totalIva = 0;

    Object.values(editSelectedProducts).forEach(product => {
        if (product && product.product_id) {
        const rowSubtotal = product.quantity * product.unit_price;
        subtotal += rowSubtotal;
            totalIva += rowSubtotal * 0.13;
            console.log(`📊 Producto: ${product.product_id}, Subtotal: ${rowSubtotal}`);
        }
    });

    console.log(`💰 Totales edición: Subtotal: ${subtotal}, IVA: ${totalIva}`);

    // Actualizar campos automáticamente
        $('#gravadaedit').val(subtotal.toFixed(2));
        $('#ivaedit').val(totalIva.toFixed(2));

    // Recalcular total general
    calculateEditTotals();
}

function calculateEditTotals() {
    // Delegar al archivo forms-purchase.js
    if (typeof sumaedit === 'function') {
        sumaedit();
    }
}

// ========================================
// FUNCIONES AUXILIARES (COMPATIBILIDAD)
// ========================================

function loadPurchaseDetails(purchaseId) {
    const encodedId = btoa(purchaseId);
    $.get(`/purchase/details/${encodedId}`, function(response) {
        if (response.success) {
            console.log('📋 Cargando detalles de compra para edición:', response.purchase);

            // Limpiar datos anteriores
            editSelectedProducts = [];
            editProductRowIndex = 0;
            $('#editProductsTableBody').empty();

            // Formatear fecha del comprobante
            const formattedDate = formatDateForInput(response.purchase.date);
            $('#dateedit').val(formattedDate);
            console.log('📅 Fecha del comprobante formateada:', formattedDate);

            // Cargar otros campos del formulario
            $('#numberedit').val(response.purchase.number || '');
            $('#exentaedit').val(response.purchase.exenta || '0.00');
            $('#gravadaedit').val(response.purchase.gravada || '0.00');
            $('#ivaedit').val(response.purchase.iva || '0.00');
            $('#contransedit').val(response.purchase.contrans || '0.00');
            $('#fovialedit').val(response.purchase.fovial || '0.00');
            $('#cescedit').val(response.purchase.cesc || '0.00');
            $('#iretenidoedit').val(response.purchase.iretenido || '0.00');
            $('#othersedit').val(response.purchase.others || '0.00');
            $('#totaledit').val(response.purchase.total || '0.00');

            // Cargar productos
            response.details.forEach(detail => {
                const product = {
                    id: detail.product_id,
                    name: detail.product.name,
                    price: detail.unit_price
                };

                addEditProductRow(product);

                const row = $(`#editProductRow_${editProductRowIndex - 1}`);
                row.find('.quantity').val(detail.quantity);
                row.find('.unit-price').val(detail.unit_price);

                // Formatear fecha de expiración
                console.log(`📅 Fecha de expiración del servidor para edición: "${detail.expiration_date}" (tipo: ${typeof detail.expiration_date})`);
                const formattedExpDate = formatDateForInput(detail.expiration_date);
                console.log(`📅 Fecha formateada para input: "${formattedExpDate}"`);
                row.find('.expiration-date').val(formattedExpDate);

                row.find('.batch-number').val(detail.batch_number);

                // Actualizar el array editSelectedProducts con los valores cargados
                updateEditSelectedProduct(editProductRowIndex - 1);

                calculateEditRowTotal(editProductRowIndex - 1);
            });

            console.log('✅ Detalles de compra cargados correctamente');
        } else {
            console.error('❌ Error al cargar detalles:', response.message);
            showError('Error al cargar los detalles de la compra: ' + response.message);
        }
    }).fail(function(xhr, status, error) {
        console.error('❌ Error en petición de detalles:', error);
        showError('Error al cargar los detalles de la compra');
    });
}

function viewPurchaseDetails(purchaseId) {
    const encodedId = btoa(purchaseId);
    $.get(`/purchase/details/${encodedId}`, function(response) {
        if (response.success) {
            $('#viewNumber').text(response.purchase.number || 'N/A');
            $('#viewDate').text(formatDateForDisplay(response.purchase.date));
            $('#viewProvider').text(response.purchase.provider ? response.purchase.provider.razonsocial : 'N/A');
            $('#viewCompany').text(response.purchase.company ? response.purchase.company.name : 'N/A');
            $('#viewExenta').text('$' + (response.purchase.exenta || '0.00'));
            $('#viewGravada').text('$' + (response.purchase.gravada || '0.00'));
            $('#viewIva').text('$' + (response.purchase.iva || '0.00'));
            $('#viewTotal').text('$' + (response.purchase.total || '0.00'));

            const tbody = $('#viewProductsTableBody');
            tbody.empty();

            if (response.details && response.details.length > 0) {
                response.details.forEach(detail => {
                    console.log(`📅 Fecha de expiración del servidor: "${detail.expiration_date}" (tipo: ${typeof detail.expiration_date})`);
                    const subtotal = detail.quantity * detail.unit_price;
                    const row = `
                        <tr>
                            <td>
                                <strong>${detail.product ? detail.product.name : 'N/A'}</strong>
                                <br><small class="text-muted">${detail.product ? detail.product.code : 'N/A'}</small>
                            </td>
                            <td>${detail.quantity}</td>
                            <td>$${detail.unit_price}</td>
                            <td>$${subtotal.toFixed(2)}</td>
                            <td>${formatDateForDisplay(detail.expiration_date)}</td>
                            <td>${detail.batch_number || 'N/A'}</td>
                        </tr>
                    `;
                    tbody.append(row);
                });
            } else {
                tbody.append('<tr><td colspan="6" class="text-center">No hay productos en esta compra</td></tr>');
            }

            $('#viewPurchaseModal').modal('show');
        } else {
            alert('Error al cargar los detalles de la compra: ' + (response.message || 'Error desconocido'));
        }
    }).fail(function(xhr, status, error) {
        alert('Error al cargar los detalles de la compra. Revisa la consola para más información.');
    });
}

// ========================================
// FUNCIONES PARA VISTAS ESPECÍFICAS
// ========================================

function loadProviders() {
    console.log('📦 Cargando proveedores...');

    $.ajax({
        url: '/provider/getproviders',
        method: 'GET',
        success: function(response) {
            console.log('✅ Proveedores cargados:', response);

            const select = $('#providerFilter');
            if (select.length) {
                select.empty();
                select.append('<option value="">Todos</option>');

                // La respuesta es un array directo
                if (Array.isArray(response)) {
                    response.forEach(provider => {
                        select.append(`<option value="${provider.id}">${provider.razonsocial}</option>`);
                    });
                }
            }
        },
        error: function(xhr, status, error) {
            console.error('❌ Error cargando proveedores:', error);
        }
    });
}

// Funciones legacy
function retomarsale(corr, document) {
    window.location.href = "create?corr=" + corr + "&draft=true&typedocument=" + document + "&operation=delete";
}

function printsale(corr) {
    window.open('impdoc/' + corr, '_blank');
}

function checkExpiredProducts() {
    console.log('🔍 Verificando productos vencidos...');

    $.get('/purchase/expired-products', function(response) {
        console.log('📊 Respuesta de productos vencidos:', response);

        if (response.success && response.data.length > 0) {
            Swal.fire({
                title: 'Productos Vencidos',
                text: `Hay ${response.data.length} productos vencidos en el inventario`,
                icon: 'warning',
                confirmButtonText: 'Ver Detalles',
                showCancelButton: true,
                cancelButtonText: 'Cerrar'
            }).then((result) => {
                if (result.isConfirmed) {
                    console.log('🔗 Navegando a vista de productos próximos a vencer...');
                    // Navegar en la misma pestaña
                    window.location.href = '/purchase/expiring-products-view';
                }
            });
        } else {
            Swal.fire({
                title: 'Sin Productos Vencidos',
                text: 'No hay productos vencidos en el inventario',
                icon: 'success',
                confirmButtonText: 'Ok'
            });
        }
    }).fail(function(xhr, status, error) {
        console.error('❌ Error al verificar productos vencidos:', error);
        console.error('Status:', status);
        console.error('Response:', xhr.responseText);

        Swal.fire({
            title: 'Error',
            text: 'Error al verificar productos vencidos. Revisa la consola para más información.',
            icon: 'error',
            confirmButtonText: 'Ok'
        });
    });
}

// Nueva función para productos vencidos en la misma página
function showExpiredProductsInSamePage() {
    console.log('🔍 Navegando a productos vencidos...');
    window.location.href = '/purchase/expiring-products-view';
}

// Función de test para debug
function testDebug() {
    console.log('🧪 INICIANDO TEST DE DEBUG...');

    // Test 1: Verificar productos
    console.log('📦 Test 1: Verificando productos cargados');
    console.log('products.length:', products.length);
    console.log('selectedProducts:', selectedProducts);

    // Test 2: Verificar elementos DOM
    console.log('🎯 Test 2: Verificando elementos DOM');
    console.log('#productModal existe:', $('#productModal').length > 0);
    console.log('#productsTableBody existe:', $('#productsTableBody').length > 0);
    console.log('#addProductBtn existe:', $('#addProductBtn').length > 0);

    // Test 3: Verificar rutas
    console.log('🔗 Test 3: Probando rutas básicas');

    $.get('/purchase/products', function(response) {
        console.log('✅ /purchase/products:', response.success ? 'OK' : 'ERROR');
        console.log('Productos obtenidos:', response.products ? response.products.length : 0);
    }).fail(function() {
        console.error('❌ /purchase/products: FALLO');
    });

    $.get('/purchase/expiring-products', function(response) {
        console.log('✅ /purchase/expiring-products:', response.success ? 'OK' : 'ERROR');
        console.log('Datos:', response.data);
    }).fail(function() {
        console.error('❌ /purchase/expiring-products: FALLO');
    });

        // Test 4: Simular agregar producto
    console.log('➕ Test 4: Simulando flujo de agregar producto');
    if (products.length > 0) {
        const testProduct = products[0];
        console.log('Producto de prueba:', testProduct);

        // Simular selección
        selectedProducts[999] = {
            product_id: testProduct.id,
            quantity: 5,
            unit_price: parseFloat(testProduct.price || 0),
            expiration_date: null,
            batch_number: null,
            notes: 'Test'
        };

        console.log('Producto test agregado:', selectedProducts[999]);
        delete selectedProducts[999]; // Limpiar
    }

    // Test 5: Verificar actualizaciones de cantidad
    console.log('🔄 Test 5: Verificando actualización de cantidades');
    const existingRows = $('#productsTableBody tr');
    if (existingRows.length > 0) {
        const firstRow = existingRows.first();
        const rowId = firstRow.attr('id');
        if (rowId) {
            const rowIndex = rowId.replace('productRow_', '');
            console.log(`Probando actualización en fila ${rowIndex}`);

            // Simular cambio de cantidad
            const quantityInput = firstRow.find('.quantity');
            if (quantityInput.length) {
                const originalQuantity = quantityInput.val();
                console.log(`Cantidad original: ${originalQuantity}`);

                quantityInput.val(10);
                quantityInput.trigger('change');

                setTimeout(() => {
                    console.log('selectedProducts después del cambio:', selectedProducts);
                }, 100);
            } else {
                console.log('No se encontró input de cantidad en la fila');
            }
        }
    } else {
        console.log('No hay filas existentes para probar');
    }

    Swal.fire({
        title: 'Test Completado',
        text: 'Revisa la consola para ver los resultados del test',
        icon: 'info',
        confirmButtonText: 'Ok'
    });
}

// Función específica para test de cantidades
function testQuantityUpdate() {
    console.log('🧪 TEST ESPECÍFICO: Actualización de Cantidades');

    // Verificar si hay productos en la tabla
    const existingRows = $('#productsTableBody tr');
    console.log(`Filas encontradas: ${existingRows.length}`);

    if (existingRows.length === 0) {
        console.log('❌ No hay filas para probar. Agrega un producto primero.');
        Swal.fire({
            title: 'Sin productos',
            text: 'Agrega un producto primero para probar la actualización de cantidades',
            icon: 'warning',
            confirmButtonText: 'Ok'
        });
        return;
    }

    // Probar en cada fila existente
    existingRows.each(function(index) {
        const row = $(this);
        const rowId = row.attr('id');

        if (rowId) {
            const rowIndex = rowId.replace('productRow_', '');
            console.log(`\n📝 Probando fila ${rowIndex}:`);

            // Obtener elementos
            const productId = row.find('.product-id').val();
            const quantityInput = row.find('.quantity');
            const priceInput = row.find('.unit-price');

            console.log(`  Product ID: ${productId}`);
            console.log(`  Cantidad actual: ${quantityInput.val()}`);
            console.log(`  Precio actual: ${priceInput.val()}`);

            // Estado anterior
            console.log(`  selectedProducts[${rowIndex}] antes:`, selectedProducts[rowIndex]);

            // Cambiar cantidad
            const newQuantity = 15 + index; // Diferente para cada fila
            quantityInput.val(newQuantity);

            // Disparar evento change manualmente
            quantityInput.trigger('change');

            // Verificar después del cambio
            setTimeout(() => {
                console.log(`  selectedProducts[${rowIndex}] después:`, selectedProducts[rowIndex]);
                console.log(`  ✅ Cantidad actualizada a: ${selectedProducts[rowIndex]?.quantity || 'ERROR'}`);
            }, 50);
        }
    });

    // Mostrar resumen después de un momento
    setTimeout(() => {
        console.log('\n📊 RESUMEN FINAL:');
        console.log('selectedProducts completo:', selectedProducts);

        Swal.fire({
            title: 'Test de Cantidades Completado',
            text: 'Revisa la consola para ver los detalles del test',
            icon: 'success',
            confirmButtonText: 'Ok'
        });
    }, 200);
}

// Las funciones de reporte de utilidades se moverán al módulo de reportes

// Función de test para edición
function testEditSubmit() {
    console.log('🧪 TEST: Formulario de edición');

    const form = $('#updatepurchaseForm');
    if (form.length === 0) {
        console.error('❌ Formulario de edición no encontrado');
        return;
    }

    console.log('✅ Formulario encontrado');
    console.log('URL de acción:', form.attr('action'));
    console.log('Método:', form.attr('method'));

    // Verificar campos principales
    const fields = ['idedit', 'numberedit', 'dateedit', 'provideredit', 'companyedit'];
    fields.forEach(field => {
        const element = $(`#${field}`);
        console.log(`Campo ${field}:`, element.length > 0 ? '✅' : '❌', element.val());
    });

    // Verificar totales
    const totals = ['exentaedit', 'gravadaedit', 'ivaedit', 'totaledit'];
    totals.forEach(total => {
        const element = $(`#${total}`);
        console.log(`Total ${total}:`, element.length > 0 ? '✅' : '❌', element.val());
    });

    // Verificar productos editados
    console.log('Productos editados:', editSelectedProducts);
    console.log('Filas de productos editados:', $('#editProductsTableBody tr').length);

    Swal.fire({
        title: 'Test de Edición Completado',
        text: 'Revisa la consola para ver los detalles',
        icon: 'info',
        confirmButtonText: 'Ok'
    });
}
