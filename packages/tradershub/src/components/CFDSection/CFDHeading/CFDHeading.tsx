import React, { Fragment } from 'react';
import { StaticLink } from '@deriv/library/src/base';
import { Button, Heading, qtMerge, Text, useBreakpoint } from '@deriv/quill-design';

const CFDHeading = () => {
    const { isMobile } = useBreakpoint();

    const CompareAccountButton = ({ className }: { className?: string }) => (
        <Button className={qtMerge('no-underline', className)} colorStyle='coral' size='sm' variant='tertiary'>
            Compare Accounts
        </Button>
    );

    return (
        <Fragment>
            {!isMobile && (
                <div className='flex items-center gap-x-200'>
                    <Heading.H4 className='font-sans'>CFDs</Heading.H4>
                    <CompareAccountButton />
                </div>
            )}
            <Text className='leading-100' size='sm'>
                Trade with leverage and tight spreads for better returns on trades.
                <StaticLink size='md' staticUrl='/trade-types/cfds/'>
                    Learn more
                </StaticLink>
            </Text>
            {isMobile && <CompareAccountButton className='mt-800' />}
        </Fragment>
    );
};

export default CFDHeading;
