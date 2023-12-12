import React from 'react';
import classNames from 'classnames';
import { Text } from '@deriv/components';
import { CopyTextComponent } from './copy-text-component';
import '../sass/cfd-dashboard.scss';

export type TSpecBoxProps = {
    value?: string;
    is_bold?: boolean;
    is_broker?: boolean;
};

const SpecBox = ({ value, is_bold, is_broker }: TSpecBoxProps) => (
    <div className='trade-modal__spec-box '>
        <Text
            size='xs'
            weight={is_bold ? 'bold' : ''}
            className={classNames('trade-modal__spec-text', { 'trade-modal__spec-text-broker': is_broker })}
        >
            {value}
        </Text>
        <CopyTextComponent text={value} className='trade-modal__spec-copy' />
    </div>
);

export default SpecBox;
