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

export type TLossThresholdWarningData = {
    show: boolean;
    loss_amount?: string | number;
    currency?: string;
    highlight_field?: Array<string>;
    already_shown?: boolean;
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
    loss_threshold_warning_data: {
        show: boolean;
    };
    is_contract_dialog_open: boolean;
    is_stop_bot_dialog_open: boolean;
    setLossThresholdWarningData: (data: TLossThresholdWarningData) => void;
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
    loss_threshold_warning_data: TLossThresholdWarningData = {
        show: false,
    };

    constructor(root_store: RootStore) {
        makeObservable(this, {
            current_duration_min_max: observable,
            form_data: observable,
            is_contract_dialog_open: observable,
            is_open: observable,
            is_stop_bot_dialog_open: observable,
            initializeLossThresholdWarningData: action,
            selected_strategy: observable,
            loss_threshold_warning_data: observable,
            onSubmit: action,
            setCurrentDurationMinMax: action,
            setFormVisibility: action,
            setSelectedStrategy: action,
            setLossThresholdWarningData: action,
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

    setLossThresholdWarningData = (data: TLossThresholdWarningData) => {
        this.loss_threshold_warning_data = {
            ...this.loss_threshold_warning_data,
            ...data,
        };
    };

    initializeLossThresholdWarningData = () => {
        this.loss_threshold_warning_data = {
            show: false,
            highlight_field: [],
            already_shown: false,
        };
    };

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

    onSubmit = async (data: TFormData) => {
        const { contracts_for } = ApiHelpers.instance;
        const market = await contracts_for.getMarketBySymbol(data.symbol);
        const submarket = await contracts_for.getSubmarketBySymbol(data.symbol);
        const trade_type_cat = await contracts_for.getTradeTypeCategoryByTradeType(data.tradetype);
        const selected_strategy = STRATEGIES[this.selected_strategy];
        const strategy_xml = await import(/* webpackChunkName: `[request]` */ `../xml/${selected_strategy.name}.xml`);
        const parser = new DOMParser();
        const strategy_dom = parser.parseFromString(strategy_xml.default, 'text/xml');

        const addPredictionBlock = (value: string) => {
            const tradeOptionsBlock = strategy_dom.querySelector('block[type="trade_definition_tradeoptions"]');
            if (tradeOptionsBlock) {
                // Update the has_prediction attribute
                tradeOptionsBlock.querySelector('mutation')?.setAttribute('has_prediction', 'true');
                // Create the <value name="PREDICTION"> block
                const predictionValue = strategy_dom.createElement('value');
                predictionValue.setAttribute('name', 'PREDICTION');
                const shadowBlock = strategy_dom.createElement('shadow');
                shadowBlock.setAttribute('type', 'math_number_positive');
                shadowBlock.setAttribute('id', 'Vm_LKDLthv@XZ7iqJ?Z1');
                const fieldBlock = strategy_dom.createElement('field');
                fieldBlock.setAttribute('name', 'NUM');
                fieldBlock.appendChild(strategy_dom.createTextNode(value));
                shadowBlock.appendChild(fieldBlock);
                predictionValue.appendChild(shadowBlock);
                // Append the <value name="PREDICTION"> block as the last child
                tradeOptionsBlock.appendChild(predictionValue);
            }
        };

        const modifyValueInputs = (key: string, value: number) => {
            const el_value_inputs = strategy_dom?.querySelectorAll(`value[strategy_value="${key}"]`);
            el_value_inputs?.forEach(el_value_input => {
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

            el_blocks?.forEach(el_block => {
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
                if (key === 'last_digit_prediction') {
                    addPredictionBlock(value);
                } else {
                    modifyValueInputs(key, value as number);
                }
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
        const modifiedXmlString = new XMLSerializer().serializeToString(strategy_dom);

        await load({
            block_string: modifiedXmlString,
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
