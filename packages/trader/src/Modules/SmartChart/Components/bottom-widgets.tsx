import React from 'react';

type BottomWidgetsProps = {
    Digits: unknown;
};

const BottomWidgets = ({ Digits }: BottomWidgetsProps) => <div className='bottom-widgets'>{Digits}</div>;

export default BottomWidgets;
