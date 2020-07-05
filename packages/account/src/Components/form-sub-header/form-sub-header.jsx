import classNames from 'classnames';
import React from 'react';

export const FormSubHeader = ({ title, subtitle, description }) => (
    <React.Fragment>
        <div
            className={classNames('account-form__header', {
                'account-form__header--has-description': !!description,
            })}
        >
            <div className='account-form__header-section'>
                <h1 className='account-form__title'>{title}</h1>
                {subtitle && <h2 className='account-form__subtitle'>{subtitle}</h2>}
            </div>
        </div>
        {description && <p className='account-form__description'>{description}</p>}
    </React.Fragment>
);
