module.exports = {
     "IP_ADDRESS": "124.7.41.184", // "210.18.127.24", // 223.30.223.177 --->check env file
     "PORT": "8080", // --->check env file
     "SENDER_MAIL":"sesl.nps@gmail.com",
     "SENDER_PASS":"antsteam@3",
     "DATABASE":"merck",
     "DEVELOPE_MODE":"testing",
     "MAIL_RECIPIANTS": newFunction().DEVELOPE_MODE=="testing"?"pradep.balamurugan@sifycorp.com":"pradep.balamurugan@sifycorp.com,siva.lakshmanan@sifycorp.com",
     "secretKey" : 'yRQYnWzskCZUxPwaQupWkiUzKELZ49eM7oWxAQK_ZXw'
    };

function newFunction() {
    return this;
}
