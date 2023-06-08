import classNames from 'classnames';
import React from 'react';
import { Button, Modal } from '@deriv/components';
import { getAuthenticationStatusInfo, isMobile, Jurisdiction } from '@deriv/shared';
import { localize } from '@deriv/translations';
import { TJurisdictionModalContentWrapperProps } from '../props.types';
import JurisdictionModalContent from './jurisdiction-modal-content';
import JurisdictionCheckBox from './jurisdiction-modal-checkbox';
import JurisdictionModalFootNote from './jurisdiction-modal-foot-note';
import { useStore, observer } from '@deriv/stores';
import { useCfdStore } from '../../Stores/Modules/CFD/Helpers/useCfdStores';

const JurisdictionModalContentWrapper = observer(({ openPasswordModal }: TJurisdictionModalContentWrapperProps) => {
    const { client, traders_hub } = useStore();

    const { show_eu_related_content } = traders_hub;

    const {
        trading_platform_available_accounts,
        account_status,
        fetchAccountSettings,
        residence,
        residence_list,
        is_virtual,
        updateMT5Status,
        should_restrict_vanuatu_account_creation,
        should_restrict_bvi_account_creation,
    } = client;

    const {
        is_jurisdiction_modal_visible,
        has_submitted_cfd_personal_details,
        jurisdiction_selected_shortcode,
        toggleCFDVerificationModal,
        toggleJurisdictionModal,
        account_type,
        real_financial_accounts_existing_data,
        real_swapfree_accounts_existing_data,
        real_synthetic_accounts_existing_data,
        setJurisdictionSelectedShortcode,
    } = useCfdStore();

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

    const is_svg_selected = jurisdiction_selected_shortcode === Jurisdiction.SVG;
    const is_bvi_selected = jurisdiction_selected_shortcode === Jurisdiction.BVI;
    const is_vanuatu_selected = jurisdiction_selected_shortcode === Jurisdiction.VANUATU;
    const is_labuan_selected = jurisdiction_selected_shortcode === Jurisdiction.LABUAN;
    const is_maltainvest_selected = jurisdiction_selected_shortcode === Jurisdiction.MALTA_INVEST;

    const is_idv_country =
        residence_list.find(elem => elem?.value === residence)?.identity?.services?.idv?.is_country_supported === 1;
    const has_idv_attempts = (account_status?.authentication?.identity?.services?.idv?.submissions_left ?? 0) > 0;
    const is_non_idv_design = !is_idv_country || (is_idv_country && !has_idv_attempts);

    const swapfree_available_accounts = trading_platform_available_accounts.filter(
        available_account =>
            available_account.market_type === 'all' &&
            (show_eu_related_content
                ? available_account.shortcode === 'maltainvest'
                : available_account.shortcode !== 'maltainvest')
    );

    const isNextButtonDisabled = () => {
        if (jurisdiction_selected_shortcode) {
            let is_account_created;
            if (account_type.type === 'synthetic') {
                is_account_created = real_synthetic_accounts_existing_data?.some(
                    account => account.landing_company_short === jurisdiction_selected_shortcode
                );
            } else if (account_type.type === 'all') {
                is_account_created = real_swapfree_accounts_existing_data?.some(
                    account => account.landing_company_short === jurisdiction_selected_shortcode
                );
            } else {
                is_account_created = real_financial_accounts_existing_data?.some(
                    account => account.landing_company_short === jurisdiction_selected_shortcode
                );
            }
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

    return (
        <div className='jurisdiction-modal__content-wrapper'>
            <div className='jurisdiction-modal__scrollable-content'>
                <JurisdictionModalContent
                    account_status={account_status}
                    account_type={account_type.type}
                    financial_available_accounts={financial_available_accounts}
                    is_non_idv_design={is_non_idv_design}
                    is_virtual={is_virtual}
                    real_financial_accounts_existing_data={real_financial_accounts_existing_data}
                    real_synthetic_accounts_existing_data={real_synthetic_accounts_existing_data}
                    jurisdiction_selected_shortcode={jurisdiction_selected_shortcode}
                    real_swapfree_accounts_existing_data={real_swapfree_accounts_existing_data}
                    setJurisdictionSelectedShortcode={setJurisdictionSelectedShortcode}
                    swapfree_available_accounts={swapfree_available_accounts}
                    synthetic_available_accounts={synthetic_available_accounts}
                />
                <div
                    className={classNames(
                        'jurisdiction-modal__footer-content',
                        `cfd-jurisdiction-card--${account_type.type}__footer-wrapper`
                    )}
                >
                    <div className={`cfd-jurisdiction-card--${account_type.type}__footnotes-container`}>
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
                    </div>
                </div>
            </div>
            <Modal.Footer className='jurisdiction-modal__footer-button' has_separator>
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
    );
});

export default JurisdictionModalContentWrapper;
