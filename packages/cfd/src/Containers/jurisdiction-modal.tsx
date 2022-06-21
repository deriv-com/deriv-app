import React from 'react';
import { Button, Modal, DesktopWrapper, MobileDialog, MobileWrapper, UILoader } from '@deriv/components';
import { localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import RootStore from 'Stores/index';
import { CFD_PLATFORMS } from '@deriv/shared';
import { LandingCompany } from '@deriv/api-types';
import JurisdictionModalContent from './jurisdiction-modal-content';

type TCompareAccountsReusedProps = {
    landing_companies: LandingCompany;
    platform: string;
    is_logged_in: boolean;
    is_uk: boolean;
};

type TJurisdictionModalProps = TCompareAccountsReusedProps & {
    disableApp: () => void;
    enableApp: () => void;
    is_compare_accounts_visible2: boolean;
    is_loading: boolean;
    is_eu: boolean;
    is_eu_country: boolean;
    residence: string;
    toggleCompareAccounts2: () => void;
};

const JurisdictionModal = ({
    disableApp,
    enableApp,
    is_compare_accounts_visible2,
    is_loading,
    platform,
    toggleCompareAccounts2,
}: TJurisdictionModalProps) => {
    return (
        <>
            <div
                className='cfd-compare-accounts-modal__wrapper'
                style={{ marginTop: platform === CFD_PLATFORMS.DXTRADE ? '5rem' : '2.4rem' }}
            >
                <Button
                    className='cfd-dashboard__welcome-message--button'
                    has_effect
                    text={'Jurisdiction modal'}
                    onClick={toggleCompareAccounts2}
                    secondary
                    disabled={is_loading}
                />
                <React.Suspense fallback={<UILoader />}>
                    <DesktopWrapper>
                        <Modal
                            className='cfd-dashboard__compare-accounts'
                            disableApp={disableApp}
                            enableApp={enableApp}
                            is_open={is_compare_accounts_visible2}
                            title={'Choose a jurisdiction for your DMT5 financial account'}
                            toggleModal={toggleCompareAccounts2}
                            type='button'
                            height='696px'
                            width='1200px'
                        >
                            <JurisdictionModalContent />
                            <Modal.Footer>
                                <Button primary>Next</Button>
                            </Modal.Footer>
                        </Modal>
                    </DesktopWrapper>
                    <MobileWrapper>
                        <MobileDialog
                            portal_element_id='deriv_app'
                            title={localize('Compare accounts')}
                            wrapper_classname='cfd-dashboard__compare-accounts'
                            visible={is_compare_accounts_visible2}
                            onClose={toggleCompareAccounts2}
                        >
                            <JurisdictionModalContent />
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
    is_compare_accounts_visible2: modules.cfd.is_compare_accounts_visible2,
    is_loading: client.is_populating_mt5_account_list,
    is_eu: client.is_eu,
    is_uk: client.is_uk,
    is_eu_country: client.is_eu_country,
    is_logged_in: client.is_logged_in,
    landing_companies: client.landing_companies,
    residence: client.residence,
    toggleCompareAccounts2: modules.cfd.toggleCompareAccountsModal2,
}))(JurisdictionModal);
