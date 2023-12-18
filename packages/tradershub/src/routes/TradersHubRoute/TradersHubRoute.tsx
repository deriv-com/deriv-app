import React from 'react';
import { Chip, Heading, Text } from '@deriv/quill-design';

const TradersHubRoute: React.FC = () => {
    return (
        <div className='container mx-auto'>
            <div className='flex align-start items-center justify-between gap-100'>
                <div className='flex items-center gap-500'>
                    <Heading.H3>Traders Hub</Heading.H3>
                    <Chip.SingleSelectDropdown
                        defaultOption={{
                            label: 'Real',
                            value: '1',
                        }}
                        // eslint-disable-next-line
                        onSelectionChange={() => {}}
                        options={[
                            {
                                label: 'Demo',
                                value: 2,
                            },
                        ]}
                        size='md'
                    />
                </div>
                <div className='flex flex-col justify-end'>
                    <Text size='sm'>Total Assets</Text>
                </div>
            </div>
        </div>
    );
};

export default TradersHubRoute;
