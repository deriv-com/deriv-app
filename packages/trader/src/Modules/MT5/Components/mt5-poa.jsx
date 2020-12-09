import { Field, Formik } from 'formik';
import PropTypes from 'prop-types';
import React from 'react';
import {
    AutoHeightWrapper,
    FormSubmitButton,
    ThemedScrollbars,
    Dropdown,
    Loading,
    Div100vhContainer,
    Modal,
    SelectNative,
    DesktopWrapper,
    MobileWrapper,
} from '@deriv/components';
import {
    FileUploaderContainer,
    FormSubHeader,
    PoaExpired,
    PoaNeedsReview,
    PoaVerified,
    PoaUnverified,
    PoaSubmitted,
    PoaStatusCodes,
} from '@deriv/account';
import { WS } from 'Services/ws-methods';
import { localize } from '@deriv/translations';
import { isDesktop, isMobile, validAddress, validLength, validLetterSymbol, validPostCode } from '@deriv/shared';
import { InputField } from './mt5-personal-details-form.jsx';

const form = React.createRef();

class MT5POA extends React.Component {
    // TODO: Refactor to functional component with hooks
    is_mounted = false;
    file_uploader_ref = undefined;
    state = {
        document_file: [],
        file_error_message: null,
        form_error: '',
        poa_status: 'none',
        is_loading: true,
        resubmit_poa: false,
        has_poi: false,
    };

    validateForm = values => {
        // No need to validate if we are waiting for confirmation.
        if ([PoaStatusCodes.verified, PoaStatusCodes.pending].includes(this.state.poa_status)) {
            return {};
        }

        const validations = {
            address_line_1: [v => !!v && !v.match(/^\s*$/), v => validAddress(v), v => validLength(v, { max: 70 })],
            address_line_2: [v => !v || validAddress(v), v => validLength(v, { max: 70 })],
            address_city: [
                v => !!v && !v.match(/^\s*$/),
                v => validLength(v, { min: 1, max: 35 }),
                v => validLetterSymbol(v),
            ],
            address_state: [v => !!v && !v.match(/^\s*$/), v => !v || validLength(v, { min: 1, max: 35 })],
            address_postcode: [
                v => !!v && !v.match(/^\s*$/),
                v => validLength(v, { min: 1, max: 20 }),
                v => validPostCode(v),
            ],
        };

        const validation_errors = {
            address_line_1: [
                localize('First line of address is required'),
                localize('First line of address is not in a proper format.'),
                localize('This should not exceed {{max}} characters.', { max: 70 }),
            ],
            address_line_2: [
                localize('Second line of address is not in a proper format.'),
                localize('This should not exceed {{max}} characters.', { max: 70 }),
            ],
            address_city: [
                localize('Town/City is required.'),
                localize('This should not exceed {{max_number}} characters.', {
                    max_number: 35,
                }),
                localize('Town/City is not in a proper format.'),
            ],
            address_state: [
                localize('State/Province is required.'),
                localize('State/Province is not in a proper format.'),
            ],
            address_postcode: [
                localize('Postal/ZIP code is required'),
                localize('This should not exceed {{max_number}} characters.', {
                    max_number: 20,
                }),
                localize('Only letters, numbers, space, and hyphen are allowed.'),
            ],
        };

        const errors = {};

        Object.entries(validations).forEach(([key, rules]) => {
            const error_index = rules.findIndex(v => !v(values[key]));
            if (error_index !== -1) {
                errors[key] = validation_errors[key][error_index];
            }
        });

        return errors;
    };

    handleCancel = values => {
        this.props.onSave(this.props.index, values);
        this.props.onCancel();
    };

    onFileDrop = (document_file, file_error_message, setFieldTouched, setFieldValue, values) => {
        setFieldTouched('document_file', true);
        setFieldValue('document_file', document_file);
        this.setState({ document_file, file_error_message });
        // To resolve sync issues with value states (form_values in container component and formik values)
        // This ensures container values are updated before being validated in runtime  (mt5-financial-stp-real-account-signup.jsx)
        if (typeof this.props.onSave === 'function') {
            this.props.onSave(this.props.index, { ...values, ...{ document_file } });
        }
    };

    proceed = () => {
        this.props.onSubmit(this.props.index, this.state);
    };

