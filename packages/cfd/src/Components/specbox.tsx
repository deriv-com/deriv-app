import React from 'react';
import { Text } from '@deriv/components';
import { CFDAccountCopy } from './cfd-account-copy';

export type TSpecBoxProps = {
    value?: string;
    is_bold?: boolean;
};

const SpecBox = ({ value, is_bold }: TSpecBoxProps) => (
    <div className='cfd-trade-modal__spec-box'>
        <Text size='xs' weight={is_bold ? 'bold' : ''} className='cfd-trade-modal__spec-text'>
            {value}
        </Text>
        <CFDAccountCopy text={value} className='cfd-trade-modal__spec-copy' />
    </div>
);

export default SpecBox;
