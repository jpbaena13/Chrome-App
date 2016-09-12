/*!
 * Conjunto de funciones que restringe al uso de caractéres específicos,
 * especialmente para campos de texto.
 *
 * @package     webroot
 * @subpackage  js
 * @author      JpBaena13
 */

permissionsKeyPress = {

    /**
     * This function allows that enter only numbers in the text field, including
     * black spaces (BS).
     */
    OnlyIntegersBSHandled: function(e) {
        if (e.which >= 48 & e.which <= 57 | e.which == 8 | e.which == 0)
            return true;
        else
            e.preventDefault();

        return false;
    },

    /**
     * This function allows only enter numbers in the text field, not including
     * blank spaces (NBS).
     */
    OnlyIntegersNBSHandled: function(e) {
        if (e.which >= 48 & e.which <= 57 | e.which == 8 | e.which == 0)
            return true;
        else
            e.preventDefault();

        return false;
    },

    /**
     * Allows only enter text or point.
     */
    OnlyTextHandled: function(e) {
        if ((e.which >= 97 & e.which <= 122) | (e.which >= 65 & e.which <= 90) |
            e.which == 32 | e.which == 8 | e.which == 0 | e.which == 209 | e.which == 241)
            return true;
        else
            e.preventDefault();

        return false;
    },

    /**
     * Allows enter only alphanumerics characters.
     */
    OnlyAlphanumericHandled: function(e) {
        if ((e.which >= 48 & e.which <= 57) | (e.which >= 97 & e.which <= 122) |
            (e.which >= 65 & e.which <= 90) | e.which == 32 | e.which == 8 
                | e.which == 0 | e.which == 209 | e.which == 241)
                return true;
        else
            e.preventDefault();

        return false;
    },

    /**
     * Allows enter only alphanumerics characters.
     */
    OnlyAlphanumericHandledNBS: function(e) {
        if ((e.which >= 48 & e.which <= 57) | (e.which >= 97 & e.which <= 122) |
            (e.which >= 65 & e.which <= 90) | e.which == 8 
                | e.which == 0 | e.which == 209 | e.which == 241)
                return true;
        else
            e.preventDefault();

        return false;
    },

    /**
     * Allows enter only alphanumerics characters and the point character.
     */
    OnlyAlphanumericPointHandled: function(e) {
        if ((e.which >= 48 & e.which <= 57) | (e.which >= 97 & e.which <= 122) |
            (e.which >= 65 & e.which <= 90) | e.which == 32 | e.which == 8 
                | e.which == 0 | e.which == 46 | e.which == 209 | e.which == 241)
                return true;
        else
            e.preventDefault();

        return false;
    }
};

