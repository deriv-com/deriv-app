import React, { memo } from 'react';
import { getShortNickname } from '../../utils';
import './Avatar.scss';

type TAvatarProps = {
    name: string;
};

const Avatar = ({ name }: TAvatarProps) => {
    return <div className='p2p-v2-avatar'>{getShortNickname(name)}</div>;
};

export default memo(Avatar);
