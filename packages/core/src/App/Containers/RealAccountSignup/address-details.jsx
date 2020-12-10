import { Formik, Field } from 'formik';
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
import { isDesktop, isMobile, getLocation } from '@deriv/shared';
import { connect } from 'Stores/connect';
import { makeCancellablePromise } from '_common/base/cancellable_promise';
import { splitValidationResultTypes } from 'App/Containers/RealAccountSignup/helpers/utils';

const InputField = props => {
    return (
        <Field name={props.name}>
            {({ field, form: { errors, touched } }) => (
                <React.Fragment>
                    <Input
                        type='text'
                        autoComplete='off'
                        maxLength={props.maxLength || '30'}
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
    is_gb_residence,
    ...props
}) => {
    const [has_fetched_states_list, setHasFetchedStatesList] = React.useState(false);
    const [address_state_to_display, setAddressStateToDisplay] = React.useState('');

    React.useEffect(() => {
        const { cancel, promise } = makeCancellablePromise(props.fetchStatesList());
        promise.then(() => {
            setHasFetchedStatesList(true);
            setAddressStateToDisplay(getLocation(states_list, props.value.address_state, 'text'));
        });
        return () => {
            setHasFetchedStatesList(false);
            cancel();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleCancel = values => {
        const current_step = getCurrentStep() - 1;
        onSave(current_step, values);
        onCancel(current_step, goToPreviousStep);
    };

    const handleValidate = values => {
        const { errors } = splitValidationResultTypes(validate(values));
        return errors;
    };

    return (
        <Formik
            initialValues={props.value}
            validate={handleValidate}
            validateOnMount
            onSubmit={(values, actions) => {
                if (values.address_state && states_list.length) {
                    values.address_state = address_state_to_display
                        ? getLocation(states_list, address_state_to_display, 'value')
                        : getLocation(states_list, values.address_state, 'value');
                }
                onSubmit(getCurrentStep() - 1, values, actions.setSubmitting, goToNextStep);
            }}
        >
            {({ handleSubmit, isSubmitting, errors, values, setFieldValue }) => (
                <AutoHeightWrapper default_height={350} height_offset={isDesktop() ? 80 : null}>
                    {({ setRef, height }) => (
                        <form ref={setRef} onSubmit={handleSubmit}>
                            <Div100vhContainer className='details-form' height_offset='110px' is_disabled={isDesktop()}>
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
                                <ThemedScrollbars height={height} className='details-form__scrollbar'>
                                    <div className='details-form__elements'>
                                        <InputField
                                            name='address_line_1'
                                            required={is_svg}
                                            label={
                                                is_svg
                                                    ? localize('First line of address*')
                                                    : localize('First line of address')
                                            }
                                            maxLength={255}
                                            placeholder={localize('First line of address')}
                                        />
                                        <InputField
                                            name='address_line_2'
                                            label={localize('Second line of address')}
                                            maxLength={255}
                                            placeholder={localize('Second line of address')}
                                        />
                                        <InputField
                                            name='address_city'
                                            required={is_svg}
                                            label={is_svg ? localize('Town/City*') : localize('Town/City')}
                                            placeholder={localize('Town/City')}
                                        />
                                        {!has_fetched_states_list && (
                                            <div className='details-form__loader'>
                                                <Loading is_fullscreen={false} />
                                            </div>
                                        )}
                                        {states_list?.length > 0 ? (
                                            <Field name='address_state'>
                                                {({ field }) => (
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
                                                                onItemSelection={({ value, text }) => {
                                                                    setFieldValue(
                                                                        'address_state',
                                                                        value ? text : '',
                                                                        true
                                                                    );
                                                                    setAddressStateToDisplay('');
                                                                }}
                                                                list_portal_id='modal_root'
                                                            />
                                                        </DesktopWrapper>
                                                        <MobileWrapper>
                                                            <SelectNative
                                                                placeholder={localize('Please select')}
                                                                label={localize('State/Province')}
                                                                value={address_state_to_display || values.address_state}
                                                                list_items={states_list}
                                                                use_text={true}
                                                                onChange={e => {
                                                                    setFieldValue(
                                                                        'address_state',
                                                                        e.target.value,
                                                                        true
                                                                    );
                                                                    setAddressStateToDisplay('');
                                                                }}
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
                                            />
                                        )}
                                        <InputField
                                            name='address_postcode'
                                            required={is_gb_residence}
                                            label={localize('Postal/ZIP Code')}
                                            placeholder={localize('Postal/ZIP Code')}
                                        />
                                    </div>
                                </ThemedScrollbars>
                            </Div100vhContainer>
                            <Modal.Footer has_separator is_bypassed={isMobile()}>
                                <FormSubmitButton
                                    is_disabled={isSubmitting || Object.keys(errors).length > 0}
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

export default connect(({ client }) => ({
    is_gb_residence: client.residence === 'gb',
    fetchStatesList: client.fetchStatesList,
    states_list: client.states_list,
}))(AddressDetails);
