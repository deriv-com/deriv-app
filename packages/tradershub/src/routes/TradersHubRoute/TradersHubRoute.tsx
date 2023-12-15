import React from 'react';
import { useActiveTradingAccount } from '@deriv/api';
import { Chip, Heading, Text } from '@deriv/quill-design';

const TradersHubRoute: React.FC = () => {
    const { data } = useActiveTradingAccount();

    const isVirtual = data?.account_type === 'virtual';

    const totalAssetsColor = isVirtual ? 'text-status-light-success' : 'text-status-light-danger';

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
                    <Heading.H3 className={totalAssetsColor}>10,000 USD</Heading.H3>
                </div>
            </div>
        </div>
    );
};

export default TradersHubRoute;
