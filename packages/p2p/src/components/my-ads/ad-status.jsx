import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react-lite';
import { Text } from '@deriv/components';
import { Localize } from 'Components/i18next';
import './ad-status.scss';

const AdStatus = ({ days_until_archive, is_active }) => {
    if (!is_active) {
        return (
            <Text className='ad-status--inactive' color='loss-danger' line_height='s' size='xs' weight='bold'>
                <Localize i18n_default_text='Inactive' />
            </Text>
        );
    } else if (days_until_archive > 1 && days_until_archive <= 10) {
        return (
            <Text
                align='center'
                className='ad-status--days_until_archive'
                color='warning'
                line_height='m'
                size='xs'
                weight='bold'
            >
                <Localize
                    i18n_default_text='Deactivating in: {{days_until_archive}} days'
                    values={{ days_until_archive }}
                />
            </Text>
        );
    } else if (days_until_archive === 1) {
        return (
            <Text
                align='center'
                className='ad-status--days_until_archive'
                color='warning'
                line_height='m'
                size='xs'
                weight='bold'
            >
                <Localize
                    i18n_default_text='Deactivating in: {{days_until_archive}} day'
                    values={{ days_until_archive }}
                />
            </Text>
        );
    } else if (!days_until_archive) {
        return (
            <Text className='ad-status--active' color='profit-success' line_height='s' size='xs' weight='bold'>
                <Localize i18n_default_text='Active' />
            </Text>
        );
    }

    return null;
};

AdStatus.propTypes = {
    days_until_archive: PropTypes.number,
    is_active: PropTypes.bool,
};

export default observer(AdStatus);
