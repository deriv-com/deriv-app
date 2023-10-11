import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { Button, Icon } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import { Localize, localize } from '@deriv/translations';
import ContractResultOverlay from 'Components/contract-result-overlay';
import BotStopNotification from 'Components/dashboard/bot-stop-notification';
import { contract_stages } from 'Constants/contract-stage';
import { useDBotStore } from 'Stores/useDBotStore';

const CircularWrapper = ({ className }) => (
    <div className={classNames('circular-wrapper', className)}>
        <span className='static-circle' />
        <span className='dynamic-circle' />
    </div>
);

const ContractStageText = ({ contract_stage }) => {
    switch (contract_stage) {
        case contract_stages.NOT_RUNNING:
        default:
            return <Localize i18n_default_text='Bot is not running' />;
        case contract_stages.STARTING:
            return <Localize i18n_default_text='Bot is starting' />;
        case contract_stages.PURCHASE_SENT:
            return <Localize i18n_default_text='Buying contract' />;
        case contract_stages.PURCHASE_RECEIVED:
            return <Localize i18n_default_text='Contract bought' />;
        case contract_stages.IS_STOPPING:
            return <Localize i18n_default_text='Bot is stopping' />;
        case contract_stages.CONTRACT_CLOSED:
            return <Localize i18n_default_text='Contract closed' />;
    }
};

const TradeAnimation = observer(({ className }) => {
    const { run_panel, summary_card } = useDBotStore();
    const { client } = useStore();
    const { is_contract_completed, profit } = summary_card;
    const {
        contract_stage,
        is_stop_button_visible,
        is_stop_button_disabled,
        onRunButtonClick,
        onStopButtonClick,
        performSelfExclusionCheck,
        should_show_overlay,
        show_bot_stop_message,
    } = run_panel;
    const { account_status } = client;
    const cashier_validation = account_status?.cashier_validation;
    const [is_button_disabled, updateIsButtonDisabled] = React.useState(false);
    const is_unavailable_for_payment_agent = cashier_validation?.includes('WithdrawServiceUnavailableForPA');

    // perform self-exclusion checks which will be stored under the self-exclusion-store
    React.useEffect(() => {
        performSelfExclusionCheck();
    }, []);

    React.useEffect(() => {
        if (is_button_disabled) {
            setTimeout(() => {
                updateIsButtonDisabled(false);
            }, 1000);
        }
    }, [is_button_disabled]);

    const status_classes = ['', '', ''];
    let progress_status =
        contract_stage -
        (contract_stage === contract_stages.PURCHASE_SENT || contract_stage === contract_stages.PURCHASE_RECEIVED
            ? 2
            : 3);

    if (progress_status >= 0) {
        if (progress_status < status_classes.length) {
            status_classes[progress_status] = 'active';
        }

        if (is_contract_completed) {
            progress_status += 1;
        }

        for (let i = 0; i < progress_status; i++) {
            status_classes[i] = 'completed';
        }
    }

    return (
        <div className={classNames('animation__wrapper', className)}>
            <Button
                is_disabled={(is_stop_button_disabled || is_button_disabled) && !is_unavailable_for_payment_agent}
                className='animation__button'
                id={is_stop_button_visible ? 'db-animation__stop-button' : 'db-animation__run-button'}
                text={is_stop_button_visible ? localize('Stop') : localize('Run')}
                icon={<Icon icon={is_stop_button_visible ? 'IcBotStop' : 'IcPlay'} color='active' />}
                onClick={() => {
                    updateIsButtonDisabled(true);
                    if (is_stop_button_visible) {
                        onStopButtonClick();
                        return;
                    }
                    onRunButtonClick();
                }}
                has_effect
                {...(is_stop_button_visible || !is_unavailable_for_payment_agent ? { primary: true } : { green: true })}
            />
            {show_bot_stop_message && <BotStopNotification />}
            <div
                className={classNames('animation__container', className, {
                    'animation--running': contract_stage > 0,
                    'animation--completed': should_show_overlay && is_contract_completed,
                })}
            >
                {should_show_overlay && is_contract_completed && <ContractResultOverlay profit={profit} />}
                <span className='animation__text'>
                    <ContractStageText contract_stage={contract_stage} />
                </span>
                <div className='animation__progress'>
                    <div className='animation__progress-line'>
                        <div className={`animation__progress-bar animation__progress-${contract_stage}`} />
                    </div>
                    {status_classes.map((status_class, i) => (
                        <CircularWrapper key={i} className={status_class} />
                    ))}
                </div>
            </div>
        </div>
    );
});

TradeAnimation.propTypes = {
    className: PropTypes.string,
};

export default TradeAnimation;
