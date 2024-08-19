import React, { FC } from 'react';
import { LegacyArrowLeft2pxIcon } from '@deriv/quill-icons';
import { Localize } from '@deriv-com/translations';
import { Text } from '@deriv-com/ui';
import useDevice from '../../../../hooks/useDevice';
import { useDynamicLeverageModalState } from '../../components/DynamicLeverageContext';
import './DynamicLeverageTitle.scss';

export const DynamicLeverageTitle: FC = () => {
    const { isMobile } = useDevice();

    const { toggleDynamicLeverage } = useDynamicLeverageModalState();

    return (
        <div className='wallets-dynamic-leverage-screen__title'>
            <LegacyArrowLeft2pxIcon
                className='wallets-dynamic-leverage-screen__title-back'
                data-testid='back_icon'
                iconSize='xs'
                onClick={toggleDynamicLeverage}
            />
            <Text color='prominent' size={isMobile ? 'sm' : 'md'} weight='bold'>
                <Localize i18n_default_text='Get more out of Deriv MT5 Financial' />
            </Text>
        </div>
    );
};

export default DynamicLeverageTitle;
