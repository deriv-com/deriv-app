import React from 'react';
import { Icon } from '@deriv/components';
import { localize } from '@deriv/translations';

const EmptyPortfolioMessage = ({ error }) => (
    <div className='portfolio-empty'>
        <div className='portfolio-empty__wrapper'>
            {error ? (
                <span className='portfolio-empty__text'>{error}</span>
            ) : (
                <React.Fragment>
                    <Icon icon='IcPortfolio' className='portfolio-empty__icon' size={96} color='disabled' />
                    <span className='portfolio-empty__text'>{localize('No open positions')}</span>
                </React.Fragment>
            )}
        </div>
    </div>
);

export default EmptyPortfolioMessage;
