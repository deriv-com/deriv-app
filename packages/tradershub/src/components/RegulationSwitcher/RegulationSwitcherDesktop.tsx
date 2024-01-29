import React, { useEffect } from 'react';
import { useActiveTradingAccount, useAuthorize, useIsDIELEnabled, useTradingAccountsList } from '@deriv/api';
import { Provider } from '@deriv/library';
import { LabelPairedCircleInfoMdRegularIcon } from '@deriv/quill-icons';
import { Tab, Tabs } from '@deriv-com/ui/dist/components/Tabs';
import { Text } from '@deriv-com/ui/dist/components/Text';
import { Regulation } from '../../constants/constants';
import useRegulationFlags from '../../hooks/useRegulationFlags';
import { RegulationModal } from '../../modals';
import { useUIContext } from '../UIProvider';

const RegulationSwitcherDesktop = () => {
    const { switchAccount } = useAuthorize();
    const { data: tradingAccountsList } = useTradingAccountsList();
    const { getUIState, setUIState } = useUIContext();
    const { show } = Provider.useModal();

    const { data: isDIEL } = useIsDIELEnabled();
    const regulation = getUIState('regulation');
    const accountType = getUIState('accountType');
    const { isEU, isHighRisk } = useRegulationFlags(regulation, accountType);

    const realCRAccount = tradingAccountsList?.find(account => account.loginid.startsWith('CR'))?.loginid ?? '';

    const realMFAccount = tradingAccountsList?.find(account => account.loginid.startsWith('MF'))?.loginid ?? '';

    const { data: activeTrading } = useActiveTradingAccount();

    const buttons = [{ label: Regulation.NonEU }, { label: Regulation.EU }];

    const activeRegulation = getUIState('regulation');

    const handleButtonClick = (label: string) => {
        if (label === Regulation.NonEU) {
            setUIState('regulation', Regulation.NonEU);
            if (realCRAccount) {
                switchAccount(realCRAccount);
            }
        } else {
            setUIState('regulation', Regulation.EU);
            if (realMFAccount) {
                switchAccount(realMFAccount);
            }
        }
    };

    useEffect(() => {
        if (activeTrading?.loginid.startsWith('CR') || isDIEL || isHighRisk) {
            setUIState('regulation', Regulation.NonEU);
        } else if (activeTrading?.loginid.startsWith('MF') || isEU) {
            setUIState('regulation', Regulation.EU);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className='flex items-center gap-400'>
            <div className='flex items-center gap-400'>
                <Text size='sm'>Regulation:</Text>
                <LabelPairedCircleInfoMdRegularIcon
                    className='cursor-pointer'
                    onClick={() => show(<RegulationModal />)}
                />
            </div>
            <h1>{activeRegulation}</h1>
            <Tabs
                activeTab={activeRegulation}
                className='flex rounded-300 p-200 w-[200px] h-2000'
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
