import classNames from 'classnames';
import React from 'react';
import { Text } from '@deriv/components';

export const FormSubHeader = ({ title, subtitle, description }) => (
    <React.Fragment>
        <div
            className={classNames('account-form__header', {
                'account-form__header--has-description': !!description,
            })}
        >
            <div className='account-form__header-section'>
                <Text as='h1' color='prominent' weight='bold' size='xs' className='account-form__title'>
                    {title}
                </Text>
                {subtitle && (
                    <Text as='h2' size='xxxs' color='prominent' className='account-form__subtitle'>
                        {subtitle}
                    </Text>
                )}
            </div>
        </div>
        {description && (
            <Text as='p' className='account-form__description'>
                {description}
            </Text>
        )}
    </React.Fragment>
);
