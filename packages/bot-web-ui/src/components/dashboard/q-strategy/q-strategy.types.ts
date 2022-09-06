import React from 'react';
import { FormikHelpers as FormikActions } from 'formik';

export type TQuickStrategyFormValues = { button: 'run' | 'edit' };

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

export type TMarketOption = {
    group: string;
    text: string;
    value: string;
};

export type TTradeTypeDropdown = Array<TTradeType>;

export type TDropdownItems = 'symbol' | 'trade-type' | 'duration-unit' | 'type-strategy';

export type TInputUniqFields = 'input_martingale_size' | 'input_alembert_unit' | 'input_oscar_unit';
export type TInputBaseFields = 'input_duration_value' | 'input_stake' | 'input_loss' | 'input_profit';
type TInputCommonFields = TInputBaseFields | TInputUniqFields;

export type TSetFieldValue = (element: 'button', action: 'run' | 'edit') => void;

export type TSelectsFieldNames =
    | 'quick-strategy__types-strategies'
    | 'quick-strategy__symbol'
    | 'quick-strategy__trade-type'
    | 'quick-strategy__duration-unit';

export type TInputsFieldNames =
    | 'quick-strategy__duration-value'
    | 'quick-strategy__stake'
    | 'quick-strategy__loss'
    | 'quick-strategy__profit';

export type TSymbolDropdownValue = 'group' | 'text' | 'value';

// export type TSymbolDropdown = Record<TSymbolDropdownValue, string[]>;
export type TSymbolItem = Record<TSymbolDropdownValue, string>;
export type TSymbolDropdown = Array<TSymbolItem>;

export type TDurationUnitDropdown = Array<TDurationOptions>;

export type TTypeStrategiesDropdown = Array<TTypeStrategy>;

export type TDropdowns =
    | TSymbolDropdown
    | TTradeTypeDropdown
    | TDurationUnitDropdown
    | TTypeStrategiesDropdown
    | string;

export type TSelectedValuesSelect = TTypeStrategy | TTradeType | TDurationOptions | TMarketOption | string;

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

type TInitialUniqKeys = 'martingale__size' | 'alembert-unit' | 'oscar-unit';

type TInitialKeys = TSelectsFieldNames | TInputsFieldNames | TInitialUniqKeys;

export type TInitialValues = Record<TInitialKeys, string>;

export type TGetSizeDesc = (index: number) => string;

export type TFormValues = { [key: string]: string };

export type TOnChangeInputValue = (field: TInputCommonFields, event: React.ChangeEvent<HTMLInputElement>) => void;
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
export type TGetFieldMap = (type: TDropdownItems) => TFieldMapData;

export type TQuickStrategyProps = {
    active_index: number;
    description: string;
    createStrategy: TCreateStrategy;
    duration_unit_dropdown: TDurationUnitDropdown;
    types_strategies_dropdown: TTypeStrategiesDropdown;
    getSizeDesc: TGetSizeDesc;
    initial_values: TQuickStrategyFormValues | (TQuickStrategyFormValues & TInitialValues);
    is_onscreen_keyboard_active: boolean;
    is_mobile: boolean;
    is_stop_button_visible: boolean;
    is_strategy_modal_open: boolean;
    onChangeDropdownItem: TOnChangeDropdownItem;
    onChangeInputValue: TOnChangeInputValue;
    onHideDropdownList: TOnHideDropdownList;
    onScrollStopDropdownList: TOnScrollStopDropdownList;
    setActiveTypeStrategyIndex: (index: number) => void;
    selected_symbol: TMarketOption;
    selected_trade_type: TTradeType;
    selected_duration_unit: TDurationOptions;
    selected_type_strategy: TTypeStrategy;
    symbol_dropdown: TSymbolDropdown;
    toggleStrategyModal: () => void;
    trade_type_dropdown: TTradeTypeDropdown;
    setCurrentFocus: TSetCurrentFocus;
    getFieldMap: TGetFieldMap;
};
