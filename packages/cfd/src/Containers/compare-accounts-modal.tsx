import React from 'react';
import { Button, Modal, DesktopWrapper, MobileDialog, MobileWrapper, UILoader } from '@deriv/components';
import { localize } from '@deriv/translations';
import { connect } from '../Stores/connect';
import RootStore from '../Stores/index';
import { CFD_PLATFORMS, isLandingCompanyEnabled, ContentFlag } from '@deriv/shared';
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
    is_real_enabled: boolean;
    is_pre_appstore: boolean;
    residence: string;
    is_demo_tab: boolean;
    has_unmerged_account: boolean;
    toggleCompareAccounts: () => void;
    openPasswordModal: (account_type: TOpenAccountTransferMeta) => void;
    openDerivRealAccountNeededModal: () => void;
    context: RootStore;
    real_account_creation_unlock_date: string;
    show_eu_related_content: boolean;
    setShouldShowCooldownModal: (value: boolean) => void;
    is_eu_user: string;
    is_cr_demo_account: boolean;
    upgradeable_landing_companies: unknown[];
    landing_company_shortcode: string;
    content_flag: string;
};

type TDxtradeCompareAccountContent = TCompareAccountsReusedProps & {
    is_demo_tab: boolean;
    is_eu_client: boolean;
    has_unmerged_account: boolean;
    residence: string;
    is_eu: boolean;
};

