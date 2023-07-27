import { parseQueryString, queryToObjectArray } from '@utils';
import { getTokenList, setStorage, getStorage } from '@storage';
import { addTokenIfValid } from '../../../common/appId';

export default function loginCheck() {
    return new Promise(resolve => {
        const queryStr = parseQueryString();
        const tokenObjectList = queryToObjectArray(queryStr);
        if (!getTokenList().length) {
            if (tokenObjectList.length) {
                addTokenIfValid(tokenObjectList[0].token, tokenObjectList).then(() => {
                    window.location.replace(window.location.href.split('/?')[0]);
                    resolve();
                });
            }

            let token_list = [];
            if (getStorage('client.accounts')) {
                token_list = JSON.parse(getStorage('client.accounts'));
            }
            setStorage('tokenList', JSON.stringify(token_list));
        }
        resolve();
    });
}
