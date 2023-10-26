const isBrowser = () => typeof window !== 'undefined';

const derivComUrl = 'deriv.com';
const derivMeUrl = 'deriv.me';
const derivBeUrl = 'deriv.be';

const supportedDomains = [derivComUrl, derivMeUrl, derivBeUrl];
const domainUrlInitial = (isBrowser() && window.location.hostname.split('app.')[1]) || '';
const domainUrl = supportedDomains.includes(domainUrlInitial) ? domainUrlInitial : derivComUrl;

export const derivUrls = Object.freeze({
    BINARYBOT_PRODUCTION: `https://bot.${domainUrl}`,
    BINARYBOT_STAGING: `https://staging-bot.${domainUrl}`,
    DERIV_APP_PRODUCTION: `https://app.${domainUrl}`,
    DERIV_APP_STAGING: `https://staging-app.${domainUrl}`,
    DERIV_COM_PRODUCTION: `https://${domainUrl}`,
    DERIV_COM_PRODUCTION_EU: `https://eu.${domainUrl}`,
    DERIV_COM_STAGING: `https://staging.${domainUrl}`,
    DERIV_HOST_NAME: domainUrl,
    SMARTTRADER_PRODUCTION: `https://smarttrader.${domainUrl}`,
    SMARTTRADER_STAGING: `https://staging-smarttrader.${domainUrl}`,
});

export const whatsappUrl = 'https://wa.me/35699578341';
