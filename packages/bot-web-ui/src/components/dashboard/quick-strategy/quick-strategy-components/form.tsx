import { ThemedScrollbars, Text } from '@deriv/components';
import { isSafari, isMobile } from '@deriv/shared';
import { localize } from '@deriv/translations';
import classNames from 'classnames';
import { Form, Formik, FormikProps } from 'formik';
import React from 'react';
import * as Yup from 'yup';
import { QuickStrategyFields, QuickStrategyFooter } from '.';
import { TQuickStrategyFormValues } from '../quick-strategy.types';
import { TQuickStrategyForm } from './components.types';

const QuickStrategyForm = ({
    duration_unit_dropdown,
    types_strategies_dropdown,
    initial_values,
    is_onscreen_keyboard_active,
    is_stop_button_visible,
    symbol_dropdown,
    trade_type_dropdown,
    selected_symbol,
    selected_trade_type,
    selected_duration_unit,
    selected_type_strategy,
    description,
    is_contract_dialog_open,
    is_stop_bot_dialog_open,
    is_running,
    createStrategy,
    onChangeDropdownItem,
    onChangeInputValue,
    onHideDropdownList,
    onScrollStopDropdownList,
    setCurrentFocus,
    toggleStopBotDialog,
}: TQuickStrategyForm) => {
    const { min, max } = selected_duration_unit;

    const setDefaultValidationNumber = () =>
        Yup.number()
            .typeError(localize('Must be a number'))
            .round('ceil')
            .min(1, localize('Must be a number higher than 0'));

    const SchemaFields = Yup.object().shape({
        'quick-strategy__duration-value': Yup.number()
            .typeError(localize('Must be a number'))
            .required(localize('Field cannot be empty'))
            .min(min, localize('Minimum duration: {{ min }}', { min }))
            .max(max, localize('Maximum duration: {{ max }}', { max })),
        'quick-strategy__stake': setDefaultValidationNumber(),
        'quick-strategy__loss': setDefaultValidationNumber(),
        'martingale-size': Yup.number()
            .typeError(localize('Must be a number'))
            .round('floor')
            .min(2, localize('The value must be equal to or greater than 2.')),
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
                const is_mobile = isMobile();

                return (
                    <Form
                        className={classNames('quick-strategy__form', {
                            'quick-strategy__form--active-keyboard': is_onscreen_keyboard_active,
                        })}
                    >
                        <ThemedScrollbars height='calc(100vh - 24rem)' autohide is_bypassed={is_mobile}>
                            <div
                                className={classNames('quick-strategy__form-content', {
                                    'quick-strategy__form-content--active-keyboard': is_onscreen_keyboard_active,
                                    'quick-strategy__form-content--safari-fix': isSafari(),
                                })}
                            >
                                <div className={classNames('quick-strategy__text', 'quick-strategy__text--margin')}>
                                    <Text weight='normal' size={is_mobile ? 'xxs' : 's'}>
                                        {localize('Choose a template and set your trade parameters.')}
                                    </Text>
                                </div>

                                <QuickStrategyFields
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
                            is_submit_enabled={is_submit_enabled}
                            is_stop_button_visible={is_stop_button_visible}
                            setFieldValue={setFieldValue}
                            submitForm={submitForm}
                            is_running={is_running}
                            is_contract_dialog_open={is_contract_dialog_open}
                            toggleStopBotDialog={toggleStopBotDialog}
                            is_stop_bot_dialog_open={is_stop_bot_dialog_open}
                        />
                    </Form>
                );
            }}
        </Formik>
    );
};

export default React.memo(QuickStrategyForm);
