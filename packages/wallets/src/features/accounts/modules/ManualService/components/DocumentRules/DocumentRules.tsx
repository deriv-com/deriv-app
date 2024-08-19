import React from 'react';
import { TDocumentRule } from '../../utils';
import { DocumentRuleTile } from './components';
import './DocumentRules.scss';

type TDocumentRulesProps = {
    hints: TDocumentRule[];
};

/** Component which shows the hints of the rules of uploaded for documents during POI */
const DocumentRules: React.FC<TDocumentRulesProps> = ({ hints }) => (
    <div className='wallets-document-rule-hints'>
        {hints.map(hint => (
            <DocumentRuleTile description={hint.description} icon={hint.icon} key={hint.description} />
        ))}
    </div>
);

export default DocumentRules;
