import React from 'react';
import { Button } from '@deriv/components';
import { TPasswordBoxProps } from './props.types';
import { localize } from '@deriv/translations';

const PasswordBox = ({ onClick }: TPasswordBoxProps) => (
    <div className='cfd-trade-modal__password-box'>
        <Button className='cfd-trade-modal__password-action' transparent onClick={onClick}>
            {localize('Forgot password?')}
        </Button>
    </div>
);

export default PasswordBox;
