import React from 'react';
import { Text } from '@deriv-com/ui';
import IcPoiClearPhoto from '../../assets/manual-upload/ic-poi-clear-photo.svg';
import IcPoiDocExpiry from '../../assets/manual-upload/ic-poi-doc-expiry.svg';
import IcPoiFileFormat from '../../assets/manual-upload/ic-poi-file-format.svg';
import IcPoiFileSize from '../../assets/manual-upload/ic-poi-file-size.svg';

const footerItems = [
    { icon: <IcPoiClearPhoto />, text: 'A clear colour photo or scanned image' },
    { icon: <IcPoiFileFormat />, text: 'JPEG, JPG, PNG, PDF, or GIF' },
    { icon: <IcPoiFileSize />, text: 'Less than 8MB' },
    { icon: <IcPoiDocExpiry />, text: 'Must be valid for at least 6 months' },
];

export const ManualFormFooter = () => (
    <ul className='grid grid-cols-2 mb-24 justify-items-center items-center gap-24 lg:flex lg:justify-evenly'>
        {footerItems.map(({ icon, text }) => (
            <li className='w-[12.4rem] flex flex-col justify-start items-center' key={text}>
                <div className='flex justify-center items-center w-72 h-72'>{icon}</div>
                <Text align='center' size='2xs'>
                    {text}
                </Text>
            </li>
        ))}
    </ul>
);
