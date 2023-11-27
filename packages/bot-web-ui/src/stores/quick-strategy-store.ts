import { action, makeObservable, observable, reaction } from 'mobx';
import { ApiHelpers, config as qs_config, load } from '@deriv/bot-skeleton';
import { save_types } from '@deriv/bot-skeleton/src/constants/save-type';
import { STRATEGIES } from 'Components/quick-strategy/config';
import { TFormData } from 'Components/quick-strategy/types';
import RootStore from './root-store';

export type TActiveSymbol = {
    group: string;
    text: string;
    value: string;
};

interface IQuickStrategyStore {
    current_duration_min_max: {
        min: number;
        max: number;
    };
    root_store: RootStore;
    is_open: boolean;
    selected_strategy: string;
    form_data: TFormData;
    is_contract_dialog_open: boolean;
    is_stop_bot_dialog_open: boolean;
    setFormVisibility: (is_open: boolean) => void;
    setSelectedStrategy: (strategy: string) => void;
    setValue: (name: string, value: string) => void;
    onSubmit: (data: TFormData) => void;
    toggleStopBotDialog: () => void;
    setCurrentDurationMinMax: (min: number, max: number) => void;
}

export default class QuickStrategyStore implements IQuickStrategyStore {
    root_store: RootStore;
    is_open = false;
    selected_strategy = 'MARTINGALE';
    form_data: TFormData = {
        symbol: qs_config.QUICK_STRATEGY.DEFAULT.symbol,
        tradetype: qs_config.QUICK_STRATEGY.DEFAULT.tradetype,
        durationtype: qs_config.QUICK_STRATEGY.DEFAULT.durationtype,
        action: 'RUN',
    };
    is_contract_dialog_open = false;
    is_stop_bot_dialog_open = false;
    current_duration_min_max = {
        min: 0,
        max: 10,
    };

    constructor(root_store: RootStore) {
        makeObservable(this, {
            current_duration_min_max: observable,
            form_data: observable,
            is_contract_dialog_open: observable,
            is_open: observable,
            is_stop_bot_dialog_open: observable,
            selected_strategy: observable,
            onSubmit: action,
            setCurrentDurationMinMax: action,
            setFormVisibility: action,
            setSelectedStrategy: action,
            setValue: action,
            toggleStopBotDialog: action,
        });
        this.root_store = root_store;
        reaction(
            () => this.is_open,
            () => {
                if (!this.is_open) {
                    this.selected_strategy = 'MARTINGALE';
                }
            }
        );
    }

    setFormVisibility = (is_open: boolean) => {
        this.is_open = is_open;
    };

    setSelectedStrategy = (strategy: string) => {
        this.selected_strategy = strategy;
    };

    setValue = (name: string, value: string | number | boolean) => {
        this.form_data[name as keyof TFormData] = value;
    };

    setCurrentDurationMinMax = (min = 0, max = 10) => {
        this.current_duration_min_max = {
            min,
            max,
        };
    };

    addDinamicallyBlockToDOM = (
        name_block: string,
        strategy_value: string,
        trade_type_cat: string,
        strategy_dom: HTMLElement
    ) => {
        if (trade_type_cat === 'digits' || trade_type_cat === 'highlowticks') {
            const block = document.createElement('value');
            block.setAttribute('name', name_block);
            block.setAttribute('strategy_value', strategy_value);

            const shadow_block = document.createElement('shadow');
            shadow_block.setAttribute('type', 'math_number_positive');
            shadow_block.setAttribute('id', 'p0O]7-M{ZORlORxGuIEb');

            const field_block = document.createElement('field');
            field_block.setAttribute('name', 'NUM');
            field_block.textContent = '0';

            shadow_block.appendChild(field_block);
            block.appendChild(shadow_block);

            const amount_block = strategy_dom.querySelector('value[name="AMOUNT"]');
            if (amount_block) {
                const parent_node = amount_block.parentNode;
                if (parent_node) {
                    parent_node.insertBefore(block, amount_block.nextSibling);
                }
            }
        }
        if (name_block === 'PREDICTION') {
            const mutation_element = strategy_dom.querySelector(
                'block[type="trade_definition_tradeoptions"] > mutation'
            );
            if (mutation_element) {
                mutation_element.setAttribute('has_prediction', 'true');
            }
        }
    };

    onSubmit = async (data: TFormData) => {
        const { contracts_for } = ApiHelpers.instance;
        const market = await contracts_for.getMarketBySymbol(data.symbol);
        const submarket = await contracts_for.getSubmarketBySymbol(data.symbol);
        const trade_type_cat = await contracts_for.getTradeTypeCategoryByTradeType(data.tradetype);
        const selected_strategy = STRATEGIES[this.selected_strategy];
        const strategy_xml = await import(/* webpackChunkName: `[request]` */ `../xml/${selected_strategy.name}.xml`);
        const strategy_dom = Blockly.Xml.textToDom(strategy_xml.default);
        this.addDinamicallyBlockToDOM('PREDICTION', 'last_digit_prediction', trade_type_cat, strategy_dom);

        const modifyValueInputs = (key: string, value: number) => {
            const el_value_inputs = strategy_dom?.querySelectorAll(`value[strategy_value="${key}"]`);
            el_value_inputs?.forEach((el_value_input: HTMLElement) => {
                if (key.includes('boolean'))
                    if (value)
                        el_value_input.innerHTML = `<block type="logic_boolean"><field name="BOOL">TRUE</field></block>`;
                    else
                        el_value_input.innerHTML = `<block type="logic_boolean"><field name="BOOL">FALSE</field></block>`;
                else
                    el_value_input.innerHTML = `<shadow type="math_number"><field name="NUM">${value}</field></shadow>`;
            });
        };

        const modifyFieldDropdownValues = (name: string, value: string) => {
            const name_list = `${name.toUpperCase()}_LIST`;
            const el_blocks = strategy_dom?.querySelectorAll(`field[name="${name_list}"]`);

            el_blocks?.forEach((el_block: HTMLElement) => {
                el_block.innerHTML = value;
            });
        };
        const { unit, action, ...rest_data } = data;
        const fields_to_update = {
            market,
            submarket,
            tradetypecat: trade_type_cat,
            dalembert_unit: unit,
            oscar_unit: unit,
            ...rest_data,
        };

        Object.keys(fields_to_update).forEach(key => {
            const value = fields_to_update[key as keyof typeof fields_to_update];

            if (!isNaN(value as number)) {
                modifyValueInputs(key, value as number);
            } else if (typeof value === 'string') {
                modifyFieldDropdownValues(key, value);
            }
        });

        const { derivWorkspace: workspace } = Blockly;

        if (action === 'RUN') {
            workspace
                ?.waitForBlockEvent({
                    block_type: 'trade_definition',
                    event_type: Blockly.Events.BLOCK_CREATE,
                    timeout: 5000,
                })
                .then(() => {
                    this.root_store.run_panel.onRunButtonClick();
                });
        }

        this.setFormVisibility(false);

        await load({
            block_string: Blockly.Xml.domToText(strategy_dom),
            file_name: selected_strategy.label,
            workspace,
            from: save_types.UNSAVED,
            drop_event: null,
            strategy_id: null,
            showIncompatibleStrategyDialog: null,
        });
    };

    toggleStopBotDialog = (): void => {
        this.is_contract_dialog_open = !this.is_contract_dialog_open;
        this.is_stop_bot_dialog_open = !this.is_stop_bot_dialog_open;
    };
}
