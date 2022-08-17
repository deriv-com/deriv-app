import React from 'react';
import { Button, Modal, DesktopWrapper, MobileDialog, MobileWrapper, UILoader } from '@deriv/components';
import { localize, Localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import RootStore from 'Stores/index';
import { GetAccountSettingsResponse, GetSettings } from '@deriv/api-types';
import JurisdictionModalContent from './jurisdiction-modal-content';
import { WS, getAuthenticationStatusInfo, isMobile } from '@deriv/shared';
import { TJurisdictionModalProps } from '../props.types';

const JurisdictionModal = ({
    account_status,
    account_settings,
    account_type,
    disableApp,
    enableApp,
    is_jurisdiction_modal_visible,
    is_eu,
    is_virtual,
    jurisdiction_selected_shortcode,
    mt5_login_list,
    openPasswordModal,
    real_synthetic_accounts_existing_data,
    real_financial_accounts_existing_data,
    trading_platform_available_accounts,
    toggleCFDPersonalDetailsModal,
    toggleJurisdictionModal,
    setAccountSettings,
    setJurisdictionSelectedShortcode,
    toggleCFDVerificationModal,
}: TJurisdictionModalProps) => {
    const [checked, setChecked] = React.useState(false);
    const [has_submitted_personal_details, setHasSubmittedPersonalDetails] = React.useState(false);

    const {
        onfido_status,
        manual_status,
        poa_status,
        poi_status,
        need_poi_for_vanuatu,
        need_poi_for_bvi_labuan_maltainvest,
        need_poa_submission,
        poi_or_poa_not_submitted,
        poi_poa_verified_for_bvi_labuan_maltainvest,
        poi_poa_verified_for_vanuatu,

        poi_acknowledged_for_vanuatu,
        poa_acknowledged,
        poi_acknowledged_for_bvi_labuan_maltainvest,
    } = getAuthenticationStatusInfo(account_status);

    const poi_failed = poi_status === 'suspected' || poi_status === 'rejected' || poi_status === 'expired';
    const poa_failed = poa_status === 'suspected' || poa_status === 'rejected' || poa_status === 'expired';

    const selectSVGJurisdiction = () => {
        if (account_type.type && !is_eu) {
            const created_svg_accounts = mt5_login_list.filter(
                data =>
                    data.market_type === account_type.type &&
                    data.landing_company_short === 'svg' &&
                    data.account_type === 'real'
            );
            if (!created_svg_accounts.length && (poa_status === 'pending' || poi_status === 'pending')) {
                setJurisdictionSelectedShortcode('svg');
            } else {
                setJurisdictionSelectedShortcode('');
            }
        } else {
            setJurisdictionSelectedShortcode('');
        }
    };
    React.useEffect(() => {
        if (is_jurisdiction_modal_visible) {
            selectSVGJurisdiction();
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
                    get_settings_response as GetSettings;
                if (citizen && place_of_birth && tax_residence && tax_identification_number && account_opening_reason) {
                    setHasSubmittedPersonalDetails(true);
                }
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [is_jurisdiction_modal_visible]);

    React.useEffect(() => {
        if (jurisdiction_selected_shortcode) {
            setChecked(false);
        }
    }, [jurisdiction_selected_shortcode, is_jurisdiction_modal_visible]);

    const financial_available_accounts = trading_platform_available_accounts.filter(
        available_account => available_account.market_type === 'financial'
    );

    const synthetic_available_accounts = trading_platform_available_accounts.filter(
        available_account => available_account.market_type === 'gaming'
    );

    const modal_title = is_eu
        ? localize('Jurisdiction for your DMT5 CFDs account')
        : localize('Choose a jurisdiction for your DMT5 {{account_type}} account', {
              account_type: account_type.type === 'synthetic' ? 'Synthetic' : 'Financial',
          });

    const isNextButtonDisabled = () => {
        if (jurisdiction_selected_shortcode) {
            const is_account_created =
                account_type.type === 'synthetic'
                    ? real_synthetic_accounts_existing_data?.some(
                          account => account.landing_company_short === jurisdiction_selected_shortcode
                      )
                    : real_financial_accounts_existing_data?.some(
                          account => account.landing_company_short === jurisdiction_selected_shortcode
                      );

            if (!is_account_created) {
                if (jurisdiction_selected_shortcode === 'svg') {
                    return false;
                } else if (jurisdiction_selected_shortcode === 'vanuatu') {
                    return (
                        (poa_acknowledged && poi_acknowledged_for_vanuatu && !poi_poa_verified_for_vanuatu) ||
                        (poi_poa_verified_for_vanuatu && !checked)
                    );
                }
                return (
                    (poa_acknowledged &&
                        poi_acknowledged_for_bvi_labuan_maltainvest &&
                        !poi_poa_verified_for_bvi_labuan_maltainvest) ||
                    (poi_poa_verified_for_bvi_labuan_maltainvest && !checked)
                );
            }
            return true;
        }
        return true;
    };

    const openPersonalDetailsFormOrPasswordForm = (type_of_account: { category: string; type: string }) => {
        if (!has_submitted_personal_details) {
            toggleCFDPersonalDetailsModal();
        } else {
            openPasswordModal(type_of_account);
        }
    };

    const onSelectRealAccount = () => {
        const type_of_account = {
            category: account_type.category,
            type: account_type.type,
        };

        if (is_eu && jurisdiction_selected_shortcode === 'maltainvest') {
            if (poi_poa_verified_for_bvi_labuan_maltainvest) {
                openPasswordModal(type_of_account);
            } else {
                toggleCFDVerificationModal();
            }
        } else if (jurisdiction_selected_shortcode === 'svg') {
            openPasswordModal(type_of_account);
        } else if (jurisdiction_selected_shortcode === 'vanuatu') {
            if (poi_poa_verified_for_vanuatu) {
                openPersonalDetailsFormOrPasswordForm(type_of_account);
            } else {
                toggleCFDVerificationModal();
            }
        } else if (jurisdiction_selected_shortcode === 'bvi' || jurisdiction_selected_shortcode === 'labuan') {
            if (poi_poa_verified_for_bvi_labuan_maltainvest) {
                openPersonalDetailsFormOrPasswordForm(type_of_account);
            } else {
                toggleCFDVerificationModal();
            }
        }
    };

    const buttonText = () => {
        const is_non_svg_selected = jurisdiction_selected_shortcode !== 'svg' && jurisdiction_selected_shortcode;
        if (poa_failed && is_non_svg_selected && !poi_or_poa_not_submitted) {
            return <Localize i18n_default_text='Resubmit proof of address' />;
        } else if (
            jurisdiction_selected_shortcode === 'vanuatu' &&
            (onfido_status === 'none' || manual_status === 'none')
        ) {
            return <Localize i18n_default_text='Next' />;
        } else if (poi_failed && is_non_svg_selected && !poi_or_poa_not_submitted) {
            return <Localize i18n_default_text='Resubmit proof of identity' />;
        } else if (poa_failed && poi_failed && is_non_svg_selected) {
            return <Localize i18n_default_text='Resubmit' />;
        }
        return <Localize i18n_default_text='Next' />;
    };

    const ModalContent = () => (
        <>
            <JurisdictionModalContent
                account_status={account_status}
                account_type={account_type.type}
                checked={checked}
                financial_available_accounts={financial_available_accounts}
                is_virtual={is_virtual}
                real_financial_accounts_existing_data={real_financial_accounts_existing_data}
                real_synthetic_accounts_existing_data={real_synthetic_accounts_existing_data}
                jurisdiction_selected_shortcode={jurisdiction_selected_shortcode}
                setChecked={setChecked}
                setJurisdictionSelectedShortcode={setJurisdictionSelectedShortcode}
                synthetic_available_accounts={synthetic_available_accounts}
            />
            <Modal.Footer has_separator>
                <Button
                    disabled={isNextButtonDisabled()}
                    primary
                    style={{ width: isMobile() ? '100%' : 'unset' }}
                    onClick={() => {
                        toggleJurisdictionModal();
                        onSelectRealAccount();
                    }}
                >
                    {buttonText()}
                </Button>
            </Modal.Footer>
        </>
    );

    return (
        <>
            <div>
                <React.Suspense fallback={<UILoader />}>
                    <DesktopWrapper>
                        <Modal
                            disableApp={disableApp}
                            enableApp={enableApp}
                            is_open={is_jurisdiction_modal_visible}
                            title={modal_title}
                            toggleModal={toggleJurisdictionModal}
                            type='button'
                            height='664px'
                            width={account_type.type === 'synthetic' ? '1040px' : '1200px'}
                            exit_classname='cfd-modal--custom-exit'
                        >
                            <ModalContent />
                        </Modal>
                    </DesktopWrapper>
                    <MobileWrapper>
                        <MobileDialog
                            portal_element_id='deriv_app'
                            title={modal_title}
                            visible={is_jurisdiction_modal_visible}
                            onClose={toggleJurisdictionModal}
                        >
                            <ModalContent />
                        </MobileDialog>
                    </MobileWrapper>
                </React.Suspense>
            </div>
        </>
    );
};

export default connect(({ modules: { cfd }, ui, client }: RootStore) => ({
    account_type: cfd.account_type,
    account_settings: client.account_settings,
    account_status: client.account_status,
    disableApp: ui.disableApp,
    enableApp: ui.enableApp,
    is_eu: client.is_eu,
    is_jurisdiction_modal_visible: cfd.is_jurisdiction_modal_visible,
    is_virtual: client.is_virtual,
    jurisdiction_selected_shortcode: cfd.jurisdiction_selected_shortcode,
    mt5_login_list: client.mt5_login_list,
    real_financial_accounts_existing_data: cfd.real_financial_accounts_existing_data,
    real_synthetic_accounts_existing_data: cfd.real_synthetic_accounts_existing_data,
    setAccountSettings: client.setAccountSettings,
    setJurisdictionSelectedShortcode: cfd.setJurisdictionSelectedShortcode,
    trading_platform_available_accounts: client.trading_platform_available_accounts,
    toggleCFDVerificationModal: cfd.toggleCFDVerificationModal,
    toggleCFDPersonalDetailsModal: cfd.toggleCFDPersonalDetailsModal,
    toggleJurisdictionModal: cfd.toggleJurisdictionModal,
}))(JurisdictionModal);
