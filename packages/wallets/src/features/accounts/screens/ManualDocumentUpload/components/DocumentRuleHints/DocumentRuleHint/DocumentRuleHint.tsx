import React, { ReactNode } from 'react';
import { WalletText } from '../../../../../../../components/Base';
import './DocumentRuleHint.scss';

type TProps = {
    description?: ReactNode;
    icon: ReactNode;
};

const DocumentRuleHint: React.FC<TProps> = ({ description, icon }) => (
    <div className='wallets-document-rule-hint'>
        {icon}
        <WalletText align='center' size='2xs'>
            {description}
        </WalletText>
    </div>
);

export default DocumentRuleHint;
