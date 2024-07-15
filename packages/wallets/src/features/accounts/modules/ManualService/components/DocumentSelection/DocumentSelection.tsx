import React from 'react';
import { useSettings } from '@deriv/api-v2';
import { WalletText } from '../../../../../../components/Base';
import { manualDocumentsMapper } from '../../utils';
import { DocumentSelectionCard } from './components';
import './DocumentSelection.scss';

type TProps = {
    onSelectDocument: (document: string) => void;
};

const DocumentSelection: React.FC<TProps> = ({ onSelectDocument }) => {
    const { data } = useSettings();

    return (
        <div className='wallets-document-selection'>
            <div className='wallets-document-selection__content'>
                <WalletText>Please upload one of the following documents:</WalletText>
                {Object.keys(manualDocumentsMapper).map(document => {
                    const { countries, description, icon, title } = manualDocumentsMapper[document];
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
