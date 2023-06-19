import React from 'react';
import { useHistory } from 'react-router-dom';
import { routes, getAuthenticationStatusInfo, WS } from '@deriv/shared';
import { Button } from '@deriv/components';
import { localize } from '@deriv/translations';
import { observer, useStore } from '@deriv/stores';
import { GetSettings, GetAccountSettingsResponse } from '@deriv/api-types';
import { TCompareAccountsCard } from 'Components/props.types';
import { getMarketType, getAccountVerficationStatus } from '../../Helpers/compare-accounts-config';

const CFDCompareAccountsButton = observer(({ trading_platforms }: TCompareAccountsCard) => {
    const market_type = getMarketType(trading_platforms);
    const jurisdiction_shortcode = market_type.concat('_', trading_platforms.shortcode);
    const {
        modules: { cfd },
        common,
        client,
        traders_hub,
    } = useStore();
    const history = useHistory();
    const { setAccountType, setJurisdictionSelectedShortcode, enableCFDPasswordModal, toggleCFDVerificationModal } =
        cfd;
    const { setAppstorePlatform } = common;
    const type_of_account = {
        category: 'real',
        type: market_type,
    };
    const { is_demo } = traders_hub;
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

    const [has_submitted_personal_details, setHasSubmittedPersonalDetails] = React.useState(false);

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

    const account_status_response = getAccountVerficationStatus(
        jurisdiction_shortcode,
        poi_or_poa_not_submitted,
        poi_acknowledged_for_vanuatu_maltainvest,
        poi_acknowledged_for_bvi_labuan,
        poa_acknowledged,
        poa_pending,
        should_restrict_bvi_account_creation,
        should_restrict_vanuatu_account_creation,
        is_demo,
        has_submitted_personal_details
    );

    const onClickAdd = () => {
        setAppstorePlatform(trading_platforms.platform);
        setJurisdictionSelectedShortcode(trading_platforms.shortcode);
        if (account_status_response) {
            setAccountType(type_of_account);
            enableCFDPasswordModal();
        } else {
            toggleCFDVerificationModal();
        }
        history.push(routes.traders_hub);
    };
    return (
        <Button className='compare-cfd-account__button' primary_light onClick={onClickAdd}>
            {localize('Add')}
        </Button>
    );
});

export default CFDCompareAccountsButton;
