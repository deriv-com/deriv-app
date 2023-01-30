import classNames from 'classnames';
import React from 'react';
import { Text } from '@deriv/components';

export type TFormSubHeader = {
    description?: string;
    subtitle?: string;
    title: string;
};

export const FormSubHeader = ({ description, subtitle, title }: TFormSubHeader) => {
    const title_as_class = title.replace(/\s+/g, '-').toLowerCase();
    return (
        <React.Fragment>
            <div
                className={classNames('account-form__header', title_as_class, {
                    'account-form__header--has-description': !!description,
                })}
                data-testid='form-sub-header'
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
};
