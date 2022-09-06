import React from 'react';
import { ThemedScrollbars } from '@deriv/components';
import classNames from 'classnames';
import { localize } from '@deriv/translations';
import { isSafari } from '@deriv/shared';
import { Formik, Form, FormikProps } from 'formik';
import { QStrategyFooter, QStrategyFields } from '.';
import { TQuickStrategyFormValues } from '../q-strategy.types';
import { TQStrategyForm } from './q-strategy-components.types';

const QStrategyForm = ({
    createStrategy,
    duration_unit_dropdown,
    types_strategies_dropdown,
    initial_errors, //!
    initial_values, //!
    is_onscreen_keyboard_active,
    is_stop_button_visible,
    onChangeDropdownItem,
    onChangeInputValue,
    onHideDropdownList,
    onScrollStopDropdownList,
    symbol_dropdown,
    trade_type_dropdown,
    validateQuickStrategy, //!
    is_mobile,
    selected_symbol,
    selected_trade_type,
    selected_duration_unit,
    setCurrentFocus,
    selected_type_strategy,
    getFieldMap,
    description,
}: TQStrategyForm) => (
    <Formik
        initialValues={initial_values}
        validate={validateQuickStrategy} //!
        onSubmit={createStrategy}
        enableReinitialize={true}
    >
        {({
            errors,
            handleChange,
            values,
            isSubmitting,
            setFieldValue,
            touched,
            submitForm,
        }: FormikProps<TQuickStrategyFormValues>) => {
            // Check values in favour of isValid, this is a hack to persist validation through tab switching.

            // const validation_errors = validateQuickStrategy(values);
            // const is_valid = Object.keys(validation_errors).length === 0;
            const is_valid = true; //!remove later

            const is_submit_enabled = !isSubmitting && is_valid;

            return (
                <Form
                    className={classNames('quick-strategy__form', {
                        'quick-strategy__form--active-keyboard': is_onscreen_keyboard_active,
                    })}
                >
                    <ThemedScrollbars height='535px' width='700px' autohide is_bypassed={is_mobile}>
                        <div
                            className={classNames('quick-strategy__form-content', {
                                'quick-strategy__form-content--active-keyboard': is_onscreen_keyboard_active,
                                'quick-strategy__form-content--safari-fix': isSafari(),
                            })}
                        >
                            <div className='q-strategy__title'>{localize('Quick strategy')}</div>
                            <div className='q-strategy__description'>
                                {localize('Choose a template and set your trade parameters.')}
                            </div>

                            <QStrategyFields
                                is_mobile={is_mobile}
                                types_strategies_dropdown={types_strategies_dropdown}
                                symbol_dropdown={symbol_dropdown}
                                trade_type_dropdown={trade_type_dropdown}
                                duration_unit_dropdown={duration_unit_dropdown}
                                selected_type_strategy={selected_type_strategy}
                                selected_trade_type={selected_trade_type}
                                selected_symbol={selected_symbol}
                                selected_duration_unit={selected_duration_unit}
                                onChangeDropdownItem={onChangeDropdownItem}
                                onHideDropdownList={onHideDropdownList}
                                setFieldValue={setFieldValue}
                                onScrollStopDropdownList={onScrollStopDropdownList}
                                handleChange={handleChange}
                                onChangeInputValue={onChangeInputValue}
                                setCurrentFocus={setCurrentFocus}
                                values={values}
                                description={description}
                                getFieldMap={getFieldMap}
                            />
                        </div>
                    </ThemedScrollbars>
                    <QStrategyFooter
                        is_onscreen_keyboard_active={is_onscreen_keyboard_active}
                        is_mobile={is_mobile}
                        is_submit_enabled={is_submit_enabled}
                        is_stop_button_visible={is_stop_button_visible}
                        setFieldValue={setFieldValue}
                        submitForm={submitForm}
                    />
                </Form>
            );
        }}
    </Formik>
);

export default QStrategyForm;
