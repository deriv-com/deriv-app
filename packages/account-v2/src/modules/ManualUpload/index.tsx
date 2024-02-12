/* eslint-disable no-console */
import React, { useState } from 'react';
import { TManualDocumentTypes } from '../../constants/manualFormConstants';
import { DocumentSelection } from '../../containers/DocumentSelection';
import { ManualForm } from '../../containers/ManualForm';

type TManualUploadProps = { countryCode: string };

export const ManualUpload = ({ countryCode }: TManualUploadProps) => {
    const [selectedDocument, setSelectedDocument] = useState<string | null>(null);

    if (selectedDocument) {
        return (
            <ManualForm
                onSubmit={() => console.log('Called submit')}
                selectedDocument={selectedDocument as TManualDocumentTypes}
                onCancel={() => {
                    console.log('Called on Cancel');
                    setSelectedDocument(null);
                }}
            />
        );
    }
    return <DocumentSelection countryCode={countryCode} handleOnClick={setSelectedDocument} />;
};
