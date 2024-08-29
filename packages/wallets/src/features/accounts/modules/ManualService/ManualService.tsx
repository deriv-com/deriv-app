import React, { useState } from 'react';
import { useSettings } from '@deriv/api-v2';
import { useTranslations } from '@deriv-com/translations';
import { Loader } from '@deriv-com/ui';
import { ModalStepWrapper } from '../../../../components';
import { THooks } from '../../../../types';
import { DocumentSelection } from './components';
import { getManualDocumentsMapper, TManualDocumentType } from './utils';

type TManualServiceProps = {
    onCompletion?: VoidFunction;
};

type TSelectedManualDocument = keyof TManualDocumentType | undefined;

type TSelectedManualDocumentProps = {
    countryCode: THooks.AccountSettings['country_code'];
    onCompletion: TManualServiceProps['onCompletion'];
    resetSelectedDocument: VoidFunction;
    selection: NonNullable<TSelectedManualDocument>;
};

const SelectedManualDocument: React.FC<TSelectedManualDocumentProps> = ({
    countryCode,
    onCompletion,
    resetSelectedDocument,
    selection,
}) => {
    const { localize } = useTranslations();
    const SelectedDocument = getManualDocumentsMapper(localize)[selection].component;

    return (
        <SelectedDocument
            documentIssuingCountryCode={countryCode}
            onClickBack={resetSelectedDocument}
            onCompletion={onCompletion}
        />
    );
};

const ManualService: React.FC<TManualServiceProps> = ({ onCompletion }) => {
    const { data: accountSettings, isLoading: isAccountSettingsLoading } = useSettings();
    const [selection, setSelection] = useState<TSelectedManualDocument>();

    if (isAccountSettingsLoading) {
        return <Loader />;
    }

    if (selection) {
        return (
            <SelectedManualDocument
                countryCode={accountSettings.country_code}
                onCompletion={onCompletion}
                resetSelectedDocument={() => {
                    setSelection(undefined);
                }}
                selection={selection}
            />
        );
    }

    return (
        <ModalStepWrapper title='Add a real MT5 account'>
            <DocumentSelection
                onSelectDocument={document => {
                    setSelection(document);
                }}
            />
        </ModalStepWrapper>
    );
};

export default ManualService;
