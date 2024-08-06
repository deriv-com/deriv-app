import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { useDevice } from '@deriv-com/ui';
import { localize, Localize } from '@deriv/translations';
import { Div100vhContainer, Icon, Button, Text } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import { EXPERIAN, getExperianResult } from './helpers/constants';
import './new-status-dialog-container.scss';

const StatusIcon = ({ icon, color }) => (
    <Icon className='status-container__body-status-icon' icon={icon} color={color} size={32} />
);

const NewStatusDialogContainer = observer(({ closeModal, currency }) => {
    const { isDesktop } = useDevice();
    const { client, ui } = useStore();
    const { landing_company_shortcode } = client;
    const { setShouldShowOneTimeDepositModal } = ui;

    const onOpenDepositModal = () => {
        closeModal();
        setShouldShowOneTimeDepositModal(true);
    };

    /**
     * Get the status for the current account
     *
     * @readonly
     * @return {EXPERIAN} status
     */
    const getStatus = () =>
        getExperianResult({
            landing_company_shortcode,
        });

    return (
        <Div100vhContainer className='status-container' is_disabled={isDesktop} height_offset='40px'>
            {isDesktop && (
                <div onClick={closeModal} className='status-container__header'>
                    <Icon icon='IcCross' />
                </div>
            )}

            <div className='status-container__body'>
                <div className='status-container__body-icon'>
                    <Icon icon={`IcCurrency-${currency.toLowerCase()}`} size={96} />
                    {getStatus() === EXPERIAN.SUCCESS && <StatusIcon icon='IcCheckmarkCircle' color='green' />}
                    {getStatus() === EXPERIAN.WARN && <StatusIcon icon='IcAlertDanger' />}
                    {getStatus() === EXPERIAN.DANGER && <StatusIcon icon='IcCrossCircle' color='red' />}
                </div>

                <Text
                    className='status-container__body-text'
                    as='h2'
                    align='center'
                    weight='bold'
                    size='s'
                    line_height='m'
                >
                    <Localize i18n_default_text='Deposit now to start trading' />
                </Text>

                <Text as='p' align='center' size='xs' line_height='sm'>
                    <Localize i18n_default_text='Your {{ currency }} account is ready.' values={{ currency }} />
                </Text>
            </div>

            <div className='status-container__footer'>
                {getStatus() !== EXPERIAN.PENDING && (
                    <Button secondary text={localize('Maybe later')} wide={!isDesktop} onClick={closeModal} />
                )}
                <Button
                    className='status-container__button'
                    primary
                    text={localize('Deposit')}
                    onClick={onOpenDepositModal}
                    wide={!isDesktop}
                />
            </div>
        </Div100vhContainer>
    );
});

NewStatusDialogContainer.propTypes = {
    closeModal: PropTypes.func,
    currency: PropTypes.string,
    closeModalAndOpenDeposit: PropTypes.func,
};

export default withRouter(NewStatusDialogContainer);
