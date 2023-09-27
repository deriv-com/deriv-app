import { action, computed, makeObservable, observable } from 'mobx';
import RootStore from './root-store';

export type TFormData = {
    symbol?: string;
    trade_type?: string;
    duration_unit?: string;
    duration_value?: number;
    stake?: number;
    size?: number;
    profit_threshold?: number;
    loss_threshold?: number;
    units?: number;
};

export type TActiveSymbol = {
    group: string;
    text: string;
    value: string;
};

export default class QuickStrategyStore {
    root_store: RootStore;
    is_open = false;
    selected_strategy = 'MARTINGALE';
    active_symbols: TActiveSymbol[] = [];
    form_data: TFormData = {
        symbol: '1HZ100V',
        trade_type: '',
        duration_unit: 't',
        duration_value: 1,
        stake: 0,
        size: 0,
        profit_threshold: 0,
        loss_threshold: 0,
        units: 0,
    };

    constructor(root_store: RootStore) {
        makeObservable(this, {
            is_open: observable,
            selected_strategy: observable,
            active_symbols: observable,
            form_data: observable,
            setFormVisibility: action,
            setSelectedStrategy: action,
        });
        this.root_store = root_store;
    }

    setFormVisibility = (is_open: boolean) => {
        this.is_open = is_open;
    };

    setSelectedStrategy = (strategy: string) => {
        this.selected_strategy = strategy;
    };

    setFormData = (data: TFormData) => {
        const form_data = {
            ...this.form_data,
            ...data,
        };

        this.form_data = form_data;
    };
}
