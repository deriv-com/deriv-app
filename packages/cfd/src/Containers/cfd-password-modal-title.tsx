import React from 'react';
import { Text } from '@deriv/components';
import { getCFDPlatformNames, getCFDPlatformLabel, getFormattedJurisdictionCode } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { Localize } from '@deriv/translations';
import { CATEGORY, CFD_PLATFORMS } from '../Helpers/cfd-config';
import { useCfdStore } from '../Stores/Modules/CFD/Helpers/useCfdStores';

type TCFDPasswordModalTitleProps = { platform: typeof CFD_PLATFORMS[keyof typeof CFD_PLATFORMS] };

const CFDPasswordModalTitle = observer(({ platform }: TCFDPasswordModalTitleProps) => {
    const { traders_hub } = useStore();
    const { show_eu_related_content } = traders_hub;
    const { account_title, account_type, jurisdiction_selected_shortcode } = useCfdStore();

    const accountTitle = (category: typeof CATEGORY[keyof typeof CATEGORY]) => {
        switch (platform) {
            case CFD_PLATFORMS.CTRADER:
            case CFD_PLATFORMS.DXTRADE:
                return category === CATEGORY.REAL ? 'Real' : '';
            default:
                return account_title;
        }
    };

    const showJurisdiction = () => {
        if (platform === CFD_PLATFORMS.DXTRADE) {
            return '';
        } else if (!show_eu_related_content) {
            return getFormattedJurisdictionCode(jurisdiction_selected_shortcode);
        }
        return 'CFDs';
    };

    return (
        <Text size='xs' className='dc-modal__container_cfd-password-modal__account-title'>
            {account_type.category === CATEGORY.REAL && (
                <Localize
                    i18n_default_text='Enter your {{platform}} password to add a {{platform_name}} {{account}} {{jurisdiction_shortcode}} account.'
                    values={{
                        platform: getCFDPlatformLabel(platform),
                        platform_name:
                            platform === CFD_PLATFORMS.MT5
                                ? getCFDPlatformNames(CFD_PLATFORMS.MT5)
                                : getCFDPlatformLabel(platform),
                        account: !show_eu_related_content ? accountTitle(account_type.category) : '',
                        jurisdiction_shortcode: showJurisdiction(),
                    }}
                />
            )}
            {account_type.category === CATEGORY.DEMO && (
                <Localize
                    i18n_default_text='Enter your {{platform}} password to add a {{platform_name}} {{account}} account.'
                    values={{
                        platform: getCFDPlatformLabel(platform),
                        platform_name:
                            platform === CFD_PLATFORMS.MT5
                                ? getCFDPlatformNames(CFD_PLATFORMS.MT5)
                                : getCFDPlatformLabel(platform),
                        account: accountTitle(account_type.category),
                    }}
                />
            )}
        </Text>
    );
});

export default CFDPasswordModalTitle;
