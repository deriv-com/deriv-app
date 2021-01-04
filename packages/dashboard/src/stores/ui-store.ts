import { action, observable } from 'mobx';
import { TUIProps } from 'Types';
import BaseStore from './base-store';

class UIStore extends BaseStore {
    public components = {};

    @observable
    public is_dark_mode_on = false;

    @action
    public init(ui_props: TUIProps): void {
        this.components = ui_props.components;
        this.is_dark_mode_on = ui_props.is_dark_mode_on;
    }
}

export default UIStore;
