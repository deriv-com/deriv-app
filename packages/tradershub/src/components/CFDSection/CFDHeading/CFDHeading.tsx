import React, { Fragment } from 'react';
import { clsx } from 'clsx';
import { useHistory } from 'react-router-dom';
import { StaticLink, TitleDescriptionLoader } from '@/components';
import { useRegulationFlags } from '@/hooks';
import { useIsEuRegion } from '@deriv/api';
import { Button, Text, useDevice } from '@deriv-com/ui';

const CompareAccountsButton = ({ className }: { className?: string }) => {
    const history = useHistory();

    const { isEU } = useRegulationFlags();

    const title = isEU ? 'Account information' : 'Compare Accounts';

    return (
        <Button
            className={clsx('no-underline', className)}
            color='primary'
            onClick={() => history.push('/traders-hub/compare-accounts')}
            size='sm'
            variant='ghost'
        >
            {title}
        </Button>
    );
};

const CFDHeading = () => {
    const { isDesktop } = useDevice();
    const { isSuccess } = useIsEuRegion();

    if (!isSuccess) return <TitleDescriptionLoader />;

    return (
        <Fragment>
            {isDesktop && (
                <div className='flex items-center gap-x-4'>
                    <Text size='lg' weight='bold'>
                        CFDs
                    </Text>
                    <CompareAccountsButton />
                </div>
            )}
            <Text className='leading-18' size='sm'>
                Trade with leverage and tight spreads for better returns on trades.
                <StaticLink staticUrl='/trade-types/cfds/'>Learn more</StaticLink>
            </Text>
            {!isDesktop && <CompareAccountsButton className='mt-16' />}
        </Fragment>
    );
};

export default CFDHeading;
