/**
 * Form Picker
 */

"use strict";
$(document).ready(function () {
    $("#btnsavenewclient").prop("disabled", true);

    $("#tel1").inputmask("9999-9999");
    $("#tel2").inputmask("9999-9999");

    $("#ncredit").inputmask("999999-9");
    $("#nitedit").inputmask("99999999-9");
    $("#tel1edit").inputmask("9999-9999");
    $("#tel2edit").inputmask("9999-9999");

                // Validación única para NIT (solo en blur para evitar duplicados)
    $("#nit").on('blur', function () {
        validateNitField($(this));
    });

    //si es extranjero
    $("#pasaporte").on('blur', function () {
        var key = $("#pasaporte").val();
        var esextranjero = $('#extranjero').is(':checked');

        // Siempre deshabilitar botón al cambiar
        $("#btnsavenewclient").prop("disabled", true);
        $("#pasaporte").removeClass("is-invalid is-valid");

        // Si está vacío o no es extranjero, no validar
        if (!key || key.trim() === '' || !esextranjero) {
            return;
        }

        // Limpiar el valor removiendo guiones y espacios para la validación
        var cleanKey = cleanMaskValue(key);

        // Si después de limpiar está vacío, no validar
        if (!cleanKey || cleanKey.trim() === '') {
            return;
        }

        var tpersona = "E";
        $.ajax({
            url: "/client/keyclient/" + btoa(cleanKey) + "/" + btoa(tpersona),
            method: "GET",
            success: function (response) {
                if (response.val) {
                    Swal.fire({
                        title: "Cliente Duplicado",
                        text: response.message,
                        icon: "warning",
                        confirmButtonText: "Entendido"
                    });
                    $("#pasaporte").addClass("is-invalid");
                    $("#btnsavenewclient").prop("disabled", true);
                } else {
                    $("#pasaporte").addClass("is-valid");
                    $("#btnsavenewclient").prop("disabled", false);
                }
            },
            error: function() {
                Swal.fire({
                    title: "Error",
                    text: "Error al validar el cliente",
                    icon: "error",
                    confirmButtonText: "Entendido"
                });
                $("#btnsavenewclient").prop("disabled", true);
            }
        });
    });

    // Validación única para NCR (solo en blur para evitar duplicados)
    $("#ncr").on('blur', function () {
        validateNcrField($(this));
    });

    // Validaciones para formulario de edición
    $("#nitedit").on('blur', function () {
        validateNitEditField($(this));
    });

    $("#ncredit").on('blur', function () {
        validateNcrEditField($(this));
    });

    $("#pasaporteedit").on('blur', function () {
        validatePasaporteEditField($(this));
    });

    //Get companies avaibles
    $.ajax({
        url: "/company/getCompany",
        method: "GET",
        success: function (response) {
            let companyselected = $("#companyselected").val();
            $.each(response, function (index, value) {
                $("#selectcompany").append(
                    '<option value="' +
                        value.id +
                        '">' +
                        value.name +
                        "</option>"
                );
            });
            $("#selectcompany option[value=" + companyselected + "]").attr(
                "selected",
                true
            );
        },
    });

    // Manejar cambio de tipo de persona
    $("#tpersona").change(function() {
        var tpersona = $(this).val();

        // Limpiar validaciones previas y deshabilitar botón
        $("#nit, #ncr, #pasaporte").removeClass("is-invalid is-valid");
        $("#btnsavenewclient").prop("disabled", true);

        // Mostrar/ocultar campos según tipo de persona
        if (tpersona === "N") {
            $("#siextranjeroduinit").show();
            $("#siextranjero").hide();
            $("#ncr").closest(".mb-3").show();
        } else if (tpersona === "J") {
            $("#siextranjeroduinit").show();
            $("#siextranjero").hide();
            $("#ncr").closest(".mb-3").show();
        }

        // Verificar si se puede habilitar el botón
        setTimeout(function() {
            checkFormReadiness();
        }, 100);
    });

    // Manejar cambio de extranjero
    $("#extranjero").change(function() {
        var esextranjero = $(this).is(':checked');

        // Limpiar validaciones previas y deshabilitar botón
        $("#nit, #ncr, #pasaporte").removeClass("is-invalid is-valid");
        $("#btnsavenewclient").prop("disabled", true);

        if (esextranjero) {
            $("#siextranjeroduinit").hide();
            $("#siextranjero").show();
            $("#ncr").closest(".mb-3").hide();
        } else {
            $("#siextranjeroduinit").show();
            $("#siextranjero").hide();
            var tpersona = $("#tpersona").val();
            if (tpersona === "J") {
                $("#ncr").closest(".mb-3").show();
            }
        }

        // Verificar si se puede habilitar el botón
        setTimeout(function() {
            checkFormReadiness();
        }, 100);
    });

    // Listeners para campos obligatorios
    $("#email, #tel1, #tel2, #firstname, #firstlastname, #comercial_name, #name_contribuyente, #country, #departament, #municipio, #address, #tipocontribuyente, #acteconomica, #contribuyente").on('input change', function() {
        setTimeout(function() {
            checkFormReadiness();
        }, 100);
    });

    if ($("#companyselected").val() == 0) {
        $("button.add-new").attr("disabled", true);
    }
    getpaises();
});





