import React from 'react';
import classNames from 'classnames';
import { Form, Formik } from 'formik';
import { observer } from 'mobx-react';
import * as Yup from 'yup';
import { Text, ThemedScrollbars } from '@deriv/components';
import { isMobile, isSafari } from '@deriv/shared';
import { useStore } from '@deriv/stores';
import { localize } from '@deriv/translations';
import { useDBotStore } from 'Stores/useDBotStore';
import { TDataFields, TInitialValues } from '../quick-strategy.types';
import { CommonSchemaFields, mergeSchema } from './data/schema-validation';
import strategies from './data/strategies-config';
import { QuickStrategyFields, QuickStrategyFooter } from '.';

const QuickStrategyForm = observer(() => {
    const { quick_strategy, run_panel } = useDBotStore();
    const { ui } = useStore();

    const { selected_duration_unit, createStrategy, getInitialValues, selected_type_strategy, toggleStopBotDialog } =
        quick_strategy;

    const { is_running } = run_panel;
    const { is_onscreen_keyboard_active } = ui;

    const { min, max } = selected_duration_unit;

    const getStrategyField = () => {
        if (selected_type_strategy?.value)
            return strategies[selected_type_strategy.value as keyof typeof strategies].fields || [];
    };
    const SchemaFields = mergeSchema(
        CommonSchemaFields(min, max),
        selected_type_strategy.value
            ? strategies[selected_type_strategy.value as keyof typeof strategies].validation_schema
            : Yup.object().shape({})
    );

    return (
        <Formik
            initialValues={getInitialValues(getStrategyField() as TDataFields[]) as TInitialValues}
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
                        <QuickStrategyFooter is_running={is_running} toggleStopBotDialog={toggleStopBotDialog} />
                    </Form>
                );
            }}
        </Formik>
    );
});

export default React.memo(QuickStrategyForm);
