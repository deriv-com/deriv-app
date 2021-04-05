import React from 'react';
import DocumentsUpload from './documents-upload.jsx';
import SelfieUpload from './selfie-upload.jsx';
import './card-details.scss';

const CardDetails = ({ data, goToCards, onConfirm }) => {
    const [documents, setDocuments] = React.useState({});
    const [is_selfie_upload, setIsSelfieUpload] = React.useState(false);

    const onSubmitDucuments = values => {
        setDocuments(values);
        setIsSelfieUpload(true);
    };

    const onConfirmDocuments = values => {
        onConfirm({ ...documents, ...values });
    };

    return (
        <React.Fragment>
            {!is_selfie_upload ? (
                <DocumentsUpload
                    initial_values={documents}
                    data={data}
                    goToCards={goToCards}
                    onSubmit={onSubmitDucuments}
                />
            ) : (
                <SelfieUpload boBack={() => setIsSelfieUpload(false)} onConfirm={onConfirmDocuments} />
            )}
        </React.Fragment>
    );
};

export default CardDetails;
