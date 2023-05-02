import { Formik, Field, FormikProps, FormikValues } from 'formik';
import React from 'react';
import {
    Modal,
    Autocomplete,
    AutoHeightWrapper,
    DesktopWrapper,
    Div100vhContainer,
    FormSubmitButton,
    Input,
    Loading,
    MobileWrapper,
    ThemedScrollbars,
    SelectNative,
    Text,
} from '@deriv/components';
import { localize, Localize } from '@deriv/translations';
import {
    isDesktop,
    isMobile,
    getLocation,
    makeCancellablePromise,
    PlatformContext,
    TLocationList,
} from '@deriv/shared';
import { splitValidationResultTypes } from '../real-account-signup/helpers/utils';

type TAddressDetails = {
    states_list: TLocationList[];
    getCurrentStep?: () => number;
    onSave: (current_step: number, values: FormikValues) => void;
    onCancel: (current_step: number, goToPreviousStep: () => void) => void;
    goToNextStep: () => void;
    goToPreviousStep: () => void;
    validate: (values: FormikValues) => FormikValues;
    onSubmit: (
        current_step: number | null,
        values: FormikValues,
        action: (isSubmitting: boolean) => void,
        next_step: () => void
    ) => void;
    is_svg: boolean;
    is_mf?: boolean;
    is_gb_residence: boolean | string;
    onSubmitEnabledChange: (is_submit_disabled: boolean) => void;
    selected_step_ref?: React.RefObject<FormikProps<FormikValues>>;
    fetchStatesList: () => Promise<unknown>;
    value: FormikValues;
};

type TFormValidation = {
    warnings: { [key: string]: string };
    errors: { [key: string]: string };
};

type TInputField = {
    name: string;
    required?: boolean | string;
    label: string;
    maxLength?: number | string;
    placeholder: string;
    onChange?: (e: any) => void;
    disabled?: string;
};

type TAutoComplete = {
    value: boolean;
    text: string;
};

const InputField = (props: TInputField) => {
    return (
        <Field name={props.name}>
            {({ field, form: { errors, touched } }: FormikValues) => (
                <React.Fragment>
                    <Input
                        type='text'
                        autoComplete='off'
                        maxLength={props.maxLength || 30}
                        error={touched[field.name] && errors[field.name]}
                        {...field}
                        {...props}
                    />
                </React.Fragment>
            )}
        </Field>
    );
};

