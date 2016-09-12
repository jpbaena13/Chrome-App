var views = {
    /**
     * Formulario para adjuntar archivos a las notas.
     * @param  int noteId       Id de la nota a la que se adjunta el archivo.
     * @param  int noteboardId  Id del noteboard al que pertenece la nota.
     * 
     * @return string           HTML correspondiente al formulario.
     */
    formAttachFile: function(noteId, noteboardId) {
        return '<form action="' + ROOT_URL + 'Files" method="POST" class="dropzone" id="uploadDropzone">\
                    <input type="hidden" name="noteId" value="' + noteId + '">\
                    <input type="hidden" name="noteboardId" value="' + noteboardId + '">\
               </form>';
    },

    /**
     * Formulario para cargar una imagen al tablero.
     * @param  int left        Posición <left> de la imagensobre el tablero.
     * @param  int top         Posición <top> de la imagen sobre el tablero.
     * @param  int noteboardId Id del tablero.
     * 
     * @return string          HTML correspondiente al formulario.
     */
    formUploadImage: function(left, top, noteboardId) {
        return '<form action="' + ROOT_URL + 'Files" method="POST" class="dropzone" id="uploadDropzone">\
                    <input type="hidden" name="noteboardId" value="' + noteboardId + '">\
                    <input type="hidden" name="left" value="' + left + '">\
                    <input type="hidden" name="top" value="' + top + '">\
               </form>';
    },

    /**
     * Corresponde a un bloque de comentario.
     * @param  Object comment Objeto que contiene los datos de un comentario
     *                        data = {profileImage, fullname, message}
     *                        
     * @return string         HTML correspondiente
     */
    commentBlock: function(comment) {
        return '<div class="untCommentBlock">\
                    <img class="untCommentImage" src="' + comment.profileImage + '" alt="X" />\
                    <div class="untCommentContent">\
                        <span class="untCommentTitle">' + comment.fullname + '</span>:\
                        <span class="untCommentMessage">' + comment.message + '</span>\
                    </div>\
                </div>';
    },

    /**
     * Corresponde al elemente <textarea> que va al final del panel de comentarios.
     * @param  string profileImage URL de la imagen del usuario autenticado.
     * 
     * @return string         HTML correspondiente
     */
    commentTA: function(profileImage) {
        return '<div class="untCommentTA">\
                    <div class="untInline">\
                        <img class="untCommentImage" src="' + profileImage +'" alt="X"/>\
                    </div>\
                    <textarea name="commentTA" cols="1" rows="1" maxlength="140"></textarea>\
                </div>'
    },

    /**
     * Corresponde a un bloque de alertas.
     * @param  Object alert Objeto que contiene los datos de un comentario
     *                        data = {id, msg, dateSelected, hourSelected, minuteSelected}
     *                        
     * @return string         HTML correspondiente
     */
    alertBlock: function(alert) {
        if (!alert.dateSelected) 
            alert.dateSelected = getDate();

        if (!alert.msg)
            alert.msg = '';

        var inputId = '';
        if (alert.id)
            inputId = '<input type="hidden" name="id" value="' + alert.id + '">';

        return '<form class="untAlertBlock">\
                    ' + inputId + '\
                    <input type="text" name="alertMsg" class="alertMsg" value="' + alert.msg + '" placeholder="' + i18n.msgAlert + '" disabled maxlength="140">\
                    <input type="text" name="alertDate" class="alertDate" value="' + alert.dateSelected + '" disabled>\
                    <select name="alertHour" class="alertHour" disabled>' + getTimeOptions(8, 20, alert.hourSelected) + '</select>\
                    <select name="alertMinute" class="alertMinute" disabled>' + getTimeOptions(0, 59, alert.minuteSelected) + '</select>\
                    <span class="icon-checkmark-circle save"></span>\
                    <img src="' + WEBROOT_URL + 'img/default/loader.gif" alt="Loader" class="untLoader" width="15px">\
                    <span class="icon-remove delete"></span>\
                </form>'
    },

    /**
     * Retorna la cabecer del bloque de alertas.
     * 
     * @return string         HTML correspondiente
     */
    headerAlert: function() {
        return '<h2>' + i18n.scheduleAlert + 
            '<input type="button" id="addAlert" class="untBtn yellow small" value="' + i18n.createAlert + '">\
        </h2>';
    },

    /**
     * Corresponse al componente Dropzone que permite subir archivos al servidor.
     * @param  Object attach Objeto con los datos del archivos a subir.
     * 
     * @return string       HTML correspondiente.
     */
    attachFileBlock: function(attach) {

        var classes = ''
            , style = '';

        if (attach == undefined) {
            attach = {
                name: '',
                filename: '',
                size: '',
                type: '',
                src: ''
            }

        } else {
            classes = 'dz-success';
            
            if (attach.src != null) {
                style = 'display:inline';
                classes += ' dz-image-preview'
            }
        }            

        return '<div class="dz-preview dz-file-preview ' + classes + '" data-attach="' + attach.name + '">\
                  <div class="dz-details">\
                    <div class="dz-filename">' + attach.filename + '<span data-dz-name></span></div>\
                    <div class="dz-size" data-dz-size><strong>' + attach.size + '</strong> Mb</div>\
                    <img data-dz-thumbnail src="' + attach.src + '" style="' + style + '" />\
                  </div>\
                  <div class="dz-progress"><span class="dz-upload" data-dz-uploadprogress></span></div>\
                  <div class="dz-success-mark"><span>✔</span></div>\
                  <div class="dz-error-mark"><span>✘</span></div>\
                  <div class="dz-error-message"><span data-dz-errormessage></span></div>\
                  <a class="dz-view" href="javascript:undefined">' + i18n.viewFile + '</a>\
                  <a class="dz-download" href="javascript:undefined">' + i18n.downloadFile + '</a>\
                  <a class="dz-remove" href="javascript:undefined">' + i18n.removeFile + '</a>\
                  <a class="dz-delete" href="javascript:undefined">' + i18n.delete + '</a>\
                </div>';
    },

    /**
     * Corresponde a un <brach> del árbol de navegación <folder, groups>
     * 
     * @param  Object folder Objeto que contiene los datos de una carpeta.
     * 
     * @return HTML correspondiente
     */
    branchTree: function(folder) {
        var ctype = folder.type.charAt(0).toUpperCase() + folder.type.slice(1);

        return '<li id="subtree-' + folder.id + '">\
                    <a href="#!/folder/' + folder.id + '" class="unt'+ ctype + ' ' + folder.type + '">\
                        <span class="icon- ' + folder.type + '"></span>\
                        <span class="name">' + folder.name + '</span>\
                        <span class="edit icon-cog"></span>\
                        <span class="share icon-users"></span>\
                    </a>\
                    <ul></ul>\
                </li>';
    },

    /**
     * Corresponde a una fila del elemento de notificaciones
     * 
     * @param  Object notification Objeto con los datos de la notificación
     * 
     * @return HTML correspondiente
     */
    notificationBlock: function(notification) {
        return '<li>\
                    <a href="' + ROOT_URL + 'Noteboard/App/' + notification.noteboardId + '#n-' + notification.noteId + '&' + notification.action + '">\
                        <img src="' + notification.user.profileImage + '" width="40px" height="40px">\
                        <span>\
                            <div class="activityDate">' + notification.activityDate + '</div>\
                            <div class="fullname">' + notification.user.fullname + '</div>\
                            <div class="info">' + notification.info + '</div>\
                        </span>\
                    </a>\
                </li>';
    },

     /**
     * Corresponde a una fila del elemento de solicitudes de invitaciones
     * 
     * @param  Object invitation Objeto con los datos de la invitación
     * 
     * @return HTML correspondiente
     */
    invitationBlock: function(invitation) {
        return '<li>\
                    <a href="#">\
                        <img src="' + invitation.profileImage + '" width="40px" height="40px">\
                        <span>\
                            <div class="activityDate">' + invitation.sharingDate + '</div>\
                            <img src="' + invitation.previewImage + '" class="preview">\
                            <div class="fullname">' + invitation.fullname + '</div>\
                            <div class="info">' + invitation.info + '</div>\
                            <div class="buttons">\
                                <input type="button" value="' + i18n.participate + '" class="untBtn small" data-action="accept" data-noteboard="' + invitation.noteboardId + '">\
                                <input type="button" value="' + i18n.noParticipate + '" class="untBtn red small" data-action="decline" data-noteboard="' + invitation.noteboardId + '">\
                            </div>\
                        </span>\
                    </a>\
                </li>';
    },

    /**
     * Formulario para adjuntar nueva imagen de fondo para una categoría dada.
     * @param  int noteId       Id de la categoría a la que pertenece el fondo
     *      * 
     * @return string           HTML correspondiente al formulario.
     */
    formBgImage: function(categoryId) {
        return '<form action="' + ROOT_URL + 'Files" method="POST" class="dropzone" id="uploadDropzone">\
                    <input type="hidden" name="categoryId" value="' + categoryId + '">\
               </form>';
    },

    /**
     * Formulario que permite editar los permisos de participante en tablero.
     *
     * @param  Object Objeto con los permisos de usuario
     * 
     * @return string   HTML correspondiente al formulario.
     */
    permissionsForm: function( permissions ) {
        permissions.canEdit = (permissions.canEdit == 1) ? 'checked' : '';
        permissions.canComment = (permissions.canComment == 1) ? 'checked' : '';
        permissions.canDelete = (permissions.canDelete == 1) ? 'checked' : '';
        permissions.canUploadFiles = (permissions.canUploadFiles == 1) ? 'checked' : '';
        permissions.canDeleteAttach = (permissions.canDeleteAttach == 1) ? 'checked' : '';
        permissions.canInvite = (permissions.canInvite == 1) ? 'checked' : '';
        

        return '<form id="permissionsForm" class="untPermissions">\
                    <input type="hidden" name="noteboardId" value="' + permissions.noteboardId + '">\
                    <input type="hidden" name="userId" value="' + permissions.userId + '">\
                    <div><input type="checkbox" name="canEdit" ' + permissions.canEdit + '>' + i18n.canEdit + '</div>\
                    <div><input type="checkbox" name="canDelete" ' + permissions.canDelete + '>' + i18n.canDelete + '</div>\
                    <div><input type="checkbox" name="canComment" ' + permissions.canComment + '>' + i18n.canComment + '</div>\
                    <div><input type="checkbox" name="canUploadFiles" ' + permissions.canUploadFiles + '>' + i18n.canUploadFiles + '</div>\
                    <div><input type="checkbox" name="canDeleteAttach" ' + permissions.canDeleteAttach + '>' + i18n.canDeleteAttach + '</div>\
                </form>';
                // <div><input type="checkbox" name="canInvite" ' + permissions.canInvite + '>' + i18n.canInvite + '</div>\
    }
}