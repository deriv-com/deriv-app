import React, { useState } from 'react';
import { DocumentSelection } from './components/DocumentSelection';
import { PassportDocumentUpload } from './components/PassportDocumentUpload';

const ManualDocumentUpload = () => {
    // will use formik here in the future!
    const [selectedDocument, setSelectedDocument] = useState('');

    if (selectedDocument === 'passport') {
        return <PassportDocumentUpload />;
    } //... other document types

    return <DocumentSelection setSelectedDocument={setSelectedDocument} />;
};

export default ManualDocumentUpload;
