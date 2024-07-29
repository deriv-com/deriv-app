import React, { FC } from 'react';
import { LegacyArrowLeft2pxIcon } from '@deriv/quill-icons';
import { useDevice } from '@deriv-com/ui';
import { WalletText } from '../../../../components';
import { useDynamicLeverageModalState } from '../../components/DynamicLeverageContext';
import './DynamicLeverageTitle.scss';

export const DynamicLeverageTitle: FC = () => {
    const { isDesktop } = useDevice();

    const { toggleDynamicLeverage } = useDynamicLeverageModalState();

    return (
        <div className='wallets-dynamic-leverage-screen__title'>
            <LegacyArrowLeft2pxIcon
                className='wallets-dynamic-leverage-screen__title-back'
                data-testid='back_icon'
                iconSize='xs'
                onClick={toggleDynamicLeverage}
            />
            <WalletText color='prominent' size={isDesktop ? 'md' : 'sm'} weight='bold'>
                Get more out of Deriv MT5 Financial
            </WalletText>
        </div>
    );
};

export default DynamicLeverageTitle;
