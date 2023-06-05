import React from 'react';
import DocumentsUpload from './documents-upload';
import SelfieUpload from './selfie-upload';
import { SELFIE_DOCUMENT } from '../constants';
import './card-details.scss';
import { FormikValues } from 'formik';

type TCardDetails = {
    data: FormikValues;
    onComplete: (e: object) => void;
    goToCards: () => void;
    is_from_external?: boolean;
    setIsCfdPoiCompleted?: (is_cfd_poi_completed: boolean) => void;
};

const CardDetails = ({ data, goToCards, onComplete, is_from_external, setIsCfdPoiCompleted }: TCardDetails) => {
    const [documents, setDocuments] = React.useState<FormikValues>();
    const [selfie, setSelfie] = React.useState<FormikValues>();
    const [is_selfie_upload, setIsSelfieUpload] = React.useState(false);

    const onSubmitDocuments = (values?: FormikValues) => {
        setDocuments(values);
        setIsSelfieUpload(true);
    };

    const onConfirmDocuments = (values?: FormikValues) => {
        onComplete({ ...documents, ...values });
        setIsCfdPoiCompleted?.(true);
    };

    return (
        <React.Fragment>
            {!is_selfie_upload ? (
                <DocumentsUpload
                    initial_values={documents}
                    is_from_external={is_from_external}
                    data={data}
                    goToCards={goToCards}
                    onSubmit={onSubmitDocuments}
                />
            ) : (
                <SelfieUpload
                    initial_values={selfie}
                    goBack={() => setIsSelfieUpload(false)}
                    onConfirm={onConfirmDocuments}
                    onFileDrop={(value?: string) => setSelfie({ [SELFIE_DOCUMENT.name]: value })}
                />
            )}
        </React.Fragment>
    );
};

export default CardDetails;
