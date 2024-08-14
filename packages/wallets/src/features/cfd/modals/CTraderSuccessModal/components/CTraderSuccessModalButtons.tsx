import React from 'react';
import { useHistory } from 'react-router-dom';
import { Localize } from '@deriv-com/translations';
import { Button } from '@deriv-com/ui';
import { WalletButtonGroup } from '../../../../../components';
import useDevice from '../../../../../hooks/useDevice';
import { THooks } from '../../../../../types';

type TCTraderSuccessModalButtons = {
    createdAccount?: THooks.CreateOtherCFDAccount;
    hide: () => void;
    isDemo: boolean;
};

const CTraderSuccessModalButtons = ({ createdAccount, hide, isDemo }: TCTraderSuccessModalButtons) => {
    const history = useHistory();
    const { isDesktop } = useDevice();

    if (isDemo) {
        return (
            <div className='wallets-success-btn'>
                <Button isFullWidth onClick={hide} size={isDesktop ? 'md' : 'lg'}>
                    <Localize i18n_default_text='OK' />
                </Button>
            </div>
        );
    }

    return (
        <WalletButtonGroup isFlex isFullWidth>
            <Button color='black' onClick={hide} size={isDesktop ? 'md' : 'lg'} variant='outlined'>
                <Localize i18n_default_text='Maybe later' />
            </Button>
            <Button
                onClick={() => {
                    hide();
                    history.push('/wallet/account-transfer', { toAccountLoginId: createdAccount?.account_id });
                }}
                size={isDesktop ? 'md' : 'lg'}
            >
                <Localize i18n_default_text='Transfer funds' />
            </Button>
        </WalletButtonGroup>
    );
};

export default CTraderSuccessModalButtons;
