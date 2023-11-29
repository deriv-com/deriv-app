import React, { FC } from 'react';
import { WalletText } from '../../../../components';
import useDevice from '../../../../hooks/useDevice';
import BackArrow from '../../../../public/images/ic-back-arrow.svg';
import { useDynamicLeverageModalState } from '../../components/DynamicLeverageContext';
import './DynamicLeverageTitle.scss';

export const DynamicLeverageTitle: FC = () => {
    const { isMobile } = useDevice();

    const { toggleDynamicLeverage } = useDynamicLeverageModalState();

    return (
        <div className='wallets-dynamic-leverage-screen__title'>
            <BackArrow
                className='wallets-dynamic-leverage-screen__title-back'
                data-testid='back_icon'
                onClick={toggleDynamicLeverage}
            />
            <WalletText color='prominent' size={isMobile ? 'sm' : 'md'} weight='bold'>
                Get more out of Deriv MT5 Financial
            </WalletText>
        </div>
    );
};

export default DynamicLeverageTitle;
