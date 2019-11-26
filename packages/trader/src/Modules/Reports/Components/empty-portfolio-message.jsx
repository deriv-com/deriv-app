import React        from 'react';
import { localize } from 'deriv-translations';
import Icon         from 'Assets/icon.jsx';

const EmptyPortfolioMessage = ({ error }) => (
    <div className='portfolio-empty'>
        <div className='portfolio-empty__wrapper'>
            { error ?
                <span className='portfolio-empty__text'>{error}</span>
                :
                <React.Fragment>
                    <Icon icon='IconPositions' className='portfolio-empty__icon' />
                    <span className='portfolio-empty__text'>{localize('No open positions')}</span>
                </React.Fragment>
            }
        </div>
    </div>
);

export default EmptyPortfolioMessage;
