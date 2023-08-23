import React from 'react';
import { Button, Icon, Popover, Text } from '@deriv/components';
import { getPlatformSettings, CFD_PLATFORMS } from '@deriv/shared';
import { localize } from '@deriv/translations';

type TPlatformPartialsProps = {
    description: JSX.Element;
    type: typeof CFD_PLATFORMS[keyof typeof CFD_PLATFORMS];
    handleClick: (type: typeof CFD_PLATFORMS[keyof typeof CFD_PLATFORMS]) => void;
};

/**
 * Component for displaying a change password instructions for a platform
 * @name PlatformPartials
 * @param description - The description of the platform
 * @param type - The type of the platform
 * @param handleClick - The function to call when the button is clicked
 * @returns React.ReactNode
 */
const PlatformPartials = ({ description, type, handleClick }: TPlatformPartialsProps) => {
    const platform_config = getPlatformSettings(type);

    return (
        <React.Fragment>
            <Text as='p' className='passwords-platform__desc' color='prominent' size='xs' weight='lighter'>
                {description}
            </Text>
            <div className='passwords-platform__content'>
                <Popover alignment='bottom' message={platform_config.name}>
                    <Icon icon={`${platform_config.icon}-dashboard`} size={32} />
                </Popover>
                <Button
                    className='account__passwords-footer-btn'
                    type='button'
                    onClick={() => handleClick(type)}
                    text={localize('Change password')}
                    primary
                    large
                />
            </div>
        </React.Fragment>
    );
};

export default PlatformPartials;
