// import React       from 'react';
// import Head        from './head.jsx';
// import GTMNoScript from './includes/google/gtm_no_script.jsx';

// const BinaryApp = () => (
//     <html>
//         <Head />
//         <body className='body theme'>
//             <GTMNoScript />

//             <div id='binary_app' className='binary-app'>
//                 {/* Initial loader before react mounts */}
//                 <div className='initial-loader'>
//                     {/* TODO add theme */}
//                     <div className={'initial-loader__barspinner barspinner barspinner-light'}>
//                         { Array.from(new Array(5)).map((x, inx) => (
//                             <div key={inx} className={`initial-loader__barspinner--rect barspinner__rect barspinner__rect--${inx + 1} rect${inx + 1}`} />
//                         ))}
//                     </div>
//                 </div>
//             </div>
//             <div id='modal_root' className='modal-root' />
//         </body>
//     </html>
// );
//
// export default BinaryApp;