// Función para limpiar valores removiendo guiones y espacios
function cleanMaskValue(value) {
    return value ? value.replace(/[-\s]/g, '') : '';
}

// Función para validar NIT sin afectar el foco
function validateNitField($field) {
    var key = $field.val();
    var tpersona = $("#tpersona").val();
    var esextranjero = $('#extranjero').is(':checked');



    // Siempre deshabilitar botón al validar
    $("#btnsavenewclient").prop("disabled", true);
    $field.removeClass("is-invalid is-valid");

    // Si está vacío, no validar
    if (!key || key.trim() === '') {
        return;
    }

    // Limpiar el valor removiendo guiones y espacios para la validación
    var cleanKey = cleanMaskValue(key);

    // Si después de limpiar está vacío, no validar
    if (!cleanKey || cleanKey.trim() === '') {
        return;
    }

    // Validar NIT para persona natural (no extranjero) O persona jurídica
    if ((tpersona === "N" && !esextranjero) || tpersona === "J") {
        var url = "/client/keyclient/" + btoa(cleanKey) + "/" + btoa(tpersona);

        // Para personas jurídicas, especificar que estamos validando NIT
        if (tpersona === "J") {
            url += "/" + btoa("nit");
        }

        $.ajax({
            url: url,
            method: "GET",
            success: function (response) {
                if (response.val) {
                    Swal.fire({
                        title: "Cliente Duplicado",
                        text: response.message,
                        icon: "warning",
                        confirmButtonText: "Entendido"
                    });
                    $field.addClass("is-invalid");
                    $("#btnsavenewclient").prop("disabled", true);
                                    } else {
                        $field.addClass("is-valid");
                        checkFormReadiness();
                    }
            },
            error: function() {
                Swal.fire({
                    title: "Error",
                    text: "Error al validar el cliente",
                    icon: "error",
                    confirmButtonText: "Entendido"
                });
                $("#btnsavenewclient").prop("disabled", true);
            }
        });
    }
}

// Función para validar NCR sin afectar el foco
function validateNcrField($field) {
    var key = $field.val();
    var tpersona = $("#tpersona").val();
    var esContribuyente = $('#contribuyente').is(':checked');



    // Siempre deshabilitar botón al validar
    $("#btnsavenewclient").prop("disabled", true);
    $field.removeClass("is-invalid is-valid");

    // Validar NRC si:
    // - Persona jurídica, o
    // - Persona natural contribuyente
    var debeValidarNcr = (tpersona === "J") || (tpersona === "N" && esContribuyente);

    // Si está vacío o no aplica la validación, salir
    if (!key || key.trim() === '' || !debeValidarNcr) {
        return;
    }

    // Limpiar el valor removiendo guiones y espacios para la validación
    var cleanKey = cleanMaskValue(key);

    // Si después de limpiar está vacío, no validar
    if (!cleanKey || cleanKey.trim() === '') {
        return;
    }

    // Construir URL; si es natural contribuyente, especificar que es NRC
    var url = "/client/keyclient/" + btoa(cleanKey) + "/" + btoa(tpersona);
    if (tpersona === "N") {
        url += "/" + btoa("ncr");
    }

    $.ajax({
        url: url,
        method: "GET",
        success: function (response) {
            if (response.val) {
                Swal.fire({
                    title: "Cliente Duplicado",
                    text: response.message,
                    icon: "warning",
                    confirmButtonText: "Entendido"
                });
                $field.addClass("is-invalid");
                $("#btnsavenewclient").prop("disabled", true);
                            } else {
                    $field.addClass("is-valid");
                    checkFormReadiness();
                }
        },
        error: function() {
            Swal.fire({
                title: "Error",
                text: "Error al validar el cliente",
                icon: "error",
                confirmButtonText: "Entendido"
            });
            $("#btnsavenewclient").prop("disabled", true);
        }
    });
}

