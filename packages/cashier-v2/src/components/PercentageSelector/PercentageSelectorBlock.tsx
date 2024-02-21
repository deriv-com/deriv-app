import React from 'react';
import Text from '../../../../components/src/components/text';
import styles from './PercentageSelector.module.scss';

type TPercentageSelectorBlock = {
    fillPercentage: number;
    label: string;
    onClick: VoidFunction;
};

const PercentageSelectorBlock = ({ fillPercentage, label, onClick }: TPercentageSelectorBlock) => {
    return (
        <div className={styles['block-container']}>
            <Text color='prominent' size='xs'>
                {label}
            </Text>
            <button className={styles.block} onClick={onClick}>
                <div className={styles.fill} style={{ width: `${fillPercentage}%` }} />
            </button>
        </div>
    );
};

export default PercentageSelectorBlock;
