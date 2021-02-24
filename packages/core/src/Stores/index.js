import ClientStore from './client-store';
import CommonStore from './common-store';
import GTMStore from './gtm-store';
import RudderStackStore from './rudderstack-store';
import PushWooshStore from './pushwoosh-store';
import ModulesStore from './Modules';
import MenuStore from './menu-store';
import UIStore from './ui-store';

export default class RootStore {
    constructor() {
        this.client = new ClientStore(this);
        this.common = new CommonStore(this);
        this.modules = new ModulesStore(this);
        this.ui = new UIStore(this);
        this.gtm = new GTMStore(this);
        this.rudderstack = new RudderStackStore(this);
        this.menu = new MenuStore(this);
        this.pushwoosh = new PushWooshStore(this);
    }
}
