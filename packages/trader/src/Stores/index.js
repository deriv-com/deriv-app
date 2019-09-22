import ClientStore  from './client-store';
import CommonStore  from './common-store';
import GTMStore     from './gtm-store';
import ModulesStore from './Modules';
import UIStore      from './ui-store';

export default class RootStore {
    constructor() {
        this.client  = new ClientStore(this);
        this.common  = new CommonStore();
        this.modules = new ModulesStore(this);
        this.ui      = new UIStore();
        this.gtm     = new GTMStore(this);
    }
}
