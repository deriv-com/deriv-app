import React from 'react';
import { observer, useStore } from '@deriv/stores';
import { Text, InlineMessage, Button } from '@deriv/components';
import { Localize, useTranslations } from '@deriv-com/translations';
import { StandaloneXmarkBoldIcon } from '@deriv/quill-icons';
import clsx from 'clsx';
import { useHistory } from 'react-router';
import { routes as shared_routes } from '@deriv/shared';
import './poa-mobile-layout.scss';
import { useFormikContext, Form } from 'formik';
import { useDevice } from '@deriv-com/ui';
import FormBody from '../../../Components/form-body';
import FormSubHeader from '../../../Components/form-sub-header';
import PersonalDetailsForm from '../../../Components/forms/personal-details-form.jsx';
import { TPOAFormState } from '../../../Types';
import FormFooter from '../../../Components/form-footer';
import FileUploaderContainer from '../../../Components/file-uploader-container';
import FilesDescription from '../../../Components/file-uploader-container/files-descriptions';
import CommonMistakeExamples from '../../../Components/poa/common-mistakes/common-mistake-examples';
import { getFileUploaderDescriptions } from '../../../Constants/file-uploader';

type TPOAMobileLayout = {
    className?: string;
    setOffset: (status: { msg: string }) => string;
    is_for_cfd_modal?: boolean;
    is_resubmit?: boolean;
    setDocumentFiles: (files: File[]) => void;
    document_files: File[];
    form_state: TPOAFormState;
};

type TFormInitialValues = Record<
    'address_line_1' | 'address_line_2' | 'address_city' | 'address_state' | 'address_postcode',
    string
> & {
    document_type?: Record<'text' | 'value', string>;
};

const ProgressBar = ({ is_active }: { is_active: boolean }) => (
    <div className='progress-container'>
        <div className={clsx('progress-bar', { 'progress-bar--animate': is_active })} />
    </div>
);

const POAMobileLayout = observer(
    ({ is_for_cfd_modal, setOffset, is_resubmit, form_state, document_files, setDocumentFiles }: TPOAMobileLayout) => {
        const history = useHistory();
        const { localize } = useTranslations();
        const { isDesktop } = useDevice();
        const { status, handleSubmit, isSubmitting, isValid, values, errors } = useFormikContext<TFormInitialValues>();
        const { client } = useStore();
        const [file_selection_error, setFileSelectionError] = React.useState<string | null>(null);
        const [step, setStep] = React.useState(1);

        const { states_list, account_settings, is_eu, getChangeableFields } = client;

        const changeable_fields = getChangeableFields();
        const poa_uploader_files_descriptions = React.useMemo(() => getFileUploaderDescriptions('poa', is_eu), []);

        const isNextBtnDisabled = React.useMemo(() => {
            if (step === 2) {
                return false;
            }
            return (
                !values.address_line_1 &&
                !!errors.address_line_1 &&
                !!errors.address_line_2 &&
                !values.address_city &&
                !!errors.address_city &&
                !!errors.address_state &&
                !!errors.address_postcode
            );
        }, [values]);

        return (
            <div className='poa-mobile-layout'>
                <div className='poa-header'>
                    <div className='timeline'>
                        <Text as='p' size='xxs'>
                            <Localize
                                i18n_default_text='<0>Proof of address:</0> Step {{step}}/2 '
                                values={{ step }}
                                components={[<strong key={0} />]}
                            />
                        </Text>
                        {!is_for_cfd_modal && (
                            <StandaloneXmarkBoldIcon
                                iconSize='md'
                                onClick={() => {
                                    history.push(shared_routes.traders_hub);
                                }}
                            />
                        )}
                    </div>
                    <div className='timeline-item'>
                        <ProgressBar is_active={step <= 2} />
                        <ProgressBar is_active={step === 2} />
                    </div>
                </div>
                <Form noValidate className='account-form account-form_poa' onSubmit={handleSubmit}>
                    <FormBody scroll_offset={setOffset(status)}>
                        {(status?.msg || is_resubmit) && (
                            <InlineMessage
                                type='error'
                                message={
                                    <Text as='p' size='xxxs'>
                                        {!status?.msg && is_resubmit && (
                                            <Localize i18n_default_text='We were unable to verify your address with the details you provided. Please check and resubmit or choose a different document type.' />
                                        )}
                                        {status?.msg}
                                    </Text>
                                }
                                className='poa-error-banner'
                                id='dt_poa_submit-error'
                            />
                        )}
                        {step === 1 && (
                            <React.Fragment>
                                <FormSubHeader title={localize('Enter your address')} title_text_size='s' />
                                <PersonalDetailsForm
                                    /* eslint-disable @typescript-eslint/ban-ts-comment */
                                    // @ts-nocheck This needs to fixed in PersonalDetailsForm
                                    is_qualified_for_poa
                                    editable_fields={changeable_fields}
                                    states_list={states_list}
                                />
                                <FormFooter className='account-form__footer-poa'>
                                    <Button
                                        className='account-form__footer-btn'
                                        type='button'
                                        has_effect
                                        text={localize('Next')}
                                        primary
                                        is_disabled={isNextBtnDisabled}
                                        onClick={() => setStep(prev_step => prev_step + 1)}
                                    />
                                </FormFooter>
                            </React.Fragment>
                        )}
                        {step === 2 && (
                            <React.Fragment>
                                <FormSubHeader title={localize('Submit your document')} title_text_size='s' />
                                <FileUploaderContainer
                                    onFileDrop={files => {
                                        setDocumentFiles(files);
                                    }}
                                    onError={setFileSelectionError}
                                    files_description={
                                        <FilesDescription
                                            title={poa_uploader_files_descriptions.title}
                                            descriptions={poa_uploader_files_descriptions.descriptions}
                                        />
                                    }
                                    examples={<CommonMistakeExamples />}
                                    country_of_residence={account_settings?.country_code as string}
                                />
                                <FormFooter className='account-form__footer-poa'>
                                    <Button
                                        className='account-form__footer-btn'
                                        type='submit'
                                        has_effect
                                        text={localize('Submit')}
                                        primary
                                        is_disabled={
                                            isSubmitting ||
                                            !isValid ||
                                            (document_files && document_files.length < 1) ||
                                            !!file_selection_error
                                        }
                                        is_loading={form_state.is_btn_loading}
                                        is_submit_success={form_state.is_submit_success}
                                    />
                                </FormFooter>
                            </React.Fragment>
                        )}
                    </FormBody>
                </Form>
            </div>
        );
    }
);

export default POAMobileLayout;
