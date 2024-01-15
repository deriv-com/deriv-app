import React from 'react';
import { CFDContent } from './CFDContent';
import { CFDHeading } from './CFDHeading';

const CFDSection = () => (
    <div className='overflow-y-scroll border-solid pt-800 lg:p-1200 rounded-1200 lg:border-xs lg:border-opacity-black-100'>
        <CFDHeading />
        <CFDContent />
    </div>
);

export default CFDSection;
