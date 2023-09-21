import React from 'react';
import { Text } from '@deriv/components';
import { isMobile } from '@deriv/shared';

const Description = ({ description }: { description?: string }) => (
    <React.Fragment>
        {
            <div key='description' className='quick-strategy__text'>
                <Text size={isMobile() ? 'xxs' : 's'} align='justify'>
                    {description}
                </Text>
            </div>
        }
    </React.Fragment>
);

Description.displayName = 'Description';

export default React.memo(Description);
