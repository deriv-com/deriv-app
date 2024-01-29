import React from 'react';
import { Text } from '@deriv-com/ui/dist/components/Text';
import { FullPageMobileWrapper } from '../../../../components';
import { MyProfileStats } from './MyProfileStats';
import { useQueryString } from '../../../../hooks';

const MyProfileStatsMobile = () => {
    const { setQueryString } = useQueryString();
    return (
        <FullPageMobileWrapper
            onBack={() =>
                setQueryString({
                    tab: 'default',
                })
            }
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
