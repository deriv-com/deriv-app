import { Text } from '@deriv/components';
import React from 'react';
import { observer, useStore } from '@deriv/stores';
import { TFilesDescription } from '../../Types';

const FilesDescription = observer(({ descriptions, title }: TFilesDescription) => {
    const {
        ui: { is_mobile },
    } = useStore();
    return (
        <div className='files-description'>
            <Text size={is_mobile ? 'xxs' : 'xs'} as='div' className='files-description__title' weight='bold'>
                {title}
            </Text>
            <ul>
                {descriptions.map(item => (
                    <li key={item.id}>
                        <Text size={is_mobile ? 'xxs' : 'xs'} line_height={is_mobile ? 'l' : 'xl'}>
                            {item.value}
                        </Text>
                    </li>
                ))}
            </ul>
        </div>
    );
});

export default FilesDescription;
