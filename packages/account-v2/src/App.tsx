import React from 'react';
import { APIProvider } from '@deriv/api';
import { BrandDerivLogoCoralIcon } from '@deriv/quill-icons';
import './index.scss';
import { BreakpointProvider } from '@deriv/quill-design';
import { FormProgress } from './components/form-progress';
import { stepProgress } from './mocks/form-progress.mock';

const App: React.FC = () => (
    <APIProvider standalone>
        <BreakpointProvider>
            <div className='text-heading-h1 text-solid-slate-500'>Account V2</div>
            <div className='p-300'>
                <BrandDerivLogoCoralIcon height='120px' width='120px' />
            </div>
            <FormProgress steps={stepProgress} activeStep={1} />
        </BreakpointProvider>
    </APIProvider>
);

export default App;