    onSubmit = async (values, actions) => {
        const { document_file, ...uploadables } = values;
        actions.setSubmitting(true);
        const data = await WS.setSettings(uploadables);
        if (data.error) {
            this.setState({
                form_error: data.error.message,
            });

            actions.setSubmitting(false);
            return;
        }
        const { error, get_settings } = await WS.authorized.storage.getSettings();
        if (error) {
            this.setState({
                form_error: error.message,
            });
            return;
        }

        // Store newly stored values in the component.
        const { address_line_1, address_line_2, address_city, address_state, address_postcode } = get_settings;

        this.setState({
            address_line_1,
            address_line_2,
            address_city,
            address_postcode,
            address_state,
            form_error: '',
        });

        try {
            const api_response = await this.file_uploader_ref.current.upload();
            if (api_response.warning) {
                this.setState({
                    form_error: api_response.warning,
                });
                actions.setSubmitting(false);
                return;
            }
            const { error: e, get_account_status } = await WS.authorized.storage.getAccountStatus();
            if (e) {
                this.setState({
                    form_error: error.message,
                });
                actions.setSubmitting(false);
                return;
            }
            const { identity } = get_account_status.authentication;
            const has_poi = !(identity && identity.status === 'none');
            if (has_poi) {
                this.proceed();
            } else {
                this.setState({
                    form_error: localize('Identity confirmation failed. You will be redirected to the previous step.'),
                });
                setTimeout(() => {
                    this.handleCancel(get_settings);
                }, 3000);
            }
        } catch (e) {
            this.setState({
                form_error: e.message,
            });
        }
        actions.setSubmitting(false);
        this.props.onSave(this.props.index, values);
        this.props.onSubmit(this.props.index, values, actions.setSubmitting);
    };

    componentDidMount() {
        this.is_mounted = true;
        WS.authorized.getAccountStatus().then(response => {
            WS.wait('states_list').then(() => {
                const { get_account_status } = response;
                const { document, identity } = get_account_status.authentication;
                const has_poi = !!(identity && identity.status === 'none');
                if (this.is_mounted) {
                    this.setState({ poa_status: document.status, has_poi, is_loading: false });
                    this.props.refreshNotifications();
                }
            });
        });
    }

    isFormDisabled(dirty, errors) {
        if (this.state.poa_status === PoaStatusCodes.verified) {
            return false;
        }
        return Object.keys(errors).length !== 0;
    }

    componentWillUnmount() {
        this.is_mounted = false;
    }

    handleResubmit = () => {
        this.setState({ resubmit_poa: true });
    };

    setFileUploadRef = ref => {
        this.file_uploader_ref = ref;
    };

