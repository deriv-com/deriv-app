import React from 'react';
import { useHistory } from 'react-router-dom';
import { routes, getAuthenticationStatusInfo, WS, CFD_PLATFORMS } from '@deriv/shared';
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
} from '../../Helpers/compare-accounts-config';

const CFDCompareAccountsButton = observer(({ trading_platforms, is_demo }: TCompareAccountsCard) => {
    const history = useHistory();

    const market_type = getMarketType(trading_platforms);
    const market_type_shortcode = market_type.concat('_', trading_platforms.shortcode);
    const {
        modules: { cfd },
        common,
        client,
        traders_hub,
    } = useStore();

    const {
        setAccountType,
        setJurisdictionSelectedShortcode,
        enableCFDPasswordModal,
        toggleCFDVerificationModal,
        current_list,
    } = cfd;
    const { getAccount } = traders_hub;
    const { setAppstorePlatform } = common;

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
        poi_acknowledged_for_vanuatu_maltainvest,
        poi_acknowledged_for_bvi_labuan,
        poa_acknowledged,
        poa_pending,
    } = getAuthenticationStatusInfo(account_status);

    const type_of_account = {
        category: is_demo ? 'demo' : 'real',
        type: market_type,
    };

    const [has_submitted_personal_details, setHasSubmittedPersonalDetails] = React.useState(false);
    let is_account_added = false;

    if (trading_platforms.platform === CFD_PLATFORMS.MT5) {
        is_account_added = isMt5AccountAdded(current_list, market_type_shortcode, is_demo);
    } else if (trading_platforms.platform === CFD_PLATFORMS.DXTRADE) {
        is_account_added = isDxtradeAccountAdded(current_list, is_demo);
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const is_account_status_verified = getAccountVerficationStatus(
        market_type_shortcode,
        poi_or_poa_not_submitted,
        poi_acknowledged_for_vanuatu_maltainvest,
        poi_acknowledged_for_bvi_labuan,
        poa_acknowledged,
        poa_pending,
        should_restrict_bvi_account_creation,
        should_restrict_vanuatu_account_creation,
        has_submitted_personal_details,
        is_demo
    );

    const onClickAdd = () => {
        setAppstorePlatform(trading_platforms.platform as string);
        if (trading_platforms.platform === CFD_PLATFORMS.MT5) {
            setJurisdictionSelectedShortcode(trading_platforms.shortcode);
            if (is_account_status_verified) {
                setAccountType(type_of_account);
                enableCFDPasswordModal();
            } else {
                toggleCFDVerificationModal();
            }
        } else {
            setAccountType(type_of_account);
            getAccount();
        }
        history.push(routes.traders_hub);
    };
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
