import React from 'react';
import { Text } from '@deriv-com/ui/dist/components/Text';
import { FullPageMobileWrapper } from '../../../../components';
import { MyProfileStats } from './MyProfileStats';

type TMyProfileStatsMobile = {
    onBack: () => void;
};
const MyProfileStatsMobile = ({ onBack }: TMyProfileStatsMobile) => {
    return (
        <FullPageMobileWrapper
            onBack={onBack}
            renderHeader={() => (
                <Text lineHeight='xs' size='lg' weight='bold'>
                    Stats
                </Text>
            )}
        >
            <MyProfileStats />
        </FullPageMobileWrapper>
    );
};

export default MyProfileStatsMobile;
