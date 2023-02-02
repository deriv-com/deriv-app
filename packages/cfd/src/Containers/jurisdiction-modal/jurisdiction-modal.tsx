import React from 'react';
import { Button, DesktopWrapper, MobileDialog, MobileWrapper, Modal, UILoader } from '@deriv/components';
import { localize } from '@deriv/translations';
import { connect } from '../../Stores/connect';
import RootStore from '../../Stores/index';
import JurisdictionModalContent from './jurisdiction-modal-content';
import { getAuthenticationStatusInfo, isMobile } from '@deriv/shared';
import { TJurisdictionModalProps } from '../props.types';

const JurisdictionModal = ({
    account_status,
    account_type,
    disableApp,
    enableApp,
    is_jurisdiction_modal_visible,
    context,
    is_virtual,
    jurisdiction_selected_shortcode,
    openPasswordModal,
    real_synthetic_accounts_existing_data,
    real_financial_accounts_existing_data,
    trading_platform_available_accounts,
    toggleJurisdictionModal,
    setJurisdictionSelectedShortcode,
    should_restrict_bvi_account_creation,
    show_eu_related_content,
    toggleCFDVerificationModal,
    updateMT5Status,
    fetchAccountSettings,
    has_submitted_cfd_personal_details,
}: TJurisdictionModalProps) => {
    const [checked, setChecked] = React.useState(false);

    const {
        poi_or_poa_not_submitted,
        poi_acknowledged_for_bvi_labuan,
        poi_acknowledged_for_vanuatu_maltainvest,
        poa_acknowledged,
    } = getAuthenticationStatusInfo(account_status);

    React.useEffect(() => {
        if (is_jurisdiction_modal_visible && !is_virtual) {
            updateMT5Status();
            setJurisdictionSelectedShortcode('');
            fetchAccountSettings();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [is_jurisdiction_modal_visible]);

    React.useEffect(() => {
        if (jurisdiction_selected_shortcode) {
            setChecked(false);
        }
    }, [jurisdiction_selected_shortcode, is_jurisdiction_modal_visible]);

    const financial_available_accounts = trading_platform_available_accounts.filter(
        available_account =>
            available_account.market_type === 'financial' &&
            (show_eu_related_content
                ? available_account.shortcode === 'maltainvest'
                : available_account.shortcode !== 'maltainvest')
    );

    const synthetic_available_accounts = trading_platform_available_accounts.filter(
        available_account =>
            available_account.market_type === 'gaming' &&
            (show_eu_related_content
                ? available_account.shortcode === 'maltainvest'
                : available_account.shortcode !== 'maltainvest')
    );

    const modal_title = show_eu_related_content
        ? localize('Jurisdiction for your Deriv MT5 CFDs account')
        : localize('Choose a jurisdiction for your Deriv MT5 {{account_type}} account', {
              account_type: account_type.type === 'synthetic' ? 'Derived' : 'Financial',
          });

    const is_svg_selected = jurisdiction_selected_shortcode === 'svg';
    const is_bvi_selected = jurisdiction_selected_shortcode === 'bvi';
    const is_vanuatu_selected = jurisdiction_selected_shortcode === 'vanuatu';
    const is_labuan_selected = jurisdiction_selected_shortcode === 'labuan';
    const is_maltainvest_selected = jurisdiction_selected_shortcode === 'maltainvest';

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
                if (is_svg_selected) {
                    return false;
                }
                return !checked;
            }
            return true;
        }
        return true;
    };

    const onSelectRealAccount = () => {
        const type_of_account = {
            category: account_type.category,
            type: account_type.type,
        };

        if (is_svg_selected) {
            openPasswordModal(type_of_account);
        } else if (is_vanuatu_selected) {
            if (
                poi_acknowledged_for_vanuatu_maltainvest &&
                !poi_or_poa_not_submitted &&
                poa_acknowledged &&
                has_submitted_cfd_personal_details
            ) {
                openPasswordModal(type_of_account);
            } else {
                toggleCFDVerificationModal();
            }
        } else if (is_bvi_selected) {
            if (
                poi_acknowledged_for_bvi_labuan &&
                !poi_or_poa_not_submitted &&
                !should_restrict_bvi_account_creation &&
                poa_acknowledged &&
                has_submitted_cfd_personal_details
            ) {
                openPasswordModal(type_of_account);
            } else {
                toggleCFDVerificationModal();
            }
        } else if (is_labuan_selected) {
            if (poi_acknowledged_for_bvi_labuan && poa_acknowledged && has_submitted_cfd_personal_details) {
                openPasswordModal(type_of_account);
            } else {
                toggleCFDVerificationModal();
            }
        } else if (is_maltainvest_selected) {
            if (poi_acknowledged_for_vanuatu_maltainvest && poa_acknowledged) {
                openPasswordModal(type_of_account);
            } else {
                toggleCFDVerificationModal();
            }
        }
    };

    const ModalContent = () => (
        <React.Fragment>
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
                context={context}
                setJurisdictionSelectedShortcode={setJurisdictionSelectedShortcode}
                synthetic_available_accounts={synthetic_available_accounts}
                should_restrict_bvi_account_creation={should_restrict_bvi_account_creation}
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
                    {localize('Next')}
                </Button>
            </Modal.Footer>
        </React.Fragment>
    );

    return (
        <div>
            <React.Suspense fallback={<UILoader />}>
                <DesktopWrapper>
                    <Modal
                        className='jurisdiction-modal'
                        disableApp={disableApp}
                        enableApp={enableApp}
                        exit_classname='cfd-modal--custom-exit'
                        is_open={is_jurisdiction_modal_visible}
                        title={modal_title}
                        toggleModal={toggleJurisdictionModal}
                        type='button'
                        context={context}
                        width={account_type.type === 'synthetic' ? '1040px' : '1200px'}
                    >
                        <ModalContent />
                    </Modal>
                </DesktopWrapper>
                <MobileWrapper>
                    <MobileDialog
                        portal_element_id='deriv_app'
                        title={modal_title}
                        context={context}
                        visible={is_jurisdiction_modal_visible}
                        onClose={toggleJurisdictionModal}
                    >
                        <ModalContent />
                    </MobileDialog>
                </MobileWrapper>
            </React.Suspense>
        </div>
    );
};

