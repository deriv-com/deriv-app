import classNames  from 'classnames';
import React       from 'react';
import Head        from './head.jsx';
import GTMNoScript from './includes/google/gtm_no_script.jsx';

const BinaryApp = () => (
    <html>
        <Head />
        <body className={classNames('body', it.language, 'theme')}>
            <GTMNoScript />

            <div id='binary_app' className='binary-app' />
            <div id='modal_root' className='modal-root' />
        </body>
    </html>
);

export default BinaryApp;
