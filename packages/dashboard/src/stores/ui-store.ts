import { action, observable } from 'mobx';
import { TUIProps } from 'Types';
import BaseStore from './base-store';

class UIStore extends BaseStore {
    public components = {};

    @observable
    public is_dark_mode_on = false;

    @observable
    public real_account_signup: unknown = {};

    public resetRealAccountSignupParams?: () => void;
    public openRealAccountSignup?: () => void;

    @observable
    public real_account_signup_target = '';

    @action
    public init(ui_props: TUIProps): void {
        this.components = ui_props.components;
        this.is_dark_mode_on = ui_props.is_dark_mode_on;
        this.real_account_signup = ui_props.real_account_signup;
        this.resetRealAccountSignupParams = ui_props.resetRealAccountSignupParams;
        this.real_account_signup_target = ui_props.real_account_signup_target;
        this.openRealAccountSignup = ui_props.openRealAccountSignup;
    }
}

export default UIStore;
