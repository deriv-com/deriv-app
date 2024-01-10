import React from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Heading, Text } from '@deriv/quill-design';
import { StaticLink } from '../../components';
import { CTraderList, MT5PlatformsList, OtherCFDPlatformsList } from './components';

const CFDPlatformsList = () => {
    const history = useHistory();

    return (
        <div className='border-solid p-1200 rounded-1200 border-xs border-opacity-black-100'>
            <div className='pb-1200'>
                <div className='flex items-center gap-200'>
                    <Heading.H4 className='font-sans'>CFDs</Heading.H4>
                    <Button
                        className='no-underline'
                        colorStyle='coral'
                        onClick={() => history.push('/tradershub/compare-accounts')}
                        size='sm'
                        variant='tertiary'
                    >
                        Compare Accounts
                    </Button>
                </div>
                <Text size='sm'>
                    Trade with leverage and tight spreads for better returns on trades.
                    <StaticLink size='md' staticUrl='/trade-types/cfds/'>
                        Learn more
                    </StaticLink>
                </Text>
            </div>
            <div className='space-y-1200'>
                <MT5PlatformsList />
                <div className='grid grid-cols-1 lg:grid-cols-3 gap-1200'>
                    <CTraderList />
                </div>
                <div className='grid grid-cols-1 lg:grid-cols-3 gap-1200'>
                    <OtherCFDPlatformsList />
                </div>
            </div>
        </div>
    );
};

export default CFDPlatformsList;
