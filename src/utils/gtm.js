import { getAppIdFallback } from '../../binaryApi/appId';
import AppIdMap from '../../binaryApi/appIdResolver';
import { getTokenList } from './storageManager';

const GTM = (() => {
    const isGtmApplicable = () => Object.values(AppIdMap).includes(`${getAppIdFallback()}`);

    const pushDataLayer = data => {
        if (isGtmApplicable()) {
            // eslint-disable-next-line no-undef
            dataLayer.push({
                ...data,
            });
        }
    };

    const setVisitorId = () => {
        const tokenList = getTokenList();
        if (tokenList.length > 0) {
            pushDataLayer({ visitorId: tokenList[0].loginInfo.loginid });
        } else {
            pushDataLayer({ visitorId: undefined });
        }
    };

    return {
        setVisitorId,
    };
})();

export default GTM;
