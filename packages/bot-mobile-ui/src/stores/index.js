import DerivApi from 'Services/websocket';
import DBotStore from 'Stores/dbot-store';
import WorkspaceStore from 'Stores/workspace-store';
import JournalStore from './journal-store';

export default class RootStore {
    constructor() {
        this.api = DerivApi.instance; 
        this.dbot = new DBotStore(this);
        this.workspace = new WorkspaceStore(this);
        this.journal = new JournalStore(this);
    }
}
