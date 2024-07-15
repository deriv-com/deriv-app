import React, { useState } from 'react';
import { ModalStepWrapper } from '../../../../components';
import { DocumentSelection } from './components';
import { manualDocumentsMapper, TManualDocumentType } from './utils';

type TManualServiceProps = {
    onCompletion?: () => void;
};

type TSelectedManualDocument = keyof TManualDocumentType | undefined;

const ManualService: React.FC<TManualServiceProps> = ({ onCompletion }) => {
    const [selectedManualDocument, setSelectedManualDocument] = useState<TSelectedManualDocument>();

    if (selectedManualDocument) {
        const SelectedDocument = manualDocumentsMapper[selectedManualDocument].component;
        return <SelectedDocument onCompletion={onCompletion} />;
    }

    return (
        <ModalStepWrapper>
            <DocumentSelection
                onSelectDocument={document => {
                    setSelectedManualDocument(document);
                }}
            />
        </ModalStepWrapper>
    );
};

export default ManualService;