// Función para validar NIT en edición sin afectar el foco
function validateNitEditField($field) {
    var key = $field.val();
    var tpersona = $("#tpersonaedit").val();
    var esextranjero = $('#extranjeroedit').is(':checked');
    var clientId = $("#idedit").val();

    // Siempre deshabilitar botón al validar
    $("#btnupdate").prop("disabled", true);
    $field.removeClass("is-invalid is-valid");

    // Si está vacío, no validar
    if (!key || key.trim() === '') {
        return;
    }

    // Limpiar el valor removiendo guiones y espacios para la validación
    var cleanKey = cleanMaskValue(key);

    // Si después de limpiar está vacío, no validar
    if (!cleanKey || cleanKey.trim() === '') {
        return;
    }

    // Validar NIT para persona natural (no extranjero) O persona jurídica
    if ((tpersona === "N" && !esextranjero) || tpersona === "J") {
        var url = "/client/keyclient/" + btoa(cleanKey) + "/" + btoa(tpersona);

        // Para personas jurídicas, especificar que estamos validando NIT
        if (tpersona === "J") {
            url += "/" + btoa("nit");
        } else {
            url += "/" + btoa("nit"); // Para natural también necesitamos especificar el campo
        }

        // Agregar clientId para excluir el cliente actual en edición
        url += "/" + btoa(clientId);

        $.ajax({
            url: url,
            method: "GET",
            success: function (response) {
                if (response.val) {
                    Swal.fire({
                        title: "Cliente Duplicado",
                        text: response.message,
                        icon: "warning",
                        confirmButtonText: "Entendido"
                    });
                    $field.addClass("is-invalid");
                    $("#btnupdate").prop("disabled", true);
                } else {
                    $field.addClass("is-valid");
                    checkEditFormReadiness();
                }
            },
            error: function() {
                Swal.fire({
                    title: "Error",
                    text: "Error al validar el cliente",
                    icon: "error",
                    confirmButtonText: "Entendido"
                });
                $("#btnupdate").prop("disabled", true);
            }
        });
    }
}

// Función para validar NCR en edición sin afectar el foco
function validateNcrEditField($field) {
    var key = $field.val();
    var tpersona = $("#tpersonaedit").val();
    var esContribuyente = $('#contribuyenteedit').is(':checked');
    var clientId = $("#idedit").val();

    // Siempre deshabilitar botón al validar
    $("#btnupdate").prop("disabled", true);
    $field.removeClass("is-invalid is-valid");

    // Validar NCR si:
    // - Persona jurídica, o
    // - Persona natural contribuyente
    var debeValidarNcr = (tpersona === "J") || (tpersona === "N" && esContribuyente);

    // Si está vacío o no aplica la validación, salir
    if (!key || key.trim() === '' || !debeValidarNcr) {
        return;
    }

    // Limpiar el valor removiendo guiones y espacios para la validación
    var cleanKey = cleanMaskValue(key);

    // Si después de limpiar está vacío, no validar
    if (!cleanKey || cleanKey.trim() === '') {
        return;
    }

    // Construir URL; si es natural contribuyente, especificar que es NRC
    var url = "/client/keyclient/" + btoa(cleanKey) + "/" + btoa(tpersona);
    if (tpersona === "N") {
        url += "/" + btoa("ncr");
    } else {
        url += "/" + btoa("ncr"); // Para jurídica también especificar campo
    }

    // Agregar clientId para excluir el cliente actual en edición
    url += "/" + btoa(clientId);

    $.ajax({
        url: url,
        method: "GET",
        success: function (response) {
            if (response.val) {
                Swal.fire({
                    title: "Cliente Duplicado",
                    text: response.message,
                    icon: "warning",
                    confirmButtonText: "Entendido"
                });
                $field.addClass("is-invalid");
                $("#btnupdate").prop("disabled", true);
            } else {
                $field.addClass("is-valid");
                checkEditFormReadiness();
            }
        },
        error: function() {
            Swal.fire({
                title: "Error",
                text: "Error al validar el cliente",
                icon: "error",
                confirmButtonText: "Entendido"
            });
            $("#btnupdate").prop("disabled", true);
        }
    });
}

// Función para validar pasaporte en edición sin afectar el foco
function validatePasaporteEditField($field) {
    var key = $field.val();
    var esextranjero = $('#extranjeroedit').is(':checked');
    var clientId = $("#idedit").val();

    // Siempre deshabilitar botón al validar
    $("#btnupdate").prop("disabled", true);
    $field.removeClass("is-invalid is-valid");

    // Si está vacío o no es extranjero, no validar
    if (!key || key.trim() === '' || !esextranjero) {
        return;
    }

    // Limpiar el valor removiendo guiones y espacios para la validación
    var cleanKey = cleanMaskValue(key);

    // Si después de limpiar está vacío, no validar
    if (!cleanKey || cleanKey.trim() === '') {
        return;
    }

    var tpersona = "E";
    var url = "/client/keyclient/" + btoa(cleanKey) + "/" + btoa(tpersona) + "/" + btoa("pasaporte") + "/" + btoa(clientId);

    $.ajax({
        url: url,
        method: "GET",
        success: function (response) {
            if (response.val) {
                Swal.fire({
                    title: "Cliente Duplicado",
                    text: response.message,
                    icon: "warning",
                    confirmButtonText: "Entendido"
                });
                $field.addClass("is-invalid");
                $("#btnupdate").prop("disabled", true);
            } else {
                $field.addClass("is-valid");
                checkEditFormReadiness();
            }
        },
        error: function() {
            Swal.fire({
                title: "Error",
                text: "Error al validar el cliente",
                icon: "error",
                confirmButtonText: "Entendido"
            });
            $("#btnupdate").prop("disabled", true);
        }
    });
}

