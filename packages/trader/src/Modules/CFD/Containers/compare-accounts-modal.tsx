import React from 'react';
import { Button, Modal, DesktopWrapper, MobileDialog, MobileWrapper, UILoader } from '@deriv/components';
import { localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import RootStore from 'Stores/index';
import { CFD_PLATFORMS } from '@deriv/shared';
import { LandingCompany } from '@deriv/api-types';
import ModalContent from './compare-accounts-content';

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
                            className='cfd-dashboard__compare-accounts'
                            disableApp={disableApp}
                            enableApp={enableApp}
                            is_open={is_compare_accounts_visible}
                            title={cfd_account_button_label}
                            toggleModal={toggleCompareAccounts}
                            type='button'
                            height='696px'
                            width='903px'
                        >
                            <ModalContent
                                is_logged_in={is_logged_in}
                                landing_companies={landing_companies}
                                platform={platform}
                                show_eu_related={show_eu_related}
                                residence={residence}
                                is_eu={is_eu}
                                is_uk={is_uk}
                            />
                        </Modal>
                    </DesktopWrapper>
                    <MobileWrapper>
                        <MobileDialog
                            portal_element_id='deriv_app'
                            title={localize('Compare accounts')}
                            wrapper_classname='cfd-dashboard__compare-accounts'
                            visible={is_compare_accounts_visible}
                            onClose={toggleCompareAccounts}
                        >
                            <ModalContent
                                is_logged_in={is_logged_in}
                                landing_companies={landing_companies}
                                platform={platform}
                                show_eu_related={show_eu_related}
                                residence={residence}
                                is_eu={is_eu}
                                is_uk={is_uk}
                            />
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
