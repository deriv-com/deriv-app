import React from 'react';
import { useActiveAccount } from '@deriv/api-v2';
import { IconMarquee } from '../../../../components';
import { onboardingCryptoCardIcons } from '../../constants/icons';
import { CashierOnboardingCard } from '../CashierOnboardingCard';

type TProps = {
    setIsDeposit: React.Dispatch<React.SetStateAction<boolean>>;
};

const CashierOnboardingCryptoCard: React.FC<TProps> = ({ setIsDeposit }) => {
    const { data: activeAccount } = useActiveAccount();
    const isCrypto = Boolean(activeAccount?.currency_config?.is_crypto);
    const onClickHandler = () => {
        if (isCrypto) setIsDeposit(true);
        //TODO: replace alert with currency modal
        // eslint-disable-next-line no-alert
        else alert('Please switch to the crypto account to make a deposit');
    };

    return (
        <CashierOnboardingCard
            description='We accept the following cryptocurrencies:'
            onClick={onClickHandler}
            title='Deposit cryptocurrencies'
        >
            <IconMarquee iconHeight={45} iconWidth={72} icons={onboardingCryptoCardIcons.light} />
        </CashierOnboardingCard>
    );
};

export default CashierOnboardingCryptoCard;
