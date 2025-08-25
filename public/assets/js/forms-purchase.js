/**
 * Form Picker
 */

'use strict';
$(document).ready(function (){
    //Get providers avaibles
    var iduser = $('#iduser').val();
    $.ajax({
        url: "/provider/getproviders",
        method: "GET",
        success: function(response){
            //console.log(response);
            $('#provider').append('<option value="0">Seleccione</option>');
            $.each(response, function(index, value) {
                $('#provider').append('<option value="'+value.id+'">'+value.razonsocial.toUpperCase()+'</option>');
                $('#provideredit').append('<option value="'+value.id+'">'+value.razonsocial.toUpperCase()+'</option>');
              });
        }
    });

    $.ajax({
        url: "/company/getCompanybyuser/" + iduser,
        method: "GET",
        success: function (response) {
            $("#company").append('<option value="0">Seleccione</option>');
            $.each(response, function (index, value) {
                $("#company").append(
                    '<option selected value="' +
                        value.id +
                        '">' +
                        value.name.toUpperCase() +
                        "</option>"
                );
                $("#companyedit").append(
                    '<option value="' +
                        value.id +
                        '">' +
                        value.name.toUpperCase() +
                        "</option>"
                );
            });
        },
    });
});

function calculaiva(monto){
    monto=parseFloat(monto*13/100).toFixed(2);
    $("#iva").val(monto);
    suma();
};
//edit
function calculaivaedit(monto){
    monto=parseFloat(monto*13/100).toFixed(2);
    $("#ivaedit").val(monto);
    suma();
};

function suma(){
    var gravada = $("#gravada").val();
    var iva = $("#iva").val();
    var exenta = $("#exenta").val();
    var otros = $("#others").val();
    var contrans = $("#contrans").val();
    var fovial = $("#fovial").val();
    var retencion_iva = $("#iretenido").val();

    gravada = parseFloat(gravada);
    iva = parseFloat(iva);
    exenta = parseFloat(exenta);
    otros = parseFloat(otros);
    contrans = parseFloat(contrans);
    fovial = parseFloat(fovial);
    retencion_iva = parseFloat(retencion_iva);
    $("#total").val(parseFloat(gravada+iva+exenta+otros+contrans+fovial+retencion_iva).toFixed(2));
};
//edit
function sumaedit(){
    var gravada = $("#gravadaedit").val();
    var iva = $("#ivaedit").val();
    var exenta = $("#exentaedit").val();
    var otros = $("#othersedit").val();
    var contrans = $("#contransedit").val();
    var fovial = $("#fovialedit").val();
    var retencion_iva = $("#iretenidoedit").val();

    gravada = parseFloat(gravada);
    iva = parseFloat(iva);
    exenta = parseFloat(exenta);
    otros = parseFloat(otros);
    contrans = parseFloat(contrans);
    fovial = parseFloat(fovial);
    retencion_iva = parseFloat(retencion_iva);
    $("#totaledit").val(parseFloat(gravada+iva+exenta+otros+contrans+fovial+retencion_iva).toFixed(2));
};
   function editpurchase(id){
    //Get data edit Products
    $.ajax({
        url: "getpurchaseid/"+btoa(id),
        method: "GET",
        success: function(response){
            console.log(response);
            $.each(response, function(index, value) {
                    if(value==null) {
                        value = "0.00";
                    }
                    $('#'+index+'edit').val(value);
                    if(index=='provider_id'){
                        $("#provideredit option[value='"+ value  +"']").attr("selected", true);
                    }
                    if(index=='company_id'){
                        $("#companyedit option[value='"+ value  +"']").attr("selected", true);
                    }
                    if(index=='periodo'){
                        $("#periodedit option[value='"+ value  +"']").attr("selected", true);
                    }
                    if(index=='document_id'){
                        $("#documentedit option[value='"+ value  +"']").attr("selected", true);
                    }
                    if(index=='provider_id'){
                        $("#provideredit option[value='"+ value  +"']").attr("selected", true);
                    }

              });

              // Cargar los detalles de productos de la compra
              if (typeof loadPurchaseDetails === 'function') {
                  loadPurchaseDetails(id);
              }

              $("#updatePurchaseModal").modal("show");
        }
    });
   }



   (function () {
    // Flat Picker
    // --------------------------------------------------------------------
    const flatpickrDate = document.querySelector('date')
    const flatpickrDateedit = document.querySelector('#dateedit')

    // Date
    if (flatpickrDate) {
      flatpickrDate.flatpickr({
        //monthSelectorType: 'static',
        dateFormat: 'd-m-Y'
      });
    }

    //date edit
    if (flatpickrDateedit) {
        flatpickrDateedit.flatpickr({
          //monthSelectorType: 'static',
          dateFormat: 'd-m-Y'
        });
      }
  })();

// ========================================
// FUNCIONES DE FORMULARIOS Y CÁLCULOS
// ========================================

// Función para calcular IVA en formulario de nueva compra
function calculaiva(monto){
    monto=parseFloat(monto*13/100).toFixed(2);
    $("#iva").val(monto);
    suma();
}

