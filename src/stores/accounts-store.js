import { getOAuthURL } from '../services/api/appId';

export default class AccountsStore {
    onLoginClick = () => {
        document.location = getOAuthURL();
    }
}
