import React from 'react';
import { APIProvider } from '@deriv/api';
import { BrandDerivLogoCoralIcon } from '@deriv/quill-icons';
import './index.scss';
import { BreakpointProvider } from '@deriv/quill-design';
import { FormProgress } from './components/form-progress';

const App: React.FC = () => (
    <APIProvider standalone>
        <BreakpointProvider>
            <div className='text-heading-h1 text-solid-slate-500'>Account V2</div>
            <div className='p-300'>
                <BrandDerivLogoCoralIcon height='120px' width='120px' />
            </div>
            <FormProgress
                steps={[
                    { title: 'Step 1', isFilled: true },
                    { title: 'Step 2', isFilled: true },
                    { title: 'Step 3', isFilled: false },
                ]}
                activeStep={1}
            />
        </BreakpointProvider>
    </APIProvider>
);

export default App;
