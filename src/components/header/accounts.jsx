import React from 'react';
import { translate }  from '../../utils/lang/i18n';
import '../../assets/sass/header/_accounts.scss';

const Accounts = () => (
    <div className='account-info'>
        <button className='btn btn__secondary btn__secondary--orange'>
            <span> {translate('Log in')} </span>
        </button>
        <button className='btn btn__primary--orange'>
            <span> {translate('Sign up')} </span>
        </button>
    </div>
);

export default Accounts;