// Función para verificar si el formulario de edición está listo
function checkEditFormReadiness() {
    // Si hay campos marcados como inválidos por duplicados, no permitir
    if ($(".is-invalid").length > 0) {
        $("#btnupdate").prop("disabled", true);
        return;
    }

    // Si todos los campos están bien, habilitar el botón
    $("#btnupdate").prop("disabled", false);
}

// Función para validar campos obligatorios antes de enviar
function validateRequiredFields() {
    var errors = [];
    var tpersona = $("#tpersona").val();
    var esextranjero = $('#extranjero').is(':checked');
    var escontribuyente = $('#contribuyente').is(':checked');

    // Limpiar clases de validación previas
    $("#email, #tel1, #tel2, #firstname, #firstlastname, #comercial_name, #name_contribuyente, #pasaporte, #tpersona, #country, #departament, #municipio, #address, #nit, #ncr, #tipocontribuyente, #acteconomica").removeClass("is-invalid");

    // Campos SIEMPRE obligatorios
    if (!tpersona || tpersona === "0") {
        $("#tpersona").addClass("is-invalid");
        errors.push("Debe seleccionar un tipo de cliente");
    }

    if (!$("#email").val() || $("#email").val().trim() === '') {
        $("#email").addClass("is-invalid");
        errors.push("El correo electrónico es obligatorio");
    }

    // Al menos un teléfono
    var tel1 = $("#tel1").val();
    var tel2 = $("#tel2").val();
    if ((!tel1 || tel1.trim() === '') && (!tel2 || tel2.trim() === '')) {
        $("#tel1").addClass("is-invalid");
        $("#tel2").addClass("is-invalid");
        errors.push("Debe ingresar al menos un teléfono");
    }

    // Ubicación obligatoria
    if (!$("#country").val() || $("#country").val() === "0" || $("#country").val() === "") {
        $("#country").addClass("is-invalid");
        errors.push("El país es obligatorio");
    }
    if (!$("#departament").val() || $("#departament").val() === "0" || $("#departament").val() === "") {
        $("#departament").addClass("is-invalid");
        errors.push("El departamento es obligatorio");
    }
    if (!$("#municipio").val() || $("#municipio").val() === "0" || $("#municipio").val() === "") {
        $("#municipio").addClass("is-invalid");
        errors.push("El municipio es obligatorio");
    }
    if (!$("#address").val() || $("#address").val().trim() === '') {
        $("#address").addClass("is-invalid");
        errors.push("La dirección es obligatoria");
    }

    // Validaciones específicas por tipo
    if (esextranjero) {
        // Extranjero - requiere pasaporte
        if (!$("#pasaporte").val() || $("#pasaporte").val().trim() === '') {
            $("#pasaporte").addClass("is-invalid");
            errors.push("El pasaporte es obligatorio para extranjeros");
        }
    } else if (tpersona === "N") {
        // Persona natural - requiere nombres y DUI/NIT
        if (!$("#firstname").val() || $("#firstname").val().trim() === '') {
            $("#firstname").addClass("is-invalid");
            errors.push("El primer nombre es obligatorio");
        }
        if (!$("#firstlastname").val() || $("#firstlastname").val().trim() === '') {
            $("#firstlastname").addClass("is-invalid");
            errors.push("El primer apellido es obligatorio");
        }
        if (!$("#nit").val() || $("#nit").val().trim() === '') {
            $("#nit").addClass("is-invalid");
            errors.push("El DUI/NIT es obligatorio");
        }

        // Si es contribuyente, requiere campos adicionales
        if (escontribuyente) {
            if (!$("#ncr").val() || $("#ncr").val().trim() === '') {
                $("#ncr").addClass("is-invalid");
                errors.push("El NRC es obligatorio para contribuyentes");
            }
            if (!$("#tipocontribuyente").val() || $("#tipocontribuyente").val() === "0") {
                $("#tipocontribuyente").addClass("is-invalid");
                errors.push("El tipo de contribuyente es obligatorio");
            }
            if (!$("#acteconomica").val() || $("#acteconomica").val() === "0") {
                $("#acteconomica").addClass("is-invalid");
                errors.push("La actividad económica es obligatoria");
            }
        }

    } else if (tpersona === "J") {
        // Persona jurídica - requiere nombres comerciales y NRC
        if (!$("#name_contribuyente").val() || $("#name_contribuyente").val().trim() === '') {
            $("#name_contribuyente").addClass("is-invalid");
            errors.push("El nombre contribuyente es obligatorio");
        }
        if (!$("#ncr").val() || $("#ncr").val().trim() === '') {
            $("#ncr").addClass("is-invalid");
            errors.push("El NRC es obligatorio para personas jurídicas");
        }
        if (!$("#tipocontribuyente").val() || $("#tipocontribuyente").val() === "0") {
            $("#tipocontribuyente").addClass("is-invalid");
            errors.push("El tipo de contribuyente es obligatorio");
        }
        if (!$("#acteconomica").val() || $("#acteconomica").val() === "0") {
            $("#acteconomica").addClass("is-invalid");
            errors.push("La actividad económica es obligatoria");
        }
    }

    return errors;
}

