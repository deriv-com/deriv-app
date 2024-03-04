/* eslint-disable no-console */
import React, { useState } from 'react';
import { DocumentSelection } from '../../containers/DocumentSelection';
import { ManualUploadContainer } from '../../pages/ManualUploadContainer/ManualUploadContainer';

type TManualUploadProps = { countryCode: string };

export const ManualUpload = ({ countryCode }: TManualUploadProps) => {
    const [selectedDocument, setSelectedDocument] = useState<string | null>(null);

    if (selectedDocument) {
        return <ManualUploadContainer selectedDocument={selectedDocument} setSelectedDocument={setSelectedDocument} />;
    }
    return <DocumentSelection countryCode={countryCode} handleOnClick={setSelectedDocument} />;
};
