import { Button } from '@deriv/components';
import { isDesktop } from '@deriv/shared';
import { localize } from '@deriv/translations';
import React from 'react';
import { TQuickStrategyFooter } from './components.types';

const QuickStrategyFooter = ({
    is_submit_enabled,
    is_running,
    setFieldValue,
    submitForm,
    setActiveTab,
    toggleStopBotDialog,
}: TQuickStrategyFooter) => {
    const handleCreateEdit = React.useCallback(() => {
        setFieldValue('button', 'edit');
        submitForm();
        setActiveTab(1);
    }, [is_submit_enabled]);

    const handleRun = React.useCallback(() => {
        setActiveTab(1);
        if (is_running) {
            toggleStopBotDialog();
            setFieldValue('button', 'edit');
            submitForm();
        } else {
            setFieldValue('button', 'run');
            submitForm();
        }
    }, [is_submit_enabled]);

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
                        onClick={handleCreateEdit}
                    />
                )}
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
