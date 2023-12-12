import React from 'react';
import { getCFDPlatformLabel } from '@deriv/shared';
import { Text, Button, Icon, Popover } from '@deriv/components';
import { TPasswordBoxProps } from '../types/components.types';
import { localize } from '@deriv/translations';
import '../sass/cfd-dashboard.scss';

const PasswordBox = ({ platform, onClick }: TPasswordBoxProps) => (
    <div className='trade-modal__password-box'>
        <div className='trade-modal__password-text'>
            <Popover
                alignment='right'
                message={localize(
                    'Use these credentials to log in to your {{platform}} account on the website and mobile apps.',
                    {
                        platform: getCFDPlatformLabel(platform),
                    }
                )}
                classNameBubble='trade-modal__password-tooltip'
                zIndex={9999}
            >
                <Text size='xs'>***************</Text>
            </Popover>
        </div>
        <Popover
            className='trade-modal__password-popover'
            alignment='left'
            message={localize('Change Password')}
            relative_render
            zIndex={9999}
        >
            <Button
                className='trade-modal__password-action'
                transparent
                onClick={onClick}
                icon={
                    <Icon
                        icon='IcEdit'
                        className='da-article__learn-more-icon'
                        custom_color='var(--text-less-prominent)'
                    />
                }
            />
        </Popover>
    </div>
);

export default PasswordBox;
