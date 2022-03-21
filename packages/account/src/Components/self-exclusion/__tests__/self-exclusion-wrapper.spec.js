import React from 'react';
import { render } from '@testing-library/react';
import SelfExclusionWrapper from '../self-exclusion-wrapper';
import SelfExclusionContext from '../self-exclusion-context';


let mockContext = {}

beforeEach(() =>{
    mockContext = {
        is_app_settings: false,
        is_wrapper_bypassed: false,
        state: {},
    }
})

describe('<SelfExclusionWrapper />', () => {
    
    it('should render SelfExclusionWrapper component without wrapper', () => {

        mockContext.is_wrapper_bypassed = true

       const {container} = render(
            <SelfExclusionContext.Provider value={mockContext}>
                <SelfExclusionWrapper />
            </SelfExclusionContext.Provider>
        )

        expect(container.querySelector('.da-self-exclusion')).toBeInTheDocument();
        expect(container.querySelector('.da-self-exclusion__scrollbars')).not.toBeInTheDocument();
    });

    it('should render SelfExclusionWrapper component with wrapper', () => {

       const {container} = render(

            <SelfExclusionContext.Provider value={mockContext}>
                <SelfExclusionWrapper />
            </SelfExclusionContext.Provider>
        )

        expect(container.querySelector('.da-self-exclusion')).not.toBeInTheDocument();
        expect(container.querySelector('.da-self-exclusion__scrollbars')).toBeInTheDocument();
    });
});