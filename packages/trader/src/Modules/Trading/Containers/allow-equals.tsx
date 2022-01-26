import classNames from 'classnames';
import React from 'react';
import { Checkbox, Text } from '@deriv/components';
import { Localize, localize } from '@deriv/translations';
import { connect } from 'Stores/connect';

type AllowEqualsProps = {
    is_allow_equal: boolean;
    has_equals_only: boolean;
    onChange: () => void;
};

const AllowEquals = ({ onChange, is_allow_equal, has_equals_only, className }: AllowEqualsProps) => {
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

export default connect(({ modules }) => ({
    is_allow_equal: !!modules.trade.is_equal,
    has_equals_only: modules.trade.has_equals_only,
    onChange: modules.trade.onChange,
}))(AllowEquals);
