import React, { Fragment } from 'react';
import { useHistory } from 'react-router-dom';
import { useIsEuRegion } from '@deriv/api';
import { Button, Heading, qtMerge, Text, useBreakpoint } from '@deriv/quill-design';
import useRegulationFlags from '../../../hooks/useRegulationFlags';
import { TitleDescriptionLoader } from '../../Loaders';
import { StaticLink } from '../../StaticLink';
import { useUIContext } from '../../UIProvider';

const CompareAccountsButton = ({ className }: { className?: string }) => {
    const history = useHistory();
    const { getUIState } = useUIContext();

    const accountType = getUIState('accountType');

    const regulation = getUIState('regulation');

    const { isEU } = useRegulationFlags(regulation, accountType);

    const title = isEU ? 'Account information' : 'Compare Accounts';

    return (
        <Button
            className={qtMerge('no-underline', className)}
            colorStyle='coral'
            onClick={() => history.push('/traders-hub/compare-accounts')}
            size='sm'
            variant='tertiary'
        >
            {title}
        </Button>
    );
};

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
