import React from 'react';
import classNames from 'classnames';
import { Popover, Text } from '@deriv/components';
import { isMobile } from '@deriv/shared';

type TQSInputLabel = {
    children?: React.ReactNode;
    label?: string;
    description?: string;
    fullwidth?: boolean;
};

const QSInputLabel: React.FC<TQSInputLabel> = ({ label, description, fullwidth = false }) => {
    const is_mobile = isMobile();

    return (
        <div className={classNames('qs__form__field', { 'full-width': fullwidth })}>
            <div className='qs__input-label'>
                <Text weight='bold' className='qs__input-label__wrapper' size='xs'>
                    {label}
                </Text>
                <span>
                    <Popover
                        message={description}
                        zIndex='9999'
                        alignment={is_mobile ? 'bottom' : 'right'}
                        icon='info'
                    />
                </span>
            </div>
        </div>
    );
};

export default QSInputLabel;
