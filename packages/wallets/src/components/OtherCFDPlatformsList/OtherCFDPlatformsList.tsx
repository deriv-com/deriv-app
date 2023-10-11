import React from 'react';
import DerivEZ from '../../public/images/derivez.svg';
import DerivX from '../../public/images/derivx.svg';
import { SecondaryActionButton } from '../SecondaryActionButton';
import { TradingAccountCard } from '../TradingAccountCard';
import './OtherCFDPlatformsList.scss';

const other_cfd_mapper = [
    {
        title: 'Deriv X',
        description: 'This account offers CFDs on a highly customisable CFD trading platform.',
        icon: <DerivX />,
    },
    {
        title: 'Deriv EZ',
        description: 'This account offers CFDs on an easy-to-get-started CFD trading platform .',
        icon: <DerivEZ />,
    },
];

const OtherCFDPlatformsList: React.FC = () => {
    return (
        <div className='wallets-other-cfd'>
            <div className='wallets-other-cfd__title'>
                <h1>Other CFD Platforms</h1>
            </div>
            <div className='wallets-other-cfd__content'>
                {other_cfd_mapper.map(account => (
                    <TradingAccountCard
                        {...account}
                        key={`cfd_other_platform_list--${account.title}`}
                        leading={() => <div className='wallets-other-cfd__content__icon'>{account.icon}</div>}
                        trailing={() => (
                            <SecondaryActionButton>
                                <p className='wallets-other-cfd__text'>Get</p>
                            </SecondaryActionButton>
                        )}
                    >
                        <div className='wallets-other-cfd__content__details'>
                            <p className='wallets-other-cfd__content__details-title'>{account.title}</p>
                            <p className='wallets-other-cfd__content__details-description'>{account.description}</p>
                        </div>
                    </TradingAccountCard>
                ))}
            </div>
        </div>
    );
};

export default OtherCFDPlatformsList;
