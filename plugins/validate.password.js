/*!
 * Plugin que permite validar la fuerza del password.
 * Usa jQuery Validation
 *
 * @package     webroot
 * @subpackage  plugins
 * @author      JpBaena13
 */
(function($){

    //Expresiones regulares que prueban la eficacia de la contraseña
    var
        LOWER = /[a-z]/,
        UPPER = /[A-Z]/,
        DIGIT = /[0-9]/,
        DIGITS = /[0-9].*[0-9]/,
        SPECIAL = /[^a-zA-Z0-9]/,
        SAME = /^(.)\1+$/;

    //Elimina letra capital del string especificado
    function uncapitalize(str) {
        return str.substring(0, 1).toLowerCase() + str.substring(1);
    }

    //Función que encapsula nivel y mensaje obtenido
    function rating(rate, message) {
        return {
            rate: rate,
            messageKey: message
        };
    }

    // Añade función al Plugin JQuery.Validate para determinar el rating de la contraseña
    $.validator.passwordRating = function(password, username) {
        if (!password || password.length < 8)
            return rating(0, 'too-short');

        if (username && password.toLowerCase().match(username.toLowerCase()))
            return rating(0, 'similar-to-username');

        if (SAME.test(password))
            return rating(1, 'very-weak');

        var
            lower = LOWER.test(password),
            upper = UPPER.test(uncapitalize(password)),
            digit = DIGIT.test(password),
            digits = DIGITS.test(password),
            special = SPECIAL.test(password);

        if (lower && upper && digit || lower && digits || upper && digits || special)
            return rating(4, 'strong');

        if (lower && upper || lower && digit || upper && digit)
            return rating(3, 'good');

        return rating(2, 'weak');
    }

    //Añade el método llamado password al JQuery.Validate
    $.validator.addMethod('password', function(value, element, usernameField) {

        usernameField = $("#username")
        var password = element.value,
            username = $(typeof usernameField != 'boolean' ? usernameField : []);

        var rating = $.validator.passwordRating(password, username.val());

        $('.password-meter').css('display', 'block')
        var meter = $('.password-meter', element.form);

        meter.find('.password-meter-bar').removeClass().addClass('password-meter-bar').addClass('password-meter-' + rating.messageKey);

        if (rating.messageKey == 'too-short' || rating.messageKey == 'similar-to-username') {
            meter.find('.password-meter-bar').animate({
                backgroundColor: '#ed3237',
                width: 12
            }, 300 );

        } else if (rating.messageKey == 'very-weak') {
            meter.find('.password-meter-bar').animate({
                backgroundColor: '#f58634',
                width: 24
            }, 300 );

        } else if (rating.messageKey == 'weak') {
            meter.find('.password-meter-bar').animate({
                backgroundColor: '#fff212',
                width: 36
            }, 300 );

        } else if (rating.messageKey == 'good') {
            meter.find('.password-meter-bar').animate({
                backgroundColor: '#bfd73e',
                width: 48
            }, 300 );

        } else {
            meter.find('.password-meter-bar').animate({
                backgroundColor: '#00A859',
                width: 60
            }, 300 );
        }
        
        return true;
    }, '&nbsp;');

    $.validator.classRuleSettings.password = {password: true};

})(jQuery);