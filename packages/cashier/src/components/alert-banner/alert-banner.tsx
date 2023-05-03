import React from 'react';
import classNames from 'classnames';
import { Icon, Text } from '@deriv/components';
import { Localize } from '@deriv/translations';
import './alert-banner.scss';

type TAlertBanner = {
    className?: string;
    i18n_default_text?: string;
    icon: string;
    values?: object;
};

const AlertBanner = ({ className, icon, i18n_default_text, values }: TAlertBanner) => {
    return (
        <div className={classNames('alert-banner', className)}>
            <Icon size={16} icon={icon} className='alert-banner__icon' />
            <Text as='p' align='center' size='xs' className='alert-banner__text'>
                <Localize i18n_default_text={i18n_default_text} values={values} />
            </Text>
        </div>
    );
};

export default AlertBanner;
