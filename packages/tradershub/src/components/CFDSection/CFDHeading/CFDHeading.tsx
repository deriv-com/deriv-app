import React, { Fragment } from 'react';
import { useIsEuRegion } from '@deriv/api';
import { Button, Heading, qtMerge, Text, useBreakpoint } from '@deriv/quill-design';
import { TitleDescriptionLoader } from '../../Loaders';
import { StaticLink } from '../../StaticLink';

const CompareAccountsButton = ({ className }: { className?: string }) => (
    <Button className={qtMerge('no-underline', className)} colorStyle='coral' size='sm' variant='tertiary'>
        Compare Accounts
    </Button>
);

const CFDHeading = () => {
    const { isMobile } = useBreakpoint();
    const { isSuccess } = useIsEuRegion();

    if (!isSuccess) return <TitleDescriptionLoader />;

    return (
        <Fragment>
            {!isMobile && (
                <div className='flex items-center gap-x-200'>
                    <Heading.H4 className='font-sans'>CFDs</Heading.H4>
                    <CompareAccountsButton />
                </div>
            )}
            <Text className='leading-100' size='sm'>
                Trade with leverage and tight spreads for better returns on trades.
                <StaticLink size='md' staticUrl='/trade-types/cfds/'>
                    Learn more
                </StaticLink>
            </Text>
            {isMobile && <CompareAccountsButton className='mt-800' />}
        </Fragment>
    );
};

export default CFDHeading;