// Función para verificar si el formulario está listo para enviar
function checkFormReadiness() {
    var tpersona = $("#tpersona").val();
    var esextranjero = $('#extranjero').is(':checked');
    var escontribuyente = $('#contribuyente').is(':checked');



    // Si hay campos marcados como inválidos por duplicados, no permitir
    if ($(".is-invalid").length > 0) {

        $("#btnsavenewclient").prop("disabled", true);
        return;
    }

    // Verificar campos básicos obligatorios
    var email = $("#email").val();
    var tel1 = $("#tel1").val();
    var tel2 = $("#tel2").val();
    var country = $("#country").val();
    var departament = $("#departament").val();
    var municipio = $("#municipio").val();
    var address = $("#address").val();

    // Validaciones básicas
    if (!tpersona || tpersona === "0") {
        $("#btnsavenewclient").prop("disabled", true);
        return;
    }

    if (!email || email.trim() === '') {
        $("#btnsavenewclient").prop("disabled", true);
        return;
    }

    // Al menos un teléfono
    if ((!tel1 || tel1.trim() === '') && (!tel2 || tel2.trim() === '')) {
        $("#btnsavenewclient").prop("disabled", true);
        return;
    }

    // Ubicación
    if (!country || country === "0" || !departament || departament === "0" ||
        !municipio || municipio === "0" || !address || address.trim() === '') {
        $("#btnsavenewclient").prop("disabled", true);
        return;
    }

    // Validaciones específicas por tipo
    var canSubmit = true;

    if (esextranjero) {
        var pasaporte = $("#pasaporte").val();
        if (!pasaporte || pasaporte.trim() === '') {
            canSubmit = false;
        } else if ($("#pasaporte").hasClass("is-invalid")) {
            canSubmit = false;
        }
    } else if (tpersona === "N") {
        var firstname = $("#firstname").val();
        var firstlastname = $("#firstlastname").val();
        var nit = $("#nit").val();

        if (!firstname || firstname.trim() === '' || !firstlastname || firstlastname.trim() === '' ||
            !nit || nit.trim() === '') {
            canSubmit = false;
        } else if ($("#nit").hasClass("is-invalid")) {
            canSubmit = false;
        }

        // Si es contribuyente, validar campos adicionales
        if (escontribuyente && canSubmit) {
            var ncr = $("#ncr").val();
            var tipocontribuyente = $("#tipocontribuyente").val();
            var acteconomica = $("#acteconomica").val();

            if (!ncr || ncr.trim() === '' || !tipocontribuyente || tipocontribuyente === "0" ||
                !acteconomica || acteconomica === "0") {
                canSubmit = false;
            } else if ($("#ncr").hasClass("is-invalid")) {
                canSubmit = false;
            }
        }

    } else if (tpersona === "J") {
        var name_contribuyente = $("#name_contribuyente").val();
        var ncr = $("#ncr").val();
        var tipocontribuyente = $("#tipocontribuyente").val();
        var acteconomica = $("#acteconomica").val();

        if (!name_contribuyente || name_contribuyente.trim() === '' || !ncr || ncr.trim() === '' ||
            !tipocontribuyente || tipocontribuyente === "0" || !acteconomica || acteconomica === "0") {
            canSubmit = false;
        } else if ($("#ncr").hasClass("is-invalid")) {
            canSubmit = false;
        }

        // Validar NIT si tiene valor
        var nit = $("#nit").val();
        if (nit && nit.trim() !== '' && $("#nit").hasClass("is-invalid")) {
            canSubmit = false;
        }
    }


    $("#btnsavenewclient").prop("disabled", !canSubmit);
}

// Función para enviar el formulario con validación
function submitClientForm() {

    // Verificar campos obligatorios
    var requiredFieldsErrors = validateRequiredFields();

    // Verificar si hay campos con validación de duplicados inválida
    var hasInvalidFields = $(".is-invalid").length > 0;

    if (requiredFieldsErrors.length > 0) {
        Swal.fire({
            title: "Campos Obligatorios",
            html: requiredFieldsErrors.join('<br>'),
            icon: "warning",
            confirmButtonText: "Entendido"
        });
        return;
    }

    if (hasInvalidFields) {
        Swal.fire({
            title: "Error de Validación",
            text: "Por favor corrija los campos marcados en rojo antes de continuar",
            icon: "error",
            confirmButtonText: "Entendido"
        });
        return;
    }


    // Si no hay errores, enviar el formulario
    $("#addNewClientForm").submit();
}

