import React from 'react';
import classNames from 'classnames';
import { Form, Formik, FormikProps } from 'formik';
import { observer } from 'mobx-react';
import { Text, ThemedScrollbars } from '@deriv/components';
import { isMobile, isSafari } from '@deriv/shared';
import { useStore } from '@deriv/stores';
import { localize } from '@deriv/translations';
import { useDBotStore } from 'Stores/useDBotStore';
import { CommonSchemaFields, mergeSchema } from './data/schema-validation';
import strategies from './data/strategies-config';
import { QuickStrategyFields, QuickStrategyFooter } from '.';

const QuickStrategyForm = observer(() => {
    const { quick_strategy, run_panel } = useDBotStore();
    const { ui } = useStore();

    const {
        selected_duration_unit,
        createStrategy,
        getInitialValues,
        selected_type_strategy,
        toggleStopBotDialog,
        is_contract_dialog_open,
        is_stop_bot_dialog_open,
    } = quick_strategy;

    const { is_stop_button_visible, is_running } = run_panel;
    const { is_onscreen_keyboard_active } = ui;

    const { min, max } = selected_duration_unit;

    const getStrategyField = () => {
        return strategies[selected_type_strategy.value].fields;
    };

    const SchemaFields = mergeSchema(
        CommonSchemaFields(min, max),
        strategies[selected_type_strategy.value].validation_schema
    );

    return (
        <Formik
            initialValues={getInitialValues(getStrategyField())}
            validationSchema={SchemaFields}
            onSubmit={createStrategy}
            enableReinitialize={true}
            validateOnMount={true}
        >
            {() => {
                const is_mobile = isMobile();

                return (
                    <Form
                        className={classNames('quick-strategy__form', {
                            'quick-strategy__form--active-keyboard': is_onscreen_keyboard_active,
                        })}
                    >
                        <ThemedScrollbars autohide is_bypassed={is_mobile} className='quick-strategy__form-scrollbar'>
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

                                <QuickStrategyFields />
                            </div>
                        </ThemedScrollbars>
                        <QuickStrategyFooter
                            is_stop_button_visible={is_stop_button_visible}
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
});

export default React.memo(QuickStrategyForm);
