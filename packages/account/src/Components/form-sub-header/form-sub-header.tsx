// [TODO] - To be removed once CFD is configured to use the new form-body component
import React, { Fragment } from 'react';
import clsx from 'clsx';
import { Text } from '@deriv/components';

export type TFormSubHeader = {
    description?: string;
    subtitle?: string;
    title: string;
    title_text_size?: string;
};

export const FormSubHeader = ({ description, subtitle, title, title_text_size = 'xs' }: TFormSubHeader) => {
    const title_as_class = title.replace(/\s+/g, '-').toLowerCase();

    return (
        <Fragment>
            <div
                className={clsx('account-form__header', title_as_class, {
                    'account-form__header--has-description': !!description,
                })}
                data-testid='form-sub-header'
            >
                <div className='account-form__header-section'>
                    <Text
                        as='h1'
                        color='prominent'
                        weight='bold'
                        size={title_text_size}
                        className='account-form__title'
                    >
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
        </Fragment>
    );
};
