import React from 'react';
import { useActiveTradingAccount, useAuthorize, useTradingAccountsList } from '@deriv/api';
import { Button, qtJoin, Text } from '@deriv/quill-design';
import { LabelPairedCircleInfoMdRegularIcon } from '@deriv/quill-icons';

const RegulationSwitcherDesktop = () => {
    const { switchAccount } = useAuthorize();
    const { data: tradingAccountsList } = useTradingAccountsList();
    const { data: activeTrading } = useActiveTradingAccount();

    const realCRAccount = tradingAccountsList?.find(account => account.loginid.startsWith('CR'))?.loginid ?? '';

    const realMFAccount = tradingAccountsList?.find(account => account.loginid.startsWith('MF'))?.loginid ?? '';

    const buttons = [
        { label: 'Non-EU', loginid: realCRAccount },
        { label: 'EU', loginid: realMFAccount },
    ];

    const handleButtonClick = (loginid: string) => {
        if (loginid) {
            switchAccount(loginid);
        }
    };

    return (
        <div className='flex items-center gap-400'>
            <div className='flex items-center gap-400'>
                <Text size='sm'>Regulation</Text>
                <LabelPairedCircleInfoMdRegularIcon />
            </div>
            <div className='flex bg-system-light-secondary-background rounded-400 p-200 gap-200 w-[200px] h-2000'>
                {buttons.map(button => (
                    <Button
                        className={qtJoin(
                            'rounded-200 ',
                            button.loginid !== activeTrading?.loginid && 'bg-transparent font-regular'
                        )}
                        colorStyle='white'
                        fullWidth
                        key={`tradershub-tab-${button.label}`}
                        onClick={() => handleButtonClick(button.loginid)}
                    >
                        {button.label}
                    </Button>
                ))}
            </div>
        </div>
    );
};

export default RegulationSwitcherDesktop;
