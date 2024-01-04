import React from 'react';
import { APIProvider } from '@deriv/api';
// import { Base } from '@deriv/library';
import { BrandDerivLogoCoralIcon } from '@deriv/quill-icons';
import './index.scss';

const App: React.FC = () => (
    <APIProvider standalone>
        <div className='account-v2'>
            <div className='text-solid-slate-500 text-heading-h1'>Account V2</div>
            <div className='p-300 flex'>
                <BrandDerivLogoCoralIcon height='120px' width='120px' />
            </div>
        </div>
    </APIProvider>
);

export default App;
