import React from 'react';
import classNames from 'classnames';
import Icon from '../../icon';
import './small.scss';

type TWalletSmallProps = {
    icon?: string;
    className?: string;
    bg?: string;
    data_testid?: string;
    icon_class?: string;
    size?: string;
};

const WalletSmall = ({ bg, icon, className, data_testid, icon_class, size = '16px' }: TWalletSmallProps) => {
    if (!icon) {
        return null;
    }

    return (
        <div className={classNames('wallet-small', bg, className)}>
            <Icon data_testid={data_testid} className={classNames(icon_class)} icon={icon} size={size} />
        </div>
    );
};

export default WalletSmall;
