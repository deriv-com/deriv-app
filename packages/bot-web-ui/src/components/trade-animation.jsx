import classNames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import { Button, Icon, Popover } from '@deriv/components';
import { localize } from '@deriv/translations';
import ContractResultOverlay from './contract-result-overlay.jsx';
import { connect } from '../stores/connect';
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
    const { index, text } = contract_stage;
    const status_classes = ['', '', ''];
    let progress_status = index - (index === 2 || index === 3 ? 2 : 3);

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
                className={classNames('animation__container', {
                    'animation--running': index > 0,
                })}
            >
                {should_show_overlay && is_contract_completed && (
                    <ContractResultOverlay profit={profit} className='animation__overlay' />
                )}
                <span className='animation__text'>{text}</span>
                <div className='animation__progress'>
                    <div className='animation__progress-line'>
                        <div className={`animation__progress-bar animation__progress-${index}`} />
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
    contract_stage: PropTypes.object,
    is_contract_completed: PropTypes.bool,
    is_stop_button_visible: PropTypes.bool,
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
