import React, { useMemo } from 'react';
import { useIsEuRegion } from '@deriv/api';
import { Heading, Text, useBreakpoint } from '@deriv/quill-design';
import { CurrencySwitcher } from '../../CurrencySwitcher';
import { TitleDescriptionLoader } from '../../Loaders';
import { StaticLink } from '../../StaticLink';

/**
 *  `OptionsAndMultipliersHeading` is a component that renders the heading title and currency switcher.
 * @returns {React.ElementType} The `OptionsAndMultipliersHeading` component.
 */
const OptionsAndMultipliersHeading = () => {
    const { isMobile } = useBreakpoint();
    const { isEU, isSuccess } = useIsEuRegion();

    const title = isEU ? 'Multipliers' : 'Options & multipliers';

    const description = useMemo(() => {
        if (isEU) {
            return (
                <Text className='space-y-50' size='sm'>
                    Get the upside of CFDs without risking more than your initial stake with
                    <StaticLink size='md' staticUrl='/trade-types/multiplier/'>
                        multipliers
                    </StaticLink>
                    .
                </Text>
            );
        }
        return (
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
        );
    }, [isEU]);

    if (!isSuccess) return <TitleDescriptionLoader />;

    return (
        <div className='flex flex-col items-start justify-between lg:flex-row gap-800 lg:gap-2400'>
            <div className='lg:flex lg:flex-col gap-100'>
                {!isMobile && <Heading.H4>{title}</Heading.H4>}
                {description}
            </div>
            <CurrencySwitcher />
        </div>
    );
};
export default OptionsAndMultipliersHeading;
