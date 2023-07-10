import React, { useState, useEffect } from 'react';
import { translate } from '@i18n';
import { observer as globalObserver } from '../../../common/utils/observer';
import { showDialog } from '../../bot/tools';

const ClearButton = () => {
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);

    useEffect(() => {
        const enableClear = () => setIsButtonDisabled(false);
        const disableClear = () => setIsButtonDisabled(true);
        const disableButtonOnBotRunning = () => setIsButtonDisabled(true);

        globalObserver.register('summary.enable_clear', enableClear);
        globalObserver.register('summary.disable_clear', disableClear);
        globalObserver.register('bot.running', disableButtonOnBotRunning);

        return () => {
            globalObserver.unregister('summary.enable_clear', enableClear);
            globalObserver.unregister('summary.disable_clear', disableClear);
            globalObserver.unregister('bot.running', disableButtonOnBotRunning);
        };
    }, []);

    const confirmClearLog = () => {
        showDialog({
            title: translate('Are you sure?'),
            text: [
                translate(
                    'This will clear all transactions in the summary panel, and all counters will be reset to zero.'
                ),
            ],
        })
            .then(() => globalObserver.emit('summary.clear'))
            .catch(() => {});
    };

    return (
        <button
            title='Clear summary log'
            id='summaryClearButton'
            className='toolbox-button icon-clear'
            onClick={confirmClearLog}
            disabled={isButtonDisabled}
        />
    );
};

export default ClearButton;
