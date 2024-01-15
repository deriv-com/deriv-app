import React from 'react';
import { qtMerge } from '@deriv/quill-design';
import { desktopStyle, mobileStyle } from './form-progress.classnames';

const StepConnector = ({ isActive }: { isActive?: boolean }) => (
    <div
        aria-current={isActive}
        className={qtMerge(
            'via-solid-grey-5 to-solid-grey-5 from-solid-coral-700 from-50% via-50% transition-all duration-700 ease-out',
            mobileStyle.connector,
            desktopStyle.connector
        )}
    >
        {' '}
    </div>
);

export default StepConnector;
