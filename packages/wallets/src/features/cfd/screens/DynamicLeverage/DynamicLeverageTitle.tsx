import React, { FC } from 'react';
import { LegacyArrowLeft2pxIcon } from '@deriv/quill-icons';
import { Localize } from '@deriv-com/translations';
import { Text, useDevice } from '@deriv-com/ui';
import { useDynamicLeverageModalState } from '../../components/DynamicLeverageContext';
import './DynamicLeverageTitle.scss';

export const DynamicLeverageTitle: FC = () => {
    const { isDesktop } = useDevice();

    const { toggleDynamicLeverage } = useDynamicLeverageModalState();

    return (
        <div className='wallets-dynamic-leverage-screen__title'>
            <LegacyArrowLeft2pxIcon
                className='wallets-dynamic-leverage-screen__title-back'
                data-testid='dt_dynamic_leverage_title_back_icon'
                iconSize='xs'
                onClick={toggleDynamicLeverage}
            />
            <Text color='prominent' size={isDesktop ? 'md' : 'sm'} weight='bold'>
                <Localize i18n_default_text='Get more out of Deriv MT5 Financial' />
            </Text>
        </div>
    );
};

export default DynamicLeverageTitle;
