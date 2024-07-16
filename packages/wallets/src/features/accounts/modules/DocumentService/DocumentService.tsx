import React from 'react';
import classNames from 'classnames';
import { IDVService, Onfido } from './components';
import './DocumentService.scss';

type TDocumentServiceProps = {
    onCompletion?: () => void;
};

const DocumentService: React.FC<TDocumentServiceProps> = ({ onCompletion }) => {
    return (
        <div
            className={classNames('wallets-document-service', {
                // 'wallets-document-service--reverse': isOnfido,
            })}
        >
            {/* <IDVService onCompletion={onCompletion} /> */}
            <Onfido onCompletion={onCompletion} />
        </div>
    );
};

export default DocumentService;
