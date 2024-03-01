import React from 'react';
import { getAuthenticationStatusInfo, WS } from '@deriv/shared';
import { Button } from '@deriv/components';
import { localize } from '@deriv/translations';
import { observer, useStore } from '@deriv/stores';
import { GetSettings, GetAccountSettingsResponse } from '@deriv/api-types';
import { TCompareAccountsCard } from 'Components/props.types';
import {
    getMarketType,
    getAccountVerficationStatus,
    isMt5AccountAdded,
    isDxtradeAccountAdded,
    isCTraderAccountAdded,
} from '../../Helpers/compare-accounts-config';
import { CATEGORY, CFD_PLATFORMS } from '../../Helpers/cfd-config';
import useCompareAccountsButtonHandler from '../../hooks/useCompareAccountsButtonHandler';

const CFDCompareAccountsButton = observer(({ trading_platforms, is_demo }: TCompareAccountsCard) => {
    const market_type = getMarketType(trading_platforms);
    const market_type_shortcode = market_type.concat('_', trading_platforms.shortcode ?? '');
    const {
        modules: { cfd },
        client,
    } = useStore();

    const { current_list } = cfd;

    const {
        account_status,
        account_settings,
        should_restrict_bvi_account_creation,
        should_restrict_vanuatu_account_creation,
        is_logged_in,
        is_virtual,
        setAccountSettings,
        updateMT5Status,
    } = client;

    const {
        poi_or_poa_not_submitted,
        poi_acknowledged_for_maltainvest,
        poi_acknowledged_for_bvi_labuan_vanuatu,
        poa_resubmit_for_labuan,
        poa_acknowledged,
    } = getAuthenticationStatusInfo(account_status);

    const type_of_account = {
        category: is_demo ? CATEGORY.DEMO : CATEGORY.REAL,
        type: market_type,
    };

    const [has_submitted_personal_details, setHasSubmittedPersonalDetails] = React.useState(false);
    let is_account_added = false;

    if (trading_platforms.platform === CFD_PLATFORMS.MT5) {
        is_account_added = isMt5AccountAdded(current_list, market_type_shortcode, is_demo);
    } else if (trading_platforms.platform === CFD_PLATFORMS.DXTRADE) {
        is_account_added = isDxtradeAccountAdded(current_list, is_demo);
    } else if (trading_platforms.platform === CFD_PLATFORMS.CTRADER) {
        is_account_added = isCTraderAccountAdded(current_list, is_demo);
    }

    React.useEffect(() => {
        if (is_logged_in && !is_virtual) {
            updateMT5Status();
        }
        if (!has_submitted_personal_details) {
            let get_settings_response: GetSettings = {};
            if (!account_settings) {
                WS.authorized.storage.getSettings().then((response: GetAccountSettingsResponse) => {
                    get_settings_response = response.get_settings as GetSettings;
                    setAccountSettings(response.get_settings as GetSettings);
                });
            } else {
                get_settings_response = account_settings;
            }
            const { citizen, place_of_birth, tax_residence, tax_identification_number, account_opening_reason } =
                get_settings_response;
            if (citizen && place_of_birth && tax_residence && tax_identification_number && account_opening_reason) {
                setHasSubmittedPersonalDetails(true);
            }
        }
    }, [
        account_settings,
        has_submitted_personal_details,
        is_logged_in,
        is_virtual,
        setAccountSettings,
        updateMT5Status,
    ]);

    const is_account_status_verified = getAccountVerficationStatus(
        market_type_shortcode,
        poi_or_poa_not_submitted,
        poi_acknowledged_for_maltainvest,
        poi_acknowledged_for_bvi_labuan_vanuatu,
        poa_acknowledged,
        poa_resubmit_for_labuan,
        has_submitted_personal_details,
        should_restrict_bvi_account_creation,
        should_restrict_vanuatu_account_creation,
        is_demo
    );

    const { onClickAdd } = useCompareAccountsButtonHandler(
        trading_platforms,
        is_account_status_verified,
        type_of_account
    );

    return (
        <Button
            className='compare-cfd-account__button'
            primary_light
            onClick={onClickAdd}
            disabled={is_account_added}
            data-testid='dt_compare_cfd_account_button'
        >
            {is_account_added ? localize('Added') : localize('Add')}
        </Button>
    );
});

export default CFDCompareAccountsButton;