    render() {
        const {
            states_list,
            value: { address_line_1, address_line_2, address_city, address_state, address_postcode },
        } = this.props;

        const { is_loading, resubmit_poa, submitted_poa } = this.state;

        const is_form_visible = !is_loading && (resubmit_poa || this.state.poa_status === PoaStatusCodes.none);

        return (
            <Formik
                initialValues={{
                    address_line_1,
                    address_line_2,
                    address_city,
                    address_state,
                    address_postcode,
                    document_file: this.state.document_file,
                }}
                validateOnMount
                validate={this.validateForm}
                enableReinitialize
                onSubmit={this.onSubmit}
                innerRef={form}
            >
                {({
                    dirty,
                    errors,
                    handleSubmit,
                    isSubmitting,
                    handleBlur,
                    handleChange,
                    setFieldTouched,
                    setFieldValue,
                    values,
                    touched,
                }) => (
                    <AutoHeightWrapper default_height={200}>
                        {({ setRef, height }) => (
                            <form ref={setRef} onSubmit={handleSubmit} className='mt5-proof-of-address'>
                                <Div100vhContainer
                                    className='details-form'
                                    height_offset='100px'
                                    is_disabled={isDesktop()}
                                >
                                    {is_loading && <Loading is_fullscreen={false} />}
                                    {is_form_visible && (
                                        <ThemedScrollbars
                                            autohide={false}
                                            height={`${height - 77}px`}
                                            is_bypassed={isMobile()}
                                        >
                                            <div className='mt5-proof-of-address__field-area'>
                                                <FormSubHeader
                                                    subtitle={localize('(All fields are required)')}
                                                    title={localize('Address information')}
                                                />
                                                <InputField
                                                    name='address_line_1'
                                                    maxLength={255}
                                                    required
                                                    label={localize('First line of address*')}
                                                    placeholder={localize('First line of address*')}
                                                    onBlur={handleBlur}
                                                />
                                                <InputField
                                                    name='address_line_2'
                                                    maxLength={255}
                                                    label={localize('Second line of address (optional)')}
                                                    optional
                                                    placeholder={localize('Second line of address')}
                                                    onBlur={handleBlur}
                                                />
                                                <div className='mt5-proof-of-address__inline-fields'>
                                                    <InputField
                                                        maxLength={255}
                                                        name='address_city'
                                                        required
                                                        label={localize('Town/City*')}
                                                        placeholder={localize('Town/City*')}
                                                        onBlur={handleBlur}
                                                    />
                                                    <fieldset className='address-state__fieldset'>
                                                        {states_list?.length > 0 ? (
                                                            <React.Fragment>
                                                                <DesktopWrapper>
                                                                    <Field name='address_state'>
                                                                        {({ field }) => (
                                                                            <Dropdown
                                                                                id='address_state'
                                                                                required
                                                                                className='address_state-dropdown'
                                                                                is_align_text_left
                                                                                list={states_list}
                                                                                error={
                                                                                    touched[field.name] &&
                                                                                    errors[field.name]
                                                                                }
                                                                                name='address_state'
                                                                                value={values.address_state}
                                                                                onChange={handleChange}
                                                                                placeholder={localize(
                                                                                    'State/Province*'
                                                                                )}
                                                                                list_portal_id='modal_root'
                                                                            />
                                                                        )}
                                                                    </Field>
                                                                </DesktopWrapper>
                                                                <MobileWrapper>
                                                                    <SelectNative
                                                                        label={localize('State/Province*')}
                                                                        value={values.address_state}
                                                                        list_items={states_list}
                                                                        error={
                                                                            touched.address_state &&
                                                                            errors.address_state
                                                                        }
                                                                        onChange={e => {
                                                                            handleChange(e);
                                                                            setFieldValue(
                                                                                'address_state',
                                                                                e.target.value,
                                                                                true
                                                                            );
                                                                        }}
                                                                        required
                                                                    />
                                                                </MobileWrapper>
                                                            </React.Fragment>
                                                        ) : (
                                                            // Fallback to input field when states list is empty / unavailable for country
                                                            <InputField
                                                                name='address_state'
                                                                label={localize('State/Province*')}
                                                                placeholder={localize('State/Province*')}
                                                                value={values.address_state}
                                                                required
                                                                onBlur={handleBlur}
                                                            />
                                                        )}
                                                    </fieldset>
                                                    <InputField
                                                        maxLength={255}
                                                        name='address_postcode'
                                                        label={localize('Postal/ZIP code*')}
                                                        placeholder={localize('Postal/ZIP code*')}
                                                        onBlur={handleBlur}
                                                        required
                                                    />
                                                </div>
                                                <div className='mt5-proof-of-address__file-upload'>
                                                    <FileUploaderContainer
                                                        onRef={ref => this.setFileUploadRef(ref)}
                                                        getSocket={WS.getSocket}
                                                        onFileDrop={({ document_file: df, file_error_message }) =>
                                                            this.onFileDrop(
                                                                df,
                                                                file_error_message,
                                                                setFieldTouched,
                                                                setFieldValue,
                                                                values
                                                            )
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        </ThemedScrollbars>
                                    )}
                                    {this.state.poa_status !== PoaStatusCodes.none && !resubmit_poa && (
                                        <ThemedScrollbars height={height} is_bypassed={isMobile()}>
                                            {submitted_poa && (
                                                <PoaSubmitted
                                                    is_description_disabled={true}
                                                    has_poi={this.state.has_poi}
                                                />
                                            )}
                                            {this.state.poa_status === PoaStatusCodes.pending && (
                                                <PoaNeedsReview is_description_disabled={true} />
                                            )}
                                            {this.state.poa_status === PoaStatusCodes.verified && (
                                                <PoaVerified
                                                    is_description_disabled={true}
                                                    has_poi={this.state.has_poi}
                                                />
                                            )}
                                            {this.state.poa_status === PoaStatusCodes.expired && (
                                                <PoaExpired onClick={this.handleResubmit} />
                                            )}
                                            {(this.state.poa_status === PoaStatusCodes.rejected ||
                                                this.state.poa_status === PoaStatusCodes.suspected) && (
                                                <PoaUnverified />
                                            )}
                                        </ThemedScrollbars>
                                    )}
                                    <Modal.Footer is_bypassed={isMobile()}>
                                        {(this.state.poa_status === PoaStatusCodes.verified || is_form_visible) && (
                                            <FormSubmitButton
                                                has_cancel
                                                cancel_label={localize('Previous')}
                                                is_disabled={
                                                    this.isFormDisabled(dirty, errors) ||
                                                    (!(this.state.poa_status === PoaStatusCodes.verified) &&
                                                        this.state.document_file &&
                                                        this.state.document_file.length < 1) ||
                                                    !!this.state.file_error_message
                                                }
                                                label={
                                                    this.state.poa_status === PoaStatusCodes.verified
                                                        ? localize('Submit')
                                                        : localize('Next')
                                                }
                                                is_absolute={isMobile()}
                                                is_loading={isSubmitting}
                                                form_error={this.state.form_error}
                                                onCancel={() => this.handleCancel(values)}
                                            />
                                        )}
                                    </Modal.Footer>
                                </Div100vhContainer>
                            </form>
                        )}
                    </AutoHeightWrapper>
                )}
            </Formik>
        );
    }
}

MT5POA.propTypes = {
    onCancel: PropTypes.func,
    onSave: PropTypes.func,
    onSubmit: PropTypes.func,
    storeProofOfAddress: PropTypes.func,
    value: PropTypes.object,
};

export default MT5POA;
