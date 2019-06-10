import React        from 'react';
import { localize } from '_common/localize';
import Icon         from 'Assets/icon.jsx';

const EmptyPortfolioMessage = () => (
    <div className='portfolio-empty'>
        <div className='portfolio-empty__wrapper'>
            <Icon icon='IconPositions' className='portfolio-empty__icon' />
            <span className='portfolio-empty__text'>{localize('No open positions')}</span>
        </div>
    </div>
);

export default EmptyPortfolioMessage;
