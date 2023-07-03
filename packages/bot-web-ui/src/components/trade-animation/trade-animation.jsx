import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { Button, Icon, Modal, Text } from '@deriv/components';
import { isMobile } from '@deriv/shared';
import { Localize, localize } from '@deriv/translations';
import ContractResultOverlay from 'Components/contract-result-overlay';
import { contract_stages } from 'Constants/contract-stage';
import { connect } from 'Stores/connect';

const CircularWrapper = ({ className }) => (
    <div className={classNames('circular-wrapper', className)}>
        <span className='static-circle' />
        <span className='dynamic-circle' />
    </div>
);

const AnimationInfo = ({ toggleAnimationInfoModal }) => {
    return (
        <div className='animation__info' onClick={toggleAnimationInfoModal}>
            <Icon icon='IcInfoOutline' id='db-animation__clear-stat' />
        </div>
    );
};

const AnimationInfoModal = ({ is_mobile, is_animation_info_modal_open, toggleAnimationInfoModal }) => {
    return (
        <Modal
            className={classNames('animation__modal', { 'animation__modal--mobile': is_mobile })}
            title={localize('Stopping the bot is risky')}
            is_open={is_animation_info_modal_open}
            toggleModal={toggleAnimationInfoModal}
            width={'440px'}
        >
            <Modal.Body>
                <div className={classNames({ 'animation__modal-body--mobile': is_mobile })}>
                    <Text as='p'>
                        {localize(
                            'Stopping the bot will prevent further trades. Any ongoing trades will be completed by our system.'
                        )}
                    </Text>
                    <Text as='p' className='animation__modal-body--content'>
                        {localize(
                            'Please be aware that some completed transactions may not be displayed in the transaction table if the bot is stopped while placing trades.'
                        )}
                    </Text>
                    <Text as='p' className='animation__modal-body--content'>
                        {localize('You may refer to the statement page for details of all completed transactions.')}
                    </Text>
                </div>
            </Modal.Body>
        </Modal>
    );
};

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
    is_animation_info_modal_open,
    is_contract_completed,
    is_stop_button_visible,
    is_stop_button_disabled,
    profit,
    should_show_overlay,
    onRunButtonClick,
    onStopButtonClick,
    info_direction,
    toggleAnimationInfoModal,
    cashier_validation,
    performSelfExclusionCheck,
}) => {
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
            {info_direction === 'left' && <AnimationInfo toggleAnimationInfoModal={toggleAnimationInfoModal} />}
            <Button
                is_disabled={(is_stop_button_disabled || is_button_disabled) && !is_unavailable_for_payment_agent}
                className='animation__button'
                id={is_stop_button_visible ? 'db-animation__stop-button' : 'db-animation__run-button'}
                text={is_stop_button_visible ? localize('Stop') : localize('Run')}
                icon={<Icon icon={is_stop_button_visible ? 'IcPause' : 'IcPlay'} color='active' />}
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
            {info_direction === 'right' && <AnimationInfo toggleAnimationInfoModal={toggleAnimationInfoModal} />}
            <AnimationInfoModal
                is_mobile={isMobile()}
                is_animation_info_modal_open={is_animation_info_modal_open}
                toggleAnimationInfoModal={toggleAnimationInfoModal}
            />
        </div>
    );
};

TradeAnimation.propTypes = {
    className: PropTypes.string,
    contract_stage: PropTypes.number,
    is_animation_info_modal_open: PropTypes.bool,
    is_contract_completed: PropTypes.bool,
    is_stop_button_visible: PropTypes.bool,
    is_stop_button_disabled: PropTypes.bool,
    onRunButtonClick: PropTypes.func,
    onStopButtonClick: PropTypes.func,
    performSelfExclusionCheck: PropTypes.func,
    profit: PropTypes.number,
    should_show_overlay: PropTypes.bool,
};

export default connect(({ summary_card, run_panel, toolbar, client }) => ({
    contract_stage: run_panel.contract_stage,
    is_animation_info_modal_open: toolbar.is_animation_info_modal_open,
    is_contract_completed: summary_card.is_contract_completed,
    is_stop_button_visible: run_panel.is_stop_button_visible,
    is_stop_button_disabled: run_panel.is_stop_button_disabled,
    onRunButtonClick: run_panel.onRunButtonClick,
    onStopButtonClick: run_panel.onStopButtonClick,
    performSelfExclusionCheck: run_panel.performSelfExclusionCheck,
    profit: summary_card.profit,
    should_show_overlay: run_panel.should_show_overlay,
    toggleAnimationInfoModal: toolbar.toggleAnimationInfoModal,
    cashier_validation: client.account_status.cashier_validation,
}))(TradeAnimation);
