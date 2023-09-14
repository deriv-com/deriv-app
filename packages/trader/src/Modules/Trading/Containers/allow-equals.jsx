import classNames from 'classnames';
import PropTypes from 'prop-types';
import { useTraderStore } from 'Stores/useTraderStores';
import { observer } from '@deriv/stores';
import React from 'react';
import { Checkbox, Text } from '@deriv/components';
import { Localize, localize } from '@deriv/translations';

const AllowEquals = ({ onChange, is_allow_equal, has_equals_only, className }) => {
    const handleOnChange = e => {
        e.persist();
        const { name, checked } = e.target;
        onChange({ target: { name, value: Number(checked) } });
    };

    return (
        <div className={classNames('allow-equals', 'mobile-widget', className)}>
            <Checkbox
                label={localize('Equals')}
                value={is_allow_equal}
                name='is_equal'
                onChange={handleOnChange}
                disabled={has_equals_only}
            />
            <Text as='p' size='xxxs'>
                <Localize i18n_default_text='Win payout if exit spot is also equal to entry spot.' />
            </Text>
        </div>
    );
};

AllowEquals.propTypes = {
    className: PropTypes.string,
    is_allow_equal: PropTypes.bool,
    has_equals_only: PropTypes.bool,
    onChange: PropTypes.func,
};

export default observer(() => {
    const { is_equal, has_equals_only, onChange } = useTraderStore();
    const allow_equals_props = {
        is_allow_equal: !!is_equal,
        has_equals_only,
        onChange,
    };
    return <AllowEquals {...allow_equals_props} />;
});
