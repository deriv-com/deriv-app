import React from 'react';
import { FormikErrors, FormikHelpers as FormikActions, FormikProps } from 'formik';
import { OPERATORS } from 'Constants/quick-strategies-validation';

export type TDurationOptions = {
    max: number;
    min: number;
    text: string;
    value: string;
};

export type TTypeStrategy = {
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

export type TKeysStrategies = 'martingale' | 'dalembert' | 'oscars_grind';

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
    alembert_unit?: string;
    duration?: number;
    durationtype: string;
    loss: string;
    market: string;
    oscar_unit?: string;
    profit: string;
    size?: string;
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
    element: 'button' | 'durationtype' | 'duration' | string,
    action: 'run' | 'edit' | string | number
) => void;

export type TSelectsFieldNames = 'strategy' | 'symbol' | 'tradetype' | 'durationtype';

export type TInputsFieldNames = 'duration' | 'stake' | 'loss' | 'profit' | 'size' | 'alembert_unit' | 'oscar_unit';

export type TSymbolDropdownValue = 'group' | 'text' | 'value';

export type TSymbolItem = Record<TSymbolDropdownValue, string>;
export type TSymbolDropdown = Array<TSymbolItem>;

export type TDurationUnitDropdown = Array<TDurationOptions>;

export type TTypeStrategiesDropdown = Array<TTypeStrategy>;

export type TDropdowns = TSymbolDropdown | TTradeTypeDropdown | TDurationUnitDropdown | TTypeStrategiesDropdown;

export type TSelectedValuesSelect = TTypeStrategy | TTradeType | TDurationOptions | TMarketOption;

export type TFieldMapData = {
    field_name: TSelectsFieldNames;
    dropdown: TDropdowns;
    selected: TSelectedValuesSelect;
    setSelected: (item: TSelectedValuesSelect) => void;
};

export type TFieldsMapData = Record<TDropdownItems, TFieldMapData>;

export type TInitialKeys = TSelectsFieldNames | TInputsFieldNames | 'button';

export type TGenericInitialValues<T extends PropertyKey, Value> = {
    [Key in T]?: Value;
};

export type TInitialValues = TGenericInitialValues<TInitialKeys, string | number | undefined>;

export type TQuickStrategyFormValues = TInitialValues;

export type TFormValues = { [key: string]: string };

export type TOnChangeInputValue = (field: TInputBaseFields, event: React.ChangeEvent<HTMLInputElement>) => void;
export type TSetCurrentFocus = (value: string) => void;
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
    is_strategy_modal_open?: boolean;
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
    setActiveTypeStrategyIndex?: (index: number) => void;
    setCurrentFocus: TSetCurrentFocus;
    toggleStopBotDialog: () => void;
    loadDataStrategy?: () => void;
}>;

export type TQSCache = {
    strategy?: TTypeStrategy;
    symbol?: TMarketOption;
    stake?: string;
    loss?: string;
    size?: string;
    profit?: string;
    oscar_unit?: string;
    alembert_unit?: string;
    tradetype?: TTradeType;
    durationtype?: TDurationOptions;
    duration?: number;
};

export type TDataFields = {
    id: string;
    field_name?: TSelectsFieldNames | TInputsFieldNames;
    className?: string;
    input_value?: TInputBaseFields;
    select_value?: TDropdownItems;
    label?: string;
    placeholder?: string;
    trailing_icon_message?: string;
    is_able_disabled?: boolean;
    group_by?: string;
    type?: string;
    description?: string;
    conditions?: {
        name: keyof TInitialValues;
        value: string | number | boolean;
        operator: keyof typeof OPERATORS;
    }[];
};

export type TQuickStrategyForm = {
    active_index: number;
    duration_unit_dropdown: TDurationUnitDropdown;
    types_strategies_dropdown: TTypeStrategiesDropdown;
    initial_values: TQuickStrategyFormValues;
    is_onscreen_keyboard_active: boolean;
    is_stop_button_visible: boolean;
    symbol_dropdown: TSymbolDropdown;
    trade_type_dropdown: TTradeTypeDropdown;
    selected_symbol: TMarketOption;
    selected_trade_type: TTradeType;
    selected_duration_unit: TDurationOptions;
    selected_type_strategy: TTypeStrategy;
    description: string;
    is_running: boolean;
    is_contract_dialog_open: boolean;
    is_stop_bot_dialog_open: boolean;
    createStrategy: TCreateStrategy;
    onChangeDropdownItem: TOnChangeDropdownItem;
    onChangeInputValue: TOnChangeInputValue;
    onHideDropdownList: TOnHideDropdownList;
    onScrollStopDropdownList: TOnScrollStopDropdownList;
    setCurrentFocus: TSetCurrentFocus;
    toggleStopBotDialog: () => void;
};

export type TQuickStrategyFields = {
    types_strategies_dropdown: TTypeStrategiesDropdown;
    symbol_dropdown: TSymbolDropdown;
    trade_type_dropdown: TTradeTypeDropdown;
    duration_unit_dropdown: TDurationUnitDropdown;
    selected_type_strategy: TTypeStrategy;
    selected_trade_type: TTradeType;
    selected_symbol: TMarketOption;
    selected_duration_unit: TDurationOptions;
    onChangeDropdownItem: TOnChangeDropdownItem;
    onHideDropdownList: TOnHideDropdownList;
    setFieldValue: TSetFieldValue;
    onScrollStopDropdownList: TOnScrollStopDropdownList;
    handleChange: FormikProps<TFormValues>['handleChange'];
    onChangeInputValue: TOnChangeInputValue;
    setCurrentFocus: TSetCurrentFocus;
    values: TInitialValues | TFormValues;
    description: string;
    errors: FormikErrors<TQuickStrategyFormValues>;
};

export type TQuickStrategyFooter = {
    is_running: boolean;
    toggleStopBotDialog: () => void;
};

export type TDropdownLists = Record<TDropdownItems, TDropdowns>;
export type TSelectedValues = Record<TDropdownItems, TSelectedValuesSelect>;

export type TSelectFieldProps = React.PropsWithChildren<{
    field_name: TSelectsFieldNames;
    id: string;
    dropdown_list: TDropdowns;
    selected_value: Partial<TSelectedValuesSelect>;
    label: string;
    select_value: TDropdownItems;
    setFieldValue: TSetFieldValue;
    className?: string;
    is_able_disabled?: boolean;
    values: TFormValues | TInitialValues;
    onChangeDropdownItem: TOnChangeDropdownItem;
    onHideDropdownList: TOnHideDropdownList;
    onScrollStopDropdownList: TOnScrollStopDropdownList;
    selected_trade_type: TTradeType;
    selected_symbol: TMarketOption;
}>;

export type TInputFieldProps = React.PropsWithChildren<{
    idx?: number;
    handleChange: FormikProps<TFormValues>['handleChange'];
    onChangeInputValue: TOnChangeInputValue;
    setCurrentFocus: TSetCurrentFocus;
    field_name?: TInputsFieldNames;
    id?: string;
    label?: string;
    input_value?: TInputBaseFields;
    placeholder?: string;
    trailing_icon_message?: string;
    uniq_selected_input?: TDataFields;
    type: string;
    errors: boolean | FormikErrors<TQuickStrategyFormValues> | undefined;
    className?: string;
}>;

export type TTradeTypeOptionProps = React.PropsWithChildren<{
    trade_type: TTradeType;
}>;

export type TMarketOptionProps = React.PropsWithChildren<{
    symbol: TMarketOption;
}>;

export type TDurationFieldProps = TSelectFieldProps;
