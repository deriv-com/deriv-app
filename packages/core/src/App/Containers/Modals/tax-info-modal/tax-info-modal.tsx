import React, { useState } from 'react';
import { Form, Formik } from 'formik';

import { Button, Modal, Text } from '@deriv/components';
import { WS } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { Localize, localize } from '@deriv/translations';
import { DerivLightUserErrorIcon } from '@deriv/quill-icons';

import IcSuccessUserIcon from '../../../../Assets/SvgComponents/others/ic-user-success.svg';
import TaxInfoDetails from './tax-info-details';
import TaxInfoPlaceOfBirth from './tax-info-place-of-birth';
import TaxResidenceJustification from './tax-residence-justification';
import { NO_TIN_JUSTIFICATION_OPTIONS, TAX_RESIDENCE_JUSTIFICATION_OPTIONS } from './tax-info-options-list';

import './tax-info-modal.scss';

/** Enum for the modal's step state */
type TModalView = 'prompt' | 'place_of_birth' | 'tax_info' | 'tax_residence_justification' | 'success';

type TTaxInfoModalProps = {
    show_place_of_birth: boolean;
    needs_update_tin: boolean;
    needs_update_tax_residence: boolean;
};

const TaxInfoModal = observer(
    ({ show_place_of_birth, needs_update_tin, needs_update_tax_residence }: TTaxInfoModalProps) => {
        const { client, ui } = useStore();
        const { account_settings, residence, updateAccountStatus } = client;
        const { is_tax_info_modal_open, setShouldShowTaxInfoModal } = ui;

        // ── Pre-populate helpers ──────────────────────────────────────────────

        /** Derive initial has_tax_details from tin_skipped + existing TIN */
        const getInitialHasTaxDetails = (): boolean | null => {
            const { tin_skipped, tax_identification_number: tin } = account_settings ?? {};
            if (tin_skipped === 1) return false;
            if (tin_skipped === 0 && tin) return true;
            // Fallback: infer from whether a TIN value exists
            if (tin) return true;
            return null;
        };

        /**
         * Given a BE justification string, return the matching option key.
         * If it matches a predefined key → return that key.
         * If it doesn't match (free-text) → return 'other'.
         * If empty → return ''.
         */
        const resolveJustificationKey = (
            be_value: string | undefined,
            options: typeof NO_TIN_JUSTIFICATION_OPTIONS
        ): string => {
            if (!be_value) return '';
            const matched = options.find(o => !o.is_other && o.key === be_value);
            return matched ? matched.key : 'other';
        };

        /** Return the free-text reason when the BE value didn't match any predefined option */
        const resolveOtherReason = (
            be_value: string | undefined,
            options: typeof NO_TIN_JUSTIFICATION_OPTIONS
        ): string => {
            if (!be_value) return '';
            const matched = options.find(o => !o.is_other && o.key === be_value);
            return matched ? '' : be_value;
        };

        // ── State ─────────────────────────────────────────────────────────────

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const settings = account_settings as any;
        const be_no_tin_justification: string | undefined = settings?.no_tin_justification;
        const be_tax_residence_justification: string | undefined = settings?.tax_residence_justification;
        const initial_has_tax_details = getInitialHasTaxDetails();
        const initial_tin = account_settings?.tax_identification_number ?? '';

        // Modal navigation state
        const [current_view, setCurrentView] = useState<TModalView>('prompt');

        // Form data state — pre-populated from BE where available
        const [place_of_birth, setPlaceOfBirth] = useState(account_settings?.place_of_birth ?? '');
        const [tax_residence, setTaxResidence] = useState(account_settings?.tax_residence ?? '');
        const [has_tax_details, setHasTaxDetails] = useState<boolean | null>(initial_has_tax_details);
        const [tax_identification_number, setTaxIdentificationNumber] = useState(initial_tin);
        // If TIN was already set by BE, pre-check the confirmation
        const [tax_identification_confirm, setTaxIdentificationConfirm] = useState(
            initial_has_tax_details === true && !!initial_tin
        );
        const [no_tin_justification_key, setNoTinJustificationKey] = useState(
            resolveJustificationKey(be_no_tin_justification, NO_TIN_JUSTIFICATION_OPTIONS)
        );
        const [no_tin_other_reason, setNoTinOtherReason] = useState(
            resolveOtherReason(be_no_tin_justification, NO_TIN_JUSTIFICATION_OPTIONS)
        );
        const [tax_residence_justification_key, setTaxResidenceJustificationKey] = useState(
            resolveJustificationKey(be_tax_residence_justification, TAX_RESIDENCE_JUSTIFICATION_OPTIONS)
        );
        const [tax_residence_other_reason, setTaxResidenceOtherReason] = useState(
            resolveOtherReason(be_tax_residence_justification, TAX_RESIDENCE_JUSTIFICATION_OPTIONS)
        );
        const [is_submitting, setIsSubmitting] = useState(false);
        const [submit_error, setSubmitError] = useState('');
        const [tin_validation_error, setTinValidationError] = useState('');

        const tax_residence_differs = tax_residence && residence && tax_residence !== residence;

        /** Determine the first form step after prompt */
        const getFirstFormStep = (): TModalView => {
            if (show_place_of_birth) return 'place_of_birth';
            return 'tax_info';
        };

        /** Check if the current step's Next button should be enabled */
        const isNextEnabled = (): boolean => {
            switch (current_view) {
                case 'place_of_birth':
                    return !!place_of_birth;
                case 'tax_info': {
                    if (!tax_residence) return false;
                    if (has_tax_details === null) return false;
                    if (has_tax_details === true) {
                        return !!tax_identification_number && tax_identification_confirm && !tin_validation_error;
                    }
                    // has_tax_details === false: need a justification
                    if (!no_tin_justification_key) return false;
                    if (no_tin_justification_key === 'other' && !no_tin_other_reason.trim()) return false;
                    return true;
                }
                case 'tax_residence_justification': {
                    if (!tax_residence_justification_key) return false;
                    if (tax_residence_justification_key === 'other' && !tax_residence_other_reason.trim()) return false;
                    return true;
                }
                default:
                    return true;
            }
        };

        /** Get the value to submit for no_tin_justification */
        const getNoTinJustificationValue = (): string => {
            if (no_tin_justification_key === 'other') return no_tin_other_reason;
            return no_tin_justification_key;
        };

        /** Get the value to submit for tax_residence_justification */
        const getTaxResidenceJustificationValue = (): string => {
            if (tax_residence_justification_key === 'other') return tax_residence_other_reason;
            return tax_residence_justification_key;
        };

        /** Determine what the next step should be */
        const getNextStep = (): TModalView | 'submit' => {
            if (current_view === 'place_of_birth') {
                // Skip tax_info step if neither TIN nor tax_residence update is needed
                if (needs_update_tin || needs_update_tax_residence) return 'tax_info';
                return 'submit';
            }
            if (current_view === 'tax_info') {
                if (tax_residence_differs) return 'tax_residence_justification';
                return 'submit';
            }
            if (current_view === 'tax_residence_justification') return 'submit';
            return 'submit';
        };

        const handleNext = async () => {
            const next = getNextStep();
            if (next === 'submit') {
                await handleSubmit();
            } else {
                setCurrentView(next);
            }
        };

        const handleBack = () => {
            switch (current_view) {
                case 'tax_info':
                    if (show_place_of_birth) {
                        setCurrentView('place_of_birth');
                    } else {
                        setCurrentView('prompt');
                    }
                    break;
                case 'tax_residence_justification':
                    setCurrentView('tax_info');
                    break;
                default:
                    setCurrentView('prompt');
            }
        };

        const handleSubmit = async () => {
            setIsSubmitting(true);
            setSubmitError('');
            try {
                const payload: Record<string, unknown> = {};

                if (show_place_of_birth && place_of_birth) {
                    payload.place_of_birth = place_of_birth;
                }

                if (tax_residence) {
                    payload.tax_residence = tax_residence;
                }

                if (has_tax_details === true && tax_identification_number) {
                    payload.tax_identification_number = tax_identification_number;
                    payload.tin_skipped = 0;
                } else if (has_tax_details === false) {
                    payload.no_tin_justification = getNoTinJustificationValue();
                    payload.tin_skipped = 1;
                }

                if (tax_residence_differs && tax_residence_justification_key) {
                    payload.tax_residence_justification = getTaxResidenceJustificationValue();
                }

                const response = await WS.setSettings(payload);

                if (response?.error) {
                    setSubmitError(response.error?.message ?? localize('An error occurred. Please try again.'));
                    return;
                }

                await updateAccountStatus();
                setCurrentView('success');
            } catch (_err) {
                setSubmitError(localize('An error occurred. Please try again.'));
            } finally {
                setIsSubmitting(false);
            }
        };

        const handleClose = () => {
            setShouldShowTaxInfoModal(false);
        };

        /** Render: initial prompt */
        if (current_view === 'prompt') {
            return (
                <Modal
                    is_open={is_tax_info_modal_open}
                    title=''
                    height='auto'
                    width='440px'
                    has_close_icon={false}
                    className='tax-info-modal'
                >
                    <Modal.Body>
                        <div className='tax-info-modal__prompt'>
                            <div className='tax-info-modal__prompt-icon'>
                                <DerivLightUserErrorIcon height='120px' width='120px' />
                            </div>
                            <Text size='xsm' weight='bold' className='tax-info-modal__prompt-title'>
                                <Localize i18n_default_text='Tax information' />
                            </Text>
                            <Text size='s' align='center' className='tax-info-modal__prompt-subtitle'>
                                <Localize i18n_default_text='We need your latest tax information before you can continue.' />
                            </Text>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button rounded wide primary onClick={() => setCurrentView(getFirstFormStep())}>
                            <Localize i18n_default_text='Proceed' />
                        </Button>
                    </Modal.Footer>
                </Modal>
            );
        }

        /** Render: success screen */
        if (current_view === 'success') {
            return (
                <Modal
                    is_open={is_tax_info_modal_open}
                    title=''
                    height='auto'
                    width='440px'
                    has_close_icon={false}
                    className='tax-info-modal'
                >
                    <Modal.Body>
                        <div className='tax-info-modal__success'>
                            <div className='tax-info-modal__success-icon'>
                                <IcSuccessUserIcon />
                            </div>
                            <Text size='xsm' weight='bold'>
                                <Localize i18n_default_text='Tax information' />
                            </Text>
                            <Text size='s' align='center'>
                                <Localize i18n_default_text='Your tax information has been successfully updated.' />
                            </Text>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button rounded wide primary onClick={handleClose}>
                            <Localize i18n_default_text='Continue' />
                        </Button>
                    </Modal.Footer>
                </Modal>
            );
        }

        /** Render: multi-step form views */
        const form_title = localize('Tax information');

        return (
            <Modal
                is_open={is_tax_info_modal_open}
                title={form_title}
                height='auto'
                width='440px'
                should_header_stick_body
                has_close_icon={false}
                className='tax-info-modal'
            >
                <Formik
                    initialValues={{
                        place_of_birth,
                        tax_residence,
                        tax_identification_number,
                    }}
                    onSubmit={() => {
                        /* handled by handleNext */
                    }}
                >
                    {() => (
                        <Form>
                            <div className='tax-info-modal__form'>
                                {/* Step: Place of birth */}
                                {current_view === 'place_of_birth' && (
                                    <TaxInfoPlaceOfBirth
                                        value={place_of_birth}
                                        onItemSelection={val => setPlaceOfBirth(val)}
                                    />
                                )}

                                {/* Step: Tax info */}
                                {current_view === 'tax_info' && (
                                    <TaxInfoDetails
                                        tax_residence_value={tax_residence}
                                        tax_identification_number={tax_identification_number}
                                        has_tax_details={has_tax_details}
                                        no_tin_justification_key={no_tin_justification_key}
                                        no_tin_other_reason={no_tin_other_reason}
                                        tax_identification_confirm={tax_identification_confirm}
                                        onTaxResidenceChange={val => setTaxResidence(val)}
                                        onTinChange={val => setTaxIdentificationNumber(val)}
                                        onTinValidationError={err => setTinValidationError(err)}
                                        onHasTaxDetailsChange={val => {
                                            // Only reset sub-fields when actually switching to a different option
                                            if (val === has_tax_details) return;
                                            setHasTaxDetails(val);
                                            setNoTinJustificationKey('');
                                            setNoTinOtherReason('');
                                            setTaxIdentificationNumber('');
                                            setTaxIdentificationConfirm(false);
                                            setTinValidationError('');
                                        }}
                                        onNoTinJustificationSelect={key => {
                                            setNoTinJustificationKey(key);
                                            if (key !== 'other') {
                                                setNoTinOtherReason('');
                                            }
                                        }}
                                        onNoTinOtherReasonChange={val => setNoTinOtherReason(val)}
                                        onTaxIdConfirmChange={val => setTaxIdentificationConfirm(val)}
                                    />
                                )}

                                {/* Step: Tax residence justification */}
                                {current_view === 'tax_residence_justification' && (
                                    <TaxResidenceJustification
                                        selected_key={tax_residence_justification_key}
                                        other_reason={tax_residence_other_reason}
                                        onSelect={key => {
                                            setTaxResidenceJustificationKey(key);
                                            if (key !== 'other') {
                                                setTaxResidenceOtherReason('');
                                            }
                                        }}
                                        onOtherReasonChange={val => setTaxResidenceOtherReason(val)}
                                    />
                                )}

                                {submit_error && (
                                    <Text size='xs' color='loss-danger' style={{ marginTop: '1.2rem' }}>
                                        {submit_error}
                                    </Text>
                                )}
                            </div>

                            <Modal.Footer className='tax-info-modal__footer'>
                                <div className='tax-info-modal__footer-buttons'>
                                    <Button
                                        rounded
                                        wide
                                        primary
                                        disabled={!isNextEnabled() || is_submitting}
                                        is_loading={is_submitting}
                                        onClick={handleNext}
                                        type='button'
                                    >
                                        <Localize i18n_default_text='Next' />
                                    </Button>
                                    <Button rounded wide secondary onClick={handleBack} type='button'>
                                        <Localize i18n_default_text='Back' />
                                    </Button>
                                </div>
                            </Modal.Footer>
                        </Form>
                    )}
                </Formik>
            </Modal>
        );
    }
);

export default TaxInfoModal;
