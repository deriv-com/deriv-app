import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react-lite';
import { Text } from '@deriv/components';
import { Localize } from 'Components/i18next';
import './ad-status.scss';

const AdStatus = ({ days_until_archive, is_active }) => {
    if (!is_active) {
        return (
            <div className='ad-status--inactive'>
                <Text color='loss-danger' line_height='s' size='xs' weight='bold'>
                    <Localize i18n_default_text='Inactive' />
                </Text>
            </div>
        );
    }

    if (days_until_archive === 1) {
        return (
            <div className='ad-status--days_until_archive'>
                <Text color='warning' line_height='m' size='xs' weight='bold'>
                    <Localize
                        i18n_default_text='Deactivating in: <br/> {{days_until_archive}} day'
                        values={{ days_until_archive }}
                    />
                </Text>
            </div>
        );
    }

    if (days_until_archive > 1 && days_until_archive <= 10) {
        return (
            <div className='ad-status--days_until_archive'>
                <Text color='warning' line_height='m' size='xs' weight='bold'>
                    <Localize
                        i18n_default_text='Deactivating in: <br/> {{days_until_archive}} days'
                        values={{ days_until_archive }}
                    />
                </Text>
            </div>
        );
    }

    return (
        <div className='ad-status--active'>
            <Text color='profit-success' line_height='s' size='xs' weight='bold'>
                <Localize i18n_default_text='Active' />
            </Text>
        </div>
    );
};

AdStatus.propTypes = {
    days_until_archive: PropTypes.number,
    is_active: PropTypes.bool,
};

export default observer(AdStatus);
