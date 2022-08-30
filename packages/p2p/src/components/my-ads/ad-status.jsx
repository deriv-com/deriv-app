import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react-lite';
import { Text } from '@deriv/components';
import { Localize } from 'Components/i18next';
import './ad-status.scss';

const AdStatus = ({ is_active }) => {
    if (!is_active) {
        return (
            <Text
                align='center'
                className='ad-status--inactive'
                color='loss-danger'
                line_height='s'
                size='xs'
                weight='bold'
            >
                <Localize i18n_default_text='Inactive' />
            </Text>
        );
    }

    return (
        <Text
            align='center'
            className='ad-status--active'
            color='profit-success'
            line_height='s'
            size='xs'
            weight='bold'
        >
            <Localize i18n_default_text='Active' />
        </Text>
    );
};

AdStatus.propTypes = {
    is_active: PropTypes.bool,
};

export default observer(AdStatus);
