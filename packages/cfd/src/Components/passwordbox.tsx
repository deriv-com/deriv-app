import React from 'react';
import { Button } from '@deriv-app/components';
import { TPasswordBoxProps } from './props.types';
import { Localize } from '@deriv-app/translations';

const PasswordBox = ({ onClick }: TPasswordBoxProps) => (
    <div className='cfd-trade-modal__password-box'>
        <Button className='cfd-trade-modal__password-action' transparent onClick={onClick}>
            <Localize i18n_default_text='Forgot password?' />
        </Button>
    </div>
);

export default PasswordBox;
