/**
 * Javascript del index principal del sitio
 *
 * @package     webroot
 * @subpackage  js
 * @author      JpBaena13
 */


//Validando que la función $().validate exista
$.fn.validate = $().validate || function(){};


// Boton para iniciar Sesión
$('.untHeaderLogin').on('click', function(){
    $.untInputWin({
        content: ROOT_URL  + 'Login/Form',
        btnAccept: false,
        width: 405,
        btnCancel: true
    });

    $('#email').focus();

    return false;
});

//Cancelar popup en fixed y lo redirecciona a /Login
$('.fixed .untHeaderLogin').off('click');

// --- Signup Page
$('#frmSignup').validate({
    success: 'valid',
    rules: {
        username: {
            required: true,
            minlength: 2,
            remote : ROOT_URL + 'Signup/Validate'
        },
        password: {
            required: true,
            minlength: 6
        },
        email: {
            required: true,
            email: true,
            remote : ROOT_URL + 'Signup/Validate'
        },
        tos_agree: {
            required: true
        }
    },
    messages: {
        username: {
            required: i18n.errUsernameReq,
            minlength: i18n.errUsernameMinlength,
            remote: i18n.errUsernameUnavailable
        },
        password: {
            required: i18n.errPasswordReq,
            minlength: i18n.errPasswordMinlength
        },
        email: {
            required: i18n.errEmailReq,
            email : i18n.errEmailInvalid,
            remote : i18n.errEmailUnavailable
        },
        tos_agree: {
            required: i18n.errTosAgree
        }
    }
});

$('#_password').on('blur', function(){
    if (this.value == '')
        $('.password-meter').hide();
});



// --- Login Page
$('#frmLogin').validate({
    success: 'valid',
    rules: {
        email: {
            required: true,
        },
        password: {
            required: true,
            minlength: 6
        }
    },
    messages: {
        email: {
            required: i18n.errEmailReq,
            email: i18n.errEmailInvalid
        },
        password: {
            required: i18n.errPasswordReq,
            minlength: i18n.errPasswordMinlength
        },
    }
});

if (getUrlVars()['email'] != undefined)
    $('#email').val(getUrlVars()['email']);


// ---- Contact Page
$('#frmContact').validate({
    success: 'valid',
    rules: {
        email: {
            required: true,
            email: true
        },
        message: {
            required: true,            
        }
    },
    messages: {
        email: {
            required: i18n.errEmailReq,
            email: i18n.errEmailInvalid
        },
        message: {
            required: i18n.writeComment
        },
    }
});

// ---- Recover Page
$('#frmRecover').validate({
    success: 'valid',
    rules: {
        email: {
            required: true,
            email: true
        }
    },
    messages: {
        email: {
            required: i18n.errEmailReq,
            email: i18n.errEmailInvalid
        }
    }
});

// ---- ChangePassword Page
$('#frmChangePassword').validate({
    success: 'valid',
    rules: {
        password: {
            required: true,
            minlength: 6
        },
        password_again: {
            equalTo: '#password'
        }
    },
    messages: {
        password: {
            required: i18n.errPasswordReq,
            minlength: i18n.errPasswordMinlength
        },
        password_again: {
            equalTo: i18n.errPasswordAgain
        }
    }
});

// ---- Payment
$('#frmPayment').validate({
    success: 'valid',
    rules: {
        payerFullName: {
            required: true,
            minlength: 6
        },
        buyerEmail: {
            required: true,
            email: true
        },
        mobilePhone: {
            required: true,
            minlength: 6
        }
    },
    messages: {
        payerFullName: {
            required: i18n.errFullnameReq,
            minlength: i18n.errPasswordMinlength
        },
        buyerEmail: {
            required: i18n.errEmailReq,
            email: i18n.errEmailInvalid
        },
        mobilePhone: {
            required: i18n.errPhoneReq,
            minlength: i18n.errPasswordMinlength
        }
    }
});


$('[name=type]').on('change', function(){
    var total = 12000
        ,base = Number((total/1.16).toFixed(0))
        ,tax = Number((total - base).toFixed(0));

    if (this.value == 'montly') {    
        $('#tdAnnual').hide();
        $('#tdMontly').show();
        $('#signature').attr('value', signMontly);
    } else {
        total = 120000;
        base = Number((total/1.16).toFixed(0));
        tax = Number((total - base).toFixed(0));

        $('#tdAnnual').show();
        $('#tdMontly').hide();
        $('#signature').attr('value', signAnnual);
    }

    $('#tdTaxReturnBase span').html('$' + base);
    $('#taxReturnBase').attr('value', base);

    $('#tdTax span').html('$' + tax);
    $('#tax').attr('value', tax);

    $('#tdTotal span').html('$' + total);
    $('#total').attr('value', total);
});

// --- MENSAJES --
if (getUrlVars()['error'] != undefined) {
    $('.untPlgMsg').untInputMsg({
        title: i18n.errLogin,
        content: i18n.errLoginMsg,
        type: 'Err'
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

if (getUrlVars()['sendMail'] != undefined) {
    $('.untPlgMsg').untInputMsg({
        title: i18n.sendMailResetPass,
        content: i18n.sendMailResetPassMsg,
        type: 'Ok'
    }).show();
}

if (getUrlVars()['existEmail'] != undefined) {
    $('.untPlgMsg').untInputMsg({
        title: i18n.existEmail,
        content: i18n.existEmailMsgA + ' ' + getUrlVars()['email'] + ' ' + i18n.existEmailMsgB,
        type: 'Wrng'
    }).show();

    $('#password').focus();
}

if (getUrlVars()['sendMail'] != undefined) {
    $('.contact .untPlgMsg').untInputMsg({
        title: i18n.sendMailContact,
        content: i18n.sendMailContactMsg,
        type: 'Ok'
    }).show();
}

if (getUrlVars()['emailNotFound'] != undefined) {
    $('.untPlgMsg').untInputMsg({
        title: i18n.emailNotFound,
        content: i18n.emailNotFoundMsg,
        type: 'Err'
    }).show();
}

if (getUrlVars()['socialId'] != undefined) {
    $('.untPlgMsg').untInputMsg({
        title: i18n.oneStep,
        content: i18n.oneStepMsg,
        type: 'Wrng'
    }).show();

    $('#frmSignup').valid();
    $('body').addClass('only-form');
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

if (getUrlVars()['owner'] != undefined) {
    content = (getUrlVars()['owner'] == 1) ? i18n.suscriptionRenew : i18n.suscriptionShare

    $('.untPlgMsg').untInputMsg({
        content: content,
        type: 'Wrng'
    }).show();
}