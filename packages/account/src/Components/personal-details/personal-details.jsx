import { Formik, Field } from 'formik';
import React from 'react';
import {
    Modal,
    Autocomplete,
    AutoHeightWrapper,
    Checkbox,
    Dropdown,
    DesktopWrapper,
    MobileWrapper,
    DateOfBirthPicker,
    Div100vhContainer,
    FormSubmitButton,
    Input,
    Popover,
    RadioGroup,
    SelectNative,
    ThemedScrollbars,
    Text,
} from '@deriv/components';
import { Link } from 'react-router-dom';
import { localize, Localize } from '@deriv/translations';
import { getLegalEntityName, isDesktop, isMobile, routes, toMoment, PlatformContext } from '@deriv/shared';
import { getEmploymentStatusList } from 'Sections/Assessment/FinancialAssessment/financial-information-list';
import { splitValidationResultTypes } from '../real-account-signup/helpers/utils';
import FormSubHeader from '../form-sub-header';
import classNames from 'classnames';

const DateOfBirthField = props => (
    <Field name={props.name}>
        {({ field: { value }, form: { setFieldValue, errors, touched, setTouched } }) => (
            <DateOfBirthPicker
                error={touched.date_of_birth && errors.date_of_birth}
                onBlur={() =>
                    setTouched({
                        ...touched,
                        date_of_birth: true,
                    })
                }
                onChange={({ target }) =>
                    setFieldValue(
                        'date_of_birth',
                        target?.value ? toMoment(target.value).format('YYYY-MM-DD') : '',
                        true
                    )
                }
                value={value}
                portal_id={props.portal_id}
                {...props}
            />
        )}
    </Field>
);

