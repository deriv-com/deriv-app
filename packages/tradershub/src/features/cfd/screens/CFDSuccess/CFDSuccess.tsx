import React from 'react';
import { ActionScreen } from '../../../../components';
import CTraderSuccess from '../../../../public/images/cfd/ctrader-success.svg';
import DerivXSuccess from '../../../../public/images/cfd/dxtrade-success.svg';
import MT5DerivedSuccess from '../../../../public/images/cfd/mt5-derived-success.svg';
import MT5FinancialSuccess from '../../../../public/images/cfd/mt5-financial-success.svg';
import MT5SwapFreeSuccess from '../../../../public/images/cfd/mt5-swap-free-success.svg';
import CheckMark from '../../../../public/images/checkmark.svg';
import { TMarketTypes, TPlatforms } from '../../../../types';

type TProps = {
    description: string;
    renderButtons?: () => React.ReactNode;
} & (
    | {
          marketType: TMarketTypes.SortedMT5Accounts;
          platform: 'mt5';
      }
    | {
          marketType?: never;
          platform: Exclude<TPlatforms.All, 'mt5'>;
      }
);

type PlatformDetails = {
    all?: { icon: React.ReactNode };
    financial?: { icon: React.ReactNode };
    icon?: React.ReactNode;
    synthetic?: { icon: React.ReactNode };
};

const marketTypeToDetailsMapper: Record<TPlatforms.All, PlatformDetails> = {
    ctrader: {
        icon: <CTraderSuccess />,
    },
    dxtrade: {
        icon: <DerivXSuccess />,
    },
    mt5: {
        all: {
            icon: <MT5SwapFreeSuccess />,
        },
        financial: {
            icon: <MT5FinancialSuccess />,
        },
        synthetic: {
            icon: <MT5DerivedSuccess />,
        },
    },
};

const CFDSuccess = ({ description, marketType, platform, renderButtons }: TProps) => {
    let icon: React.ReactNode;
    if (platform === 'mt5') {
        icon = marketTypeToDetailsMapper[platform][marketType]?.icon;
    } else {
        icon = marketTypeToDetailsMapper[platform].icon;
    }

    const IconWithCheckMark = () => (
        <div className='relative'>
            {icon}
            <CheckMark className='absolute bottom-50 left-[100px]' />
        </div>
    );

    return (
        <ActionScreen
            description={description}
            icon={<IconWithCheckMark />}
            renderButtons={renderButtons}
            title='Success!'
        />
    );
};

export default CFDSuccess;
