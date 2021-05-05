import PropTypes from 'prop-types';
import React from 'react';
import { localize } from '@deriv/translations';
import { formatDuration, getDiffDuration } from '@deriv/shared';
import { Text } from '@deriv/components';
import Fieldset from 'App/Components/Form/fieldset.jsx';
import { connect } from 'Stores/connect';

const Expiration = ({ expiration, start_time }) => {
    if (!expiration) return null;
    return (
        <Fieldset
            className='trade-container__fieldset trade-container__fieldset__multiplier'
            is_center
            header={localize('Expiration')}
            header_tooltip={localize(
                'Your contract will be closed automatically at the next available asset price when the duration exceeds {{ duration }}.',
                { duration: formatDuration(getDiffDuration(start_time.unix(), expiration)) }
            )}
        >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '1.6rem' }}>
                <Text size='xs' align='center'>
                    {expiration} {localize('days')}
                </Text>
            </div>
        </Fieldset>
    );
};

Expiration.propTypes = {
    expiration: PropTypes.number,
    start_time: PropTypes.number,
};

export default connect(({ modules, common }) => ({
    expiration: modules.trade.proposal_info.date_expiry,
    start_time: common.start_time,
}))(Expiration);
