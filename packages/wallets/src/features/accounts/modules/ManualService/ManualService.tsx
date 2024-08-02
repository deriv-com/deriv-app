import React, { useState } from 'react';
import { useSettings } from '@deriv/api-v2';
import { useTranslations } from '@deriv-com/translations';
import { Loader } from '@deriv-com/ui';
import { ModalStepWrapper } from '../../../../components';
import { DocumentSelection } from './components';
import { getManualDocumentsMapper, TManualDocumentComponent, TManualDocumentType } from './utils';

type TManualServiceProps = {
    onCompletion?: VoidFunction;
};

type TSelectedManualDocument = keyof TManualDocumentType | undefined;

const ManualService: React.FC<TManualServiceProps> = ({ onCompletion }) => {
    const { localize } = useTranslations();
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
        SelectedDocument = getManualDocumentsMapper(localize)[selectedManualDocument].component;
        return (
            <SelectedDocument
                documentIssuingCountryCode={accountSettings.country_code}
                onClickBack={resetSelectedDocument}
                onCompletion={onCompletion}
            />
        );
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
