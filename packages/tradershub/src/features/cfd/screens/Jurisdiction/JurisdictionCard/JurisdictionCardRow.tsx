import React, { FC, ReactNode } from 'react';
import { Text } from '@deriv/quill-design';

type TJurisdictionCardRowProps = {
    description?: ReactNode;
    renderTag?: () => ReactNode;
    title: string;
};

const JurisdictionCardRow: FC<TJurisdictionCardRowProps> = ({ description, renderTag, title }) => {
    return (
        <div className='flex flex-col w-full gap-400 py-1000 px-50 lg:py-700 first:mt-800'>
            <div className='flex items-center justify-between'>
                <Text bold size='sm'>
                    {title}
                </Text>
                {renderTag && <div>{renderTag()}</div>}
            </div>
            {description && <Text size='sm'>{description}</Text>}
        </div>
    );
};

export default JurisdictionCardRow;
