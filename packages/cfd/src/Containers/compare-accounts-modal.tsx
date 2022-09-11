import React from 'react';
import { Button, Modal, DesktopWrapper, MobileDialog, MobileWrapper, UILoader } from '@deriv/components';
import { localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import RootStore from 'Stores/index';
import { CFD_PLATFORMS } from '@deriv/shared';
import { LandingCompany } from '@deriv/api-types';
import ModalContent from './compare-accounts-content';
import DMT5CompareModalContent from './mt5-compare-table-content';
import CfdDxtradeCompareContent from '../Components/cfd-dxtrade-compare-content';

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

type TCompareAccountsModalProps = TCompareAccountsReusedProps & {
    disableApp: () => void;
    enableApp: () => void;
    is_compare_accounts_visible: boolean;
    is_loading: boolean;
    is_eu: boolean;
    is_eu_country: boolean;
    is_real_enabled: boolean;
    residence: string;
    is_demo_tab: boolean;
    toggleCompareAccounts: () => void;
    openPasswordModal: (account_type: TOpenAccountTransferMeta) => void;
    openDerivRealAccountNeededModal: () => void;
};

type TDxtradeCompareAccountContent = TCompareAccountsReusedProps & {
    is_demo_tab: boolean;
    show_eu_related: boolean;
    residence: string;
    is_eu: boolean;
};

// TODO: Remove this component and use one component for both when real released.
const DxtradeCompareAccountContent = ({
    is_demo_tab,
    is_logged_in,
    landing_companies,
    platform,
    show_eu_related,
    residence,
    is_eu,
    is_uk,
}: TDxtradeCompareAccountContent) => {
    if (is_demo_tab) {
        return (
            <CfdDxtradeCompareContent
                is_logged_in={is_logged_in}
                landing_companies={landing_companies}
                platform={platform}
                show_eu_related={show_eu_related}
                residence={residence}
                is_eu={is_eu}
                is_uk={is_uk}
            />
        );
    }

    return (
        <ModalContent
            is_logged_in={is_logged_in}
            landing_companies={landing_companies}
            platform={platform}
            show_eu_related={show_eu_related}
            residence={residence}
            is_eu={is_eu}
            is_uk={is_uk}
        />
    );
};

const CompareAccountsModal = ({
    disableApp,
    enableApp,
    is_compare_accounts_visible,
    landing_companies,
    is_loading,
    is_logged_in,
    is_eu,
    is_uk,
    is_eu_country,
    is_real_enabled,
    platform,
    residence,
    is_demo_tab,
    toggleCompareAccounts,
    openPasswordModal,
    openDerivRealAccountNeededModal,
}: TCompareAccountsModalProps) => {
    const show_eu_related = (is_logged_in && is_eu) || (!is_logged_in && is_eu_country);
    const is_dxtrade = platform && platform === CFD_PLATFORMS.DXTRADE;
    const mt5_accounts = [
        landing_companies?.mt_gaming_company?.financial,
        landing_companies?.mt_financial_company?.financial,
        landing_companies?.mt_financial_company?.financial_stp,
    ];

    const cfd_account_button_label =
        mt5_accounts.filter(Boolean).length === 1 || (is_demo_tab && platform === CFD_PLATFORMS.DXTRADE)
            ? localize('Account Information')
            : localize('Compare accounts');

    const getCFDModalTitle = () => (is_dxtrade ? cfd_account_button_label : localize('Compare available accounts'));

    const getModalStyle = () => {
        if (is_dxtrade) {
            return {
                height: '696px',
                width: '903px',
            };
        } else if (show_eu_related) {
            return {
                height: '506px',
                width: '300px',
            };
        }
        return {
            height: '506px',
            width: '996px',
        };
    };

    return (
        <>
            <div className='cfd-compare-accounts-modal__wrapper' style={{ marginTop: is_dxtrade ? '5rem' : '2.4rem' }}>
                {!(is_demo_tab && platform === 'mt5') && (
                    <Button
                        className='cfd-dashboard__welcome-message--button'
                        has_effect
                        text={cfd_account_button_label}
                        onClick={toggleCompareAccounts}
                        secondary
                        disabled={is_loading}
                    />
                )}
                <React.Suspense fallback={<UILoader />}>
                    <DesktopWrapper>
                        <Modal
                            className={is_dxtrade ? 'cfd-dashboard__compare-accounts' : 'cfd-real-compare-accounts'}
                            disableApp={disableApp}
                            enableApp={enableApp}
                            is_open={is_compare_accounts_visible}
                            title={getCFDModalTitle()}
                            toggleModal={toggleCompareAccounts}
                            type='button'
                            height={getModalStyle().height}
                            width={getModalStyle().width}
                            exit_classname={is_dxtrade ? '' : 'cfd-modal--custom-exit'}
                        >
                            {is_dxtrade ? (
                                <DxtradeCompareAccountContent
                                    is_demo_tab={is_demo_tab}
                                    is_logged_in={is_logged_in}
                                    landing_companies={landing_companies}
                                    platform={platform}
                                    show_eu_related={show_eu_related}
                                    residence={residence}
                                    is_eu={is_eu}
                                    is_uk={is_uk}
                                />
                            ) : (
                                <DMT5CompareModalContent
                                    is_logged_in={is_logged_in}
                                    openDerivRealAccountNeededModal={openDerivRealAccountNeededModal}
                                    openPasswordModal={openPasswordModal}
                                    is_demo_tab={is_demo_tab}
                                    show_eu_related={show_eu_related}
                                    is_real_enabled={is_real_enabled}
                                    toggleCompareAccounts={toggleCompareAccounts}
                                />
                            )}
                        </Modal>
                    </DesktopWrapper>
                    <MobileWrapper>
                        <MobileDialog
                            portal_element_id='deriv_app'
                            title={getCFDModalTitle()}
                            wrapper_classname='cfd-dashboard__compare-accounts'
                            visible={is_compare_accounts_visible}
                            onClose={toggleCompareAccounts}
                            header_classname={is_dxtrade ? '' : 'cfd-real-compare-accounts-mobile-header'}
                        >
                            {is_dxtrade ? (
                                <DxtradeCompareAccountContent
                                    is_demo_tab={is_demo_tab}
                                    is_logged_in={is_logged_in}
                                    landing_companies={landing_companies}
                                    platform={platform}
                                    show_eu_related={show_eu_related}
                                    residence={residence}
                                    is_eu={is_eu}
                                    is_uk={is_uk}
                                />
                            ) : (
                                <DMT5CompareModalContent
                                    is_logged_in={is_logged_in}
                                    openDerivRealAccountNeededModal={openDerivRealAccountNeededModal}
                                    openPasswordModal={openPasswordModal}
                                    is_demo_tab={is_demo_tab}
                                    show_eu_related={show_eu_related}
                                    is_real_enabled={is_real_enabled}
                                    toggleCompareAccounts={toggleCompareAccounts}
                                />
                            )}
                        </MobileDialog>
                    </MobileWrapper>
                </React.Suspense>
            </div>
        </>
    );
};

export default connect(({ modules, ui, client }: RootStore) => ({
    disableApp: ui.disableApp,
    enableApp: ui.enableApp,
    is_compare_accounts_visible: modules.cfd.is_compare_accounts_visible,
    is_loading: client.is_populating_mt5_account_list,
    is_eu: client.is_eu,
    is_uk: client.is_uk,
    is_eu_country: client.is_eu_country,
    is_logged_in: client.is_logged_in,
    landing_companies: client.landing_companies,
    residence: client.residence,
    toggleCompareAccounts: modules.cfd.toggleCompareAccountsModal,
    openDerivRealAccountNeededModal: ui.openDerivRealAccountNeededModal,
}))(CompareAccountsModal);
