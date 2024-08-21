import React from 'react';
import { useSettings } from '@deriv/api-v2';
import { Localize, useTranslations } from '@deriv-com/translations';
import { Text } from '@deriv-com/ui';
import { getManualDocumentsMapper } from '../../utils';
import { DocumentSelectionCard } from './components';
import './DocumentSelection.scss';

type TProps = {
    onSelectDocument: (document: string) => void;
};

const DocumentSelection: React.FC<TProps> = ({ onSelectDocument }) => {
    const { localize } = useTranslations();
    const { data } = useSettings();

    const documents = getManualDocumentsMapper(localize);

    return (
        <div className='wallets-document-selection'>
            <div className='wallets-document-selection__content'>
                <Text>
                    <Localize i18n_default_text='Please upload one of the following documents:' />
                </Text>
                {Object.keys(documents).map(document => {
                    const { countries, description, icon, title } = documents[document];
                    if (countries && !countries.includes(data?.country_code ?? '')) {
                        return null;
                    }
                    return (
                        <DocumentSelectionCard
                            description={description}
                            icon={icon}
                            key={`document-card-${document}`}
                            onClick={onSelectDocument}
                            title={title}
                            value={document}
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default DocumentSelection;
