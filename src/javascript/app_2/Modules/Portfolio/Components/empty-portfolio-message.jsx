import React             from 'react';
import { localize }      from '_common/localize';
import { IconPositions } from 'Assets/Footer';

const EmptyPortfolioMessage = () => (
    // TODO: combine with statement component, once design is final
    <div className='portfolio-empty'>
        <div className='portfolio-empty__wrapper'>
            <IconPositions className='portfolio-empty__icon' />
            <span className='portfolio-empty__text'>{localize('No running positions')}</span>
        </div>
    </div>
);

export default EmptyPortfolioMessage;
