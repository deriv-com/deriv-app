/* eslint-disable no-console */
import React, { useState } from 'react';
import { DocumentSelection } from '../../containers/DocumentSelection';
import { ManualUploadContainer } from '../../pages/ManualFormContainer/manual-form-container';

type TManualUploadProps = { countryCode: string };

export const ManualUpload = ({ countryCode }: TManualUploadProps) => {
    const [selectedDocument, setSelectedDocument] = useState<string | null>(null);

    if (selectedDocument) {
        return <ManualUploadContainer selectedDocument={selectedDocument} setSelectedDocument={setSelectedDocument} />;
    }
    return <DocumentSelection countryCode={countryCode} handleOnClick={setSelectedDocument} />;
};
