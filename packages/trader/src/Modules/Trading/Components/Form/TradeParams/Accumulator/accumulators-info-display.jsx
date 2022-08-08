import PropTypes from 'prop-types';
import React from 'react';
import { Localize } from '@deriv/translations';
import Fieldset from 'App/Components/Form/fieldset.jsx';
import { connect } from 'Stores/connect';
import { Text } from '@deriv/components';
import classNames from 'classnames';

const AccumulatorsInfoDisplay = ({ currency, max_payout, maximum_ticks }) => {
    return (
        <Fieldset className={classNames('trade-container__fieldset', 'trade-container__fieldset--accu-info-display')}>
            <Text size='xs' weight='bold'>
                {
                    <Localize
                        i18n_default_text={'Maximum payout <0>{{max_payout}} {{currency}}</0>'}
                        values={{ max_payout: max_payout?.toFixed(2), currency }}
                        components={[<Text key={0} styles={{ marginLeft: '4px', borderBottom: 'none' }} size='xxxs' />]}
                    />
                }
            </Text>
            <Text size='xs' weight='bold'>
                {
                    <Localize
                        i18n_default_text={'Maximum ticks <0>{{maximum_ticks}} {{ticks}}</0>'}
                        values={{ maximum_ticks, ticks: maximum_ticks === 1 ? 'tick' : 'ticks' }}
                        components={[<Text key={0} styles={{ marginLeft: '4px', borderBottom: 'none' }} size='xxxs' />]}
                    />
                }
            </Text>
        </Fieldset>
    );
};

AccumulatorsInfoDisplay.propTypes = {
    currency: PropTypes.string,
    max_payout: PropTypes.number,
    maximum_ticks: PropTypes.number,
};

export default connect(({ modules }) => ({
    // TODO:: when API is ready, connect real maximum_ticks
    currency: modules.trade.currency,
    maximum_ticks: modules.trade.maximum_ticks,
    max_payout: modules.trade.max_payout,
}))(AccumulatorsInfoDisplay);
