import PropTypes from 'prop-types';
import React from 'react';
import { localize } from '@deriv/translations';
import { formatDuration, getDiffDuration, getDateFromNow } from '@deriv/shared';
import { Text } from '@deriv/components';
import Fieldset from 'App/Components/Form/fieldset.jsx';
import { observer, useStore } from '@deriv/stores';
import { useTraderStore } from 'Stores/useTraderStores';

const Expiration = observer(({ is_text_only, text_size }) => {
    const { expiration } = useTraderStore();
    const { common } = useStore();
    const { server_time: start_time } = common;
    const { days, timestamp } = formatDuration(getDiffDuration(start_time.unix(), expiration), 'HH:mm');
    const date = getDateFromNow(days, 'day', 'DD MMM YYYY');

    if (is_text_only) {
        return (
            <React.Fragment>
                {expiration ? (
                    <Text size={text_size} align='center'>
                        {date} at {timestamp}
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
            header={localize('Expires on')}
            header_tooltip={
                expiration
                    ? localize(
                          'Your contract will be closed automatically at the next available asset price on {{date}} at {{timestamp}}.',
                          { date, timestamp }
                      )
                    : null
            }
        >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '1.6rem' }}>
                {expiration ? (
                    <Text size='xs' align='center'>
                        {date} at {timestamp}
                    </Text>
                ) : (
                    '-'
                )}
            </div>
        </Fieldset>
    );
});

Expiration.propTypes = {
    is_text_only: PropTypes.bool,
    text_size: PropTypes.string,
};

export default Expiration;
