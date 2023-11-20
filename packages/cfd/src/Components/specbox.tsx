import React from 'react';
import classNames from 'classnames';

import { Text } from '@deriv/components';

import { CFDAccountCopy } from './cfd-account-copy';

export type TSpecBoxProps = {
    value?: string;
    is_bold?: boolean;
    is_broker?: boolean;
};

const SpecBox = ({ value, is_bold, is_broker }: TSpecBoxProps) => (
    <div className='cfd-trade-modal__spec-box '>
        <Text
            size='xs'
            weight={is_bold ? 'bold' : ''}
            className={classNames('cfd-trade-modal__spec-text', { 'cfd-trade-modal__spec-text-broker': is_broker })}
        >
            {value}
        </Text>
        <CFDAccountCopy text={value} className='cfd-trade-modal__spec-copy' />
    </div>
);

export default SpecBox;
