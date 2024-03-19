import React from 'react';
import InfoIcon from '@/assets/svgs/ic-info-outline.svg';
import { useQueryParams, useRegulationSwitcher } from '@/hooks';
import { useUIContext } from '@/providers';
import { Tab, Tabs } from '@deriv-com/ui';

const RegulationSwitcherMobile = () => {
    const { uiState } = useUIContext();
    const { openModal } = useQueryParams();

    const { buttons, handleButtonClick } = useRegulationSwitcher();

    const activeRegulation = uiState.regulation;

    return (
        <div className='flex items-center gap-8'>
            <InfoIcon className='w-16 h-auto' onClick={() => openModal('RegulationModal')} />
            <Tabs
                TitleFontSize='sm'
                activeTab={activeRegulation}
                className='flex p-4 w-[120px] h-40'
                key={activeRegulation}
                onChange={index => handleButtonClick(buttons[index].label)}
                variant='secondary'
            >
                {buttons.map(button => (
                    <Tab key={button.label} title={button.label} />
                ))}
            </Tabs>
        </div>
    );
};

export default RegulationSwitcherMobile;
