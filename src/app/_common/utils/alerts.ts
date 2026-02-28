import swal from 'sweetalert2'
import { Helpers } from './helpers';

export module Alerts {
  export function success(titulo: string = "", mensaje = ""): void {
    closeLoad();
    setTimeout(() => {
      swal.fire({
        icon: "success",
        title: titulo,
        text: mensaje,
        buttonsStyling: false,
        customClass: {
          confirmButton: 'btn success-alert',
        }
      });
    }, 0);
  };

  export function info(titulo: string = "", mensaje = ""): void {
    closeLoad();
    setTimeout(() => {
      swal.fire({
        icon: "info",
        title: titulo,
        text: mensaje,
        buttonsStyling: false,
        customClass: {
          confirmButton: 'btn info-alert',
        }
      });
    }, 0);
  };

  export function warning(titulo: string = "", mensaje = ""): void {
    closeLoad();
    setTimeout(() => {
      swal.fire({
        icon: "warning",
        title: titulo,
        text: mensaje,
        showLoaderOnConfirm: false,
        buttonsStyling: false,
        customClass: {
          confirmButton: 'btn warning-alert',
        }
      });
    }, 0);
  };

  export function error(titulo: string = "", mensaje = ""): void {
    closeLoad();
    setTimeout(() => {
      swal.fire({
        icon: "error",
        title: titulo,
        text: mensaje,
        buttonsStyling: false,
        customClass: {
          confirmButton: 'btn error-alert',
        }
      });
    }, 0);
  };

  export function confirm(html = null, titulo = "Éxito", mensaje = "", confirmButtonText = "Ok"): Promise<any> {
    const promesa = new Promise((resolve, reject) => {
      swal.fire({
        title: titulo,
        text: mensaje,
        html: html,
        icon: 'success',
        customClass: {
          confirmButton: 'btn success-alert',
          container: 'content-class'
        },
        // customClass: {
        //   confirmButton: 'btn success-alert',
        //   content: 'content-class'
        // },
        confirmButtonText: confirmButtonText,
        allowOutsideClick: false,
        buttonsStyling: false,
      }).then(function () {
        resolve;
      }).catch(function () {
        reject();
      });
    })

    return promesa;
  }

  export function withInput(mensaje = "", defaultValue = "", confirmButtonText = "Aceptar", cancelButtonText = "Cancelar"): Promise<any> {
    const promesa = new Promise((resolve, reject) => {
      swal.fire({
        // title: titulo,
        text: mensaje,
        input: 'text',
        inputValue: defaultValue,
        showCancelButton: true,
        customClass: {
          confirmButton: 'btn success-alert',
          cancelButton: 'btn error-alert'
        },
        confirmButtonText: confirmButtonText,
        cancelButtonText: cancelButtonText,
        allowOutsideClick: false,
        buttonsStyling: false,

      }).then((value) => {
        resolve(value);
      }).catch(function () {
        reject();
      });
    })

    return promesa;
  }

  export function question(titulo: string, mensaje = "", confirmButtonText = "Si", cancelButtonText = "No"): Promise<any> {
    const promesa = new Promise((resolve, reject) => {
      swal.fire({
        title: titulo,
        text: mensaje,
        icon: 'question',
        showCancelButton: true,
        customClass: {
          confirmButton: 'btn btn-Azulsiman',
          cancelButton: 'btn btn-danger'
        },
        confirmButtonText: confirmButtonText,
        cancelButtonText: cancelButtonText,
        allowOutsideClick: false,
        buttonsStyling: false,

      }).then(function () {
        resolve;
      }).catch(function () {
        reject();
      });
    })

    return promesa;
  }

  export function operacionNoCompletada(
    titulo: string = "",
    mensaje = "No se pudo completar la petición, por favor intente nuevamente o contacte a TI") {
    Alerts.warning(titulo, mensaje);
  }

  export function noTienePermisoParaAcceder(
    titulo: string = "",
    mensaje = "Su perfil no tiene permiso para acceder a esta pantalla, si los requiere debe comunicarse con el departamento de TI.") {
    Alerts.warning(titulo, mensaje);
  }

  export function errorEnServidor(
    titulo: string = "Ocurrió un error en el servidor",
    mensaje = "Por favor intente nuevamente o contacte a TI") {
    Alerts.error(titulo, mensaje);
  }

  export function datosModificados(
    titulo: string = "",
    mensaje = "Los datos fueron modificados correctamente") {
    Alerts.success(titulo, mensaje);
  }

  export function showHttpResponse(error: any, titulo: string = "Advertencia", esNotificacion = false, esGaraphql = false) {
    if (Helpers.isNull(error)) {
      return;
    }

    if (Helpers.isNull(error.status) || error.status == 0) {
      operacionNoCompletada();
      return;
    }

    if (error.status == 500) {
      if (error.error && error.error.message) {
        warning(titulo, error.error.message);
        return;
      }
      errorEnServidor();
      return;
    }

    if (!Helpers.isNull(error._body)) {
      let body = JSON.parse(error._body);

      if (Helpers.isNull(error._body)) {
        operacionNoCompletada();
        return;
      }

      if (Helpers.isNull(body.message)) {
        if (esNotificacion) {
          // Notificaciones.warning(body, "top", "center", 1500);
        } else {
          warning(titulo, body);
        }
        return;
      }

      if (esNotificacion) {
        // Notificaciones.warning(body.message, "top", "center", 1500);
      } else {
        warning(titulo, body.message);
      }
    }

    if (!Helpers.isNull(error.error))
      if (Helpers.isNull(error.error.message))
        operacionNoCompletada();
      else {
        if (esNotificacion) {
          // Notificaciones.warning(error.error.message, "top", "center", 1500);
        } else {
          warning(titulo, error.error.message);
        }
      }
  }
  export function openLoad(titulo: string = "Espere un momento por favor", mensaje = ""): void {
    swal.fire({
      title: titulo,
      text: mensaje,
      showConfirmButton: false,
      allowOutsideClick: false,
      allowEnterKey: false,
      allowEscapeKey: false,
      timer: 70000,
      didOpen: function () {
        swal.showLoading();
        // $(".swal2-spacer").css({ "margin": "10px 0" });
      }
    }).then((result) => {
      if (result.dismiss === swal.DismissReason.timer) {
        errorEnServidor();
      }
    })
  };

  export function closeLoad() {
    swal.close();
  }

}