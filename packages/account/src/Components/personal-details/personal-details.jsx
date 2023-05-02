import React from 'react';
import classNames from 'classnames';
import { Formik, Field, Form } from 'formik';
import {
    Modal,
    AutoHeightWrapper,
    Div100vhContainer,
    FormSubmitButton,
    ThemedScrollbars,
    Text,
} from '@deriv/components';
import { isDesktop, isMobile, PlatformContext, IDV_NOT_APPLICABLE_OPTION } from '@deriv/shared';
import { localize, Localize } from '@deriv/translations';
import { shouldShowIdentityInformation, documentAdditionalError, getRegex } from 'Helpers/utils';
import { splitValidationResultTypes } from '../real-account-signup/helpers/utils';
import IDVForm from '../forms/idv-form';
import PersonalDetailsForm from '../forms/personal-details-form';
import FormSubHeader from '../form-sub-header';

const PersonalDetails = ({
    getCurrentStep,
    onSave,
    onCancel,
    onSubmit,
    goToPreviousStep,
    goToNextStep,
    validate,
    salutation_list,
    disabled_items,
    is_mf,
    is_svg,
    residence_list,
    is_virtual,
    is_fully_authenticated,
    account_opening_reason_list,
    onSubmitEnabledChange,
    selected_step_ref,
    closeRealAccountSignup,
    has_real_account,
    ...props
}) => {
    const { account_status, account_settings, residence, real_account_signup_target } = props;
    const { is_appstore } = React.useContext(PlatformContext);
    const [is_tax_residence_popover_open, setIsTaxResidencePopoverOpen] = React.useState(false);
    const [is_tin_popover_open, setIsTinPopoverOpen] = React.useState(false);
    const [warning_items, setWarningItems] = React.useState({});
    const is_submit_disabled_ref = React.useRef(true);

    const isSubmitDisabled = errors => {
        return selected_step_ref?.current?.isSubmitting || Object.keys(errors).length > 0;
    };

    const checkSubmitStatus = errors => {
        const is_submit_disabled = isSubmitDisabled(errors);

        if (is_submit_disabled_ref.current !== is_submit_disabled) {
            is_submit_disabled_ref.current = is_submit_disabled;
            onSubmitEnabledChange?.(!is_submit_disabled);
        }
    };

    const handleCancel = values => {
        const current_step = getCurrentStep() - 1;
        onSave(current_step, values);
        onCancel(current_step, goToPreviousStep);
    };

    const is_qualified_for_idv = shouldShowIdentityInformation({
        account_status,
        account_settings,
        residence,
        residence_list,
        real_account_signup_target,
    });

    const validateIDV = values => {
        const errors = {};
        const { document_type, document_number, document_additional } = values;
        if (document_type.id === IDV_NOT_APPLICABLE_OPTION.id) return errors;
        const needs_additional_document = !!document_type.additional;
        const is_document_number_invalid = document_number === document_type.example_format;
        if (!document_type || !document_type.text) {
            errors.document_type = localize('Please select a document type.');
        }
        if (needs_additional_document) {
            const error_message = documentAdditionalError(document_additional, document_type.additional?.format);
            if (error_message)
                errors.document_additional =
                    localize(error_message) + getExampleFormat(document_type.additional?.example_format);
        }

        if (!document_number) {
            errors.document_number =
                localize('Please enter your document number. ') + getExampleFormat(document_type.example_format);
        } else if (is_document_number_invalid) {
            errors.document_number = localize('Please enter a valid ID number.');
        } else {
            const format_regex = getRegex(document_type.value);
            if (!format_regex.test(document_number)) {
                errors.document_number =
                    localize('Please enter the correct format. ') + getExampleFormat(document_type.example_format);
            }
        }
        return errors;
    };

    const handleValidate = values => {
        let idv_error = {};
        if (is_qualified_for_idv) {
            idv_error = validateIDV(values);
        }
        const { errors, warnings } = splitValidationResultTypes(validate(values));
        const error_data = { ...idv_error, ...errors };
        setWarningItems(warnings);
        checkSubmitStatus(error_data);
        return error_data;
    };

    const closeTooltipOnScroll = () => {
        // Close any open tooltip
        if (!is_tax_residence_popover_open || !is_tin_popover_open) {
            setIsTaxResidencePopoverOpen(false);
            setIsTinPopoverOpen(false);
        }
    };

    const handleClickOutside = () => {
        if (is_tax_residence_popover_open) {
            setIsTaxResidencePopoverOpen(false);
        }
        if (is_tin_popover_open) {
            setIsTinPopoverOpen(false);
        }
    };

    /*
    In most modern browsers, setting autocomplete to "off" will not prevent a password manager from asking the user if they would like to save username and password information, or from automatically filling in those values in a site's login form.
    check this link https://developer.mozilla.org/en-US/docs/Web/Security/Securing_your_site/Turning_off_form_autocompletion#the_autocomplete_attribute_and_login_fields
    */
    // for dropdowns use 'none'

    const getExampleFormat = example_format => {
        return example_format ? localize('Example: ') + example_format : '';
    };

    return (
        <Formik
            innerRef={selected_step_ref}
            initialValues={{ ...props.value }}
            validate={handleValidate}
            validateOnMount
            onSubmit={(values, actions) => {
                onSubmit(getCurrentStep() - 1, values, actions.setSubmitting, goToNextStep);
            }}
        >
            {({ handleSubmit, errors, setFieldValue, setFieldTouched, touched, values, handleChange, handleBlur }) => (
                <AutoHeightWrapper default_height={380} height_offset={isDesktop() ? 81 : null}>
                    {({ setRef, height }) => (
                        <Form
                            ref={setRef}
                            onSubmit={handleSubmit}
                            autoComplete='off'
                            onClick={handleClickOutside}
                            data-testid='personal_details_form'
                        >
                            <Div100vhContainer className='details-form' height_offset='90px' is_disabled={isDesktop()}>
                                {!is_qualified_for_idv && (
                                    <Text as='p' size='xxxs' align='center' className='details-form__description'>
                                        <Localize
                                            i18n_default_text={
                                                'Any information you provide is confidential and will be used for verification purposes only.'
                                            }
                                        />
                                    </Text>
                                )}
                                <ThemedScrollbars
                                    height={height}
                                    onScroll={closeTooltipOnScroll}
                                    testId='dt_personal_details_container'
                                >
                                    {!is_qualified_for_idv && is_appstore && (
                                        <div className='details-form__sub-header'>
                                            <Text size={isMobile() ? 'xs' : 'xxs'} align={isMobile() && 'center'}>
                                                {localize(
                                                    'We need this for verification. If the information you provide is fake or inaccurate, you won’t be able to deposit and withdraw.'
                                                )}
                                            </Text>
                                        </div>
                                    )}

                                    <div
                                        className={classNames('details-form__elements', 'personal-details-form')}
                                        style={{ paddingBottom: isDesktop() ? 'unset' : null }}
                                    >
                                        {is_qualified_for_idv && (
                                            <React.Fragment>
                                                <FormSubHeader title={localize('Identity verification')} />
                                                <Field name='document'>
                                                    {({ field }) => (
                                                        <IDVForm
                                                            account_settings={account_settings}
                                                            residence={residence}
                                                            residence_list={residence_list}
                                                            errors={errors}
                                                            touched={touched}
                                                            values={values}
                                                            handleChange={handleChange}
                                                            handleBlur={handleBlur}
                                                            setFieldValue={setFieldValue}
                                                            hide_hint={true}
                                                            {...field}
                                                        />
                                                    )}
                                                </Field>
                                                <FormSubHeader title={localize('Details')} />
                                            </React.Fragment>
                                        )}
                                        <React.Fragment>
                                            <Field>
                                                {({ field }) => (
                                                    <div
                                                        className={classNames({
                                                            'account-form__poi-confirm-example_container':
                                                                is_qualified_for_idv,
                                                        })}
                                                    >
                                                        <PersonalDetailsForm
                                                            errors={errors}
                                                            touched={touched}
                                                            values={values}
                                                            handleChange={handleChange}
                                                            handleBlur={handleBlur}
                                                            setFieldValue={setFieldValue}
                                                            setFieldTouched={setFieldTouched}
                                                            is_virtual={is_virtual}
                                                            is_svg={is_svg}
                                                            is_mf={is_mf}
                                                            is_qualified_for_idv={is_qualified_for_idv}
                                                            is_appstore={is_appstore}
                                                            disabled_items={disabled_items}
                                                            residence_list={residence_list}
                                                            has_real_account={has_real_account}
                                                            is_fully_authenticated={is_fully_authenticated}
                                                            closeRealAccountSignup={closeRealAccountSignup}
                                                            salutation_list={salutation_list}
                                                            warning_items={warning_items}
                                                            account_opening_reason_list={account_opening_reason_list}
                                                            {...field}
                                                        />
                                                    </div>
                                                )}
                                            </Field>
                                        </React.Fragment>
                                    </div>
                                </ThemedScrollbars>
                            </Div100vhContainer>
                            <Modal.Footer has_separator is_bypassed={isMobile()}>
                                <FormSubmitButton
                                    cancel_label={localize('Previous')}
                                    has_cancel
                                    is_disabled={isSubmitDisabled(errors)}
                                    is_absolute={isMobile()}
                                    label={localize('Next')}
                                    onCancel={() => handleCancel(values)}
                                />
                            </Modal.Footer>
                        </Form>
                    )}
                </AutoHeightWrapper>
            )}
        </Formik>
    );
};

export default PersonalDetails;
