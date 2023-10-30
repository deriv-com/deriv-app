import React from 'react';
import { Text } from '@deriv/components';
import { getCFDPlatformNames, getCFDPlatformLabel, CFD_PLATFORMS, getFormattedJurisdictionCode } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { Localize } from '@deriv/translations';
import { CATEGORY } from '../Helpers/cfd-config';
import { useCfdStore } from 'Stores/Modules/CFD/Helpers/useCfdStores';

type TCFDPasswordModalTitleProps = { platform: string };

const CFDPasswordModalTitle = observer(({ platform }: TCFDPasswordModalTitleProps) => {
    const { traders_hub, ui } = useStore();
    const { show_eu_related_content } = traders_hub;
    const { is_mt5_migration_modal_enabled } = ui;
    const { account_title, account_type, jurisdiction_selected_shortcode } = useCfdStore();

    const accountTitle = (category: string) => {
        switch (platform) {
            case 'ctrader':
            case 'derivez':
                return 'CFD';
            case 'dxtrade':
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
            {is_mt5_migration_modal_enabled && (
                <Localize
                    i18n_default_text='Enter your {{platform}} password to move your account(s).'
                    values={{
                        platform: getCFDPlatformLabel(platform),
                    }}
                />
            )}
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
