import React from 'react';
import { Chip, SearchField } from '@deriv-com/quill-ui';
import { LegacyGuide1pxIcon } from '@deriv/quill-icons';
import { observer } from '@deriv/stores';
import { DBOT_TABS } from 'Constants/bot-contents';
import { useDBotStore } from 'Stores/useDBotStore';
import './strategy-template-picker.scss';
import { QsSteps, TRADE_TYPE_STRATEGY } from './trade-constants';
import StrategyList from './strategy-list';

type TStrategyTemplatePicker = {
    setCurrentStep: (current_step: QsSteps) => void;
    setSelectedTradeType: (selected_trade_type: string) => void;
};

const StrategyTemplatePicker = observer(({ setCurrentStep, setSelectedTradeType }: TStrategyTemplatePicker) => {
    const { dashboard, quick_strategy } = useDBotStore();
    const { setActiveTabTutorial, setActiveTab, setFAQSearchValue, filterTuotrialTab } = dashboard;
    const { setFormVisibility, setSelectedStrategy } = quick_strategy;

    const [option, setOption] = React.useState(0);
    const [is_searching, setIsSearching] = React.useState(false);
    const [search_value, setSearchValue] = React.useState('');

    const handleChipSelect = (index: number) => {
        setOption(index);
    };

    const trade_types = Object.keys(TRADE_TYPE_STRATEGY);
    const trade_types_values = Object.values(TRADE_TYPE_STRATEGY);

    const onSelectStrategy = (strategy: string, trade_type: string) => {
        setSelectedStrategy(strategy);
        setSelectedTradeType(trade_type);
        setCurrentStep(QsSteps.StrategyVerified);
    };

    return (
        <div className='strategy-template-picker'>
            <div className='strategy-template-picker__panel'>
                <SearchField
                    onChange={event => {
                        setSearchValue(event.target.value);
                        setIsSearching(true);
                        setFAQSearchValue(event.target.value);
                        filterTuotrialTab(event.target.value);
                    }}
                    placeholder='Search'
                    type='text'
                    value={search_value}
                    inputSize='sm'
                />
                <button
                    className='strategy-template-picker__icon'
                    onClick={() => {
                        setActiveTab(DBOT_TABS.TUTORIAL);
                        setActiveTabTutorial(3);
                        setFormVisibility(false);
                    }}
                >
                    <LegacyGuide1pxIcon iconSize='sm' />
                </button>
            </div>
            <div className='strategy-template-picker__chips'>
                {trade_types.map((item, index) => (
                    <Chip.Selectable
                        key={index}
                        onClick={() => handleChipSelect(index)}
                        selected={index == option}
                        size='sm'
                        label={item}
                    />
                ))}
            </div>
            <StrategyList
                option={option}
                trade_types={trade_types}
                trade_types_values={trade_types_values}
                search_value={search_value}
                is_searching={is_searching}
                onSelectStrategy={onSelectStrategy}
            />
        </div>
    );
});

export default StrategyTemplatePicker;
