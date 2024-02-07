import React, { ReactNode } from 'react';
import { ActionScreen } from '@/components';
import { TMarketTypes, TPlatforms } from '@/types';
import { PlatformDetails } from '@cfd/constants';
import CTraderSuccess from '../../../../public/images/cfd/ctrader-success.svg';
import DerivXSuccess from '../../../../public/images/cfd/dxtrade-success.svg';
import MT5DerivedSuccess from '../../../../public/images/cfd/mt5-derived-success.svg';
import MT5FinancialSuccess from '../../../../public/images/cfd/mt5-financial-success.svg';
import MT5SwapFreeSuccess from '../../../../public/images/cfd/mt5-swap-free-success.svg';
import CheckMark from '../../../../public/images/checkmark.svg';

type TCFDSuccessProps = {
    description: string;
    renderButtons?: () => ReactNode;
} & (
    | {
          displayBalance: string;
          landingCompany?: string;
          marketType: TMarketTypes.SortedMT5Accounts;
          platform: TPlatforms.MT5;
          title: string;
      }
    | {
          marketType?: never;
          platform: TPlatforms.OtherAccounts;
      }
);

type TPlatformDetails = Partial<{
    all: { icon: ReactNode };
    financial: { icon: ReactNode };
    icon: ReactNode;
    synthetic: { icon: ReactNode };
}>;

const marketTypeToDetailsMapper: Record<TPlatforms.All, TPlatformDetails> = {
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

const CFDSuccess = ({ description, marketType, platform, renderButtons }: TCFDSuccessProps) => {
    let icon: ReactNode;
    if (platform === 'mt5') {
        icon = marketTypeToDetailsMapper[platform][marketType]?.icon;
    } else {
        icon = PlatformDetails[platform as keyof typeof PlatformDetails]?.icon;
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
