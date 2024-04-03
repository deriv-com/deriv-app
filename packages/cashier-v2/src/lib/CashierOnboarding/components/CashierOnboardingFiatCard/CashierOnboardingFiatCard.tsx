import React from 'react';
import { useActiveAccount } from '@deriv/api-v2';
import { onboardingFiatCardIcons } from '../../constants/icons';
import { CashierOnboardingCard } from '../CashierOnboardingCard';
import { CashierOnboardingIconMarquee } from '../CashierOnboardingIconMarquee';

type TProps = {
    setIsDeposit: React.Dispatch<React.SetStateAction<boolean>>;
};

const CashierOnboardingFiatCard: React.FC<TProps> = ({ setIsDeposit }) => {
    const { data: activeAccount } = useActiveAccount();
    const isFiat = Boolean(activeAccount?.currency_config?.is_fiat);
    const onClickHandler = () => {
        if (isFiat) setIsDeposit(true);
        //TODO: replace alert with currency modal
        // eslint-disable-next-line no-alert
        else alert('Please switch to the fiat account to make a deposit');
    };
    return (
        <CashierOnboardingCard
            description='Deposit via the following payment methods:'
            onClick={onClickHandler}
            title='Deposit via bank wire, credit card, and e-wallet'
        >
            <CashierOnboardingIconMarquee icons={onboardingFiatCardIcons.light} />
        </CashierOnboardingCard>
    );
};

export default CashierOnboardingFiatCard;
