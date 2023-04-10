import React from 'react';
import { Button, DesktopWrapper, MobileDialog, MobileWrapper, Modal, UILoader } from '@deriv/components';
import { localize } from '@deriv/translations';
import JurisdictionModalContent from './jurisdiction-modal-content';
import { getAuthenticationStatusInfo, isMobile } from '@deriv/shared';
import { TJurisdictionModalProps } from '../props.types';
import JurisdictionCheckBox from './jurisdiction-modal-checkbox';
import JurisdictionModalFootNote from './jurisdiction-modal-foot-note';
import { observer, useStore } from '@deriv/stores';

const JurisdictionModal = ({ openPasswordModal }: TJurisdictionModalProps) => {
    const {
        modules: {
            cfd: {
                account_type,
                is_jurisdiction_modal_visible,
                jurisdiction_selected_shortcode,
                real_financial_accounts_existing_data,
                real_synthetic_accounts_existing_data,
                setJurisdictionSelectedShortcode,
                toggleCFDVerificationModal,
                toggleJurisdictionModal,
                has_submitted_cfd_personal_details,
            },
        },
        client: {
            account_status,
            is_virtual,
            should_restrict_bvi_account_creation,
            should_restrict_vanuatu_account_creation,
            trading_platform_available_accounts,
            updateMT5Status,
            fetchAccountSettings,
        },
        traders_hub: { show_eu_related_content },
        ui: { disableApp, enableApp },
    } = useStore();
    const [checked, setChecked] = React.useState(false);

    const {
        poi_or_poa_not_submitted,
        poi_acknowledged_for_bvi_labuan,
        poi_acknowledged_for_vanuatu_maltainvest,
        poa_acknowledged,
        need_poa_resubmission,
    } = getAuthenticationStatusInfo(account_status);

    React.useEffect(() => {
        if (is_jurisdiction_modal_visible) {
            if (!is_virtual) {
                updateMT5Status();
                fetchAccountSettings();
            }
            setJurisdictionSelectedShortcode('');
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
        : localize('Choose a jurisdiction for your MT5 {{account_type}} account', {
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
                if (
                    is_svg_selected ||
                    (is_bvi_selected && should_restrict_bvi_account_creation && need_poa_resubmission) ||
                    (is_vanuatu_selected && should_restrict_vanuatu_account_creation && need_poa_resubmission)
                ) {
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
                !should_restrict_vanuatu_account_creation &&
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
                account_type={account_type.type}
                financial_available_accounts={financial_available_accounts}
                is_virtual={is_virtual}
                real_financial_accounts_existing_data={real_financial_accounts_existing_data}
                real_synthetic_accounts_existing_data={real_synthetic_accounts_existing_data}
                jurisdiction_selected_shortcode={jurisdiction_selected_shortcode}
                setJurisdictionSelectedShortcode={setJurisdictionSelectedShortcode}
                synthetic_available_accounts={synthetic_available_accounts}
            />
            <div className={`cfd-jurisdiction-card--${account_type.type}__footer-wrapper`}>
                <JurisdictionModalFootNote
                    account_status={account_status}
                    account_type={account_type.type}
                    card_classname={`cfd-jurisdiction-card--${account_type.type}`}
                    jurisdiction_selected_shortcode={jurisdiction_selected_shortcode}
                    should_restrict_bvi_account_creation={should_restrict_bvi_account_creation}
                    should_restrict_vanuatu_account_creation={should_restrict_vanuatu_account_creation}
                />
                <JurisdictionCheckBox
                    is_checked={checked}
                    onCheck={() => setChecked(!checked)}
                    class_name={`cfd-jurisdiction-card--${account_type.type}__jurisdiction-checkbox`}
                    jurisdiction_selected_shortcode={jurisdiction_selected_shortcode}
                    should_restrict_bvi_account_creation={should_restrict_bvi_account_creation}
                    should_restrict_vanuatu_account_creation={should_restrict_vanuatu_account_creation}
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
            </div>
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
                        width={account_type.type === 'synthetic' ? '1040px' : '1200px'}
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
    );
};

export default observer(JurisdictionModal);
