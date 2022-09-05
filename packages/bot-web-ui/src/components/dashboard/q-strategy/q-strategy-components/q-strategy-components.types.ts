import { FormikProps } from 'formik';
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
    TGetFieldMap,
    TSetFieldValue,
    TFormValues,
} from '../q-strategy.types';

export type TQStrategyForm = {
    createStrategy: TCreateStrategy;
    duration_unit_dropdown: TDurationUnitDropdown;
    types_strategies_dropdown: TTypeStrategiesDropdown;
    // initial_errors,
    // initial_values: any;
    is_onscreen_keyboard_active: boolean;
    is_stop_button_visible: boolean;
    onChangeDropdownItem: TOnChangeDropdownItem;
    onChangeInputValue: TOnChangeInputValue;
    onHideDropdownList: TOnHideDropdownList;
    onScrollStopDropdownList: TOnScrollStopDropdownList;
    symbol_dropdown: TSymbolDropdown;
    trade_type_dropdown: TTradeTypeDropdown;
    // validateQuickStrategy,
    is_mobile: boolean;
    selected_symbol: string;
    selected_trade_type: TTradeType;
    selected_duration_unit: TDurationOptions;
    setCurrentFocus: TSetCurrentFocus;
    selected_type_strategy: TTypeStrategy;
    getFieldMap: TGetFieldMap;
    description: string;
};

export type TQStrategyFields = {
    is_mobile: boolean;
    types_strategies_dropdown: TTypeStrategiesDropdown;
    symbol_dropdown: TSymbolDropdown;
    trade_type_dropdown: TTradeTypeDropdown;
    duration_unit_dropdown: TDurationUnitDropdown;
    selected_type_strategy: TTypeStrategy;
    selected_trade_type: TTradeType;
    selected_symbol: string;
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
    getFieldMap: TGetFieldMap;
};
