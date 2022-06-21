import React from 'react';
import { Button, Modal, DesktopWrapper, MobileDialog, MobileWrapper, UILoader } from '@deriv/components';
import { localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import RootStore from 'Stores/index';
import { isMobile, CFD_PLATFORMS } from '@deriv/shared';
import { LandingCompany } from '@deriv/api-types';
import ModalContent from './compare-accounts-content';
import DMT5CompareModalContent from './mt5-compare-table-content';

type TCompareAccountsReusedProps = {
    landing_companies: LandingCompany;
    platform: string;
    is_logged_in: boolean;
    is_uk: boolean;
};

type TCompareAccountsModalProps = TCompareAccountsReusedProps & {
    disableApp: () => void;
    enableApp: () => void;
    is_compare_accounts_visible: boolean;
    is_loading: boolean;
    is_eu: boolean;
    is_eu_country: boolean;
    residence: string;
    is_demo_tab: boolean;
    toggleCompareAccounts: () => void;
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
    platform,
    residence,
    is_demo_tab,
    toggleCompareAccounts,
}: TCompareAccountsModalProps) => {
    const show_eu_related = (is_logged_in && is_eu) || (!is_logged_in && is_eu_country);

    const mt5_accounts = [
        landing_companies?.mt_gaming_company?.financial,
        landing_companies?.mt_financial_company?.financial,
        landing_companies?.mt_financial_company?.financial_stp,
    ];

    const cfd_account_button_label =
        mt5_accounts.filter(Boolean).length === 1 ? localize('Account Information') : localize('Compare accounts');

    const getCFDModalTitle = () => {
        if (platform === 'mt5') {
            return isMobile()
                ? localize('Choose a jurisdiction for your account')
                : localize('Choose a jurisdiction for your {{type}} DMT5 account', {
                      type: is_demo_tab ? 'demo' : 'real',
                  });
        }
        return cfd_account_button_label;
    };

    return (
        <>
            <div
                className='cfd-compare-accounts-modal__wrapper'
                style={{ marginTop: platform === CFD_PLATFORMS.DXTRADE ? '5rem' : '2.4rem' }}
            >
                <Button
                    className='cfd-dashboard__welcome-message--button'
                    has_effect
                    text={cfd_account_button_label}
                    onClick={toggleCompareAccounts}
                    secondary
                    disabled={is_loading}
                />
                <React.Suspense fallback={<UILoader />}>
                    <DesktopWrapper>
                        <Modal
                            className={is_demo_tab ? 'cfd-dashboard__compare-accounts' : 'cfd-real-compare-accounts'}
                            disableApp={disableApp}
                            enableApp={enableApp}
                            is_open={is_compare_accounts_visible}
                            title={getCFDModalTitle()}
                            toggleModal={toggleCompareAccounts}
                            type='button'
                            height={platform === CFD_PLATFORMS.DXTRADE ? '696px' : '506px'}
                            width={platform === CFD_PLATFORMS.DXTRADE ? '903px' : '996px'}
                        >
                            {platform === CFD_PLATFORMS.DXTRADE ? (
                                <ModalContent
                                    is_logged_in={is_logged_in}
                                    landing_companies={landing_companies}
                                    platform={platform}
                                    show_eu_related={show_eu_related}
                                    residence={residence}
                                    is_eu={is_eu}
                                    is_uk={is_uk}
                                />
                            ) : (
                                <DMT5CompareModalContent />
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
                            header_classname={
                                platform === CFD_PLATFORMS.MT5 && 'cfd-real-compare-accounts-mobile-header'
                            }
                        >
                            {platform === CFD_PLATFORMS.DXTRADE ? (
                                <ModalContent
                                    is_logged_in={is_logged_in}
                                    landing_companies={landing_companies}
                                    platform={platform}
                                    show_eu_related={show_eu_related}
                                    residence={residence}
                                    is_eu={is_eu}
                                    is_uk={is_uk}
                                />
                            ) : (
                                <DMT5CompareModalContent />
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
}))(CompareAccountsModal);
