import React from 'react';
import { Text } from '@deriv-com/ui';
import { TDocumentRule } from '../../../../utils';
import './DocumentRuleTile.scss';

const DocumentRuleTile: React.FC<React.PropsWithChildren<TDocumentRule>> = ({ description, icon }) => {
    return (
        <div className='wallets-document-rule-tile'>
            {icon}
            <Text align='center' size='2xs'>
                {description}
            </Text>
        </div>
    );
};

export default DocumentRuleTile;
