import classNames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import { Button, Icon, Popover } from '@deriv/components';
import { localize, Localize } from '@deriv/translations';
import ContractResultOverlay from './contract-result-overlay.jsx';
import { connect } from '../stores/connect';
import { contract_stages } from '../constants/contract-stage';
import '../assets/sass/trade-animation.scss';

const CircularWrapper = ({ className }) => (
    <div className={classNames('circular-wrapper', className)}>
        <span className='static-circle' />
        <span className='dynamic-circle' />
    </div>
);

const AnimationInfo = () => (
    <Popover
        className='animation__info'
        alignment='bottom'
        message={localize(
            'Stopping the bot will prevent further trades. Any ongoing trades will be completed by our system. Please be aware that some completed transactions may not be displayed in the transaction table if the bot is stopped while placing trades. You may refer to the statement page for details of all completed transactions.'
        )}
        zIndex={5}
    >
        <Icon icon='IcInfoOutline' id='db-animation__clear-stat' />
    </Popover>
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

const TradeAnimation = ({
    className,
    contract_stage,
    is_contract_completed,
    is_stop_button_visible,
    is_stop_button_disabled,
    profit,
    should_show_overlay,
    onRunButtonClick,
    onStopButtonClick,
    info_direction,
}) => {
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
            {info_direction === 'left' && <AnimationInfo />}
            <Button
                is_disabled={is_stop_button_disabled}
                className='animation__button'
                id={is_stop_button_visible ? 'db-animation__stop-button' : 'db-animation__run-button'}
                text={is_stop_button_visible ? localize('Stop') : localize('Run')}
                icon={<Icon icon={is_stop_button_visible ? 'IcPause' : 'IcPlay'} color='active' />}
                onClick={is_stop_button_visible ? onStopButtonClick : onRunButtonClick}
                has_effect
                {...(is_stop_button_visible ? { primary: true } : { green: true })}
            />
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
            {info_direction === 'right' && <AnimationInfo />}
        </div>
    );
};

TradeAnimation.propTypes = {
    className: PropTypes.string,
    contract_stage: PropTypes.number,
    is_contract_completed: PropTypes.bool,
    is_stop_button_visible: PropTypes.bool,
    is_stop_button_disabled: PropTypes.bool,
    onRunButtonClick: PropTypes.func,
    onStopButtonClick: PropTypes.func,
    profit: PropTypes.number,
    should_show_overlay: PropTypes.bool,
};

export default connect(({ run_panel, contract_card }) => ({
    contract_stage: run_panel.contract_stage,
    is_contract_completed: contract_card.is_contract_completed,
    is_stop_button_visible: run_panel.is_stop_button_visible,
    is_stop_button_disabled: run_panel.is_stop_button_disabled,
    onRunButtonClick: run_panel.onRunButtonClick,
    onStopButtonClick: run_panel.onStopButtonClick,
    profit: contract_card.profit,
    should_show_overlay: run_panel.should_show_overlay,
}))(TradeAnimation);
