import React from 'react';
import { useSelector } from 'react-redux';
import { translate } from '@i18n';
import { observer as globalObserver } from '@utilities/observer';
import { showDialog } from '../../../blockly/bot/tools';

const ClearButton = () => {
    const { is_bot_running } = useSelector(state => state.ui);
    const [is_button_disabled, setIsButtonDisabled] = React.useState(true);

    const isRunning = globalObserver.getState('isRunning');

    React.useEffect(() => {
        globalObserver.register('summary.enable_clear', () => setIsButtonDisabled(false));
        globalObserver.register('summary.disable_clear', () => setIsButtonDisabled(true));
        globalObserver.register('bot.running', () => setIsButtonDisabled(true));
    }, []);

    React.useEffect(() => {
        if (!is_bot_running && !isRunning) {
            setIsButtonDisabled(false);
        }
    }, [is_bot_running, isRunning]);

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
            title={translate('Clear summary log')}
            id='summaryClearButton'
            className='toolbox-button icon-clear'
            onClick={confirmClearLog}
            disabled={is_button_disabled}
        />
    );
};

export default ClearButton;
