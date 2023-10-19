import { Text } from '@deriv/components';
import React from 'react';

type TFilesDescription = {
    descriptions: JSX.Element[];
    is_mobile?: boolean;
    title: React.ReactNode;
};

const FilesDescription = ({ descriptions, is_mobile, title }: TFilesDescription) => (
    <div className='files-description'>
        <Text size={is_mobile ? 'xxs' : 'xs'} as='div' className='files-description__title' weight='bold'>
            {title}
        </Text>
        <ul>
            {descriptions.map(item => (
                <li key={item.props.key}>
                    <Text size={is_mobile ? 'xxs' : 'xs'} line_height={is_mobile ? 'l' : 'xl'}>
                        {item}
                    </Text>
                </li>
            ))}
        </ul>
    </div>
);

export default FilesDescription;