const AddressDetails = ({
    states_list,
    getCurrentStep,
    onSave,
    onCancel,
    goToNextStep,
    goToPreviousStep,
    validate,
    onSubmit,
    is_svg,
    is_mf,
    is_gb_residence,
    onSubmitEnabledChange,
    selected_step_ref,
    disabled_items,
    has_real_account,
    ...props
}: TAddressDetails) => {
    const { is_appstore } = React.useContext(PlatformContext);
    const [has_fetched_states_list, setHasFetchedStatesList] = React.useState(false);
    const [address_state_to_display, setAddressStateToDisplay] = React.useState('');

    React.useEffect(() => {
        const { cancel, promise } = makeCancellablePromise(props.fetchStatesList());
        promise.then(() => {
            setHasFetchedStatesList(true);
            if (props.value.address_state) {
                setAddressStateToDisplay(getLocation(states_list, props.value.address_state, 'text'));
            }
        });
        return () => {
            setHasFetchedStatesList(false);
            cancel();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const is_submit_disabled_ref = React.useRef<boolean | undefined>(true);

    const isSubmitDisabled = (errors?: { [key: string]: string } | FormikValues) => {
        return selected_step_ref?.current?.isSubmitting || (errors && Object.keys(errors).length > 0);
    };

    const checkSubmitStatus = (errors?: { [key: string]: string }) => {
        const is_submit_disabled = isSubmitDisabled(errors);

        if (is_submit_disabled_ref.current !== is_submit_disabled) {
            is_submit_disabled_ref.current = is_submit_disabled;
            onSubmitEnabledChange?.(!is_submit_disabled);
        }
    };

    const handleCancel = (values: FormikValues) => {
        const current_step = (getCurrentStep?.() || 1) - 1;
        onSave(current_step, values);
        onCancel(current_step, goToPreviousStep);
    };

    const handleValidate = (values: FormikValues) => {
        const { errors }: Partial<TFormValidation> = splitValidationResultTypes(validate(values));
        checkSubmitStatus(errors);
        return errors;
    };

    return (
        <Formik
            innerRef={selected_step_ref}
            initialValues={props.value}
            validate={handleValidate}
            validateOnMount
            onSubmit={(values, actions) => {
                if (values.address_state && states_list.length) {
                    values.address_state = address_state_to_display
                        ? getLocation(states_list, address_state_to_display, 'value')
                        : getLocation(states_list, values.address_state, 'value');
                }
                onSubmit((getCurrentStep?.() || 1) - 1, values, actions.setSubmitting, goToNextStep);
            }}
        >
            {({ handleSubmit, errors, values, setFieldValue, handleChange, setFieldTouched }: FormikValues) => (
                <AutoHeightWrapper default_height={350} height_offset={isDesktop() ? 80 : null}>
                    {({ setRef, height }: { setRef: (instance: HTMLFormElement) => void; height: number | string }) => (
                        <form ref={setRef} onSubmit={handleSubmit}>
                            <Div100vhContainer
                                className='details-form'
                                height_offset={is_appstore ? '222px' : '90px'}
                                is_disabled={isDesktop()}
                            >
                                {!is_appstore && (
                                    <Text
                                        as='p'
                                        align='left'
                                        size='xxs'
                                        line_height='l'
                                        className='details-form__description'
                                    >
                                        <strong>
                                            <Localize i18n_default_text='Only use an address for which you have proof of residence - ' />
                                        </strong>
                                        <Localize i18n_default_text='a recent utility bill (e.g. electricity, water, gas, landline, or internet), bank statement, or government-issued letter with your name and this address.' />
                                    </Text>
                                )}
                                <ThemedScrollbars height={height} className='details-form__scrollbar'>
                                    {is_appstore && (
                                        <div className='details-form__sub-header'>
                                            <Text size={isMobile() ? 'xs' : 'xxs'} align={isMobile() ? 'center' : ''}>
                                                {localize(
                                                    'We need this for verification. If the information you provide is fake or inaccurate, you won’t be able to deposit and withdraw.'
                                                )}
                                            </Text>
                                        </div>
                                    )}
                                    <div className='details-form__elements'>
                                        <InputField
                                            name='address_line_1'
                                            required={is_svg || is_appstore || is_mf}
                                            label={
                                                is_svg || is_appstore || is_mf
                                                    ? localize('First line of address*')
                                                    : localize('First line of address')
                                            }
                                            maxLength={255}
                                            placeholder={localize('First line of address')}
                                            disabled={
                                                disabled_items.includes('address_line_1') ||
                                                (props.value?.address_line_1 && has_real_account)
                                            }
                                        />
                                        <InputField
                                            name='address_line_2'
                                            required={is_appstore}
                                            label={
                                                is_appstore
                                                    ? localize('Second line of address*')
                                                    : localize('Second line of address')
                                            }
                                            maxLength={255}
                                            placeholder={localize('Second line of address')}
                                            disabled={
                                                disabled_items.includes('address_line_2') ||
                                                (props.value?.address_line_2 && has_real_account)
                                            }
                                        />
                                        <InputField
                                            name='address_city'
                                            required={is_svg || is_appstore || is_mf}
                                            label={
                                                is_svg || is_appstore || is_mf
                                                    ? localize('Town/City*')
                                                    : localize('Town/City')
                                            }
                                            placeholder={localize('Town/City')}
                                            disabled={
                                                disabled_items.includes('address_city') ||
                                                (props.value?.address_city && has_real_account)
                                            }
                                        />
                                        {!has_fetched_states_list && (
                                            <div className='details-form__loader'>
                                                <Loading is_fullscreen={false} />
                                            </div>
                                        )}
                                        {states_list?.length > 0 ? (
                                            <Field name='address_state'>
                                                {({ field }: FormikValues) => (
                                                    <>
                                                        <DesktopWrapper>
                                                            <Autocomplete
                                                                {...field}
                                                                {...(address_state_to_display && {
                                                                    value: address_state_to_display,
                                                                })}
                                                                data-lpignore='true'
                                                                autoComplete='new-password' // prevent chrome autocomplete
                                                                type='text'
                                                                label={localize('State/Province')}
                                                                list_items={states_list}
                                                                onItemSelection={({ value, text }: TAutoComplete) => {
                                                                    setFieldValue(
                                                                        'address_state',
                                                                        value ? text : '',
                                                                        true
                                                                    );
                                                                    setAddressStateToDisplay('');
                                                                }}
                                                                list_portal_id={is_appstore ? '' : 'modal_root'}
                                                                disabled={
                                                                    disabled_items.includes('address_state') ||
                                                                    (props.value?.address_state && has_real_account)
                                                                }
                                                            />
                                                        </DesktopWrapper>
                                                        <MobileWrapper>
                                                            <SelectNative
                                                                placeholder={localize('Please select')}
                                                                label={localize('State/Province')}
                                                                value={address_state_to_display || values.address_state}
                                                                list_items={states_list}
                                                                use_text={true}
                                                                onChange={(e: { target: { value: string } }) => {
                                                                    setFieldValue(
                                                                        'address_state',
                                                                        e.target.value,
                                                                        true
                                                                    );
                                                                    setAddressStateToDisplay('');
                                                                }}
                                                                disabled={
                                                                    disabled_items.includes('address_state') ||
                                                                    (props.value?.address_state && has_real_account)
                                                                }
                                                            />
                                                        </MobileWrapper>
                                                    </>
                                                )}
                                            </Field>
                                        ) : (
                                            // Fallback to input field when states list is empty / unavailable for country
                                            <InputField
                                                name='address_state'
                                                label={localize('State/Province')}
                                                placeholder={localize('State/Province')}
                                                disabled={
                                                    disabled_items.includes('address_state') ||
                                                    (props.value?.address_state && has_real_account)
                                                }
                                            />
                                        )}
                                        <InputField
                                            name='address_postcode'
                                            required={is_gb_residence || is_appstore}
                                            label={
                                                is_appstore ? localize('Postal/ZIP Code*') : localize('Postal/ZIP Code')
                                            }
                                            placeholder={localize('Postal/ZIP Code')}
                                            onChange={e => {
                                                setFieldTouched('address_postcode', true);
                                                handleChange(e);
                                            }}
                                            disabled={
                                                disabled_items.includes('address_postcode') ||
                                                (props.value?.address_postcode && has_real_account)
                                            }
                                        />
                                    </div>
                                </ThemedScrollbars>
                            </Div100vhContainer>
                            <Modal.Footer has_separator is_bypassed={isMobile()}>
                                <FormSubmitButton
                                    is_disabled={isSubmitDisabled(errors)}
                                    label={localize('Next')}
                                    is_absolute={isMobile()}
                                    has_cancel
                                    cancel_label={localize('Previous')}
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

export default AddressDetails;
