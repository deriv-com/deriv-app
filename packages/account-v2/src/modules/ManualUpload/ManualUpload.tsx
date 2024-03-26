import React, { useState } from 'react';
import { DocumentSelection } from '../../containers/DocumentSelection';
import { ManualUploadContainer } from '../../pages/ManualUploadContainer/ManualUploadContainer';

type TManualUploadProps = { countryCode: string; onCancel: () => void };

export const ManualUpload = ({ countryCode, onCancel }: TManualUploadProps) => {
    const [selectedDocument, setSelectedDocument] = useState<string | null>(null);

    if (selectedDocument) {
        return (
            <ManualUploadContainer
                countryCode={countryCode}
                selectedDocument={selectedDocument}
                setSelectedDocument={setSelectedDocument}
            />
        );
    }
    return <DocumentSelection countryCode={countryCode} handleOnClick={setSelectedDocument} onCancel={onCancel} />;
};
