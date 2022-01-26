import React from 'react';
import { Icon, Text } from '@deriv/components';
import { localize } from '@deriv/translations';

const EmptyPortfolioMessage = ({ error }) => (
    <div className='portfolio-empty'>
        <div className='portfolio-empty__wrapper'>
            {error ? (
                <Text color='disabled' size='xs'>
                    {error}
                </Text>
            ) : (
                <React.Fragment>
                    <Icon icon='IcPortfolio' className='portfolio-empty__icon' size={96} color='disabled' />
                    <Text color='disabled' size='xs'>
                        {localize('No open positions')}
                    </Text>
                </React.Fragment>
            )}
        </div>
    </div>
);

export default EmptyPortfolioMessage;