export default connect(({ modules: { cfd }, ui, client, traders_hub }: RootStore) => ({
    account_type: cfd.account_type,
    account_settings: client.account_settings,
    account_status: client.account_status,
    content_flag: traders_hub.content_flag,
    disableApp: ui.disableApp,
    enableApp: ui.enableApp,
    is_jurisdiction_modal_visible: cfd.is_jurisdiction_modal_visible,
    is_virtual: client.is_virtual,
    jurisdiction_selected_shortcode: cfd.jurisdiction_selected_shortcode,
    real_financial_accounts_existing_data: cfd.real_financial_accounts_existing_data,
    real_synthetic_accounts_existing_data: cfd.real_synthetic_accounts_existing_data,
    setAccountSettings: client.setAccountSettings,
    setJurisdictionSelectedShortcode: cfd.setJurisdictionSelectedShortcode,
    should_restrict_bvi_account_creation: client.should_restrict_bvi_account_creation,
    show_eu_related_content: traders_hub.show_eu_related_content,
    trading_platform_available_accounts: client.trading_platform_available_accounts,
    toggleCFDVerificationModal: cfd.toggleCFDVerificationModal,
    toggleJurisdictionModal: cfd.toggleJurisdictionModal,
    updateMT5Status: client.updateMT5Status,
    fetchAccountSettings: client.fetchAccountSettings,
    has_submitted_cfd_personal_details: cfd.has_submitted_cfd_personal_details,
}))(JurisdictionModal);
