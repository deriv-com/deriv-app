import { Button } from '@deriv-com/quill-ui';
import React from 'react';

const ContractDetailsFooter = () => {
    return (
        <div className='contract-details-footer--container'>
            <Button variant='secondary' label='Close @ 9.00 USD' color='black' size='lg' fullWidth />
        </div>
    );
};

export default ContractDetailsFooter;
