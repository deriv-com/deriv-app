import { Field, Formik, FieldProps, FormikHelpers, FormikProps, FormikErrors } from 'formik';
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
    useStateCallback,
    Text,
} from '@deriv/components';
import { FileUploaderContainer, FormSubHeader, PoaStatusCodes } from '@deriv/account';
import { localize } from '@deriv/translations';
import { isDesktop, isMobile, validAddress, validLength, validLetterSymbol, validPostCode, WS } from '@deriv/shared';
import { InputField } from './cfd-personal-details-form';
import { GetSettings, StatesList, AccountStatusResponse } from '@deriv/api-types';

type TErrors = {
    code: string;
    message: string;
};

type TFile = {
    path: string;
    lastModified: number;
    lastModifiedDate: Date;
    name: string;
    size: number;
    type: string;
    webkitRelativePath: string;
};

type TObjDocumentFile = {
    errors: TErrors[];
    file: TFile;
};

type TFormValuesInputs = {
    address_city?: string;
    address_line_1?: string;
    address_line_2?: string;
    address_postcode?: string;
    address_state?: string;
};

type TDocumentFile = {
    document_file?: Array<TObjDocumentFile>;
    files?: Array<TObjDocumentFile>;
};

type TFormValues = TFormValuesInputs & TDocumentFile;

type TFormValue = GetSettings;

type TApiResponse = {
    document_upload: {
        call_type: number;
        checksum: string;
        size: number;
        status: string;
        upload_id: number;
    };
    passthrough: {
        document_upload: boolean;
    };
    warning?: string;
};

type TStoreProofOfAddress = (file_uploader_ref: React.RefObject<(HTMLElement | null) & TUpload>) => void;

export type TCFDPOAProps = {
    onSave: (index: number, values: TFormValues) => void;
    index: number;
    onSubmit: (index: number, value: TFormValues) => void;
    refreshNotifications: () => void;
    form_error: string;
    get_settings: GetSettings;
    height: string;
    states_list: StatesList;
    storeProofOfAddress: TStoreProofOfAddress;
    value: TFormValue;
};
type TUpload = {
    upload: () => void;
};

let file_uploader_ref: React.RefObject<HTMLElement & TUpload>;

