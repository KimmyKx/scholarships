const msal = require("@azure/msal-node");

module.exports = new msal.ConfidentialClientApplication({
    auth: {
        clientId: process.env.MICROSOFT_CLIENTID,
        authority: "https://login.microsoftonline.com/" + process.env.MICROSOFT_TENANT_ID,
        clientSecret: process.env.MICROSOFT_CLIENT_SECRET
    },
    system: {
        loggerOptions: {
            loggerCallback(loglevel, message) {
                console.log(message);
            },
            piiLoggingEnabled: false,
            logLevel: 3
        }
    }
});