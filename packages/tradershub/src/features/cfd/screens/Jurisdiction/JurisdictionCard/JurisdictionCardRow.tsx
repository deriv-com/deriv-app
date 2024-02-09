import React, { ReactNode } from 'react';
import { Text } from '@deriv-com/ui';

type TJurisdictionCardRowProps = {
    description?: ReactNode;
    renderTag?: () => ReactNode;
    title: string;
};

const JurisdictionCardRow = ({ description, renderTag, title }: TJurisdictionCardRowProps) => {
    return (
        <div className='w-full border-solid space-y-8 py-20 px-50 border-b-sm border-system-light-secondary-background last:border-b-none lg:py-700 first:mt-16'>
            <div className='flex items-center justify-between'>
                <Text size='sm' weight='bold'>
                    {title}
                </Text>
                {renderTag && <div>{renderTag()}</div>}
            </div>
            {description && <Text className='text-50'>{description}</Text>}
        </div>
    );
};

export default JurisdictionCardRow;
