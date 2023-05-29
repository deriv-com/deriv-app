import { FormikProps, FormikErrors } from 'formik';
import {
    TCreateStrategy,
    TDurationUnitDropdown,
    TTypeStrategiesDropdown,
    TOnChangeDropdownItem,
    TOnChangeInputValue,
    TOnHideDropdownList,
    TOnScrollStopDropdownList,
    TSymbolDropdown,
    TTradeTypeDropdown,
    TTradeType,
    TDurationOptions,
    TSetCurrentFocus,
    TTypeStrategy,
    TSetFieldValue,
    TFormValues,
    TMarketOption,
    TGetSizeDesc,
    TQuickStrategyFormValues,
    TSelectsFieldNames,
    TDropdowns,
    TSelectedValuesSelect,
    TDropdownItems,
    TInputBaseFields,
    TInputsFieldNames,
} from '../quick-strategy.types';
import { TDataUniqInput } from './data/data-uniq-input-obj';
import { TCommonInputsProperties } from './data/common-input-properties';

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
    getSizeDesc: TGetSizeDesc;
    onChangeDropdownItem: TOnChangeDropdownItem;
    onChangeInputValue: TOnChangeInputValue;
    onHideDropdownList: TOnHideDropdownList;
    onScrollStopDropdownList: TOnScrollStopDropdownList;
    setCurrentFocus: TSetCurrentFocus;
    setActiveTab: (active_tab: number) => void;
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
    values: TFormValues;
    description: string;
    errors: FormikErrors<TQuickStrategyFormValues>;
};

export type TQuickStrategyFooter = {
    is_submit_enabled: boolean;
    is_stop_button_visible: boolean;
    is_running: boolean;
    is_contract_dialog_open: boolean;
    is_stop_bot_dialog_open: boolean;
    setFieldValue: TSetFieldValue;
    submitForm: FormikProps<TFormValues>['submitForm'];
    toggleStopBotDialog: () => void;
};

export type TDropdownLists = Record<TDropdownItems, TDropdowns>;
export type TSelectedValues = Record<TDropdownItems, TSelectedValuesSelect>;

export type TSelectFieldProps = React.PropsWithChildren<{
    field_name: TSelectsFieldNames;
    id: string;
    is_mobile: boolean;
    dropdown_list: TDropdowns;
    selected_value: Partial<TSelectedValuesSelect>;
    label: string;
    select_value: TDropdownItems;
    setFieldValue: TSetFieldValue;
    className?: string;
    is_able_disabled?: boolean;
    values: TFormValues;
    onChangeDropdownItem: TOnChangeDropdownItem;
    onHideDropdownList: TOnHideDropdownList;
    onScrollStopDropdownList: TOnScrollStopDropdownList;
    selected_trade_type: TTradeType;
    selected_symbol: TMarketOption;
}>;

export type TInputFieldProps = React.PropsWithChildren<
    {
        idx?: number;
        handleChange: FormikProps<TFormValues>['handleChange'];
        onChangeInputValue: TOnChangeInputValue;
        setCurrentFocus: TSetCurrentFocus;
        is_mobile: boolean;
        field_name?: TInputsFieldNames;
        id?: string;
        label?: string;
        input_value?: TInputBaseFields;
        placeholder?: string;
        is_uniq_strategy_field?: boolean;
        trailing_icon_message?: string;
        uniq_selected_input?: TDataUniqInput;
        errors: FormikErrors<TQuickStrategyFormValues>;
    } & TCommonInputsProperties
>;

export type TTradeTypeOptionProps = React.PropsWithChildren<{
    trade_type: TTradeType;
}>;

export type TMarketOptionProps = React.PropsWithChildren<{
    symbol: TMarketOption;
}>;

type TSelectsAdditionalProps = { select_value?: TDropdownItems; field_name: TSelectsFieldNames | TInputsFieldNames };
export type TSelects = Omit<TSelectFieldProps, 'field_name' | 'select_value' | 'is_mobile'> & TSelectsAdditionalProps;

export type TInputs = Omit<TInputFieldProps, 'field_name' | 'is_mobile'> & {
    is_input_field: boolean;
    field_name: TSelectsFieldNames | TInputsFieldNames;
};

export type TDurationFields = TSelects &
    Pick<TInputs, 'handleChange' | 'onChangeInputValue' | 'setCurrentFocus' | 'errors' | 'idx'>;
