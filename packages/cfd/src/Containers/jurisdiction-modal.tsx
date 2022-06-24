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
    is_jurisdiction_modal_visible: boolean;
    is_loading: boolean;
    is_eu: boolean;
    is_eu_country: boolean;
    residence: string;
    jurisdiction_selected_card: boolean;
    toggleJurisdictionModal: () => void;
    tradingPlatformAvailableAccounts: any[];
};

const JurisdictionModal = ({
    disableApp,
    enableApp,
    is_jurisdiction_modal_visible,
    is_loading,
    platform,
    jurisdiction_selected_card,
    toggleJurisdictionModal,
    tradingPlatformAvailableAccounts,
}: TJurisdictionModalProps) => {
    const financial_available_accounts = tradingPlatformAvailableAccounts
        .filter(available_account => available_account.market_type === 'financial')
        .map((acc: any[]) => acc);

    const synthetic_available_accounts = tradingPlatformAvailableAccounts
        .filter(available_account => available_account.market_type === 'gaming')
        .map((acc: any[]) => acc);

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
                    onClick={toggleJurisdictionModal}
                    secondary
                    disabled={is_loading}
                />
                <React.Suspense fallback={<UILoader />}>
                    <DesktopWrapper>
                        <Modal
                            className='cfd-dashboard__compare-accounts'
                            disableApp={disableApp}
                            enableApp={enableApp}
                            is_open={is_jurisdiction_modal_visible}
                            title={'Choose a jurisdiction for your DMT5 financial account'}
                            toggleModal={toggleJurisdictionModal}
                            type='button'
                            height='696px'
                            width='1200px'
                        >
                            <JurisdictionModalContent
                                financial_available_accounts={financial_available_accounts}
                                synthetic_available_accounts={synthetic_available_accounts}
                            />
                            <Modal.Footer>
                                <Button disabled={jurisdiction_selected_card === undefined} primary>
                                    Next
                                </Button>
                            </Modal.Footer>
                        </Modal>
                    </DesktopWrapper>
                    <MobileWrapper>
                        <MobileDialog
                            portal_element_id='deriv_app'
                            title={localize('Compare accounts')}
                            wrapper_classname='cfd-dashboard__compare-accounts'
                            visible={is_jurisdiction_modal_visible}
                            onClose={toggleJurisdictionModal}
                        >
                            <JurisdictionModalContent
                                financial_available_accounts={financial_available_accounts}
                                synthetic_available_accounts={synthetic_available_accounts}
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
    is_jurisdiction_modal_visible: modules.cfd.is_jurisdiction_modal_visible,
    tradingPlatformAvailableAccounts: client.tradingPlatformAvailableAccounts,
    is_loading: client.is_populating_mt5_account_list,
    is_eu: client.is_eu,
    is_uk: client.is_uk,
    is_eu_country: client.is_eu_country,
    is_logged_in: client.is_logged_in,
    landing_companies: client.landing_companies,
    residence: client.residence,
    jurisdiction_selected_card: modules.cfd.jurisdiction_selected_card,
    toggleJurisdictionModal: modules.cfd.toggleJurisdictionModal,
}))(JurisdictionModal);
