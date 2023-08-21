import React from 'react';
import './divider.scss';

type TProps = {
    vertical?: boolean;
};

const Divider: React.FC<TProps> = ({ vertical = false }) => (
    <div className={vertical ? 'divider__vertical' : 'divider__horizontal'} />
);

export default Divider;
