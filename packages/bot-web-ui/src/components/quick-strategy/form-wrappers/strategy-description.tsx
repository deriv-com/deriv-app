import React from 'react';
import AccordionStrategyGroup from './accordion-strategy-group';
import './strategy-description.scss';

type TStrategyDescription = Partial<{
    formfields: React.ReactNode;
    active_tab: string;
    tutorial_selected_strategy: string;
}>;

const StrategyDescription: React.FC<TStrategyDescription> = ({
    formfields,
    active_tab,
    tutorial_selected_strategy,
}) => (
    <>
        {active_tab === 'TRADE_PARAMETERS' ? (
            <div className='qs__body__content__form'>{formfields}</div>
        ) : (
            <div className='qs__body__content__description'>
                <div>
                    <AccordionStrategyGroup tutorial_selected_strategy={tutorial_selected_strategy} />
                </div>
            </div>
        )}
    </>
);

export default StrategyDescription;
