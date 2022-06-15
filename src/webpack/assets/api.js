import {
    sleep,
    injectConfig,
    injectParasiteSnake,
    processFiles,
    base64ToFile,
    generateMediaKey,
    arrayBufferToBase64,
    encryptAndUploadFile,
    getFileHash
} from './help';

import {
    getChat,
    scope,
    getNewId,
    getNewMessageId,
    sendExist,
    checkNumberStatus,
    isMD,
    sendCheckType
} from './functions/help';

import {
    sendMessage,
    baseSendMessage
} from './functions';

import {
    addOnStream,
    addOnNewMessage,
    AddOnAck
} from './listeners';

import {
    serializeMessageObj,
    serializeChatObj,
    serializeContactObj,
    serializeProfilePicThumb,
    serializeRawObj,
} from './serializers'

//initialized scrap webpack
(async () => {
    window[injectConfig.webpack] = window[injectConfig.webpack] || [];
    window.Store = {};
    while (true) {
        try {
            const webPackLast = window[injectConfig.webpack].length - 1;
            if (!window[injectConfig.webpack][webPackLast][0].includes(injectConfig.parasite)) {
                await injectParasiteSnake();
                return;
            }
        } catch {
            await sleep(1000);
        }
    }
})();

if (typeof window.API === 'undefined') {
    window.API = {};

    // Helps
    window.API.getChat = getChat;
    window.API.scope = scope;
    window.API.getNewId = getNewId;
    window.API.getNewMessageId = getNewMessageId;
    window.API.sendExist = sendExist;
    window.API.checkNumberStatus = checkNumberStatus;
    window.API.isMD = isMD;
    window.API.baseSendMessage = baseSendMessage;
    window.API.processFiles = processFiles;
    window.API.base64ToFile = base64ToFile;
    window.API.generateMediaKey = generateMediaKey;
    window.API.arrayBufferToBase64 = arrayBufferToBase64;
    window.API.encryptAndUploadFile = encryptAndUploadFile;
    window.API.getFileHash = getFileHash;
    window.API.sendCheckType = sendCheckType;

    // Functions
    window.API.sendMessage = sendMessage;

    // Serialize
    window.API.serializeMessageObj = serializeMessageObj;
    window.API.serializeChatObj = serializeChatObj;
    window.API.serializeContactObj = serializeContactObj;
    window.API.serializeProfilePicThumb = serializeProfilePicThumb;
    window.API.serializeRawObj = serializeRawObj;

    // On
    addOnStream();
    addOnNewMessage();
    AddOnAck();
}