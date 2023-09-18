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
                        renderActions={() => (
                            <SecondaryActionButton>
                                <p className='wallets-other-cfd__text'>Get</p>
                            </SecondaryActionButton>
                        )}
                    />
                ))}
            </div>
        </div>
    );
};

export default OtherCFDPlatformsList;
