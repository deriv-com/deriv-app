import React, { useState } from 'react';
import { DocumentSelection } from './components/DocumentSelection';
import { DrivingLicenseDocumentUpload } from './components/DrivingLicenseDocumentUpload';
import { IdentityCardDocumentUpload } from './components/IdentityCardDocumentUpload';
import { NIMCSlipDocumentUpload } from './components/NIMCSlipDocumentUpload';
import { PassportDocumentUpload } from './components/PassportDocumentUpload';

const ManualDocumentUpload = () => {
    // will use formik here in the future!
    const [selectedDocument, setSelectedDocument] = useState('');

    if (selectedDocument === 'passport') {
        return <PassportDocumentUpload />;
    } else if (selectedDocument === 'driving-license') {
        return <DrivingLicenseDocumentUpload />;
    } else if (selectedDocument === 'identity-card') {
        return <IdentityCardDocumentUpload />;
    } else if (selectedDocument === 'nimc-slip') {
        return <NIMCSlipDocumentUpload />;
    }

    return <DocumentSelection setSelectedDocument={setSelectedDocument} />;
};

export default ManualDocumentUpload;
