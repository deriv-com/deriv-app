import React from 'react';
import { useDevice } from '@deriv-com/ui';
import { Icon, Text } from '@deriv/components';
import { getMT5Title, getCFDPlatformLabel } from '@deriv/shared';
import { Localize, localize } from '@deriv/translations';
import { useDynamicLeverage } from '../dynamic-leverage/dynamic-leverage-context';
import { TJurisdictionModalTitleProps } from '../props.types';
import { CFD_PLATFORMS } from '../../Helpers/cfd-config';
import { platformsText } from '../../Helpers/constants';

export const JurisdictionModalTitle = ({
    show_eu_related_content,
    account_type,
    platform,
}: TJurisdictionModalTitleProps) => {
    const { isDesktop } = useDevice();
    const { is_dynamic_leverage_visible, toggleDynamicLeverage } = useDynamicLeverage();
    if (is_dynamic_leverage_visible) {
        return (
            <div className='jurisdiction-modal__title'>
                <span
                    data-testid='back_icon'
                    className='jurisdiction-modal__title-back'
                    onClick={toggleDynamicLeverage}
                >
                    <Icon icon='IcArrowLeftBold' />
                </span>
                <Text size={isDesktop ? 's' : 'xs'} weight='bold' color='prominent'>
                    {localize('Get more out of Deriv MT5 Financial')}
                </Text>
            </div>
        );
    } else if (show_eu_related_content) {
        return <Localize i18n_default_text='Choose a jurisdiction for your Deriv MT5 CFDs account' />;
    }

    return (
        <Localize
            i18n_default_text={'Choose a jurisdiction for your {{account_type}} account'}
            values={{
                account_type:
                    platform === CFD_PLATFORMS.MT5
                        ? `${getCFDPlatformLabel(platform)} ${getMT5Title(account_type)}`
                        : platformsText(platform),
            }}
        />
    );
};

export default JurisdictionModalTitle;
