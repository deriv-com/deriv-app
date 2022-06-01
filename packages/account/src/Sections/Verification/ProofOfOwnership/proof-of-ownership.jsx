import React, { useRef } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'Stores/connect';
import ProofOfOwnershipForm from './proof-of-ownership-form.jsx';
import POOSubmitted from 'Components/poo-submitted';
import { compressImageFiles, readFiles, WS } from '@deriv/shared';
import { localize } from '@deriv/translations';
import DocumentUploader from '@binary-com/binary-document-uploader';
import { Loading } from '@deriv/components';
import POONotRequired from 'Components/poo-not-required';
import POOVerified from 'Components/poo-verified';
import POORejetced from 'Components/poo-rejected';

const ProofOfOwnership = ({ account_status }) => {
    const cards = account_status?.authentication?.ownership?.requests;
    const status = account_status?.authentication?.ownership?.status;
    const formRef = useRef();
    const fileReadErrorMessage = filename => {
        return localize('Unable to read file {{name}}', { name: filename });
    };
    const handleSubmit = async e => {
        e.preventDefault();
        const { data: formValues } = formRef.current.values;
        const uploader = new DocumentUploader({ connection: WS.getSocket() });
        const { get_settings, error } = await WS.authorized.storage.getSettings();
        if (error) {
            // TODO: Handle Errors
            return;
        }
        formValues.forEach(async values => {
            if (values.files.length > 0) {
                const files = values.files.flatMap(f => f.file);
                const filesToProcess = await compressImageFiles(files);
                const processedFiles = await readFiles(filesToProcess, fileReadErrorMessage);
                if (typeof processedFiles === 'string') {
                    // TODO: Display errors
                }
                processedFiles.forEach(async pF => {
                    const fileToSends = pF;
                    fileToSends.proof_of_ownership = {
                        details: {
                            email: get_settings.email,
                        },
                        id: values.id,
                    };
                    fileToSends.documentType = 'proof_of_ownership';
                    const response = await uploader.upload(fileToSends);
                    if (response.warning) {
                        // TODO: Display errors
                    }
                });
            }
        });
    };
    if (status === 'pending' && cards.length) {
        return <ProofOfOwnershipForm cards={cards} handleSubmit={handleSubmit} formRef={formRef} />; // Proof of ownership is required.
    }
    if (status === 'verified') {
        return <POOVerified />; // Proof of ownership verified
    }
    if (status === 'pending' && cards.length === 0) {
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
