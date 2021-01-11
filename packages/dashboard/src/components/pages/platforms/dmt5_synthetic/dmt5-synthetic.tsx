import * as React from 'react';
import Wrapper from '../components/wrapper'
import BackButton from '../components/back-button'
import GetSection from '../components/get-section'
import Preview from '../components/preview'
import Facts from '../components/facts'

const DMT5Synthetic: React.FC = () => {
    return (
        <Wrapper>
            <BackButton />
            <GetSection />
            <Preview />
            <Facts />
        </Wrapper>
    );
};

export default DMT5Synthetic;
