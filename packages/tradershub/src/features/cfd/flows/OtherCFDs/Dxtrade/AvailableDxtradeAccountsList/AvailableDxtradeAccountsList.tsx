import React from 'react';
import { Button, Text } from '@deriv/quill-design';
import { TradingAccountCard } from '../../../../../../components';
import { getStaticUrl } from '../../../../../../helpers/urls';
import DerivX from '../../../../../../public/images/cfd/derivx.svg';

const AvailableDxtradeAccountsList: React.FC = () => {
    return (
        <TradingAccountCard
            leading={() => (
                <div
                    className='cursor-pointer'
                    onClick={() => {
                        window.open(getStaticUrl('/derivx'));
                    }}
                >
                    <DerivX />
                </div>
            )}
            trailing={() => <Button color='primary-light' /* open <DxtradeEnterPasswordModal /> */>Get</Button>}
        >
            <div className='flex-grow'>
                <p>
                    <Text size='sm' weight='bold'>
                        Deriv X
                    </Text>
                </p>
                <Text size='xs'>This account offers CFDs on a highly customisable CFD trading platform.</Text>
            </div>
        </TradingAccountCard>
    );
};

export default AvailableDxtradeAccountsList;
