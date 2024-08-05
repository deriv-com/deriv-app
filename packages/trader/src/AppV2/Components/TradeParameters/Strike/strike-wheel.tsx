import React from 'react';
import clsx from 'clsx';
import { ActionSheet } from '@deriv-com/quill-ui';
import { Localize } from '@deriv/translations';

type TStrikeWheelProps = {
    is_small_screen_device?: boolean;
    onSave: () => void;
};

const StrikeWheel = ({ is_small_screen_device, onSave }: TStrikeWheelProps) => {
    return (
        <React.Fragment>
            <ActionSheet.Content
                className={clsx('strike__wrapper', is_small_screen_device && 'strike__wrapper--small-screen')}
            >
                <div>Content</div>
            </ActionSheet.Content>
            <ActionSheet.Footer
                alignment='vertical'
                primaryAction={{
                    content: <Localize i18n_default_text='Save' />,
                    onAction: onSave,
                }}
            />
        </React.Fragment>
    );
};

export default StrikeWheel;
