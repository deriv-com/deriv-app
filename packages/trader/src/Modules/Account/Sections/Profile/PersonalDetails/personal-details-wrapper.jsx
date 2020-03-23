import React from 'react';
import Lazy from 'App/Containers/Lazy';

const PersonalDetailsWrapper = () => {
    return <Lazy ctor={() => import(/* webpackChunkName: "personal-details" */ './personal-details')} />;
};

export default PersonalDetailsWrapper;
