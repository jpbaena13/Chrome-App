﻿/*!
 * Testo in Italiano per internationalization (i18n)
 *
 * @package     webroot
 * @subpackage  locale
 * @author      JpBaena13 
 */

i18n = {

    //  -----------------
    //  --- DEFAULTS ----
    //  -----------------
    accept  : 'Accettare',
    black   : 'Nero',
    blue    : 'Blue',
    cancel  : 'Annullare',
    green   : 'Verde',
    gray    : 'Grigio',
    red     : 'Rosso',
    loading: 'Caricamento in corso ... ',
    search: 'Cercare',
    share: 'Condividere',
    notshare: 'Non condividere più',
    unavailable: 'No disponibile',        
    writeComment: 'Scrivi un commento',
    successSaveData: 'Dati salvati correttamente!!',
    back: 'Ritornare',
    delete: 'Cancellare',

    // ---> Server
    err400: 'Richiesta non valida',
    err400Msg: 'La richiesta non è valida, si prega di riprovare',
    err401: 'Non c\'è una sessione attiva',
    err401Msg: 'Non hai effettuato l\'ingresso. Accedi per continuare',
    err403: 'Autorizzazioni insufficienti',
    err403Msg: 'Non si dispone dell\'autorizzazione per eseguire questa azione',
    err432: 'Data sbagliata',
    err432Msg: 'La data selezionata è inferiore alla data corrente. Selezionare una data maggiore rispetto alla data corrente.',
    err433: 'Telefono non impostato',
    err433Msg: 'Ancora non è configurato un numero di telefono a cui il messaggio viene inviato. Per configurare un numero si prega di fare<a href="' + ROOT_URL + 'Account/Profile"> click qui</a>',
    err500: 'Errore inaspettato',
    err500Msg: 'C\'è stato un errore imprevisto e non può fare la richiesta',

    // ---> Signup
    errEmailReq: 'Inserisci la tua e-mail',
    errEmailInvalid: 'Questo non è un indirizzo email valido',
    errEmailUnavailable: 'L\'account di posta elettronica è già esistente!!',
    errUsernameReq: 'È richiesto un nome utente',
    errUsernameMinlength: 'Oh scusa!! ma devono essere più di 2 caratteri',
    errUsernameUnavailable: 'Il nome utente è già in uso',
    errPasswordReq: 'Inserisci la tua password',
    errPasswordMinlength: 'Almeno 6 caratteri',
    errTosAgree: 'Accetta le condizioni di servizio',
    oneStep: 'Manca solo un passo!',
    oneStepMsg: 'Per creare il tuo account UnNotes esamina e riempi i seguenti dati, e poi <b>Registrati</b>.<br>Il primo campo è il nome utente, scegli un username buono perché non è possibile cambiarlo dopo.',

    // ---> Login
    errLogin: 'Errore di autenticazione',
    errLoginMsg : 'La combinazione di nome utente e password non è valida, si prega di reinserire i dati correttamente',
    emailConfirm: 'Indirizzo e-mail confermato',
    emailConfirmMsg: 'Il tuo indirizzo e-mail è stato confermato. Continua ad usare UnNotes e rendi le tue note indimenticabili.',
    errEmailConfirm: 'Il tuo indirizzo e-mail <b>non è stato confermato</b>.',
    errEmailConfirmMsg: 'I dati per confermare il tuo indirizzo e-mail sono errati oppure il vostro indirizzo e-mail è già stato confermato',
    existEmail: 'Email già esistente',
    existEmailMsgA: 'L\'indirizzo e-mail',
    existEmailMsgB: 'è già registrato in UnNotes. Se hai già un account si prega di autenticarsi e di associare il account social con UnNotes',   


    // ---> MyBoards
    createNoteboard : 'Crea una bacheca',
    editNoteboard : 'Edita una bacheca',
    deleteNoteboard : 'Cancella bacheca',
    deleteNoteboardMsg : 'Sei sicuro di voler cancellare la bacheca?<br><br><small class="untWrng">Se si cancella questa bacheca, tutte le risorse associati vengono pure cancellati. Inoltre, questo sarà cancellato da tutti gli account con cui è stato condiviso.</small>',
    shareNoteboard: 'Condividi la bacheca',
    unshareNoteboardMsg: 'Sei sicuro di voler cancellare la bacheca?<br><br><small class="untWrng">Questa bacheca <strong>è condivisa</strong>. Se si continua con questa azione non sarà più <strong>Collaboratore</strong> per questa bacheca.</small>',
    errNameNoteboard: 'Inserisci un nome per la bacheca',
    createFolder: 'Crea Cartella',
    editFolder : 'Modifica Cartella',
    deleteFolder: 'Cancella cartella',
    deleteFolderMsg : 'Sei sicuro di voler eliminare questa cartella: ',
    errNameFolder: 'Si prega di inserire un nome per la cartella',
    errSelectContact: 'Seleziona almeno un contatto',
    scheduleAlert: 'Programma allarma SMS',
    createAlert: 'Creare Allarma SMS',
    msgAlert: 'Scrivi un mesaggio',
    errAlertMsg: 'Mesaggio vuoto',
    errAlertMsg2: 'Si prega di ingresare un messaggio fino a 140 caratteri',

    // ---> Notes
    removeFile: 'Cancella il file',
    downloadFile: 'Scarica il file',
    downloadImage: 'Scarica immagine',
    previewImage: 'Anteprima immagine',
    attachDeleted: 'File cancellato',
    scheduleAlert: 'Programma allarma SMS',

    // ---> Contact
    sendMailContact: 'Messaggio inviato',
    sendMailContactMsg: 'Il tuo messaggio è stato inviato con successo. Entro 24 ore avremo una risposta. <br> Grazie per il tuo tempo.',

    // ---> Recover
    sendMailResetPass: 'Posta inviata',
    sendMailResetPassMsg: 'Le istruzioni per reimpostare la password sono state inviate al tuo indirizzo email. Controlla la posta in arrivo o spam, ',
    emailNotFound: 'Email non registrata',
    emailNotFoundMsg: 'L\'e-mail non è registrata in UnNotes, si prega di verificare che sia ben scritto.',
    errPasswordAgain: 'Le password devono essere identiche',
    passwordChanged: 'Password cambiata',
    passwordChangedMsg: 'La password è stata cambiata con successo',

    // Upload Images
    msgUploadImagesYourself: 'Carica una foto sul profilo',
    sizeNotAllowed:'Peso massimo superato',
    errSizeNotAllowed: 'Il peso dell\'immagine deve essere inferiore a',
    msgExtensionAllowed:"È possibile caricare file in formato",
    extensionNotAllowed: 'Formato non consentito',
    errExtensionNotAllowed: 'Formato non consentito, sono accettati solo formati di immagine.',
    errNoSelectImage: 'Nessuna immagine selezionata',
    errNoImages: 'Seleziona un\'immagine da caricare',
    errSelectionFirst: 'seleziona per prima',
    msgSelectionArea: 'Selezionare l\'area sull\'immagine',
    saveImage: 'Salva immagine',
    uploadImage: 'Carica immagine',
    msgInvalidImage: 'Si prega di astenersi di caricare immagini oscene o contenuto protetto da copyright.',
    msgImagesProfile: 'L\'immagine specificata verrà utilizzata su tutti i prodotti e servizi UnNotes',
    msgUploadImagesSuccess: 'Immagine Caricata con successo!!<br><small>Per vedere le modifiche ricaricare la pagina.</small>',
    changeImage: 'Cambiarw immagine',
    deleteImage: 'Cancellare Immagine',
    chageProfileImage: 'Cambiare immagine di profilo',


    //  -----------------
    //  --- MODULES -----
    //  -----------------
    
    
    // ---> Tablero
    sendBack    : 'Porta in secondo piano',
    sendForward : 'Porta in primo piano',
    changeFont  : 'Cambiare tipi di carattere',
    changeSize  : 'Cambiare dimensione di carattere',
    changeColor : 'Cambiare colore di carattere',
    changeBG    : 'Cambiare Colore della Nota',
    removeNote  : 'Cancellare Nota',
    removeObject: 'Elimina oggetto',
    removeNoteImage  : 'Cancellare Immagine',
    addNote     : 'Inserisce una nota',
    removeNoteMsg  : 'Sei sicuro di voler eliminare questa nota?.<br><small>Tutti i dati associati saranno anche cancellati</small>',
    attachNote  : 'Visualizza oppure Allega file',
    attachFile  : 'Allegare il file?',
    alertNote   : 'Programma allarma SMS',
    vertical    : 'Crea linea verticale',
    horizontal  : 'Crea linea orizzontale',
    image       : 'Inserire una immagine',
    circle      : 'Inserire un cerchio',
    label       : 'Crea etichetta',    
    shareNB     : 'Condividi',
    sharedNB    : 'Bacheca condivisa',
    clearNB     : 'Cancella la bacheca',
    clearNBMsg  : 'Questo eliminerà tutte le note.Sei assolutamente sicuro?',
    shareLink   : 'Condividi questo link',
    shareLinkMsg: 'Per condividere questa bacheca con i tuoi amici, inviare il seguente link:<br><br>',
    errAlertDate: 'Data sbagliata',
    errAlertDateMsg: 'Si prega di inserire una data superiore alla data corrente',
    alertMsgEmpty: 'La nota non ha alcun testo da inviare in SMS',
    alertDeleteSuccess: 'L\'allerta è stata cancellata con successo!',
}