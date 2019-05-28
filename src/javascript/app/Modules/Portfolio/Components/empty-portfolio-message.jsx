import React        from 'react';
import { localize } from '_common/localize';
import Icon         from 'Assets/Common';

const EmptyPortfolioMessage = () => (
    <div className='portfolio-empty'>
        <div className='portfolio-empty__wrapper'>
<<<<<<< HEAD
            <Icon icon='IconPositions' className='portfolio-empty__icon' />
            <span className='portfolio-empty__text'>{localize('No running positions')}</span>
=======
            <IconPositions className='portfolio-empty__icon' />
            <span className='portfolio-empty__text'>{localize('No open positions')}</span>
>>>>>>> e79bd60f02f95b61175386c2f75292b1bb035f9e
        </div>
    </div>
);

export default EmptyPortfolioMessage;
