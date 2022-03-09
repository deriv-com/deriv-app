import React from 'react';
import { Icon } from '@deriv/components';
import classNames from 'classnames';

type TProps = {
    icon: string;
};

const WalletRadioButton: React.FC<TProps> = ({ icon }) => {
    const [is_wallet_selected, setIsWalletSelected] = React.useState(false);

    const onWalletClicked = () => {
        setIsWalletSelected(!is_wallet_selected);
    };

    return (
        <div className='wallet-radio-button' onClick={onWalletClicked}>
            {is_wallet_selected && <Icon icon='IcAppstoreCheck' className='wallet-radio-icon' />}
            <Icon
                className={classNames('wallet-radio-button__icon__border', {
                    'wallet-radio-button__icon__border--red': is_wallet_selected,
                })}
                icon={icon}
                width={64}
                height={40}
            />
        </div>
    );
};

export default WalletRadioButton;
