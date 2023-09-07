import React from 'react';
import { FormikHelpers as FormikActions } from 'formik';

export type TDurationOptions = {
    max: number;
    min: number;
    text: string;
    value: string;
};

export type TTypeStrategy = {
    description: string;
    index: number;
    text: string;
    value: string;
};
type TIconTradeType = Array<'CALLE' | 'PUTE'>;

export type TTradeType = {
    group: string;
    icon: TIconTradeType;
    text: string;
    value: string;
};

export type TTradeTypeContractsFor = {
    icon: TIconTradeType;
    name: string;
    value: string;
};

type TStrategy = {
    index: number;
    label: string;
    description: string;
};
export type TKeysStrategies = 'martingale' | 'dalembert' | 'oscars_grind';
export type TStrategies = Record<TKeysStrategies, TStrategy>;

export type TSymbol = Record<
    'market' | 'market_display' | 'submarket' | 'submarket_display' | 'symbol' | 'symbol_display',
    string
>;
export type TSymbols = Array<TSymbol>;

export type TDuration = {
    display: 'Ticks' | 'Minutes' | 'Hours' | 'Days';
    max: number;
    min: number;
    unit: 't' | 'm' | 'h' | 'd';
};

export type TDurations = Array<TDuration>;

export type TFieldsToUpdate = {
    alembert_unit: string;
    duration: string | number;
    durationtype: string;
    loss: string;
    market: string;
    oscar_unit: string;
    profit: string;
    size: string;
    stake: string;
    submarket: string;
    symbol: string;
    tradetype: string;
    tradetypecat: string;
};

export type TMarketOption = {
    group: string;
    text: string;
    value: string;
};

export type TTradeTypeDropdown = Array<TTradeType>;

export type TDropdownItems = 'symbol' | 'trade-type' | 'duration-unit' | 'type-strategy';

export type TInputBaseFields =
    | 'input_duration_value'
    | 'input_stake'
    | 'input_loss'
    | 'input_profit'
    | 'input_martingale_size'
    | 'input_alembert_unit'
    | 'input_oscar_unit';

export type TSetFieldValue = (
    element: 'button' | 'quick-strategy__duration-unit' | 'quick-strategy__duration-value' | string,
    action: 'run' | 'edit' | string | number
) => void;

export type TSelectsFieldNames =
    | 'quick-strategy__type-strategy'
    | 'quick-strategy__symbol'
    | 'quick-strategy__trade-type'
    | 'quick-strategy__duration-unit'
    | '';

export type TInputsFieldNames =
    | 'quick-strategy__duration-value'
    | 'quick-strategy__stake'
    | 'quick-strategy__loss'
    | 'quick-strategy__profit'
    | 'martingale-size'
    | 'alembert-unit'
    | 'oscar-unit';

export type TSymbolDropdownValue = 'group' | 'text' | 'value';

export type TSymbolItem = Record<TSymbolDropdownValue, string>;
export type TSymbolDropdown = Array<TSymbolItem>;

export type TDurationUnitDropdown = Array<TDurationOptions>;

export type TTypeStrategiesDropdown = Array<TTypeStrategy>;

export type TDropdowns = TSymbolDropdown | TTradeTypeDropdown | TDurationUnitDropdown | TTypeStrategiesDropdown;

export type TSelectedValuesSelect = TTypeStrategy | TTradeType | TDurationOptions | TMarketOption;

type TSetSelectedTradeType = (trade_type: TTradeType) => void;
type TSetSelectedSymbol = (symbol: string) => void;
type TSetSelectedDurationUnit = (duration_unit: TDurationOptions) => void;
type TSetSelectedTypeStrategy = (type_strategy: TTypeStrategy) => void;

type TSelectedField = TSetSelectedSymbol | TSetSelectedTradeType | TSetSelectedDurationUnit | TSetSelectedTypeStrategy;

export type TFieldMapData = {
    field_name: TSelectsFieldNames;
    dropdown: TDropdowns;
    selected: TSelectedValuesSelect;
    setSelected: TSelectedField;
};

export type TFieldsMapData = Record<TDropdownItems, TFieldMapData>;

type TInitialKeys = TSelectsFieldNames | TInputsFieldNames;

export type TInitialValues = Record<TInitialKeys, string>;
export type TQuickStrategyFormValues = TInitialValues & Record<'button', 'run' | 'edit'>;

export type TFormValues = { [key: string]: string };

export type TOnChangeInputValue = (field: TInputBaseFields, event: React.ChangeEvent<HTMLInputElement>) => void;
export type TSetCurrentFocus = (value: string | null) => void;
export type TOnChangeDropdownItem = (type: TDropdownItems, value: string, setFieldValue: TSetFieldValue) => void;
export type TOnHideDropdownList = (
    type: TDropdownItems,
    value: TSelectsFieldNames,
    setFieldValue: TSetFieldValue
) => void;
export type TOnScrollStopDropdownList = (type: TDropdownItems) => void;
export type TCreateStrategy = (
    values: TQuickStrategyFormValues,
    actions: FormikActions<TQuickStrategyFormValues>
) => void;

export type TQuickStrategyProps = React.PropsWithChildren<{
    active_index: number;
    description: string;
    duration_unit_dropdown: TDurationUnitDropdown;
    types_strategies_dropdown: TTypeStrategiesDropdown;
    initial_values: TQuickStrategyFormValues;
    is_onscreen_keyboard_active: boolean;
    is_stop_button_visible: boolean;
    is_strategy_modal_open: boolean;
    selected_symbol: TMarketOption;
    selected_trade_type: TTradeType;
    selected_duration_unit: TDurationOptions;
    selected_type_strategy: TTypeStrategy;
    symbol_dropdown: TSymbolDropdown;
    trade_type_dropdown: TTradeTypeDropdown;
    is_running: boolean;
    is_contract_dialog_open: boolean;
    is_stop_bot_dialog_open: boolean;
    createStrategy: TCreateStrategy;
    onChangeDropdownItem: TOnChangeDropdownItem;
    onChangeInputValue: TOnChangeInputValue;
    onHideDropdownList: TOnHideDropdownList;
    onScrollStopDropdownList: TOnScrollStopDropdownList;
    setActiveTypeStrategyIndex: (index: number) => void;
    setCurrentFocus: TSetCurrentFocus;
    toggleStopBotDialog: () => void;
    loadDataStrategy: () => void;
}>;

export type TQSCache = {
    selected_type_strategy?: TTypeStrategy;
    selected_symbol?: TMarketOption;
    input_stake?: string;
    input_loss?: string;
    input_martingale_size?: string;
    input_profit?: string;
    input_oscar_unit?: string;
    input_alembert_unit?: string;
    selected_trade_type?: TTradeType;
    selected_duration_unit?: TDurationOptions;
    input_duration_value?: number | string;
};

export type TCommonInputsProperties = {
    className?: string;
    zIndex?: number;
};

export type TDataFields = {
    id: string;
    field_name: TSelectsFieldNames | TInputsFieldNames;
    className?: string;
    input_value?: TInputBaseFields;
    select_value?: TDropdownItems;
    label: string;
    placeholder?: string;
    trailing_icon_message?: string;
    is_able_disabled?: boolean;
    is_uniq_strategy_field?: boolean;
    group_by?: string;
} & Readonly<TCommonInputsProperties>;
