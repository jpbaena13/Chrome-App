/**
 * Javascript del index principal del sitio.
 *
 * @package     webroot
 * @subpackage  js
 * @author      JpBaena13
 */

// ----- NOTIFICATION COMPONENT -----
var flat_notifications = true;
(function($){
    $.getJSON(
        API + 'Activity/CountNotifications/',
        function(data) {
            if (data.count > 0) {
                $('#notifications').find('div').html(data.count).show();
            }
        }
    )
})(jQuery);
$('#notifications').qtip({
    content: {
        ajax: {
            url: API + 'Activity/Notifications/',
            type: 'GET',
            success: function(data, status) {
                if (flat_notifications)
                    flat_notifications = false;
                else 
                    return;

                var $qtip = this
                    $notifications = $('<ul>', {Class: 'untNotifications'});

                if (data.length != 0) {                    

                    for (var i = 0; i < data.length; i++) {
                        var notification = data[i];
                        $notifications.append( views.notificationBlock( notification ) );
                    }
                    
                    $qtip.set('content.text', $notifications);

                    $notifications.jScrollPane({
                        showArrows: false,
                        maintainPosition: true,
                        stickToBottom: true
                    });

                } else {
                    $notifications.append('<span class="noNotifications">' + i18n.noNotifications + '</span>')
                    $qtip.set('content.text', $notifications);
                }

            }
        }
    },
    show: 'click',
    hide: 'unfocus',
    position: {
        at: 'bottom middle',
        my: 'top center'
    },
    style: {
        width: 480, 
        classes: 'ui-tooltip-shadow ui-tooltip-white'
    }
});


// ----- INVITATION COMPONENT -----
var flat_invitations = true;
(function($){
    $.getJSON(
        API + 'Activity/CountInvitations/',
        function(data) {
            if (data.count > 0) {
                $('#invitations').find('div').html(data.count).show();
            }
        }
    )
})(jQuery);
$('#invitations').qtip({
    content: {
        ajax: {
            url: API + 'Activity/Invitations/',
            type: 'GET',
            success: function(data, status) {
                if (flat_invitations)
                    flat_invitations = false;
                else 
                    return;

                var $qtip = this
                    $invitations = $('<ul>', {Class: 'untNotifications'});

                if (data.length != 0) {

                    for (var i = 0; i < data.length; i++) {
                        var invitations = data[i];
                        $invitations.append( views.invitationBlock( invitations ) );
                    }
                    
                    $qtip.set('content.text', $invitations);

                    $invitations.jScrollPane({
                        showArrows: false,
                        maintainPosition: true,
                        stickToBottom: true
                    });

                    $('.buttons').find('.untBtn').on('click', function() {
                        $this = $(this);
                        
                        $.post(
                            ROOT_URL + 'Noteboard/Shared',
                            {
                                'action': $this.data('action'),
                                'noteboardId': $this.data('noteboard')
                            },
                            function(data) {
                                location.reload();
                            }
                        );
                    });

                } else {
                    $invitations.append('<span class="noNotifications">' + i18n.noInvitations + '</span>')
                    $qtip.set('content.text', $invitations);
                }
            }
        }
    },
    show: 'click',
    hide: 'unfocus',
    position: {
        at: 'bottom middle',
        my: 'top center'
    },
    style: {
        width: 480, 
        classes: 'ui-tooltip-shadow ui-tooltip-white'
    }
});


