import { action, observable } from 'mobx';
import { TClientProps } from 'Types';
import BaseStore from './base-store';

class ClientStore extends BaseStore {
    @observable
    public loginid = '';

    @observable
    public is_logged_in = false;

    @action
    public init(client_props: TClientProps): void {
        this.is_logged_in = client_props.is_logged_in;
        this.loginid = client_props.loginid;
    }
}

export default ClientStore;
