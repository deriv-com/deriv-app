import React from 'react';
import { useFlow } from '../../../../components/FlowProvider';
import { DocumentSelection } from './components/DocumentSelection';
import {
    DrivingLicenseDocumentUpload,
    IdentityCardDocumentUpload,
    NIMCSlipDocumentUpload,
    PassportDocumentUpload,
} from './components';
import './ManualDocumentUpload.scss';

const ManualDocumentUploadContent = () => {
    const { formValues, setFormValues } = useFlow();

    if (formValues.selectedManualDocument === 'passport') {
        return <PassportDocumentUpload />;
    } else if (formValues.selectedManualDocument === 'driving-license') {
        return <DrivingLicenseDocumentUpload />;
    } else if (formValues.selectedManualDocument === 'identity-card') {
        return <IdentityCardDocumentUpload />;
    } else if (formValues.selectedManualDocument === 'nimc-slip') {
        return <NIMCSlipDocumentUpload />;
    }

    return <DocumentSelection setSelectedDocument={(doc: string) => setFormValues('selectedManualDocument', doc)} />;
};

const ManualDocumentUpload = () => {
    return (
        <div className='wallets-manual-document-upload'>
            <ManualDocumentUploadContent />
        </div>
    );
};

export default ManualDocumentUpload;
