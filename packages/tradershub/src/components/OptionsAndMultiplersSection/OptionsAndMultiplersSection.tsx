import React from 'react';
import { Heading, Text, useBreakpoint } from '@deriv/quill-design';
import { getStaticUrl } from '../../helpers/urls';
import { CurrencySwitcher } from '../CurrencySwitcher';
import { OptionsAndMultipliersContent } from './OptionsAndMultipliersContent';

const OptionsAndMultiplersSection = () => {
    const { isMobile } = useBreakpoint();

    return (
        <div className='border-solid p-1200 rounded-1200 border-xs border-opacity-black-100 '>
            <div className='flex-col w-full gap-1200 '>
                <div className='flex items-start self-stretch gap-2400'>
                    <div className='flex flex-col'>
                        {!isMobile && <Heading.H4>Options & multipliers</Heading.H4>}
                        <Text size='sm'>
                            Earn a range of payouts by correctly predicting market price movements with
                            <a
                                className='underline cursor-pointer text-solid-red-700 underline-offset-2 px-200'
                                href={getStaticUrl('/trade-types/options/digital-options/up-and-down/')}
                                key={0}
                                rel='noopener noreferrer'
                                target='_blank'
                            >
                                options
                            </a>
                            , or get the upside of CFDs without risking more than your initial stake with
                            <a
                                className='underline cursor-pointer text-solid-red-700 underline-offset-2 px-200'
                                href={getStaticUrl('/trade-types/multiplier/')}
                                key={1}
                                rel='noopener noreferrer'
                                target='_blank'
                            >
                                multipliers
                            </a>
                            .
                        </Text>
                    </div>
                    <CurrencySwitcher />
                </div>

                <OptionsAndMultipliersContent />
            </div>
        </div>
    );
};
export default OptionsAndMultiplersSection;
