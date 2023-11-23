import React from 'react';
import { useSettings } from '@deriv/api';
import { WalletText } from '../../../../../../components/Base';
import { documentTypes } from '../../constants';
import { DocumentSelectionCard } from '../DocumentSelectionCard';
import './DocumentSelection.scss';

type TProps = {
    setSelectedDocument: (document: string) => void;
};

const DocumentSelection: React.FC<TProps> = ({ setSelectedDocument }) => {
    const { data } = useSettings();

    return (
        <div className='wallets-document-selection'>
            <div className='wallets-document-selection__content'>
                <WalletText>Please upload one of the following documents:</WalletText>
                {documentTypes.map(({ countries, description, icon, title, value }) => {
                    if (countries && !countries.includes(data?.country_code ?? '')) {
                        return null;
                    }
                    return (
                        <DocumentSelectionCard
                            description={description}
                            icon={icon}
                            key={`document-card-${value}`}
                            onClick={setSelectedDocument}
                            title={title}
                            value={value}
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default DocumentSelection;
