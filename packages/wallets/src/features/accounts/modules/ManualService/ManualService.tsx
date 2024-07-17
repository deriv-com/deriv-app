import React, { useState } from 'react';
import { useSettings } from '@deriv/api-v2';
import { Loader } from '@deriv-com/ui';
import { ModalStepWrapper } from '../../../../components';
import { DocumentSelection } from './components';
import { manualDocumentsMapper, TManualDocumentComponent, TManualDocumentType } from './utils';

type TManualServiceProps = {
    onCompletion?: () => void;
};

type TSelectedManualDocument = keyof TManualDocumentType | undefined;

const ManualService: React.FC<TManualServiceProps> = ({ onCompletion }) => {
    const { data: accountSettings, isLoading: isAccountSettingsLoading } = useSettings();
    const [selectedManualDocument, setSelectedManualDocument] = useState<TSelectedManualDocument>();
    let SelectedDocument: TManualDocumentComponent;

    const resetSelectedDocument = () => {
        setSelectedManualDocument(undefined);
    };

    if (isAccountSettingsLoading) {
        return <Loader />;
    }

    if (selectedManualDocument) {
        SelectedDocument = manualDocumentsMapper[selectedManualDocument].component;
        return <SelectedDocument onClickBack={resetSelectedDocument} onCompletion={onCompletion} />;
    }

    return (
        <ModalStepWrapper title='Add a real MT5 account'>
            <DocumentSelection
                onSelectDocument={document => {
                    setSelectedManualDocument(document);
                }}
            />
        </ModalStepWrapper>
    );
};

export default ManualService;
