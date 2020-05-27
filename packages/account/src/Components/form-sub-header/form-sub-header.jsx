import React from 'react';

export const FormSubHeader = ({ title, subtitle }) => (
    <div className='account-form__header'>
        <h1 className='account-form__title'>
            {title}
            {subtitle && <i className='account-form__subtitle'>{subtitle}</i>}
        </h1>
    </div>
);
