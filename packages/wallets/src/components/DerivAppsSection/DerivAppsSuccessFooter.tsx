import React from 'react';
import { useHistory } from 'react-router-dom';
import { Localize } from '@deriv-com/translations';
import { Button, useDevice } from '@deriv-com/ui';
import { useModal } from '../ModalProvider';
import './DerivAppsSuccessFooter.scss';

const DerivAppsSuccessFooter = () => {
    const { hide } = useModal();
    const { isDesktop } = useDevice();
    const history = useHistory();

    return (
        <div className='wallets-deriv-apps-success-footer'>
            <Button
                borderWidth='sm'
                color='black'
                isFullWidth={!isDesktop}
                onClick={hide}
                size='lg'
                textSize='sm'
                variant='outlined'
            >
                <Localize i18n_default_text='Maybe later' />
            </Button>
            <Button
                isFullWidth={!isDesktop}
                onClick={() => {
                    history.push('/wallet/account-transfer');
                    hide();
                }}
                size='lg'
                textSize='sm'
            >
                <Localize i18n_default_text='Transfer funds' />
            </Button>
        </div>
    );
};

export { DerivAppsSuccessFooter };
