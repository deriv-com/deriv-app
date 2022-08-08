import { action, observable, reaction } from 'mobx';

export default class RouterStore {
    constructor(root_store) {
        this.root_store = root_store;

        reaction();
    }

    @observable buy_sell = {
        popup: false,
    };
    @observable payment_methods = {
        add_payment_method_form: false,
        cancel_add_payment_method_modal: false,
    };
    @observable routes = {
        buy_sell: {
            show_cancel_add_payment_method_modal: () => {
                this.hide(this.buy_sell.popup);
                this.hide(this.payment_methods.add_payment_method_form);
                this.show(this.payment_methods.cancel_add_payment_method_modale);
            },
        },
    };

    @action.bound
    addRoute(route) {
        this.routes.push(route);
    }

    @action.bound
    show(view) {
        view = true;
    }

    @action.bound
    hide(view) {
        view = false;
    }
}
