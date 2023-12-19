import React from 'react';
import { Text } from '@deriv/components';
import { useStore } from '@deriv/stores';
import { localize } from '@deriv/translations';
import { quick_strategy_content } from '../config';
import QuickStrategyCards from './quick-strategy-cards';
import './index.scss';

const QuickStrategyGuides = () => {
    const { ui } = useStore();
    const { is_mobile } = ui;
    const [tutorial_selected_strategy, setTutorialSelectedStrategy] = React.useState('');

    return (
        <div className='tutorials-quick-strategy'>
            {tutorial_selected_strategy === '' && (
                <Text
                    className='tutorials-quick-strategy__title'
                    weight='bold'
                    color='prominent'
                    line_height='s'
                    size={is_mobile ? 'xxs' : 's'}
                    as='div'
                >
                    {localize('Quick strategy guides')}
                </Text>
            )}
            <QuickStrategyCards
                tutorial_selected_strategy={tutorial_selected_strategy}
                setTutorialSelectedStrategy={setTutorialSelectedStrategy}
                quick_strategy_content={quick_strategy_content}
            />
        </div>
    );
};

export default QuickStrategyGuides;