function getpaises(selected = "", type = "") {
    if (type == "edit") {
        $.ajax({
            url: "/getcountry",
            method: "GET",
            success: function (response) {
                $.each(response, function (index, value) {
                    if (selected != "" && value.id == selected) {
                        $("#countryedit").append(
                            '<option value="' +
                                value.id +
                                '" selected>' +
                                value.name.toUpperCase() +
                                "</option>"
                        );
                    } else {
                        $("#countryedit").append(
                            '<option value="' +
                                value.id +
                                '">' +
                                value.name.toUpperCase() +
                                "</option>"
                        );
                    }
                });
            },
        });
    } else {
        $.ajax({
            url: "/getcountry",
            method: "GET",
            success: function (response) {
                $.each(response, function (index, value) {
                    $("#country").append(
                        '<option value="' +
                            value.id +
                            '">' +
                            value.name.toUpperCase() +
                            "</option>"
                    );
                });
            },
        });
    }
}

(function () {
    // Flat Picker
    // --------------------------------------------------------------------
    const flatpickrDate = document.querySelector("#a");

    // Date
    if (flatpickrDate) {
        flatpickrDate.flatpickr({
            //monthSelectorType: 'static',
            dateFormat: "d-m-Y",
        });
    }
})();

function getdepartamentos(pais, type = "", selected, selectedact) {
    //Get countrys avaibles
    if (type == "edit") {
        $.ajax({
            url: "/getdepartment/" + btoa(pais),
            method: "GET",
            success: function (response) {
                $("#departamentedit").find("option:not(:first)").remove();
                $.each(response, function (index, value) {
                    if (selected != "" && value.id == selected) {
                        $("#departamentedit").append(
                            '<option value="' +
                                value.id +
                                '" selected>' +
                                value.name +
                                "</option>"
                        );
                    } else {
                        $("#departamentedit").append(
                            '<option value="' +
                                value.id +
                                '">' +
                                value.name +
                                "</option>"
                        );
                    }
                });
            },
        });

        //Get acteconomica
        $.ajax({
            url: "/geteconomicactivity/" + btoa(pais),
            method: "GET",
            success: function (response) {
                $.each(response, function (index, value) {
                    if (selectedact !== "" && value.id == selectedact) {
                        $("#acteconomicaedit").append(
                            '<option value="' +
                                value.id +
                                '" selected>' +
                                value.name +
                                "</option>"
                        );
                    } else {
                        $("#acteconomicaedit").append(
                            '<option value="' +
                                value.id +
                                '">' +
                                value.name +
                                "</option>"
                        );
                    }
                });
            },
        });
    } else {
        $.ajax({
            url: "/getdepartment/" + btoa(pais),
            method: "GET",
            success: function (response) {
                $("#departament").find("option:not(:first)").remove();
                $.each(response, function (index, value) {
                    $("#departament").append(
                        '<option value="' +
                            value.id +
                            '">' +
                            value.name +
                            "</option>"
                    );
                });
            },
        });
        //Get acteconomica
        $.ajax({
            url: "/geteconomicactivity/" + btoa(pais),
            method: "GET",
            success: function (response) {
                $.each(response, function (index, value) {
                    $("#acteconomica").append(
                        '<option value="' +
                            value.id +
                            '">' +
                            value.name +
                            "</option>"
                    );
                });
            },
        });
    }
}

function getmunicipio(dep, type = "", selected) {
    if (type == "edit") {
        //Get countrys avaibles
        $.ajax({
            url: "/getmunicipality/" + btoa(dep),
            method: "GET",
            success: function (response) {
                $("#municipioedit").find("option:not(:first)").remove();
                $.each(response, function (index, value) {
                    if (selected !== "" && value.id == selected) {
                        $("#municipioedit").append(
                            '<option value="' +
                                value.id +
                                '" selected>' +
                                value.name +
                                "</option>"
                        );
                    } else {
                        $("#municipioedit").append(
                            '<option value="' +
                                value.id +
                                '">' +
                                value.name +
                                "</option>"
                        );
                    }
                });
            },
        });
    } else {
        //Get countrys avaibles
        $.ajax({
            url: "/getmunicipality/" + btoa(dep),
            method: "GET",
            success: function (response) {
                $("#municipio").find("option:not(:first)").remove();
                $.each(response, function (index, value) {
                    $("#municipio").append(
                        '<option value="' +
                            value.id +
                            '">' +
                            value.name +
                            "</option>"
                    );
                });
            },
        });
    }
}

