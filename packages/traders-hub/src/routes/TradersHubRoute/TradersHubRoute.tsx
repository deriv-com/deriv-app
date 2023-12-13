import React from 'react';
import { Heading, Text } from '@deriv/quill-design';

const TradersHubRoute: React.FC = () => {
    return (
        <div className='container mx-auto'>
            <div className='flex align-start items-center justify-between gap-100'>
                <Heading.H3>Traders Hub</Heading.H3>
                <div className='flex flex-col justify-end'>
                    <Text size='sm'>Total Assets</Text>
                    <Heading.H3>10,000 USD</Heading.H3>
                </div>
            </div>
        </div>
    );
};

export default TradersHubRoute;
