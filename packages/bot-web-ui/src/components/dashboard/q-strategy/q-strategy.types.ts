import React from 'react';
import { FormikHelpers as FormikActions } from 'formik';

type TQuickStrategyFormValues = { button: 'run' | 'edit' };

type TDurationOptions = {
    max: number;
    min: number;
    text: string;
    value: string;
};

type TTypeStrategy = {
    description: string;
    index: number;
    text: string;
    value: string;
};
type TIconTradeType = Record<'CALLE' | 'PUTE', string[]>;

export type TTradeType = {
    group: string;
    icon: TIconTradeType;
    text: string;
    value: string;
};

type TTradeTypeDropdown = Array<TTradeType>;

type TDropdownItems = 'symbol' | 'trade-type' | 'duration-unit' | 'type-strategy';

type TInputUniqFields = 'input_martingale_size' | 'input_alembert_unit' | 'input_oscar_unit';
type TInputBaseFields = 'input_duration_value' | 'input_stake' | 'input_loss' | 'input_profit';
type TInputCommonFields = TInputBaseFields | TInputUniqFields;

type TSetFieldValue = (value: 'button' | 'edit') => void;

type TSelectsFieldNames =
    | 'quick-strategy__types-strategies'
    | 'quick-strategy__symbol'
    | 'quick-strategy__trade-type'
    | 'quick-strategy__duration-unit';

export type TSymbolDropdownValue = 'group' | 'text' | 'value';

// export type TSymbolDropdown = Record<TSymbolDropdownValue, string[]>;
export type TSymbolItem = Record<TSymbolDropdownValue, string>;
export type TSymbolDropdown = Array<TSymbolItem>;

type TDurationUnitDropdown = Array<TDurationOptions>;

type TTypeStrategiesDropdown = Array<TTypeStrategy>;

type TDropdowns = TSymbolDropdown | TTradeTypeDropdown | TDurationUnitDropdown | TTypeStrategiesDropdown;

type TSelectedValuesSelect = TTypeStrategy | string | TTradeType | TDurationOptions;

type TSetSelectedTradeType = (trade_type: TTradeType) => void;
type TSetSelectedSymbol = (symbol: string) => void;
type TSetSelectedDurationUnit = (duration_unit: TDurationOptions) => void;
type TSetSelectedTypeStrategy = (type_strategy: TTypeStrategy) => void;

type TFieldMapData = {
    field_name: TSelectsFieldNames;
    dropdown: TDropdowns;
    selected: TSelectedValuesSelect;
    setSelected: TSetSelectedSymbol | TSetSelectedTradeType | TSetSelectedDurationUnit | TSetSelectedTypeStrategy;
};

export type TQuickStrategyProps = {
    active_index: number;
    description: string;
    createStrategy: (values: TQuickStrategyFormValues, actions: FormikActions<TQuickStrategyFormValues>) => void;
    duration_unit_dropdown: TDurationUnitDropdown;
    types_strategies_dropdown: TTypeStrategiesDropdown;
    getSizeDesc: (index: number) => string;
    // initial_errors: any;
    // initial_values: any;
    is_onscreen_keyboard_active: boolean;
    is_mobile: boolean;
    is_stop_button_visible: boolean;
    is_strategy_modal_open: boolean;
    onChangeDropdownItem: (type: TDropdownItems, value: string, setFieldValue: TSetFieldValue) => void;
    onChangeInputValue: (field: TInputCommonFields, event: React.ChangeEvent<HTMLInputElement>) => void;
    onHideDropdownList: (type: TDropdownItems, value: TSelectsFieldNames, setFieldValue: TSetFieldValue) => void;
    onScrollStopDropdownList: (type: TDropdownItems) => void;
    setActiveTypeStrategyIndex: (index: number) => void;
    selected_symbol: string;
    selected_trade_type: TTradeType;
    selected_duration_unit: TDurationOptions;
    selected_type_strategy: TTypeStrategy;
    symbol_dropdown: TSymbolDropdown;
    toggleStrategyModal: () => void;
    trade_type_dropdown: TTradeTypeDropdown;
    // validateQuickStrategy: any;
    setCurrentFocus: (value: string) => void;
    getFieldMap: (type: TDropdownItems) => TFieldMapData;
};