// Función para calcular IVA en formulario de edición
function calculaivaedit(monto){
    monto=parseFloat(monto*13/100).toFixed(2);
    $("#ivaedit").val(monto);
    sumaedit();
}

// Función para sumar totales en formulario de nueva compra
function suma(){
    var gravada = $("#gravada").val();
    var iva = $("#iva").val();
    var exenta = $("#exenta").val();
    var otros = $("#others").val();
    var contrans = $("#contrans").val();
    var fovial = $("#fovial").val();
    var retencion_iva = $("#iretenido").val();

    gravada = parseFloat(gravada);
    iva = parseFloat(iva);
    exenta = parseFloat(exenta);
    otros = parseFloat(otros);
    contrans = parseFloat(contrans);
    fovial = parseFloat(fovial);
    retencion_iva = parseFloat(retencion_iva);
    $("#total").val(parseFloat(gravada+iva+exenta+otros+contrans+fovial+retencion_iva).toFixed(2));
}

// Función para sumar totales en formulario de edición
function sumaedit(){
    var gravada = $("#gravadaedit").val();
    var iva = $("#ivaedit").val();
    var exenta = $("#exentaedit").val();
    var otros = $("#othersedit").val();
    var contrans = $("#contransedit").val();
    var fovial = $("#fovialedit").val();
    var retencion_iva = $("#iretenidoedit").val();

    gravada = parseFloat(gravada);
    iva = parseFloat(iva);
    exenta = parseFloat(exenta);
    otros = parseFloat(otros);
    contrans = parseFloat(contrans);
    fovial = parseFloat(fovial);
    retencion_iva = parseFloat(retencion_iva);
    $("#totaledit").val(parseFloat(gravada+iva+exenta+otros+contrans+fovial+retencion_iva).toFixed(2));
}

// ========================================
// FUNCIONES DE EDICIÓN Y ELIMINACIÓN
// ========================================

// Función para editar compra
function editpurchase(id){
    //Get data edit Products
    $.ajax({
        url: "getpurchaseid/"+btoa(id),
        method: "GET",
        success: function(response){
            console.log(response);
            $.each(response, function(index, value) {
                    if(value==null) {
                        value = "0.00";
                    }
                    $('#'+index+'edit').val(value);
                    if(index=='provider_id'){
                        $("#provideredit option[value='"+ value  +"']").attr("selected", true);
                    }
                    if(index=='company_id'){
                        $("#companyedit option[value='"+ value  +"']").attr("selected", true);
                    }
                    if(index=='periodo'){
                        $("#periodedit option[value='"+ value  +"']").attr("selected", true);
                    }
                    if(index=='document_id'){
                        $("#documentedit option[value='"+ value  +"']").attr("selected", true);
                    }
                    if(index=='provider_id'){
                        $("#provideredit option[value='"+ value  +"']").attr("selected", true);
                    }

              });

              // Cargar los detalles de productos de la compra
              if (typeof loadPurchaseDetails === 'function') {
                  loadPurchaseDetails(id);
              }

              $("#updatePurchaseModal").modal("show");
        }
    });
}

// Función para eliminar compra
function deletepurchase(id){
    // Verificar que SweetAlert2 esté disponible
    if (typeof Swal === 'undefined') {
        alert('Error: SweetAlert2 no está disponible');
        return;
    }

    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: 'btn btn-success',
          cancelButton: 'btn btn-danger'
        },
        buttonsStyling: false
    });

    swalWithBootstrapButtons.fire({
        title: '¿Eliminar Compra?',
        text: "Esta acción no se puede deshacer",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, Eliminar',
        cancelButtonText: 'Cancelar',
        reverseButtons: true
    }).then((result) => {
        if (result.isConfirmed) {
            // Mostrar loading
            Swal.fire({
                title: 'Eliminando...',
                text: 'Por favor espera',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            $.ajax({
                url: "destroy/"+btoa(id),
                method: "GET",
                success: function(response){
                    if(response.success === true){
                        Swal.fire({
                            title: '¡Eliminado!',
                            text: response.message || 'La compra ha sido eliminada correctamente',
                            icon: 'success',
                            confirmButtonText: 'Aceptar'
                        }).then((result) => {
                            if (result.isConfirmed) {
                                location.reload();
                            }
                        });
                    } else {
                        Swal.fire({
                            title: 'Error',
                            text: response.message || 'No se pudo eliminar la compra. Por favor, contacta al administrador.',
                            icon: 'error',
                            confirmButtonText: 'Aceptar'
                        });
                    }
                },
                error: function(xhr, status, error) {
                    Swal.fire({
                        title: 'Error',
                        text: 'Ocurrió un error al eliminar la compra. Por favor, intenta de nuevo.',
                        icon: 'error',
                        confirmButtonText: 'Aceptar'
                    });
                }
            });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            Swal.fire({
                title: 'Cancelado',
                text: 'No se ha eliminado ninguna compra',
                icon: 'info',
                confirmButtonText: 'Aceptar'
            });
        }
    });
}

