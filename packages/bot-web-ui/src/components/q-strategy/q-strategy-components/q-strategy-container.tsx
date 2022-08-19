import React, { useEffect } from 'react';
import {
    Autocomplete,
    SelectNative,
    Button,
    Icon,
    Input,
    Modal,
    Popover,
    Tabs,
    IconTradeTypes,
    ThemedScrollbars,
    MobileFullPageModal,
    Text,
} from '@deriv/components';
import classNames from 'classnames';
import { localize } from '@deriv/translations';
import { isSafari } from '@deriv/shared';
import { Formik, Form, Field } from 'formik';
import { config } from '@deriv/bot-skeleton';
import { popover_zindex } from 'Constants/z-indexes';
import { connect } from 'Stores/connect';
import RootStore from 'Stores/index';
import { TQuickStrategyProps } from '../q-strategy.types';

const QStrategyContainer = (props: TQuickStrategyProps) => {
    const { strategies } = config;
    const {
        setActiveTabIndex,
        symbol_dropdown,
        trade_type_dropdown,
        active_index,
        createStrategy,
        duration_unit_dropdown,
        getSizeDesc,
        getSizeText,
        initial_errors,
        initial_values,
        is_onscreen_keyboard_active,
        is_mobile,
        is_stop_button_visible,
        onChangeDropdownItem,
        onChangeInputValue,
        onHideDropdownList,
        onScrollStopDropdownList,
        validateQuickStrategy,
        selected_symbol,
        selected_trade_type,
        setCurrentFocus,
        selected_duration_unit,
    } = props;

    return (
        <>
            <Autocomplete
                // {...field}
                // {active_index}
                autoComplete='off'
                // className='quick-strategy__dropdown quick-strategy__leading'
                type='text'
                label={localize('Asset')}
                list_items={symbol_dropdown}
                onHideDropdownList={() => {
                    // onHideDropdownList('symbol', values[field.name], setFieldValue);
                }}
                onItemSelection={({ value }) => {
                    // onChangeDropdownItem('symbol', value, setFieldValue);
                }}
                onScrollStop={() => onScrollStopDropdownList('symbol')}
                leading_icon={selected_symbol.value && <Icon icon={`IcUnderlying${selected_symbol.value}`} size={24} />}
            />

            {/* <Tabs active_index={active_index} onTabItemClick={setActiveTabIndex} top> */}
            <div>
                {Object.keys(strategies).map(key => {
                    const { index, label, description } = strategies[key];
                    return (
                        <div key={index} label={label}>
                            <p>QuickStrategyForm</p>
                        </div>
                    );
                })}
            </div>
        </>
    );
};

export default QStrategyContainer;
