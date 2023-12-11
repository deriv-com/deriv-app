import React from 'react';
import { observer, useStore } from '@deriv/stores';
import { website_domain, TRADE_FEATURE_FLAGS } from '@deriv/shared';
import { Checkbox, Text } from '@deriv/components';

export const FeatureFlagsSection = observer(() => {
    const { feature_flags } = useStore();
    const HIDDEN_FEATURE_FLAGS = ['wallet'];

    const visible_feature_flags = Object.entries(feature_flags.data ?? {})?.reduce<{ [key: string]: boolean }>(
        (flags, [key, value]) => {
            const is_production = location.hostname === website_domain;
            if ((!is_production || !TRADE_FEATURE_FLAGS.includes(key)) && !HIDDEN_FEATURE_FLAGS.includes(key)) {
                flags[key] = value;
            }
            return flags;
        },
        {} // hiding trade features flags from production
    );
    if (!feature_flags.data) return null;

    return (
        <div className='feature-flags'>
            <Text as='h1' weight='bold' color='prominent'>
                Feature flags
            </Text>
            {Object.keys(visible_feature_flags).map(flag => (
                <div key={flag} className='feature-flags__item'>
                    <Checkbox
                        label={flag}
                        value={visible_feature_flags[flag as keyof typeof visible_feature_flags]}
                        onChange={e =>
                            feature_flags.update((old?: typeof feature_flags.data) => ({
                                ...(old as typeof feature_flags.data),
                                [flag]: (e.target as HTMLInputElement).checked,
                            }))
                        }
                    />
                </div>
            ))}
        </div>
    );
});
