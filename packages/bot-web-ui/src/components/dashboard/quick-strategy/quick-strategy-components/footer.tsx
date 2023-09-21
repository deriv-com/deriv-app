import React from 'react';
import { useFormikContext } from 'formik';
import { Button } from '@deriv/components';
import { isDesktop } from '@deriv/shared';
import { localize } from '@deriv/translations';
import { TInitialValues, TQuickStrategyFooter } from '../quick-strategy.types';

const QuickStrategyFooter = ({ is_running, toggleStopBotDialog }: TQuickStrategyFooter) => {
    const { submitForm, setFieldValue, errors, values, isSubmitting } = useFormikContext();

    const is_valid =
        Object.keys(errors).length === 0 &&
        !Object.values(values as TInitialValues).some(elem => (elem as string) === '');
    const is_submit_enabled = !isSubmitting && is_valid;

    const handleRunEdit = React.useCallback(
        async (mode: 'run' | 'edit') => {
            setFieldValue('button', mode);
            submitForm().then(() => {
                if (is_running) {
                    toggleStopBotDialog();
                }
            });
        },
        [is_submit_enabled]
    );

    return (
        <div className={'quick-strategy__form-footer'}>
            <Button.Group>
                {isDesktop() && (
                    <Button
                        type='button'
                        id='db-quick-strategy__button-edit'
                        text={localize('Edit')}
                        is_disabled={!is_submit_enabled}
                        secondary
                        large
                        onClick={() => handleRunEdit('edit')}
                    />
                )}
                <Button
                    type='button'
                    id='db-quick-strategy__button-run'
                    text={localize('Run')}
                    is_disabled={!is_submit_enabled}
                    primary
                    large
                    onClick={() => handleRunEdit('run')}
                />
            </Button.Group>
        </div>
    );
};

export default React.memo(QuickStrategyFooter);
