import classNames from 'classnames';
import { useTraderStore } from 'Stores/useTraderStores';
import { observer } from '@deriv/stores';
import React from 'react';
import { Checkbox, Text } from '@deriv/components';
import { Localize, localize } from '@deriv/translations';

type TAllowEquals = {
    onChange: (e: { target: { name: string; value: number } }) => Promise<void>;
    is_allow_equal: boolean;
    has_equals_only: boolean;
    className?: string;
};

const AllowEquals = ({ onChange, is_allow_equal, has_equals_only, className }: TAllowEquals) => {
    const handleOnChange: React.ComponentProps<typeof Checkbox>['onChange'] = e => {
        e.persist();
        if ('checked' in e.target) {
            const { name, checked } = e.target;
            onChange({ target: { name, value: Number(checked) } });
        }
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

export default observer(() => {
    const { is_equal, has_equals_only, onChange } = useTraderStore();
    const allow_equals_props = {
        is_allow_equal: !!is_equal,
        has_equals_only,
        onChange,
    };
    return <AllowEquals {...allow_equals_props} />;
});
