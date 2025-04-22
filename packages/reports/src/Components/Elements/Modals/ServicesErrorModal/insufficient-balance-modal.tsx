import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Button, Modal } from '@deriv/components';
import { routes } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { localize } from '@deriv/translations';
import { useIsHubRedirectionEnabled } from '@deriv/hooks';

type TInsufficientBalanceModal = RouteComponentProps & {
    is_virtual?: boolean;
    is_visible: boolean;
    message: string;
    toggleModal: () => void;
};

const InsufficientBalanceModal = observer(
    ({ history, is_virtual, is_visible, message, toggleModal }: TInsufficientBalanceModal) => {
        const {
            ui: { is_mobile },
            client,
        } = useStore();
        const { isHubRedirectionEnabled } = useIsHubRedirectionEnabled();
        const { has_wallet } = client;
        return (
            <Modal
                id='dt_insufficient_balance_modal'
                is_open={is_visible}
                small
                is_vertical_centered={is_mobile}
                toggleModal={toggleModal}
                title={localize('Insufficient balance')}
            >
                <Modal.Body>{message}</Modal.Body>
                <Modal.Footer>
                    <Button
                        has_effect
                        text={is_virtual ? localize('OK') : localize('Deposit now')}
                        onClick={() => {
                            if (!is_virtual) {
                                if (isHubRedirectionEnabled) {
                                    const PRODUCTION_REDIRECT_URL = 'https://hub.deriv.com/tradershub';
                                    const STAGING_REDIRECT_URL = 'https://staging-hub.deriv.com/tradershub';
                                    const redirectUrl =
                                        process.env.NODE_ENV === 'production'
                                            ? PRODUCTION_REDIRECT_URL
                                            : STAGING_REDIRECT_URL;
                                    window.location.href = `${redirectUrl}/redirect?action=redirect_to&redirect_to=wallet`;
                                } else {
                                    history?.push?.(has_wallet ? routes.wallets_deposit : routes.cashier_deposit);
                                }
                            } else {
                                toggleModal();
                            }
                        }}
                        primary
                    />
                </Modal.Footer>
            </Modal>
        );
    }
);

export default withRouter(InsufficientBalanceModal);