function typeperson(type) {
    $('#fields_with_option').css('display', '');
    if (type == "N") {
        $("#fields_natural").css("display", "");
        $("#fields_juridico").css("display", "none");
        $("#contribuyentelabel").css("display", "");
        $("#extranjerolabel").css("display", "");
        $("#siescontri").css("display", "none");
        $("#nacimientof").css("display", "");
    } else {
        $("#contribuyentelabel").css("display", "none");
        $("#extranjerolabel").css("display", "none");
        $("#siescontri").css("display", "");
    }
    if (type == "J") {
        $("#fields_juridico").css("display", "");
        $("#fields_natural").css("display", "none");
        $("#nacimientof").css("display", "none");
    }
}
function typepersonedit(type) {
    if (type == "N") {
        $("#contribuyentelabeledit").css("display", "");
        $("#extranjerolabeledit").css("display", "");
        $("#siescontriedit").css("display", "none");
        validarchecked();
        $("#nacimientof").css("display", "");
    } else {
        $("#contribuyentelabeledit").css("display", "none");
        $("#extranjerolabeledit").css("display", "none");
        $("#siescontriedit").css("display", "");
        $("#nacimientof").css("display", "none");
    }
}

function escontri() {
    if ($("#contribuyente").is(":checked")) {
        $("#siescontri").css("display", "");
    } else {
        $("#siescontri").css("display", "none");
    }
}

function esextranjero() {
    if ($("#extranjero").is(":checked")) {
        $("#siextranjero").css("display", "");
        $("#siextranjeroduinit").css("display", "none");
    } else {
        $("#siextranjero").css("display", "none");
        $("#siextranjeroduinit").css("display", "");
    }
}

function escontriedit() {
    if ($("#contribuyenteedit").is(":checked")) {
        $("#siescontriedit").css("display", "");
    } else {
        $("#siescontriedit").css("display", "none");
    }
    validarchecked();
}

function validarchecked() {
    if ($("#contribuyenteedit").is(":checked")) {
        $("#contribuyenteeditvalor").val("1");
    }
}
function llamarselected(pais, departamento, municipio, acteconomica) {
    getpaises(pais, "edit");
    getdepartamentos(pais, "edit", departamento, acteconomica);
    getmunicipio(departamento, "edit", municipio);
}

function editClient(id) {
    //Get data edit companies
    //alert('entro');
    $.ajax({
        url: "/client/getClientid/" + btoa(id),
        method: "GET",
        success: function (response) {
            llamarselected(
                response[0]["country"],
                response[0]["departament"],
                response[0]["municipio"],
                response[0]["acteconomica"]
            );
            $.each(response[0], function (index, value) {
                if (index == "phone") {
                    $("#tel1edit").val(value);
                } else if (index == "phone_fijo") {
                    $("#tel2edit").val(value);
                }
                if (index == "phone_id") {
                    $("#phoneeditid").val(value);
                }
                if (index == "address_id") {
                    $("#addresseditid").val(value);
                }

                if (index == "contribuyente") {
                    if (value == "1") {
                        $("#contribuyenteedit").prop("checked", true);
                        $("#contribuyentelabeledit").css("display", "");
                        validarchecked();
                    } else if (value == "0") {
                        $(".contribuyenteedit").prop("checked", false);
                        $("#contribuyentelabeledit").css("display", "");
                    }
                    escontriedit();
                    if ($("#tpersonaedit").val() == "J") {
                        $("#contribuyentelabeledit").css("display", "none");
                        $("#siescontriedit").css("display", "");
                    }
                }
                if (index == "tpersona") {
                    var selectedN = "";
                    var selectedJ = "";
                    if (value == "J") {
                        selectedJ = "selected";
                        $("#fields_natural_edit").css("display", "none");
                        $("#fields_juridico_edit").css("display", "");
                        $("#dui_fields").css("display", "none");
                        $("#DOB_field").css("display", "none");
                    } else if (value == "N") {
                        selectedN = "selected";
                        $("#contribuyentelabeledit").css("display", "");
                        $("#fields_natural_edit").css("display", "");
                        $("#fields_juridico_edit").css("display", "none");
                        $("#dui_fields").css("display", "");
                        $("#DOB_field").css("display", "");
                    }
                    $("#tpersonaedit").empty();
                    $("#tpersonaedit").append(
                        '<option value="N" ' + selectedN + ">NATURAL</option>"
                    );
                    $("#tpersonaedit").append(
                        '<option value="J" ' + selectedJ + ">JURIDICO</option>"
                    );
                }

                if (index == "tipoContribuyente") {
                    $(
                        "#tipocontribuyenteedit option[value='" + value + "']"
                    ).attr("selected", true);
                }
                $("#" + index + "edit").val(value);
            });
            const bsOffcanvas = new bootstrap.Offcanvas(
                "#offcanvasUpdateClient"
            ).show();
        },
    });
}

