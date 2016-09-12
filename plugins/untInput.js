/*!
 * JQuery Messages and Buttons Plug-in 0.1
 *
 * @author      JpBaena13
 */
;(function($, undefined) {

    $.fn.untInputMsg = function(options) {
        var defaults = {
            content: '',
            title: '',
            type: 'Ok',
        }

        var opts = $.extend(defaults, options)

        return this.each(function() {

            var $this = $(this)
            $this.css('display', 'none')
            $this.html('<div class="untMsg">\
                              <div class="untMsgDelete icon-cancel-circle"></div>\
                              <div class="untMsgIcon"></div>\
                              <div class="untMsgWrapper">\
                                 <div class="untMsgTitle">' + opts.title + '</div>\
                                 <div class="untMsgContent">' + opts.content + '</div>\
                              </div>\
                          </div>')

            var children = $this.children('.untMsg')

            children
                .addClass('untMsg' + opts.type)
                .css('width', opts.width)
                .css('height', opts.height);
            
            // Inserta el tag img si el usuario ingreso una URL de imagen
            if (opts.icon) {
                children.children('.untMsgIcon')
                    .html('<img src="' + opts.icon + '"/>')
                    .css('display', 'inline-block')
            }

            if (opts.title == '')
                $this.find('.untMsgTitle').remove();

            $this.find('.untMsgDelete').on('click', function(){
                $this.remove();
            });
        });
    }

    $.untInputWin = function(options) {
        var defaults = {
            title: undefined,
            content: '',
            data: '',
            btnAccept: true,
            btnCancel: false,
            width: 'auto',
            height: 'auto',
            maxWidth: '95%',
            classes: '',
            clickCancel: function() { return true; },
            clickAccept: function() { return true; },
            onLoadContent: function() { }
        }

        if (typeof(options) != 'object')
            options = {content: options}

        var opts = $.extend(defaults, options),
            elems = [];

        elems.bg =      $('<div>', {Class: 'untWinBG'}).appendTo( $('body') );
        elems.win =     $('<div>', {Class: 'untWin ' + opts.classes}).css({ width: opts.width, height: opts.height, 'max-width': opts.maxWidth }).appendTo( elems.bg );
        elems.header =  $('<div>', {Class: 'untWinHeader'}).html( opts.title ).appendTo( elems.win );
        elems.close =   $('<span>', {Class: 'untWinClose icon-cancel-circle'}).appendTo( elems.header );
        elems.content = $('<div>', {Class: 'untWinContent'}).html( opts.content ).appendTo( elems.win );
        elems.footer =  $('<div>', {Class: 'untWinFooter'}).appendTo( elems.win );
        elems.btnAccept = $('<button>', {Class: 'btnWinAccept untBtn yellow'}).html( i18n.accept ).appendTo( elems.footer );
        elems.btnCancel = $('<button>', {Class: 'btnWinCancel untBtn'}).html( i18n.cancel ).appendTo( elems.footer );

        elems.close.on('click', function(e){ untInputWinRemove(); });
        untInputWinCenter();

        // Cargando el contenido dinamicamente si opts.content es una URL
        if (isURL(opts.content)) {
            var exit = false;
            elems.content.html('<img src="' + WEBROOT_URL + 'img/default/loader.gif" alt="Loader" style="display:inherit;margin:0 auto;" width="30px" height="30px">');
            elems.btnAccept.hide();

            $.ajax ({
                url: opts.content,
                data: opts.data,
                success: function(data) {
                    if (opts.btnAccept) elems.btnAccept.show();
                    (isURL(data)) ? location.href = data : elems.content.html( data );
                    opts.onLoadContent();
                    untInputWinCenter();
                }
            })
            .error(function(){
                elems.bg.remove();
            });
        }
        
        if (!opts.title) elems.header.hide();

        if (opts.btnAccept) {
            elems.btnAccept.on('click', function(){
                if (opts.clickAccept() !== false)
                    untInputWinRemove();
            });
        } else {
            elems.btnAccept.hide();
        }

        if (opts.btnCancel) {
            elems.btnCancel.on('click', function(){
                if(opts.clickCancel() !== false)
                    untInputWinRemove();
            });
        } else {
            elems.btnCancel.hide();
        }

        if (!opts.btnAccept && !opts.btnCancel) elems.footer.hide();
    }

    // --- Eventos de cambio de pantalla y tecla presionada
    $(window).on('resize', function() {
        untInputWinCenter();
    })

    $(document).on('keydown', function(e) {
        var key = e.which || e.keycode
        if (key == 27) {
            if($('.untWin').length != 0) {
                untInputWinRemove();
            }
        }
    });
})(jQuery);

/**
 * Permite centrar un untInputWin (Acceso público)
 */
function untInputWinCenter() {
    var win = $(window)
        ,untWin = $('.untWin').last()
        ,wDoc = win.width()
        ,hDoc = win.height()
        ,top = (hDoc - untWin.outerHeight()) / 2;

    if (top < 0)
        top = 0;

    $('.untWinBG').last().css({
        width: wDoc,
        height: hDoc
    });

    untWin.css({
        top: top
    });
}

/**
 * Borrar los elementos de una ventana
 */
function untInputWinRemove(all) {
    var untWin = $('.untWin').last()
        ,untWinBG = $('.untWinBG').last();

    if (all) {
        untWin = $('.untWin');
        untWinBG = $('.untWinBG');
    }

    untWin.css({ top: -untWin.outerHeight() });

    setTimeout(function() {
        untWinBG.remove();
        untWin.remove();
    }, 1000)
}