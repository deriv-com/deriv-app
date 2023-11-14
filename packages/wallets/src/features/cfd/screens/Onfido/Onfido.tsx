import React from 'react';
import { useOnfido } from '@deriv/api';
import './Onfido.scss';

const Onfido = () => {
    const {
        data: { onfidoContainerId },
    } = useOnfido();

    return (
        <div className='wallets-onfido'>
            <div id={onfidoContainerId} />
        </div>
    );
};

export default Onfido;
