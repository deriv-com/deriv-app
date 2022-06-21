import React, { useRef } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'Stores/connect';
import ProofOfOwnershipForm from './proof-of-ownership-form.jsx';
import POOSubmitted from 'Components/poo-submitted';
import { compressImageFiles, readFiles, WS } from '@deriv/shared';
import { localize } from '@deriv/translations';
import DocumentUploader from '@binary-com/binary-document-uploader';
import { Loading, useStateCallback } from '@deriv/components';
import POONotRequired from 'Components/poo-not-required';
import POOVerified from 'Components/poo-verified';
import POORejetced from 'Components/poo-rejected';

export const ProofOfOwnership = ({ account_status }) => {
    const [form_state, setFormState] = useStateCallback({ should_show_form: true });
    const cards = account_status?.authentication?.ownership?.requests;
    const status = account_status?.authentication?.ownership?.status;
    const needs_verification = account_status?.authentication?.needs_verification?.find(a => a === 'ownership');

    const formRef = useRef();
    const fileReadErrorMessage = filename => {
        return localize('Unable to read file {{name}}', { name: filename });
    };
    const handleSubmit = async e => {
        try {
            e.preventDefault();
            const { data: formValues } = formRef.current.values;
            const uploader = new DocumentUploader({ connection: WS.getSocket() });
            const { get_settings, error } = await WS.authorized.storage.getSettings();
            if (error) {
                throw new Error(error);
            }
            if (formRef.current.errors.length > 0) {
                // Only upload if no errors and a file has been attached
                return;
            }
            setFormState({ ...form_state, ...{ is_btn_loading: true } });
            formValues.forEach(async values => {
                if (values.files.length > 0) {
                    const files = values.files.flatMap(f => f.file);
                    const filesToProcess = await compressImageFiles(files);
                    const processedFiles = await readFiles(filesToProcess, fileReadErrorMessage);
                    if (typeof processedFiles === 'string') {
                        // eslint-disable-next-line no-console
                        console.warn(processedFiles);
                    }
                    processedFiles.forEach(async pF => {
                        const fileToSends = pF;
                        fileToSends.proof_of_ownership = {
                            details: {
                                email: get_settings.email,
                                identifier: values.identifier,
                            },
                            id: values.id,
                        };
                        fileToSends.documentType = 'proof_of_ownership';
                        const response = await uploader.upload(fileToSends);
                        if (response.warning) {
                            // eslint-disable-next-line no-console
                            console.warn(response);
                        } else {
                            location.reload();
                        }
                    });
                }
            });
        } catch (err) {
            // eslint-disable-next-line no-console
            console.warn(err);
        } finally {
            setFormState({ ...form_state, ...{ is_btn_loading: false } });
        }
    };
    if (needs_verification === 'ownership') {
        return (
            <ProofOfOwnershipForm
                cards={cards}
                handleSubmit={handleSubmit}
                formRef={formRef}
                is_loading={form_state.is_btn_loading}
            />
        ); // Proof of ownership is required.
    }
    if (status === 'verified') {
        return <POOVerified />; // Proof of ownership verified
    }
    if (status === 'pending') {
        return <POOSubmitted />; // Proof of ownership submitted pending review
    }
    if (status === 'none') {
        return <POONotRequired />; // Client does not need proof of ownership.
    }
    if (status === 'rejected') {
        return <POORejetced />; // Proof of ownership rejected
    }
    return <Loading is_fullscreen={false} className='account__initial-loader' />;
};

export default connect(({ client }) => ({
    account_status: client.account_status,
}))(withRouter(ProofOfOwnership));