const FormInputField = ({ name, optional = false, warn, ...props }) => (
    <Field name={name}>
        {({ field, form: { errors, touched } }) => (
            <Input
                type='text'
                required={!optional}
                name={name}
                autoComplete='off'
                maxLength={props.maxLength || 30}
                error={touched[field.name] && errors[field.name]}
                warn={warn}
                {...field}
                {...props}
            />
        )}
    </Field>
);

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
    ...props
}) => {
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

    const handleValidate = values => {
        const { errors, warnings } = splitValidationResultTypes(validate(values));
        setWarningItems(warnings);
        checkSubmitStatus(errors);
        return errors;
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

    const getLastNameLabel = () => {
        if (is_appstore) return localize('Family name*');
        return is_svg || is_mf ? localize('Last name*') : localize('Last name');
    };

    const getFieldHint = field_name => {
        return (
            <Localize
                i18n_default_text='Please enter your {{ field_name }} as in your official identity documents.'
                values={{ field_name }}
            />
        );
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
                        <form
                            ref={setRef}
                            onSubmit={handleSubmit}
                            autoComplete='off'
                            onClick={handleClickOutside}
                            data-testid='personal_details_form'
                        >
                            <Div100vhContainer className='details-form' height_offset='90px' is_disabled={isDesktop()}>
                                <Text as='p' size='xxxs' align='center' className='details-form__description'>
                                    <Localize
                                        i18n_default_text={
                                            'Any information you provide is confidential and will be used for verification purposes only.'
                                        }
                                    />
                                </Text>
                                <ThemedScrollbars
                                    height={height}
                                    onScroll={closeTooltipOnScroll}
                                    testId='dt_personal_details_container'
                                >
                                    {is_appstore && (
                                        <div className='details-form__sub-header'>
                                            <Text size={isMobile() ? 'xs' : 'xxs'} align={isMobile() && 'center'}>
                                                {localize(
                                                    'We need this for verification. If the information you provide is fake or inaccurate, you won’t be able to deposit and withdraw.'
                                                )}
                                            </Text>
                                        </div>
                                    )}

                                    <div
                                        className='details-form__elements'
                                        style={{ paddingBottom: isDesktop() ? 'unset' : null }}
                                    >
                                        {'salutation' in props.value && (
                                            <div>
                                                <Text size={isMobile() ? 'xs' : 'xxs'} align={isMobile() && 'center'}>
                                                    {is_virtual ? (
                                                        localize(
                                                            'Please remember that it is your responsibility to keep your answers accurate and up to date. You can update your personal details at any time in your account settings.'
                                                        )
                                                    ) : (
                                                        <Localize
                                                            i18n_default_text='Please remember that it is your responsibility to keep your answers accurate and up to date. You can update your personal details at any time in your <0>account settings</0>.'
                                                            components={[
                                                                <Link
                                                                    to={routes.personal_details}
                                                                    key={0}
                                                                    className='link'
                                                                    onClick={closeRealAccountSignup}
                                                                />,
                                                            ]}
                                                        />
                                                    )}
                                                </Text>
                                            </div>
                                        )}
                                        {!is_appstore && (
                                            <FormSubHeader
                                                title={
                                                    'salutation' in props.value
                                                        ? localize('Title and name')
                                                        : localize('Name')
                                                }
                                            />
                                        )}
                                        {'salutation' in props.value && ( // TODO: [deriv-eu] Remove salutation once api is optional
                                            <RadioGroup
                                                className='dc-radio__input'
                                                name='salutation'
                                                selected={values.salutation}
                                                onToggle={e => {
                                                    e.persist();
                                                    setFieldValue('salutation', e.target.value);
                                                }}
                                                required
                                            >
                                                {salutation_list.map(item => (
                                                    <RadioGroup.Item
                                                        key={item.value}
                                                        label={item.label}
                                                        value={item.value}
                                                        disabled={
                                                            !!values.salutation && disabled_items.includes('salutation')
                                                        }
                                                    />
                                                ))}
                                            </RadioGroup>
                                        )}
                                        {'first_name' in props.value && (
                                            <FormInputField
                                                name='first_name'
                                                required={is_svg || is_appstore}
                                                label={
                                                    is_svg || is_appstore || is_mf
                                                        ? localize('First name*')
                                                        : localize('First name')
                                                }
                                                hint={getFieldHint(localize('first name'))}
                                                disabled={disabled_items.includes('first_name')}
                                                placeholder={localize('John')}
                                                data-testid='first_name'
                                            />
                                        )}
                                        {'last_name' in props.value && (
                                            <FormInputField
                                                name='last_name'
                                                required={is_svg || is_appstore}
                                                label={getLastNameLabel()}
                                                hint={getFieldHint(localize('last name'))}
                                                disabled={disabled_items.includes('last_name')}
                                                placeholder={localize('Doe')}
                                                data-testid='last_name'
                                            />
                                        )}
                                        {!is_appstore && <FormSubHeader title={localize('Other details')} />}
                                        {'date_of_birth' in props.value && (
                                            <DateOfBirthField
                                                name='date_of_birth'
                                                required={is_svg || is_appstore}
                                                label={
                                                    is_svg || is_appstore || is_mf
                                                        ? localize('Date of birth*')
                                                        : localize('Date of birth')
                                                }
                                                hint={getFieldHint(localize('date of birth'))}
                                                disabled={disabled_items.includes('date_of_birth')}
                                                placeholder={localize('01-07-1999')}
                                                portal_id={is_appstore ? '' : 'modal_root'}
                                                data_testid='date_of_birth'
                                            />
                                        )}
                                        {'place_of_birth' in props.value && (
                                            <Field name='place_of_birth'>
                                                {({ field }) => (
                                                    <React.Fragment>
                                                        <DesktopWrapper>
                                                            <Autocomplete
                                                                {...field}
                                                                disabled={
                                                                    !!props.value.place_of_birth &&
                                                                    disabled_items.includes('place_of_birth')
                                                                }
                                                                data-lpignore='true'
                                                                autoComplete='off' // prevent chrome autocomplete
                                                                type='text'
                                                                label={
                                                                    is_mf
                                                                        ? localize('Place of birth*')
                                                                        : localize('Place of birth')
                                                                }
                                                                error={touched.place_of_birth && errors.place_of_birth}
                                                                list_items={residence_list}
                                                                onItemSelection={({ value, text }) =>
                                                                    setFieldValue(
                                                                        'place_of_birth',
                                                                        value ? text : '',
                                                                        true
                                                                    )
                                                                }
                                                                required
                                                                data-testid='place_of_birth'
                                                            />
                                                        </DesktopWrapper>
                                                        <MobileWrapper>
                                                            <SelectNative
                                                                placeholder={localize('Place of birth')}
                                                                name={field.name}
                                                                disabled={
                                                                    !!props.value.place_of_birth &&
                                                                    disabled_items.includes('place_of_birth')
                                                                }
                                                                label={
                                                                    is_mf
                                                                        ? localize('Place of birth*')
                                                                        : localize('Place of birth')
                                                                }
                                                                list_items={residence_list}
                                                                value={values.place_of_birth}
                                                                use_text={true}
                                                                error={touched.place_of_birth && errors.place_of_birth}
                                                                onChange={e => {
                                                                    handleChange(e);
                                                                    setFieldValue(
                                                                        'place_of_birth',
                                                                        e.target.value,
                                                                        true
                                                                    );
                                                                }}
                                                                {...field}
                                                                list_portal_id='modal_root'
                                                                required
                                                                should_hide_disabled_options={false}
                                                                data_testid='place_of_birth_mobile'
                                                            />
                                                        </MobileWrapper>
                                                    </React.Fragment>
                                                )}
                                            </Field>
                                        )}
                                        {'citizen' in props.value && (
                                            <Field name='citizen'>
                                                {({ field }) => (
                                                    <React.Fragment>
                                                        <DesktopWrapper>
                                                            <Autocomplete
                                                                {...field}
                                                                data-lpignore='true'
                                                                autoComplete='off' // prevent chrome autocomplete
                                                                type='text'
                                                                label={
                                                                    is_mf
                                                                        ? localize('Citizenship*')
                                                                        : localize('Citizenship')
                                                                }
                                                                error={touched.citizen && errors.citizen}
                                                                disabled={
                                                                    (props.value.citizen && is_fully_authenticated) ||
                                                                    (!!props.value.citizen &&
                                                                        disabled_items.includes('citizen'))
                                                                }
                                                                list_items={residence_list}
                                                                onItemSelection={({ value, text }) =>
                                                                    setFieldValue('citizen', value ? text : '', true)
                                                                }
                                                                list_portal_id='modal_root'
                                                                required
                                                                data-testid='citizenship'
                                                            />
                                                        </DesktopWrapper>
                                                        <MobileWrapper>
                                                            <SelectNative
                                                                placeholder={localize('Citizenship')}
                                                                name={field.name}
                                                                disabled={
                                                                    (props.value.citizen && is_fully_authenticated) ||
                                                                    (!!props.value.citizen &&
                                                                        disabled_items.includes('citizen'))
                                                                }
                                                                label={
                                                                    is_mf
                                                                        ? localize('Citizenship*')
                                                                        : localize('Citizenship')
                                                                }
                                                                list_items={residence_list}
                                                                value={values.citizen}
                                                                use_text={true}
                                                                error={touched.citizen && errors.citizen}
                                                                onChange={e => {
                                                                    handleChange(e);
                                                                    setFieldValue('citizen', e.target.value, true);
                                                                }}
                                                                {...field}
                                                                required
                                                                should_hide_disabled_options={false}
                                                                data_testid='citizenship_mobile'
                                                            />
                                                        </MobileWrapper>
                                                    </React.Fragment>
                                                )}
                                            </Field>
                                        )}
                                        {'phone' in props.value && (
                                            <FormInputField
                                                name='phone'
                                                label={
                                                    is_svg || is_appstore || is_mf
                                                        ? localize('Phone number*')
                                                        : localize('Phone number')
                                                }
                                                placeholder={
                                                    is_svg || is_appstore || is_mf
                                                        ? localize('Phone number*')
                                                        : localize('Phone number')
                                                }
                                                maxLength={50}
                                                data-testid='phone'
                                            />
                                        )}
                                        {('tax_residence' in props.value ||
                                            'tax_identification_number' in props.value) && (
                                            <React.Fragment>
                                                <FormSubHeader title={localize('Tax information')} />
                                                {'tax_residence' in props.value && (
                                                    <Field name='tax_residence'>
                                                        {({ field }) => (
                                                            <div className='details-form__tax'>
                                                                <DesktopWrapper>
                                                                    <Autocomplete
                                                                        {...field}
                                                                        data-lpignore='true'
                                                                        autoComplete='off' // prevent chrome autocomplete
                                                                        type='text'
                                                                        label={
                                                                            is_mf
                                                                                ? localize('Tax residence*')
                                                                                : localize('Tax residence')
                                                                        }
                                                                        error={
                                                                            touched.tax_residence &&
                                                                            errors.tax_residence
                                                                        }
                                                                        list_items={residence_list}
                                                                        onItemSelection={({ value, text }) =>
                                                                            setFieldValue(
                                                                                'tax_residence',
                                                                                value ? text : '',
                                                                                true
                                                                            )
                                                                        }
                                                                        list_portal_id='modal_root'
                                                                        data-testid='tax_residence'
                                                                    />
                                                                </DesktopWrapper>
                                                                <MobileWrapper>
                                                                    <SelectNative
                                                                        placeholder={localize('Tax residence')}
                                                                        name={field.name}
                                                                        label={
                                                                            is_mf
                                                                                ? localize('Tax residence*')
                                                                                : localize('Tax residence')
                                                                        }
                                                                        list_items={residence_list}
                                                                        value={values.tax_residence}
                                                                        use_text={true}
                                                                        error={
                                                                            touched.tax_residence &&
                                                                            errors.tax_residence
                                                                        }
                                                                        onChange={e => {
                                                                            handleChange(e);
                                                                            setFieldValue(
                                                                                'tax_residence',
                                                                                e.target.value,
                                                                                true
                                                                            );
                                                                        }}
                                                                        {...field}
                                                                        required
                                                                        data_testid='tax_residence_mobile'
                                                                    />
                                                                </MobileWrapper>
                                                                <div
                                                                    data-testid='tax_residence_pop_over'
                                                                    onClick={e => {
                                                                        setIsTaxResidencePopoverOpen(true);
                                                                        setIsTinPopoverOpen(false);
                                                                        e.stopPropagation();
                                                                    }}
                                                                >
                                                                    <Popover
                                                                        alignment={isDesktop() ? 'right' : 'left'}
                                                                        icon='info'
                                                                        message={localize(
                                                                            'The country in which you meet the criteria for paying taxes. Usually the country in which you physically reside.'
                                                                        )}
                                                                        zIndex={9998}
                                                                        disable_message_icon
                                                                        is_open={is_tax_residence_popover_open}
                                                                    />
                                                                </div>
                                                            </div>
                                                        )}
                                                    </Field>
                                                )}
                                                {'tax_identification_number' in props.value && (
                                                    <div className='details-form__tax'>
                                                        <FormInputField
                                                            name='tax_identification_number'
                                                            label={
                                                                is_mf
                                                                    ? localize('Tax Identification Number*')
                                                                    : localize('Tax Identification Number')
                                                            }
                                                            placeholder={localize('Tax Identification Number')}
                                                            warn={warning_items?.tax_identification_number}
                                                            data-testid='tax_identification_number'
                                                        />
                                                        <div
                                                            data-testid='tax_identification_number_pop_over'
                                                            onClick={e => {
                                                                setIsTaxResidencePopoverOpen(false);
                                                                setIsTinPopoverOpen(true);
                                                                e.stopPropagation();
                                                            }}
                                                        >
                                                            <Popover
                                                                alignment={isDesktop() ? 'right' : 'left'}
                                                                icon='info'
                                                                is_open={is_tin_popover_open}
                                                                message={
                                                                    <Localize
                                                                        i18n_default_text={
                                                                            "Don't know your tax identification number? Click <0>here</0> to learn more."
                                                                        }
                                                                        components={[
                                                                            <a
                                                                                key={0}
                                                                                className='link link--red'
                                                                                rel='noopener noreferrer'
                                                                                target='_blank'
                                                                                href='https://www.oecd.org/tax/automatic-exchange/crs-implementation-and-assistance/tax-identification-numbers/'
                                                                            />,
                                                                        ]}
                                                                    />
                                                                }
                                                                zIndex={9998}
                                                                disable_message_icon
                                                            />
                                                        </div>
                                                    </div>
                                                )}
                                                {warning_items?.tax_identification_number && (
                                                    <div className='details-form__tin-warn-divider' />
                                                )}
                                                {'employment_status' in props.value && (
                                                    <fieldset
                                                        className={classNames('account-form__fieldset', 'emp-status')}
                                                    >
                                                        <DesktopWrapper>
                                                            <Dropdown
                                                                placeholder={
                                                                    is_mf
                                                                        ? localize('Employment status*')
                                                                        : localize('Employment status')
                                                                }
                                                                is_align_text_left
                                                                name='employment_status'
                                                                list={getEmploymentStatusList()}
                                                                value={values.employment_status}
                                                                onChange={handleChange}
                                                                handleBlur={handleBlur}
                                                                error={
                                                                    touched.employment_status &&
                                                                    errors.employment_status
                                                                }
                                                            />
                                                        </DesktopWrapper>
                                                        <MobileWrapper>
                                                            <SelectNative
                                                                placeholder={localize('Please select')}
                                                                name='employment_status'
                                                                label={
                                                                    is_mf
                                                                        ? localize('Employment status*')
                                                                        : localize('Employment status')
                                                                }
                                                                list_items={getEmploymentStatusList()}
                                                                value={values.employment_status}
                                                                error={
                                                                    touched.employment_status &&
                                                                    errors.employment_status
                                                                }
                                                                onChange={e => {
                                                                    setFieldTouched('employment_status', true);
                                                                    handleChange(e);
                                                                }}
                                                            />
                                                        </MobileWrapper>
                                                    </fieldset>
                                                )}
                                                {'tax_identification_confirm' in props.value && (
                                                    <Checkbox
                                                        name='tax_identification_confirm'
                                                        className='details-form__tin-confirm'
                                                        data-lpignore
                                                        onChange={() =>
                                                            setFieldValue(
                                                                'tax_identification_confirm',
                                                                !values.tax_identification_confirm,
                                                                true
                                                            )
                                                        }
                                                        value={values.tax_identification_confirm}
                                                        label={localize(
                                                            'I hereby confirm that the tax information I provided is true and complete. I will also inform {{legal_entity_name}} about any changes to this information.',
                                                            {
                                                                legal_entity_name: getLegalEntityName('maltainvest'),
                                                            }
                                                        )}
                                                        renderlabel={title => (
                                                            <Text size='xs' line_height='s'>
                                                                {title}
                                                            </Text>
                                                        )}
                                                        withTabIndex={0}
                                                        data-testid='tax_identification_confirm'
                                                    />
                                                )}
                                            </React.Fragment>
                                        )}
                                        {'account_opening_reason' in props.value && ( // TODO: [deriv-eu] Remove account opening reason once api is optional
                                            <React.Fragment>
                                                <FormSubHeader title={localize('Account opening reason')} />
                                                <Field name='account_opening_reason'>
                                                    {({ field }) => (
                                                        <React.Fragment>
                                                            <DesktopWrapper>
                                                                <Dropdown
                                                                    placeholder={
                                                                        is_mf
                                                                            ? localize('Account opening reason*')
                                                                            : localize('Account opening reason')
                                                                    }
                                                                    name={field.name}
                                                                    disabled={disabled_items.includes(
                                                                        'account_opening_reason'
                                                                    )}
                                                                    is_align_text_left
                                                                    list={account_opening_reason_list}
                                                                    value={values.account_opening_reason}
                                                                    onChange={handleChange}
                                                                    handleBlur={handleBlur}
                                                                    error={
                                                                        touched.account_opening_reason &&
                                                                        errors.account_opening_reason
                                                                    }
                                                                    {...field}
                                                                    list_portal_id='modal_root'
                                                                    required
                                                                />
                                                            </DesktopWrapper>
                                                            <MobileWrapper>
                                                                <SelectNative
                                                                    placeholder={localize('Please select')}
                                                                    name={field.name}
                                                                    label={
                                                                        is_mf
                                                                            ? localize('Account opening reason*')
                                                                            : localize('Account opening reason')
                                                                    }
                                                                    list_items={account_opening_reason_list}
                                                                    value={values.account_opening_reason}
                                                                    error={
                                                                        touched.account_opening_reason &&
                                                                        errors.account_opening_reason
                                                                    }
                                                                    onChange={e => {
                                                                        handleChange(e);
                                                                        setFieldValue(
                                                                            'account_opening_reason',
                                                                            e.target.value,
                                                                            true
                                                                        );
                                                                    }}
                                                                    {...field}
                                                                    required
                                                                    data_testid='account_opening_reason_mobile'
                                                                />
                                                            </MobileWrapper>
                                                        </React.Fragment>
                                                    )}
                                                </Field>
                                            </React.Fragment>
                                        )}
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
                        </form>
                    )}
                </AutoHeightWrapper>
            )}
        </Formik>
    );
};

export default PersonalDetails;
