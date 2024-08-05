import React from 'react';
import clsx from 'clsx';
import { ActionSheet, Text } from '@deriv-com/quill-ui';
import { Localize } from '@deriv/translations';

const StrikeDescription = ({ is_small_screen_device }: { is_small_screen_device?: boolean }) => (
    <ActionSheet.Content
        className={clsx(
            'strike__wrapper--definition',
            is_small_screen_device && 'strike__wrapper--definition--small-screen'
        )}
    >
        <Text>
            <Localize i18n_default_text='Content goes here.' />
        </Text>
    </ActionSheet.Content>
);

export default StrikeDescription;
