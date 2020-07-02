import classNames from 'classnames';
import React from 'react';

export const FormSubHeader = ({ title, subtitle, description }) => (
    <React.Fragment>
        <div
            className={classNames('account-form__header', {
                'account-form__header--has-description': !!description,
            })}
        >
            <h1 className='account-form__title'>
                {title}
                {subtitle && <i className='account-form__subtitle'>{subtitle}</i>}
            </h1>
        </div>
        {description && <p className='account-form__description'>{description}</p>}
    </React.Fragment>
);