// ----- ALERTS COMPONENT -----
var flat_alerts = true;
$('#alert').qtip({
    content: {
        ajax: {
            url: API + 'Alert/AllAlerts/',
            type: 'GET',
            success: function(data, status) {
                if (flat_alerts)
                    flat_alerts = false;
                else 
                    return;

                var $qtip = this
                    ,header = views.headerAlert()
                    ,content = $('<div>',{id: 'alertsContainer'});

                data.forEach(function(alert) {
                    var d = new Date(alert.alertDate);
                    alert.dateSelected = getDate(d);
                    alert.hourSelected = d.getHours();
                    alert.minuteSelected = d.getMinutes();

                    content.append( views.alertBlock(alert) );
                });

                $qtip.set('content.text', header + content[0].outerHTML);

                $('.alertDate').datepicker({ dateFormat: 'yy-mm-dd', minDate: 0 });

                // Añadir alerta
                $('#addAlert').on('click', function() {
                    var block = $( views.alertBlock({}) ).prependTo( $('#alertsContainer') );
            
                    block.find('input').attr('disabled', false);
                    block.find('select').attr('disabled', false);
                    block.find('.edit').hide();
                    block.find('.save').show();
                    block.find('.alertMsg').focus();
                    block.find('.alertDate').datepicker({ dateFormat: 'yy-mm-dd', minDate: 0 });
                });

                // Guardar alerta
                $('#alertsContainer').on('click', '.untAlertBlock .save', function(){
                    var $this = $(this)
                        ,parent = $this.parent();

                    if ($.trim( parent.find('.alertMsg').val() ) == '') {
                        $.untInputWin({
                            title: i18n.errAlertMsg,
                            content: i18n.errAlertMsg2
                        });

                        return;
                    }

                    $this.hide();
                    parent.find('.untLoader').show();

                    $.post(
                        API + 'Alert',
                        parent.serialize(),
                        function(data) {
                            parent.prepend('<input type="hidden" name="id" value="' + data.id + '">');                                
                            parent.find('input').attr('disabled', 'disabled');
                            parent.find('select').attr('disabled', 'disabled');
                            parent.find('.edit').show();
                            parent.find('.save').hide();
                            parent.find('.untLoader').hide();
                        }
                    ).fail(function(data) {
                        $this.show();
                        parent.find('.untLoader').hide();
                    });
                });

                // Eliminar alerta
                $('#alertsContainer').on('click', '.untAlertBlock .delete', function(){
                    var $this = $(this)
                        ,parent = $this.parent();

                    if( !parent.find('[name=id]').val() ) {
                        parent.remove();
                        return;
                    }

                    $this.hide();
                    parent.find('.untLoader').show();

                     $.ajax({
                        url: API + 'Alert/' + parent.find('[name=id]').val(),
                        type: 'DELETE',
                        success: function(data) {
                            parent.remove();    
                        }
                    });
                });
            }
        }
    },
    show: 'click',
    hide: 'click',
    position: {
        at: 'bottom middle',
        my: 'top center'
    },
    style: {
        width: 480, 
        classes: 'ui-tooltip-shadow ui-tooltip-white'
    }
});


// ----- SEARCH COMPONENT -----
$('#search')
    .autocomplete({
        delay: 500,
        source: API + 'Noteboard/Search/',
        close: function(elem) {
            var child = elem.currentTarget.lastChild;
            if (child)
                location.href = $(child).find('a').attr('href');
        }
    })
    .data( "uiAutocomplete" )._renderItem = function( ul, item ) {
            var $a = $('<a>', { href: ROOT_URL + 'Noteboard/App/' + item.url + '#n-' + item.id, 
                                  Class: 'untNoteSearch',
                                  style: 'border-left:5px solid #' + item.background})
                            .html('<div class="untContent">'
                                        + item.message + 
                                   '</div><img src="' + item.creatorImage + '" class="untCreatorImage">' +
                                   '</div><div class="untDate">'
                                       + item.date +
                                   '</div>');

            return $( "<li></li>" )
                        .data( "item.autocomplete", item )
                        .append( $a )
                        .appendTo( ul );
    };

// ----- Menú contextual 'Configuración de cuenta' en header
var headerMenu = false;
$(document).on('click', function(e){
    var btn = $('#btnHeaderMenu');

    if (btn.is(e.target)) {
        if (headerMenu) {
            $('#headerMenu').hide();
        } else {
            $('#headerMenu').show();
        }

        btn.toggleClass('hovered');
        headerMenu = !headerMenu;
    } else {
        if (headerMenu) {
            $('#headerMenu').hide();
            btn.toggleClass('hovered');
            headerMenu = !headerMenu;
        }
    }
});    

// Botón para cambiar el avatar de UnNotes
$('#btnChangeAvatar').on('click', function(){
    $.untInputWin({ 
        title: i18n.chageProfileImage,
        content: '<iframe src="' + ROOT_URL + 'Account/UploadProfileImage/" class="untUploadImage"></iframe>',
        btnAccept: false,
        btnCancel: true,
        width: 485
    });
});

// ---- MESSAGES ----
if (getUrlVars()['sendMail'] != undefined) {
    $('.untPlgMsg').untInputMsg({
        title: i18n.sendMailResetPass,
        content: i18n.sendMailResetPassMsg,
        type: 'Ok'
    }).show();
}

if (getUrlVars()['saveProfile'] != undefined) {
    $('.untPlgMsg').untInputMsg({
        content: i18n.successSaveData,
        type: 'Ok'
    }).show();
}

if (getUrlVars()['emailConfirm'] != undefined) {
    $('.untPlgMsg').untInputMsg({
        title: i18n.emailConfirm,
        content: i18n.emailConfirmMsg,
        type: 'Ok'
    }).show();
}

if (getUrlVars()['emailConfirmErr'] != undefined) {
    $('.untPlgMsg').untInputMsg({
        title: i18n.errEmailConfirm,
        content: i18n.errEmailConfirmMsg,
        type: 'Err'
    }).show();
}

if (getUrlVars()['passwordChanged'] != undefined) {
    $('.untPlgMsg').untInputMsg({
        title: i18n.passwordChanged,
        content: i18n.passwordChangedMsg,
        type: 'Ok'
    }).show();

    $('#frmSignup').valid();
    $('body').addClass('only-form');
}