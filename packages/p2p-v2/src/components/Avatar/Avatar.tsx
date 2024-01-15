import React, { memo } from 'react';
import './Avatar.scss';

type TAvatarProps = {
    name: string;
};

export const getShortNickname = (nickname: string): string => nickname?.substring(0, 2).toUpperCase();

const Avatar = ({ name }: TAvatarProps) => {
    return <div className='p2p-v2-avatar'>{getShortNickname(name)}</div>;
};

export default memo(Avatar);
