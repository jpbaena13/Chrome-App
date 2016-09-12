/*!
 * Texto en Español para internationalization (i18n)
 *
 * @package     webroot
 * @subpackage  locale
 * @author      JpBaena13 
 */

i18n = {

    //  -----------------
    //  --- DEFAULTS ----
    //  -----------------
    accept  : 'Aceptar',
    black   : 'Negro',
    blue    : 'Azul',
    cancel  : 'Cancelar',
    green   : 'verde',
    gray    : 'Gris',
    red     : 'Rojo',
    loading: 'En proceso...',
    search: 'Buscar',
    share: 'Compartir',
    notshare: 'No compartir más',
    unavailable: 'No disponible',        
    writeComment: 'Escribe un comentario',
    successSaveData: 'Datos guardados exitosamente!!',
    back: 'Regresar',
    delete: 'Eliminar',

    // ---> Server
    err400: 'Solicitud Incorrecta',
    err400Msg: 'La solicitud realizada no es correcta, por favor intente nuevamente',
    err401: 'No hay sesión iniciada',
    err401Msg: 'No se ha iniciado ninguna sesión. Por favor inicia sesión para continuar',
    err403: 'Permisos insuficientes',
    err403Msg: 'No tienes permisos para realizar esta acción',
    err500: 'Error inesperado',
    err500Msg: 'Ha ocurrido un error inesperado y no se puedo realizar la solicitud',

    // ---> Signup
    errEmailReq: 'Ingresa tu correo electrónico',
    errEmailInvalid: 'Esta no es una dirección de correo válida',
    errEmailUnavailable: 'La cuenta de correo electrónica ya Exite!!',
    errUsernameReq: 'Se requiere un nombre de usuario',
    errUsernameMinlength: 'Oye!! más de 2 caractéres',
    errUsernameUnavailable: 'Nombre de usuario no esta disponible',
    errPasswordReq: 'Ingresa tu contraseña',
    errPasswordMinlength: 'Mínimo 6 caractéres',
    errTosAgree: 'Debes aceptar las Condiciones del Servicio',

    // ---> Login
    errLogin: 'Error de autenticación',
    errLoginMsg : 'La combinación de usuario y contraseña no es válida, por favor asegurate de ingresar correctamente tus datos.',
    emailConfirm: 'Dirección de correo electrónico confirmada',
    emailConfirmMsg: 'Tu dirección de correo electrónico ha sido confirmado. Sigue usando UnNotes y crea tus notas para que nada se te olvide.',
    errEmailConfirm: 'Tu Dirección de correo <b>no pudo confirmarse</b>.',
    errEmailConfirmMsg: 'Los datos para confirmar tu dirección de correo están incorrectos o tu dirección de correo ya está confirmada',
    existEmail: 'Correo electrónico existente',
    existEmailMsgA: 'La dirección de correo electrónico',
    existEmailMsgB: 'ya está registrada en UnNotes. Si ya tienes cuenta por favor autentícate y asocia tu cuenta social a UnNotes',
    oneStep: 'Solo falta un paso!!!',
    oneStepMsg: 'Solo falta un paso para crear tu cuenta en UnNotes, llena los campos faltantes y <b>Regístrate</b>.',


    // ---> MyBoards
    createNoteboard : 'Crear Tablero',
    editNoteboard : 'Editar Tablero',
    deleteNoteboard : 'Eliminar Tablero',
    deleteNoteboardMsg : '¿Seguro desea eliminar el tablero?<br><br><small class="untWrng">Si elimina este tablero, todos los recursos asociados a él también se borrarán. Así mismo, se eliminará de todas las cuentas con quien los hayas compartido.</small>',
    shareNoteboard: 'Compatir Tablero',
    unshareNoteboardMsg: '¿Seguro desea eliminar el tablero?<br><br><small class="untWrng">Esta tablero <strong>es compartido</strong>. Si continua con esta acción dejará de ser <strong>Colaborador</strong> para este tablero.</small>',
    errNameNoteboard: 'Por favor ingrese un nombre al tablero',
    createFolder: 'Crear Carpeta',
    editFolder : 'Editar Carpeta',
    deleteFolder: 'Eliminar Carpeta',
    deleteFolderMsg : '¿Seguro desea eliminar esta carpeta: ',
    errNameFolder: 'Por favor ingrese un nombre a la carpeta',
    errSelectContact: 'Seleccione al menos un contacto a invitar',

    // ---> Notes
    removeFile: 'Eliminar archivo',
    downloadFile: 'Descargar archivo',
    downloadImage: 'Descargar imagen',
    previewImage: 'Previsualizar imagen',
    attachDeleted: 'Archivo Eliminado',
    scheduleAlert: 'Programar alerta SMS',

    // ---> Contact
    sendMailContact: 'Mensaje enviado',
    sendMailContactMsg: 'Tu mensaje fue enviado exitosamente. En menos de 24 horas te estaremos respondiendo. <br>Agradecemos tu tiempo.',

    // ---> Recover
    sendMailResetPass: 'Correo enviado',
    sendMailResetPassMsg: 'Las instrucciones para cambiar tu contraseña fueron enviados a tu correo electrónico. Revísalas en tu bandeja de entrada o spam, ',

    // Upload Images
    msgUploadImagesYourself: 'Cargue una foto para su perfil',
    sizeNotAllowed:'Peso máximo excedido',
    errSizeNotAllowed: 'El peso de la imagen debe ser menor a',
    msgExtensionAllowed:"Puede cargar archivos con formato",
    extensionNotAllowed: 'Extensión no permitida',
    errExtensionNotAllowed: 'Extensión no permitida, solo se aceptan extesiones de imagenes.',
    errNoSelectImage: 'Imagen no seleccionada',
    errNoImages: 'Seleccione un imagen para cargar',
    errSelectionFirst: 'Realice una selección primero',
    msgSelectionArea: 'Seleccione el area sobre la imagen',
    saveImage: 'Guardar imagen',
    uploadImage: 'Cargar imagen',
    msgInvalidImage: 'Por favor, abstengase se cargar imagenes obscenas o que contengan derechos de autor.',
    msgImagesProfile: 'La foto que especifique será usada entodos los productos y servicios de UnNotes',
    msgUploadImagesSuccess: 'Imagen cargada exitosamente!!!<br><small>Para ver los cambios recargue la página.</small>',
    changeImage: 'Cambiar imagen',
    deleteImage: 'Borrar Imagen',
    chageProfileImage: 'Cambiar imagen de perfil',


    //  -----------------
    //  --- MODULES -----
    //  -----------------
    
    
    // ---> Tablero
    changeFont  : 'Cambiar Fuente',
    changeSize  : 'Cambiar Tamaño Fuente',
    changeColor : 'Cambiar Color Fuente',
    changeBG    : 'Cambiar Color Nota',
    removeNote  : 'Eliminar Nota',
    removeNoteImage  : 'Eliminar Imagen',
    addNote     : 'Insertar nota',
    removeNoteMsg  : '¿Seguro desea eliminar esta nota?.<br><small>Todos los datos asociado también se eliminarán</small>',
    attachNote  : 'Ver y/o Adjuntar archivos',
    attachFile  : '¿Adjuntar archivos?',
    alertSchedule  : 'Programar alerta SMS',
    vertical    : 'Crear línea vertical',
    horizontal  : 'Crear línea horizontal',
    image       : 'Insertar imagen',
    label       : 'Crear Label',    
    shareNB     : 'Compartir',
    sharedNB    : 'Tablero compartido',
    clearNB     : 'Limpiar tablero',
    clearNBMsg  : 'Esta acción borrará todas las notas. ¿Está completamente seguro?',
    shareLink   : 'Comparte éste enlace',
    shareLinkMsg: 'Para compartir este tablero con tus amigos, envíales el siguiente enlace:<br><br>',
    errAlertDate: 'Fecha incorrecta',
    errAlertDateMsg: 'Por favor ingrese una fecha superior a la actual',
    alertMsgEmpty: 'La nota no tiene ningún texto para enviar en el SMS',
    alertDeleteSuccess: 'La alerta ha sido borrada exitosamente!!!',
}