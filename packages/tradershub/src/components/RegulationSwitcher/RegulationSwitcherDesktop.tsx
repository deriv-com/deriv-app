import React, { useEffect } from 'react';
import { useActiveTradingAccount, useAuthorize, useTradingAccountsList } from '@deriv/api';
import { Button, qtJoin, Text } from '@deriv/quill-design';
import { LabelPairedCircleInfoMdRegularIcon } from '@deriv/quill-icons';
import { Regulation } from '../../constants/constants';
import { useUIContext } from '../UIProvider';

const RegulationSwitcherDesktop = () => {
    const { switchAccount } = useAuthorize();
    const { data: tradingAccountsList } = useTradingAccountsList();
    const { getUIState, setUIState } = useUIContext();

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
        if (activeTrading?.loginid.startsWith('CR')) {
            setUIState('regulation', Regulation.NonEU);
        } else if (activeTrading?.loginid.startsWith('MF')) {
            setUIState('regulation', Regulation.EU);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className='flex items-center gap-400'>
            <div className='flex items-center gap-400'>
                <Text size='sm'>Regulation:</Text>
                <LabelPairedCircleInfoMdRegularIcon />
            </div>
            <div className='flex bg-system-light-secondary-background rounded-400 p-200 gap-200 w-[200px] h-2000'>
                {buttons.map(button => (
                    <Button
                        className={qtJoin(
                            'rounded-200',
                            activeRegulation !== button.label && 'bg-transparent font-regular'
                        )}
                        colorStyle='white'
                        fullWidth
                        key={`tradershub-tab-${button.label}`}
                        onClick={() => handleButtonClick(button.label)}
                    >
                        {button.label}
                    </Button>
                ))}
            </div>
        </div>
    );
};

export default RegulationSwitcherDesktop;
