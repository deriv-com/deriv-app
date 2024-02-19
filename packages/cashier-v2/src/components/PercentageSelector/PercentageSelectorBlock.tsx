import React from 'react';
import Text from '../../../../components/src/components/text';
import styles from './PercentageSelector.module.scss';

type TWalletsPercentageSelectorBlock = {
    fillPercentage: number;
    label: string;
    onClick: VoidFunction;
};

const WalletsPercentageSelectorBlock = ({ fillPercentage, label, onClick }: TWalletsPercentageSelectorBlock) => {
    return (
        <div className={styles['block-container']}>
            <Text color='prominent' size='xs'>
                {label}
            </Text>
            <div className={styles.block} onClick={onClick}>
                <div className={styles.fill} style={{ width: `${fillPercentage}%` }} />
            </div>
        </div>
    );
};

export default WalletsPercentageSelectorBlock;
