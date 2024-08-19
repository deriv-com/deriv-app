import React from 'react';
import { WalletText } from '../../../../../../../../components';
import { TDocumentRule } from '../../../../utils';
import './DocumentRuleTile.scss';

const DocumentRuleTile: React.FC<React.PropsWithChildren<TDocumentRule>> = ({ description, icon }) => {
    return (
        <div className='wallets-document-rule-tile'>
            {icon}
            <WalletText align='center' size='2xs'>
                {description}
            </WalletText>
        </div>
    );
};

export default DocumentRuleTile;