// TODO: Remove this component and use one component for both when real released.
const DxtradeCompareAccountContent = ({
    is_demo_tab,
    is_logged_in,
    landing_companies,
    platform,
    is_eu_client,
    has_unmerged_account,
    residence,
    is_eu,
    is_uk,
}: TDxtradeCompareAccountContent) => {
    if (is_demo_tab || !has_unmerged_account) {
        return (
            <CfdDxtradeCompareContent
                is_logged_in={is_logged_in}
                landing_companies={landing_companies}
                platform={platform}
                is_eu_client={is_eu_client}
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
            is_eu_client={is_eu_client}
            residence={residence}
            is_eu={is_eu}
            is_uk={is_uk}
        />
    );
};

const CompareAccountsModal = ({
    context,
    disableApp,
    enableApp,
    has_unmerged_account,
    is_compare_accounts_visible,
    is_demo_tab,
    is_eu,
    is_loading,
    is_logged_in,
    is_real_enabled,
    is_uk,
    landing_companies,
    openDerivRealAccountNeededModal,
    openPasswordModal,
    platform,
    real_account_creation_unlock_date,
    residence,
    setShouldShowCooldownModal,
    toggleCompareAccounts,
    content_flag,
    show_eu_related_content,
}: TCompareAccountsModalProps) => {
    const location = window.location.pathname;
    const is_pre_appstore_setting = location.startsWith('/appstore/traders-hub');

    // TODO : should change the type to all after changing derivx api
    const has_derivx =
        isLandingCompanyEnabled({
            landing_companies,
            platform: CFD_PLATFORMS.DXTRADE,
            type: 'financial',
        }) ||
        isLandingCompanyEnabled({
            landing_companies,
            platform: CFD_PLATFORMS.DXTRADE,
            type: 'gaming',
        }) ||
        isLandingCompanyEnabled({
            landing_companies,
            platform: CFD_PLATFORMS.DXTRADE,
            type: 'all',
        });

    const should_show_derivx = is_pre_appstore_setting && has_derivx && !show_eu_related_content;

    const show_preappstore_eu_demo = is_pre_appstore_setting && show_eu_related_content && is_demo_tab;
    const is_preappstore_cr_demo_account = is_pre_appstore_setting && content_flag === ContentFlag.CR_DEMO;

    const is_dxtrade = platform && platform === CFD_PLATFORMS.DXTRADE;
    const mt5_accounts = [
        landing_companies?.mt_gaming_company?.financial,
        landing_companies?.mt_financial_company?.financial,
        landing_companies?.mt_financial_company?.financial_stp,
    ];

    const cfd_account_button_label =
        mt5_accounts.filter(Boolean).length === 1 ||
        (is_demo_tab && platform === CFD_PLATFORMS.DXTRADE) ||
        (!has_unmerged_account && platform === CFD_PLATFORMS.DXTRADE)
            ? localize('Account Information')
            : localize('Compare accounts');

    const getCFDModalTitle = () => {
        if (is_pre_appstore_setting && show_eu_related_content) {
            return is_demo_tab ? localize('Deriv MT5 CFDs demo account') : localize('Deriv MT5 CFDs real account');
        } else if (should_show_derivx) {
            return is_demo_tab ? localize('Compare CFDs demo accounts') : localize('Compare CFDs real accounts');
        }
        return is_dxtrade ? cfd_account_button_label : localize('Compare available accounts');
    };
    const getModalStyle = () => {
        if (is_dxtrade) {
            return {
                height: '696px',
                width: '903px',
            };
        } else if (is_preappstore_cr_demo_account) {
            return {
                height: '404px',
                width: '610px',
            };
        } else if (show_eu_related_content) {
            if (is_pre_appstore_setting) {
                if (content_flag === ContentFlag.EU_DEMO) {
                    return {
                        height: '350px',
                        width: '483px',
                    };
                }
                return {
                    height: '560px',
                    width: '483px',
                };
            }
            return {
                height: '525px',
                width: '300px',
            };
        } else if (is_pre_appstore_setting && should_show_derivx) {
            return {
                height: '574px',
                width: '1131px',
            };
        }
        return {
            height: '506px',
            width: '996px',
        };
    };

    const getModalContent = () => {
        return is_dxtrade ? (
            <DxtradeCompareAccountContent
                is_demo_tab={is_demo_tab}
                is_logged_in={is_logged_in}
                landing_companies={landing_companies}
                platform={platform}
                is_eu_client={!!show_eu_related_content}
                residence={residence}
                has_unmerged_account={has_unmerged_account}
                is_eu={is_eu}
                is_uk={is_uk}
            />
        ) : (
            <DMT5CompareModalContent
                content_flag={content_flag}
                context={context}
                is_demo_tab={is_demo_tab}
                is_logged_in={is_logged_in}
                is_pre_appstore_setting={is_pre_appstore_setting}
                is_preappstore_cr_demo_account={is_preappstore_cr_demo_account}
                is_real_enabled={is_real_enabled}
                openDerivRealAccountNeededModal={openDerivRealAccountNeededModal}
                openPasswordModal={openPasswordModal}
                real_account_creation_unlock_date={real_account_creation_unlock_date}
                setShouldShowCooldownModal={setShouldShowCooldownModal}
                should_show_derivx={should_show_derivx}
                show_eu_related_content={show_eu_related_content}
                show_preappstore_eu_demo={show_preappstore_eu_demo}
                toggleCompareAccounts={toggleCompareAccounts}
            />
        );
    };

    return (
        <>
            <div className='cfd-compare-accounts-modal__wrapper' style={{ marginTop: is_dxtrade ? '5rem' : '2.4rem' }}>
                {!(is_demo_tab && platform === 'mt5') && !is_pre_appstore_setting && (
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
                            className={is_dxtrade ? 'cfd-dashboard__compare-accounts' : 'cfd-accounts-compare-modal'}
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
                            {getModalContent()}
                        </Modal>
                    </DesktopWrapper>
                    <MobileWrapper>
                        <MobileDialog
                            portal_element_id='deriv_app'
                            title={getCFDModalTitle()}
                            wrapper_classname='cfd-dashboard__compare-accounts'
                            visible={is_compare_accounts_visible}
                            onClose={toggleCompareAccounts}
                            header_classname={is_dxtrade ? '' : 'cfd-accounts-compare-modal-mobile-header'}
                            has_full_height
                        >
                            {getModalContent()}
                        </MobileDialog>
                    </MobileWrapper>
                </React.Suspense>
            </div>
        </>
    );
};

export default connect(({ modules, ui, client, traders_hub }: RootStore) => ({
    disableApp: ui.disableApp,
    enableApp: ui.enableApp,
    is_compare_accounts_visible: modules.cfd.is_compare_accounts_visible,
    is_loading: client.is_populating_mt5_account_list,
    is_eu: client.is_eu,
    is_uk: client.is_uk,
    is_eu_country: client.is_eu_country,
    is_logged_in: client.is_logged_in,
    is_pre_appstore: client.is_pre_appstore,
    landing_companies: client.landing_companies,
    residence: client.residence,
    toggleCompareAccounts: modules.cfd.toggleCompareAccountsModal,
    openDerivRealAccountNeededModal: ui.openDerivRealAccountNeededModal,
    selected_region: traders_hub.selected_region,
    is_eu_user: traders_hub.is_eu_user,
    content_flag: traders_hub.content_flag,
    show_eu_related_content: traders_hub.show_eu_related_content,
}))(CompareAccountsModal);
