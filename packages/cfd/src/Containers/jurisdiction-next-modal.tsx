import React from 'react';
import { Button, Modal, DesktopWrapper, MobileDialog, MobileWrapper, UILoader } from '@deriv/components';
import { localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import RootStore from 'Stores/index';
import { CFD_PLATFORMS } from '@deriv/shared';
import { LandingCompany } from '@deriv/api-types';
import { ProofOfIdentityContainer } from '@deriv/account';

type TCompareAccountsReusedProps = {
    landing_companies: LandingCompany;
    platform: string;
    is_logged_in: boolean;
    is_uk: boolean;
};

type TJurisdictionNextModalProps = TCompareAccountsReusedProps & {
    account_type: string;
    authentication_status: {
        document_status: string;
        identity_status: string;
    };
    disableApp: () => void;
    enableApp: () => void;
    is_bvi_poi_modal_open: boolean;
    is_loading: boolean;
    is_eu: boolean;
    is_fully_authenticated: boolean;
    residence: string;
    jurisdiction_selected_card: string | undefined;
    toggleBVIPOIModal: () => void;
    tradingPlatformAvailableAccounts: any[];
};

const JurisdictionNextModal = ({
    disableApp,
    enableApp,
    is_bvi_poi_modal_open,
    is_loading,
    platform,
    toggleBVIPOIModal,
    authentication_status,
}: TJurisdictionNextModalProps) => {
    return (
        <>
            <div
                className='cfd-compare-accounts-modal__wrapper'
                style={{ marginTop: platform === CFD_PLATFORMS.DXTRADE ? '5rem' : '2.4rem' }}
            >
                <Button
                    className='cfd-dashboard__welcome-message--button'
                    has_effect
                    text={'BVI'}
                    onClick={toggleBVIPOIModal}
                    secondary
                    disabled={is_loading}
                />
                <React.Suspense fallback={<UILoader />}>
                    <DesktopWrapper>
                        <Modal
                            className='cfd-dashboard__compare-accounts'
                            disableApp={disableApp}
                            enableApp={enableApp}
                            is_open={is_bvi_poi_modal_open}
                            title={localize('Abcd')}
                            toggleModal={toggleBVIPOIModal}
                            type='button'
                            height='696px'
                            width='1200px'
                        >
                            <ProofOfIdentityContainer
                                height={200}
                                is_from_external={true}
                                onStateChange={authentication_status?.identity_status}
                            />
                            <Modal.Footer>
                                <Button primary>Next</Button>
                            </Modal.Footer>
                        </Modal>
                    </DesktopWrapper>
                    <MobileWrapper>
                        <MobileDialog
                            portal_element_id='deriv_app'
                            title={localize('BVI')}
                            wrapper_classname='cfd-dashboard__compare-accounts'
                            visible={is_bvi_poi_modal_open}
                            onClose={toggleBVIPOIModal}
                        >
                            <ProofOfIdentityContainer
                                height={200}
                                is_from_external={true}
                                onStateChange={authentication_status?.identity_status}
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
    is_bvi_poi_modal_open: modules.cfd.is_bvi_poi_modal_open,
    tradingPlatformAvailableAccounts: client.tradingPlatformAvailableAccounts,
    is_loading: client.is_populating_mt5_account_list,
    is_eu: client.is_eu,
    is_uk: client.is_uk,
    is_eu_country: client.is_eu_country,
    is_logged_in: client.is_logged_in,
    is_fully_authenticated: client.is_fully_authenticated,
    landing_companies: client.landing_companies,
    residence: client.residence,
    jurisdiction_selected_card: modules.cfd.jurisdiction_selected_card,
    toggleBVIPOIModal: modules.cfd.toggleBVIPOIModal,
}))(JurisdictionNextModal);
