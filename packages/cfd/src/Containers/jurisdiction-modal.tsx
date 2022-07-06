import React from 'react';
import { Button, Modal, DesktopWrapper, MobileDialog, MobileWrapper, UILoader } from '@deriv/components';
import { localize, Localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import RootStore from 'Stores/index';
import { LandingCompany } from '@deriv/api-types';
import JurisdictionModalContent from './jurisdiction-modal-content';

type TTradingPlatformAvailableAccount = {
    market_type: 'financial' | 'gaming';
    name: string;
    requirements: {
        after_first_deposit: {
            financial_assessment: string[];
        };
        compliance: {
            mt5: string[];
            tax_information: string[];
        };
        signup: string[];
    };
    shortcode: 'bvi' | 'labuan' | 'svg' | 'vanuatu';
    sub_account_type: string;
};

type TCompareAccountsReusedProps = {
    landing_companies: LandingCompany;
    platform: string;
    is_logged_in: boolean;
    is_uk: boolean;
};

type TOpenAccountTransferMeta = {
    category: string;
    type?: string;
};

type TJurisdictionModalProps = TCompareAccountsReusedProps & {
    account_type: {
        type: string;
        category: string;
    };
    authentication_status: {
        document_status: string;
        identity_status: string;
    };
    disableApp: () => void;
    enableApp: () => void;
    has_real_mt5_login: boolean;
    is_jurisdiction_modal_visible: boolean;
    is_loading: boolean;
    is_eu: boolean;
    is_eu_country: boolean;
    residence: string;
    jurisdiction_selected_card: string;
    toggleCFDPersonalDetailsModal: () => void;
    toggleJurisdictionModal: () => void;
    trading_platform_available_accounts: TTradingPlatformAvailableAccount[];
    is_fully_authenticated: boolean;
    is_pending_authentication: boolean;
    openPasswordModal: (account_type: TOpenAccountTransferMeta) => void;
};

const JurisdictionModal = ({
    account_type,
    authentication_status,
    disableApp,
    enableApp,
    has_real_mt5_login,
    is_jurisdiction_modal_visible,
    is_eu,
    jurisdiction_selected_card,
    toggleCFDPersonalDetailsModal,
    toggleJurisdictionModal,
    trading_platform_available_accounts,
    is_fully_authenticated,
    is_pending_authentication,
    openPasswordModal,
}: TJurisdictionModalProps) => {
    const [checked, setChecked] = React.useState<boolean>(false);

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

    const poa_status = authentication_status?.document_status;
    const poi_status = authentication_status?.identity_status;
    const poi_poa_verified = poi_status === 'verified' && poa_status === 'verified';

    const onSelectRealAccount = () => {
        const type_of_account = {
            category: account_type.category,
            type: account_type.type,
        };
        toggleJurisdictionModal();

        switch (jurisdiction_selected_card) {
            case 'svg':
                openPasswordModal(type_of_account);
                break;
            case 'labuan':
                if (poi_poa_verified) {
                    if (!has_real_mt5_login && !is_eu) {
                        toggleCFDPersonalDetailsModal();
                    }
                }
                break;
            case 'bvi':
                if (poi_poa_verified) {
                    if (!has_real_mt5_login && !is_eu) {
                        toggleCFDPersonalDetailsModal();
                    }
                }
                break;
            case 'mf':
                if (poi_poa_verified) {
                    if (!has_real_mt5_login && !is_eu) {
                        toggleCFDPersonalDetailsModal();
                    }
                }
                break;
            case 'vanuatu':
                if (poi_poa_verified) {
                    if (!has_real_mt5_login && !is_eu) {
                        toggleCFDPersonalDetailsModal();
                    }
                }
                break;
            default:
        }
    };

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
                            height='696px'
                            width='1200px'
                        >
                            <JurisdictionModalContent
                                financial_available_accounts={financial_available_accounts}
                                synthetic_available_accounts={synthetic_available_accounts}
                                account_type={account_type.type}
                                authentication_status={authentication_status}
                                poa_status={poa_status}
                                poi_status={poi_status}
                                is_eu={is_eu}
                                is_fully_authenticated={is_fully_authenticated}
                                is_pending_authentication={is_pending_authentication}
                                checked={checked}
                                setChecked={setChecked}
                            />
                            <Modal.Footer>
                                <Button
                                    disabled={
                                        (poi_poa_verified && !checked) ||
                                        !jurisdiction_selected_card ||
                                        (jurisdiction_selected_card !== 'svg' && is_pending_authentication)
                                    }
                                    primary
                                    onClick={() => {
                                        onSelectRealAccount();
                                    }}
                                >
                                    <Localize i18n_default_text='Next' />
                                </Button>
                            </Modal.Footer>
                        </Modal>
                    </DesktopWrapper>
                    <MobileWrapper>
                        <MobileDialog
                            portal_element_id='deriv_app'
                            title={modal_title}
                            visible={is_jurisdiction_modal_visible}
                            onClose={toggleJurisdictionModal}
                            footer={
                                <Button
                                    style={{ width: '100%' }}
                                    disabled={
                                        jurisdiction_selected_card === undefined ||
                                        (is_eu && is_fully_authenticated && !checked) ||
                                        (jurisdiction_selected_card !== 'svg' && is_pending_authentication)
                                    }
                                    primary
                                    onClick={() => {
                                        onSelectRealAccount();
                                    }}
                                >
                                    <Localize i18n_default_text='Next' />
                                </Button>
                            }
                        >
                            <JurisdictionModalContent
                                financial_available_accounts={financial_available_accounts}
                                synthetic_available_accounts={synthetic_available_accounts}
                                account_type={account_type.type}
                                authentication_status={authentication_status}
                                poa_status={poa_status}
                                poi_status={poi_status}
                                is_eu={is_eu}
                                is_fully_authenticated={is_fully_authenticated}
                                is_pending_authentication={is_pending_authentication}
                                checked={checked}
                                setChecked={setChecked}
                            />
                        </MobileDialog>
                    </MobileWrapper>
                </React.Suspense>
            </div>
        </>
    );
};

export default connect(({ modules, ui, client }: RootStore) => ({
    account_type: modules.cfd.account_type,
    authentication_status: client.authentication_status,
    disableApp: ui.disableApp,
    enableApp: ui.enableApp,
    has_real_mt5_login: client.has_real_mt5_login,
    is_jurisdiction_modal_visible: modules.cfd.is_jurisdiction_modal_visible,
    trading_platform_available_accounts: client.trading_platform_available_accounts,
    is_loading: client.is_populating_mt5_account_list,
    is_eu: client.is_eu,
    is_logged_in: client.is_logged_in,
    is_eu_country: client.is_eu_country,
    landing_companies: client.landing_companies,
    is_fully_authenticated: client.is_fully_authenticated,
    is_pending_authentication: client.is_pending_authentication,
    toggleJurisdictionModal: modules.cfd.toggleJurisdictionModal,
    jurisdiction_selected_card: modules.cfd.jurisdiction_selected_card,
    residence: client.residence,
}))(JurisdictionModal);
