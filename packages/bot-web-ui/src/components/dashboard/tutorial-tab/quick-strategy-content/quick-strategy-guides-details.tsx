import React from 'react';
import StrategyDescription from 'Components/quick-strategy/form-wrappers/strategy-description';

type TQuickStrategyContentDetail = {
    tutorial_selected_strategy: string;
};

const QuickStrategyContentDetail = ({ tutorial_selected_strategy }: TQuickStrategyContentDetail) => {
    return (
        <div className='qs'>
            <StrategyDescription tutorial_selected_strategy={tutorial_selected_strategy} />
        </div>
    );
};

export default QuickStrategyContentDetail;
