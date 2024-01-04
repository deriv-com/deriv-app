import React from 'react';
import { APIProvider } from '@deriv/api';
import { BrandDerivLogoCoralIcon } from '@deriv/quill-icons';
import './index.scss';

const App: React.FC = () => (
    <APIProvider standalone>
        <div className='quill-design'>
            <div className='text-solid-slate-500 text-heading-h1'>Account V2</div>
            <div className='p-300 flex'>
                <BrandDerivLogoCoralIcon height='120px' width='120px' />
            </div>
        </div>
    </APIProvider>
);

export default App;