function deleteClient(id) {
    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
            confirmButton: "btn btn-success",
            cancelButton: "btn btn-danger",
        },
        buttonsStyling: false,
    });

    swalWithBootstrapButtons
        .fire({
            title: "¿Eliminar?",
            text: "Esta accion no tiene retorno",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Si, Eliminarlo!",
            cancelButtonText: "No, Cancelar!",
            reverseButtons: true,
        })
        .then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    url: "/client/destroy/" + btoa(id),
                    method: "GET",
                    success: function (response) {
                        if (response.res == 1) {
                            Swal.fire({
                                title: "Eliminado",
                                icon: "success",
                                confirmButtonText: "Ok",
                            }).then((result) => {
                                /* Read more about isConfirmed, isDenied below */
                                if (result.isConfirmed) {
                                    location.reload();
                                }
                            });
                        } else if (response.res == 0) {
                            swalWithBootstrapButtons.fire(
                                "Problemas!",
                                "Algo sucedio y no pudo eliminar el cliente, favor comunicarse con el administrador.",
                                "success"
                            );
                        }
                    },
                });
            } else if (
                /* Read more about handling dismissals below */
                result.dismiss === Swal.DismissReason.cancel
            ) {
                swalWithBootstrapButtons.fire(
                    "Cancelado",
                    "No hemos hecho ninguna accion :)",
                    "error"
                );
            }
        });
}

function nitDuiMask(inputField) {
    var separator = "-";
    var nitPattern;
    if (inputField.value.length == 9) {
        nitPattern = new Array(8, 1);
    } else {
        nitPattern = new Array(4, 6, 3, 1);
    }
        mask(inputField, separator, nitPattern, true);
}

function pasaporteMask(inputField) {
    var separator = "-";
    var pasaportePattern;
    var cleanValue = inputField.value.replace(/-/g, "").toUpperCase(); // Eliminar guiones y convertir a mayúsculas

    // Solo permitir letras y números
    cleanValue = cleanValue.replace(/[^A-Z0-9]/g, "");
    inputField.value = cleanValue; // Actualiza el campo sin caracteres no permitidos

    if (/^[0-9]{9}$/.test(cleanValue)) {
        pasaportePattern = [9]; // Solo números (EE.UU., México, Brasil)
    } else if (/^[A-Z][0-9]{7,9}$/.test(cleanValue)) {
        pasaportePattern = [1, 7]; // Letra + 7-9 números (Reino Unido, Alemania)
    } else if (/^[A-Z]{2}[0-9]{7,8}$/.test(cleanValue)) {
        pasaportePattern = [2, 8]; // Dos letras + 7-8 números (España, Argentina, Italia)
    } else if (/^[0-9]{4}[0-9]{6}[0-9]{3}[A-Z]$/.test(cleanValue)) {
        pasaportePattern = [4, 6, 3, 1]; // Formato XXXX-XXXXXX-XXX-X (Centroamérica)
    } else if (/^[A-Z]{2}[0-9]{8}[A-Z]{2}$/.test(cleanValue)) {
        pasaportePattern = [2, 8, 2]; // Dos letras al inicio y fin (Algunos países europeos y asiáticos)
    } else {
        pasaportePattern = [cleanValue.length]; // Si no coincide, deja el formato sin guiones
    }

    mask(inputField, separator, pasaportePattern, true);
}


function NRCMask(inputField) {
    var separator = "-";
    var nrcPattern;
    if (inputField.value.length == 6) {
        nrcPattern = new Array(5, 1);
    } else {
        nrcPattern = new Array(6, 1);
    }
        mask(inputField, separator, nrcPattern, true);
}

function mask(inputField, separator, pattern, nums) {
    var val;
    var largo;
    var val2;
    var r;
    var z;
    var val3;
    var s;
    var q;
    if (inputField.valant != inputField.value) {
        val = inputField.value;
        largo = val.length;
        val = val.split(separator);
        val2 = "";
        for (r = 0; r < val.length; r++) {
            val2 += val[r];
        }
        if (nums) {
            for (z = 0; z < val2.length; z++) {
                if (isNaN(val2.charAt(z))) {
                    letra = new RegExp(val2.charAt(z), "g");
                    val2 = val2.replace(letra, "");
                }
            }
        }
        val = "";
        val3 = new Array();
        for (s = 0; s < pattern.length; s++) {
            val3[s] = val2.substring(0, pattern[s]);
            val2 = val2.substr(pattern[s]);
        }
        for (q = 0; q < val3.length; q++) {
            if (q == 0) {
                val = val3[q];
            } else {
                if (val3[q] != "") {
                    val += separator + val3[q];
                }
            }
        }
        inputField.value = val;
        inputField.valant = val;
    }
}
