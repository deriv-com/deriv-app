import React from 'react';
import { qtMerge } from '@deriv/quill-design';
import { Text } from '@deriv-com/ui';
import { TPlatforms } from '../../../../types';
import {
    CompareAccountsPlatformLabelClass,
    CompareAccountsPlatformLabelTextColorClass,
    TCompareAccountsPlatformLabelClassProps,
    TCompareAccountsPlatformLabelTextClassProps,
} from './CompareAccounts.classnames';
import { getPlatformType } from './CompareAccountsConfig';
import { platformLabel } from './constants';

type TCompareAccountsPlatformLabel = {
    platform: TPlatforms.All;
};

const CompareAccountsPlatformLabel = ({ platform }: TCompareAccountsPlatformLabel) => {
    const platformType = getPlatformType(platform);

    return (
        <div
            className={qtMerge(
                CompareAccountsPlatformLabelClass({
                    background: platformType,
                } as unknown as TCompareAccountsPlatformLabelClassProps)
            )}
        >
            <Text
                className={qtMerge(
                    CompareAccountsPlatformLabelTextColorClass({
                        label: platformType,
                    } as unknown as TCompareAccountsPlatformLabelTextClassProps)
                )}
                size='sm'
                weight='bold'
            >
                {platformLabel[platformType]}
            </Text>
        </div>
    );
};

export default CompareAccountsPlatformLabel;
