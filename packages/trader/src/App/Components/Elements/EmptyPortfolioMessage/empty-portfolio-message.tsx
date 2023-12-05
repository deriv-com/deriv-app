import React from 'react';
import { Icon, Text } from '@deriv/components';
import { localize } from '@deriv/translations';

type TEmptyPortfolioMessage = {
    error?: string;
};

const EmptyPortfolioMessage = ({ error }: TEmptyPortfolioMessage) => (
    <div className='portfolio-empty'>
        <div className='portfolio-empty__wrapper'>
            {error ? (
                <Text color='disabled' size='xs'>
                    {error}
                </Text>
            ) : (
                <React.Fragment>
                    <Icon icon='IcPortfolio' className='portfolio-empty__icon' size={96} color='disabled' />
                    <Text align='center' className='portfolio-empty__text' color='disabled' size='xs'>
                        {localize(
                            'You have no open positions for this asset. To view other open positions, click Go to Reports'
                        )}
                    </Text>
                </React.Fragment>
            )}
        </div>
    </div>
);

export default EmptyPortfolioMessage;
