import React, { ReactNode } from 'react';
import { Text } from '@deriv-com/ui';

type TJurisdictionCardRowProps = {
    description?: ReactNode;
    renderTag?: () => ReactNode;
    title: string;
};

const JurisdictionCardRow = ({ description, renderTag, title }: TJurisdictionCardRowProps) => {
    return (
        <div className='w-full py-20 border-b border-solid space-y-14 border-system-light-secondary-background last:border-none lg:py-14 first:mt-16'>
            <div className='flex items-center justify-between'>
                <Text size='sm' weight='bold'>
                    {title}
                </Text>
                {renderTag && <div>{renderTag()}</div>}
            </div>
            {description && <Text size='sm'>{description}</Text>}
        </div>
    );
};

export default JurisdictionCardRow;
