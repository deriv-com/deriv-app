import React from 'react';
import { Text } from '@deriv/components';

type TDescription = {
    id: string;
    description: string;
};

const Description = ({ id, description }: TDescription) => (
    <React.Fragment>
        {id === 'type-strategy' && (
            <div key='description' className='quick-strategy__text'>
                <Text text='sm' weight='normal'>
                    {description}
                </Text>
            </div>
        )}
    </React.Fragment>
);

Description.displayName = 'Description';

export default React.memo(Description);
