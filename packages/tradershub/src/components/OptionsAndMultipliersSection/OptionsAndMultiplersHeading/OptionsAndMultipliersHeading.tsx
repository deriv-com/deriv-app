import React from 'react';
import { Heading, Text, useBreakpoint } from '@deriv/quill-design';
import { useContentSwitch } from '../../ContentSwitcher';
import { CurrencySwitcher } from '../../CurrencySwitcher';
import { StaticLink } from '../../StaticLink';

/**
 *  `OptionsAndMultipliersHeading` is a component that renders the heading title and currency switcher.
 * @returns {React.ElementType} The `OptionsAndMultipliersHeading` component.
 */
const OptionsAndMultipliersHeading = () => {
    const { isMobile } = useBreakpoint();
    const { activeTabLabel } = useContentSwitch();

    const isEu = activeTabLabel === 'EU';

    const title = isEu ? 'Multipliers' : 'Options & multipliers';

    return (
        <div className='flex flex-col items-start sm:flex-row gap-800 sm:gap-2400'>
            <div className='sm:flex sm:flex-col'>
                {!isMobile && <Heading.H4>{title}</Heading.H4>}
                <Text className='space-y-50' size='sm'>
                    Earn a range of payouts by correctly predicting market price movements with
                    <StaticLink size='md' staticUrl='/trade-types/options/digital-options/up-and-down/'>
                        options
                    </StaticLink>
                    , or get the upside of CFDs without risking more than your initial stake with
                    <StaticLink size='md' staticUrl='/trade-types/multiplier/'>
                        multipliers
                    </StaticLink>
                    .
                </Text>
            </div>
            <CurrencySwitcher />
        </div>
    );
};
export default OptionsAndMultipliersHeading;
