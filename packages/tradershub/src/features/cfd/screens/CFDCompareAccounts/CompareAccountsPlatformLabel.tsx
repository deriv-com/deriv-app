import React from 'react';
import { qtMerge, Text } from '@deriv/quill-design';
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
                bold
                className={qtMerge(
                    CompareAccountsPlatformLabelTextColorClass({
                        label: platformType,
                    } as unknown as TCompareAccountsPlatformLabelTextClassProps),
                    'text-center'
                )}
                size='sm'
            >
                {platformLabel[platformType]}
            </Text>
        </div>
    );
};

export default CompareAccountsPlatformLabel;
