import { ThemedScrollbars, Text } from '@deriv/components';
import { isSafari } from '@deriv/shared';
import { localize } from '@deriv/translations';
import classNames from 'classnames';
import { Form, Formik, FormikProps } from 'formik';
import React from 'react';
import * as Yup from 'yup';
import { QuickStrategyFields, QuickStrategyFooter } from '.';
import { TQuickStrategyFormValues } from '../quick-strategy.types';
import { TQuickStrategyForm } from './components.types';

const QuickStrategyForm = ({
    createStrategy,
    duration_unit_dropdown,
    types_strategies_dropdown,
    initial_values,
    is_onscreen_keyboard_active,
    is_stop_button_visible,
    onChangeDropdownItem,
    onChangeInputValue,
    onHideDropdownList,
    onScrollStopDropdownList,
    symbol_dropdown,
    trade_type_dropdown,
    is_mobile,
    selected_symbol,
    selected_trade_type,
    selected_duration_unit,
    setCurrentFocus,
    selected_type_strategy,
    description,
    setActiveTab,
}: TQuickStrategyForm) => {
    const { min, max } = selected_duration_unit;

    const setDefaultValidationNumber = () =>
        Yup.number()
            .typeError(localize('Should be a number'))
            .round('ceil')
            .min(1, localize('Must be a number higher than 0'));

    const SchemaFields = Yup.object().shape({
        'quick-strategy__duration-value': Yup.number()
            .typeError(localize('Should be a number'))
            .required(localize('Field cannot be empty'))
            .min(min, localize('Minimum duration: {{ min }}', { min }))
            .max(max, localize('Maximum duration: {{ max }}', { max })),

        'quick-strategy__stake': setDefaultValidationNumber(),
        'quick-strategy__loss': setDefaultValidationNumber(),
        'martingale-size': setDefaultValidationNumber().min(3, localize('Must be a number higher than 2')),
        'alembert-unit': setDefaultValidationNumber(),
        'oscar-unit': setDefaultValidationNumber(),
        'quick-strategy__profit': setDefaultValidationNumber(),
    });
    return (
        <Formik
            initialValues={initial_values}
            validationSchema={SchemaFields}
            onSubmit={createStrategy}
            enableReinitialize={true}
            validateOnMount={true}
        >
            {({
                errors,
                handleChange,
                values,
                isSubmitting,
                setFieldValue,
                submitForm,
            }: FormikProps<TQuickStrategyFormValues>) => {
                const is_valid =
                    Object.keys(errors).length === 0 && !Object.values(values).some(elem => (elem as string) === '');
                const is_submit_enabled = !isSubmitting && is_valid;

                return (
                    <Form
                        className={classNames('quick-strategy__form', {
                            'quick-strategy__form--active-keyboard': is_onscreen_keyboard_active,
                        })}
                    >
                        <ThemedScrollbars height='calc(100vh - 23.9rem)' autohide is_bypassed={is_mobile}>
                            <div
                                className={classNames('quick-strategy__form-content', {
                                    'quick-strategy__form-content--active-keyboard': is_onscreen_keyboard_active,
                                    'quick-strategy__form-content--safari-fix': isSafari(),
                                })}
                            >
                                <div className='quick-strategy__text'>
                                    <Text size={is_mobile ? 's' : 'sm'} weight='bold' line_height='s'>
                                        {localize('Quick strategy')}
                                    </Text>
                                </div>
                                <div className='quick-strategy__text'>
                                    <Text size={is_mobile ? 'xxs' : 's'}>
                                        {localize('Choose a template and set your trade parameters.')}
                                    </Text>
                                </div>

                                <QuickStrategyFields
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
                                    errors={errors}
                                />
                            </div>
                        </ThemedScrollbars>
                        <QuickStrategyFooter
                            is_onscreen_keyboard_active={is_onscreen_keyboard_active}
                            is_submit_enabled={is_submit_enabled}
                            is_stop_button_visible={is_stop_button_visible}
                            setFieldValue={setFieldValue}
                            submitForm={submitForm}
                            setActiveTab={setActiveTab}
                        />
                    </Form>
                );
            }}
        </Formik>
    );
};

export default React.memo(QuickStrategyForm);