const CFDPOA = ({ onSave, index, onSubmit, refreshNotifications, ...props }: TCFDPOAProps) => {
    const form = React.useRef<FormikProps<TFormValues> | null>(null);

    const [is_loading, setIsLoading] = React.useState(true);
    const [form_state, setFormState] = useStateCallback({
        poa_status: 'none',
        has_poi: false,
        form_error: '',
    });
    const [document_upload, setDocumentUpload] = useStateCallback({ files: [], error_message: null });
    const [hasPOAFailed, sethasPOAfailed] = React.useState(false);

    const validateForm = (values: TFormValuesInputs) => {
        // No need to validate if we are waiting for confirmation.
        if ([PoaStatusCodes.verified, PoaStatusCodes.pending].includes(form_state.poa_status)) {
            return {};
        }

        const validations: Record<string, Array<(value: string) => boolean>> = {
            address_line_1: [
                (v: string) => !!v && !v.match(/^\s*$/),
                (v: string) => validLength(v, { max: 70 }),
                (v: string) => validAddress(v).is_ok,
            ],
            address_line_2: [(v: string) => validLength(v, { max: 70 }), (v: string) => validAddress(v).is_ok],
            address_city: [
                (v: string) => !!v && !v.match(/^\s*$/),
                (v: string) => validLength(v, { min: 1, max: 35 }),
                (v: string) => validLetterSymbol(v),
            ],
            address_state: [(v: string) => validLength(v, { max: 35 })],
            address_postcode: [(v: string) => validLength(v, { max: 20 }), (v: string) => !v || validPostCode(v)],
        };

        const validation_errors: Record<string, Array<string>> = {
            address_line_1: [
                localize('First line of address is required'),
                localize('This should not exceed {{max}} characters.', { max: 70 }),
                localize('First line of address is not in a proper format.'),
            ],
            address_line_2: [
                localize('This should not exceed {{max}} characters.', { max: 70 }),
                localize('Second line of address is not in a proper format.'),
            ],
            address_city: [
                localize('Town/City is required.'),
                localize('This should not exceed {{max_number}} characters.', {
                    max_number: 35,
                }),
                localize('Town/City is not in a proper format.'),
            ],
            address_state: [localize('State/Province is not in a proper format.')],
            address_postcode: [
                localize('This should not exceed {{max_number}} characters.', {
                    max_number: 20,
                }),
                localize('Only letters, numbers, space, and hyphen are allowed.'),
            ],
        };

        const errors: Record<string, string> = {};

        Object.entries(validations).forEach(([key, rules]) => {
            const error_index = rules.findIndex(v => !v(values[key as keyof TFormValuesInputs] as string));
            if (error_index !== -1) {
                errors[key] = validation_errors[key][error_index];
            }
        });

        return errors;
    };

    const onFileDrop = (
        files: TObjDocumentFile,
        error_message: string,
        setFieldTouched: (field: string, isTouched?: boolean, shouldValidate?: boolean) => void,
        setFieldValue: (field: string, files_array: TObjDocumentFile) => void,
        values: TFormValues
    ) => {
        setFieldTouched('document_file', true);
        setFieldValue('document_file', files);
        setDocumentUpload({ files, error_message }, () => {
            // To resolve sync issues with value states (form_values in container component and formik values)
            // This ensures container values are updated before being validated in runtime  (mt5-financial-stp-real-account-signup.jsx)
            if (typeof onSave === 'function') {
                onSave(index, { ...values, ...({ document_file: files } as unknown as TDocumentFile) });
            }
        });
    };

    const onSubmitValues = async (values: TFormValues, actions: FormikHelpers<TFormValues>) => {
        const uploadables = { ...values };
        delete uploadables.document_file;

        actions.setSubmitting(true);
        const data = await WS.setSettings(uploadables);
        if (data.error) {
            setFormState({ ...form_state, ...{ form_error: data.error.message } });
            actions.setSubmitting(false);
            return;
        }
        const { error } = await WS.authorized.storage.getSettings();
        if (error) {
            setFormState({ ...form_state, ...{ form_error: error.message } });
            return;
        }

        setFormState({ ...form_state, ...{ form_error: '' } });

        try {
            const api_response = await file_uploader_ref.current?.upload();

            if (api_response && (api_response as TApiResponse)?.warning) {
                setFormState({ ...form_state, ...{ form_error: (api_response as TApiResponse).warning } });
                actions.setSubmitting(false);
                return;
            }
            const { error: e } = await WS.authorized.storage.getAccountStatus();
            if (e) {
                setFormState({ ...form_state, ...{ form_error: error.message } });
                actions.setSubmitting(false);
                return;
            }
        } catch (e: unknown) {
            setFormState({ ...form_state, ...{ form_error: (e as Error).message } });
        }

        actions.setSubmitting(false);
        onSave(index, values);
        onSubmit(index, values);
    };

    // didMount hook
    React.useEffect(() => {
        WS.authorized.getAccountStatus().then((response: AccountStatusResponse) => {
            WS.wait('states_list').then(() => {
                const poa_status = response.get_account_status?.authentication?.document?.status;
                const poi_status = response.get_account_status?.authentication?.identity?.status;
                const poa_failed_status = ['rejected', 'expired', 'suspected'];
                if (poa_status && poi_status) {
                    const needs_poi = poi_status === 'none';
                    setFormState({ ...form_state, ...{ poa_status, needs_poi, identity_status: poi_status } }, () => {
                        setIsLoading(false);
                        refreshNotifications();
                    });
                }

                if (poa_status && poa_failed_status.includes(poa_status)) {
                    sethasPOAfailed(true);
                }
            });
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [refreshNotifications, setFormState]);

    const isFormDisabled = (dirty: boolean, errors: FormikErrors<TFormValues>) => {
        if (form_state.poa_status === PoaStatusCodes.verified) {
            return false;
        }
        return Object.keys(errors).length !== 0;
    };

    const {
        states_list,
        value: { address_line_1, address_line_2, address_city, address_state, address_postcode },
    } = props;
    const { form_error, poa_status } = form_state;

    const is_form_visible = !is_loading && poa_status !== PoaStatusCodes.verified;

    return (
        <Formik
            initialValues={{
                address_line_1,
                address_line_2,
                address_city,
                address_state,
                address_postcode,
                document_file: document_upload.files,
            }}
            validateOnMount
            validate={validateForm}
            enableReinitialize
            onSubmit={onSubmitValues}
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
            }: FormikProps<TFormValues>) => {
                return (
                    <AutoHeightWrapper default_height={200}>
                        {({
                            setRef,
                            height,
                        }: {
                            setRef: (instance: HTMLFormElement | null) => void;
                            height: number;
                        }) => (
                            <form ref={setRef} onSubmit={handleSubmit} className='cfd-proof-of-address'>
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
                                            <div className='cfd-proof-of-address__field-area'>
                                                {hasPOAFailed && (
                                                    <Text size='xs' align='center' color='loss-danger'>
                                                        {localize(
                                                            'We were unable to verify your address with the details you provided. Please check and resubmit or choose a different document type.'
                                                        )}
                                                    </Text>
                                                )}
                                                <FormSubHeader title={localize('Address information')} />
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
                                                <div className='cfd-proof-of-address__inline-fields'>
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
                                                                        {({
                                                                            field,
                                                                        }: FieldProps<string, TFormValues>) => (
                                                                            <Dropdown
                                                                                id='address_state'
                                                                                className='address_state-dropdown'
                                                                                is_align_text_left
                                                                                list={states_list}
                                                                                error={
                                                                                    touched[
                                                                                        field.name as keyof TFormValues
                                                                                    ] &&
                                                                                    errors[
                                                                                        field.name as keyof TFormValues
                                                                                    ]
                                                                                }
                                                                                name='address_state'
                                                                                value={values.address_state}
                                                                                onChange={handleChange}
                                                                                placeholder={localize('State/Province')}
                                                                                list_portal_id='modal_root'
                                                                            />
                                                                        )}
                                                                    </Field>
                                                                </DesktopWrapper>
                                                                <MobileWrapper>
                                                                    <SelectNative
                                                                        label={localize('State/Province')}
                                                                        value={values.address_state}
                                                                        list_items={states_list}
                                                                        error={
                                                                            touched.address_state &&
                                                                            errors.address_state
                                                                        }
                                                                        onChange={(
                                                                            e: React.ChangeEvent<HTMLSelectElement>
                                                                        ) => {
                                                                            handleChange(e);
                                                                            setFieldValue(
                                                                                'address_state',
                                                                                e.target.value,
                                                                                true
                                                                            );
                                                                        }}
                                                                    />
                                                                </MobileWrapper>
                                                            </React.Fragment>
                                                        ) : (
                                                            // Fallback to input field when states list is empty / unavailable for country
                                                            <InputField
                                                                name='address_state'
                                                                label={localize('State/Province')}
                                                                placeholder={localize('State/Province')}
                                                                value={values.address_state}
                                                                onBlur={handleBlur}
                                                            />
                                                        )}
                                                    </fieldset>
                                                    <InputField
                                                        maxLength={255}
                                                        name='address_postcode'
                                                        label={localize('Postal/ZIP code')}
                                                        placeholder={localize('Postal/ZIP code')}
                                                        onBlur={handleBlur}
                                                        optional
                                                    />
                                                </div>
                                                <div className='cfd-proof-of-address__file-upload'>
                                                    <FileUploaderContainer
                                                        onRef={(ref: React.RefObject<(HTMLElement | null) & TUpload>) =>
                                                            (file_uploader_ref = ref)
                                                        }
                                                        getSocket={WS.getSocket}
                                                        onFileDrop={(df: {
                                                            files: TObjDocumentFile;
                                                            error_message: string;
                                                        }) =>
                                                            onFileDrop(
                                                                df.files,
                                                                df.error_message,
                                                                setFieldTouched,
                                                                setFieldValue,
                                                                values as TFormValues
                                                            )
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        </ThemedScrollbars>
                                    )}

                                    <Modal.Footer is_bypassed={isMobile()}>
                                        {(poa_status === PoaStatusCodes.none || is_form_visible) && (
                                            <FormSubmitButton
                                                is_disabled={
                                                    isFormDisabled(dirty, errors) ||
                                                    (poa_status !== PoaStatusCodes.verified &&
                                                        document_upload.files &&
                                                        document_upload.files.length < 1) ||
                                                    !!document_upload.error_message
                                                }
                                                label={
                                                    poa_status === PoaStatusCodes.verified
                                                        ? localize('Submit')
                                                        : localize('Next')
                                                }
                                                is_absolute={isMobile()}
                                                is_loading={isSubmitting}
                                                form_error={form_error}
                                            />
                                        )}
                                    </Modal.Footer>
                                </Div100vhContainer>
                            </form>
                        )}
                    </AutoHeightWrapper>
                );
            }}
        </Formik>
    );
};

export default CFDPOA;
