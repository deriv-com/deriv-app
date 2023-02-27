import React from 'react';
import { Button } from '@deriv/components';
import classNames from 'classnames';
import { localize } from '@deriv/translations';
import { TQuickStrategyFooter } from './components.types';

const QuickStrategyFooter = ({
    is_onscreen_keyboard_active,
    is_submit_enabled,
    is_stop_button_visible,
    is_dialog_open,
    setFieldValue,
    submitForm,
    setActiveTab,
    toggleStopBotDialog,
    is_contract_dialog_open,
    is_stop_bot_dialog_open,
}: TQuickStrategyFooter) => {
    const handleCreateEdit = React.useCallback(() => {
        setFieldValue('button', 'edit');
        submitForm();
        setActiveTab(1);
    }, [is_submit_enabled]);

    const handleRun = React.useCallback(() => {
        setActiveTab(1);
        if (!is_dialog_open) {
            toggleStopBotDialog();
        } else {
            setFieldValue('button', 'run');
            submitForm();
        }
    }, [is_submit_enabled]);

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
                    text={localize('Create and edit')}
                    secondary
                    large
                    onClick={handleCreateEdit}
                />
                <Button
                    type='button'
                    id='db-quick-strategy__button-run'
                    text={localize('Run')}
                    primary
                    large
                    onClick={handleRun}
                />
            </Button.Group>
        </div>
    );
};

export default React.memo(QuickStrategyFooter);
