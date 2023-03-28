import React from 'react';
import { Button } from '@deriv/components';
import classNames from 'classnames';
import { localize } from '@deriv/translations';
import { TQuickStrategyFooter } from './components.types';

const QuickStrategyFooter = ({
    is_onscreen_keyboard_active,
    is_submit_enabled,
    is_running,
    setFieldValue,
    submitForm,
    toggleStopBotDialog,
}: TQuickStrategyFooter) => {
    const handleCreateEdit = React.useCallback(() => {
        setFieldValue('button', 'edit');
        submitForm();
    }, [is_submit_enabled]);

    const handleRun = React.useCallback(() => {
        if (is_running) {
            setFieldValue('button', 'edit');
            submitForm();
            toggleStopBotDialog();
        } else {
            setFieldValue('button', 'run');
            submitForm();
        }
    }, [is_submit_enabled, setFieldValue, submitForm]);

    return (
        <div
            className={classNames('quick-strategy__form-footer', {
                'quick-strategy__form-footer--active-keyboard': is_onscreen_keyboard_active,
            })}
        >
            <Button.Group>
                <Button
                    type='button'
                    id='db-quick-strategy__button-edit'
                    text={localize('Edit')}
                    is_disabled={!is_submit_enabled}
                    secondary
                    large
                    onClick={handleCreateEdit}
                />
                <Button
                    type='button'
                    id='db-quick-strategy__button-run'
                    text={localize('Run')}
                    is_disabled={!is_submit_enabled}
                    primary
                    large
                    onClick={handleRun}
                />
            </Button.Group>
        </div>
    );
};

export default React.memo(QuickStrategyFooter);
