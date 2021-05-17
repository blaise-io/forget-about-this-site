// tslint:disable max-line-length
module.exports = JSON.stringify(
  {
    extensionName: { message: `Olvídate de este sitio` },
    extensionDescription: {
      message: `Botón de acción de página que elimina las cookies, el almacenamiento local, el historial de navegación y el historial de descargas del sitio web que está visitando.`,
    },
    successNotificationText: { message: `Datos eliminados con éxito` },
    successNotificationBody: { message: `Eliminó $1 por $2` },
    deleteItems: {
      message: `Cuando se hace clic en el botón de acción de la página, <br> Borre los siguientes elementos para el sitio web actual:`,
    },
    cookies: { message: `Cookies` },
    localStorage: { message: `Local storage` },
    history: { message: `Historial de navegación` },
    downloads: { message: `Historial de descargas` },
    beforeDeleting: { message: `Antes de eliminar elementos:` },
    askConfirmation: { message: `Pedir confirmación` },
    confirmationPrompt: {
      message: `¿Estás seguro de que quieres eliminar $1?`,
    },
    closeTab: { message: `Close tab` },
    closeTabHelp: {
      message: `Esto evita que el sitio web escriba elementos adicionales después de la eliminación`,
    },
    afterDeleting: { message: `Después de eliminar elementos:` },
    showConfirmation: { message: `Mostrar una confirmación` },
    reloadWebsite: { message: `Vuelva a cargar el sitio web` },
    lastSaved: { message: `Último guardado: $1` },
  },
  null,
  2
);
