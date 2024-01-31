import React from 'react';
import { Provider } from '@deriv/library';
import { LabelPairedCircleInfoMdRegularIcon } from '@deriv/quill-icons';
import { Tab, Tabs, Text } from '@deriv-com/ui';
import { useRegulationSwitcher } from '../../hooks/useRegulationSwitcher';
import { RegulationModal } from '../../modals';
import { useUIContext } from '../UIProvider';

const RegulationSwitcherDesktop = () => {
    const { getUIState } = useUIContext();
    const { show } = Provider.useModal();
    const { buttons, handleButtonClick } = useRegulationSwitcher();
    const activeRegulation = getUIState('regulation');

    return (
        <div className='flex items-center gap-400'>
            <div className='flex items-center gap-400'>
                <Text size='sm'>Regulation:</Text>
                <LabelPairedCircleInfoMdRegularIcon
                    className='cursor-pointer'
                    onClick={() => show(<RegulationModal />)}
                />
            </div>
            <Tabs
                activeTab={activeRegulation}
                className='flex rounded-300 p-200 w-[200px] h-2000'
                key={activeRegulation}
                onChange={index => handleButtonClick(buttons[index].label)}
                variant='primary'
            >
                {buttons.map(button => (
                    <Tab className='rounded-200' key={button.label} title={button.label} />
                ))}
            </Tabs>
        </div>
    );
};

export default RegulationSwitcherDesktop;
