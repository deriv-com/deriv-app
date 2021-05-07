import PropTypes from 'prop-types';
import React from 'react';
import { localize } from '@deriv/translations';
import { formatDuration, getDiffDuration } from '@deriv/shared';
import { Text } from '@deriv/components';
import Fieldset from 'App/Components/Form/fieldset.jsx';
import { connect } from 'Stores/connect';
import { getCardLabels } from 'Constants/contract';

const Expiration = ({ expiration, start_time, is_text_only, text_size }) => {
    const { days, timestamp } = formatDuration(getDiffDuration(start_time.unix(), expiration), 'HH:mm');
    const unit = days > 1 ? getCardLabels().DAYS : getCardLabels().DAY;

    if (is_text_only) {
        return (
            <React.Fragment>
                {expiration ? (
                    <Text size={text_size} align='center'>
                        {days} {unit} {timestamp}
                    </Text>
                ) : (
                    '-'
                )}
            </React.Fragment>
        );
    }

    return (
        <Fieldset
            className='trade-container__fieldset trade-container__fieldset__multiplier'
            is_center
            header={localize('Expires in')}
            header_tooltip={
                expiration
                    ? localize(
                          'Your contract will be closed automatically at the next available asset price when the duration exceeds {{ days }} {{ unit }} {{ timestamp }}.',
                          { days, timestamp, unit }
                      )
                    : null
            }
        >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '1.6rem' }}>
                {expiration ? (
                    <Text size='xs' align='center'>
                        {days} {unit} {timestamp}
                    </Text>
                ) : (
                    '-'
                )}
            </div>
        </Fieldset>
    );
};

Expiration.propTypes = {
    expiration: PropTypes.number,
    is_text_only: PropTypes.bool,
    start_time: PropTypes.number,
    text_size: PropTypes.string,
};

export default connect(({ modules, common }) => ({
    expiration: modules.trade.expiration,
    start_time: common.server_time,
}))(Expiration);
