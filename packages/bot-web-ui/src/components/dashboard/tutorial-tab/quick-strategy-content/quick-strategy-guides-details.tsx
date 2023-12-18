import React from 'react';
import StrategyDescription from 'Components/quick-strategy/form-wrappers/strategy-description';

type TQuickStrategyGuidesDetail = {
    tutorial_selected_strategy: string;
};

const QuickStrategyGuidesDetail = ({ tutorial_selected_strategy }: TQuickStrategyGuidesDetail) => {
    return (
        <div>
            <StrategyDescription tutorial_selected_strategy={tutorial_selected_strategy} />
        </div>
    );
};

export default QuickStrategyGuidesDetail;
