// import classNames          from 'classnames';
// import PropTypes           from 'prop-types';
// import React               from 'react';
// import {
//     Icon,
//     IconExclamation }      from 'Assets/Common';
//
// const PopConfirmElement = ({
//     alignment,
//     cancel_text,
//     confirm_text,
//     is_visible,
//     message,
//     onClose,
//     onConfirm,
//     wrapperRef,
// }) => {
//     const popconfirm_class = classNames('popconfirm', `popconfirm--${alignment}`, {
//         [`popconfirm--${alignment}--open`]: is_visible,
//         'popconfirm--open'                : is_visible,
//     });
//     return (
//         <div ref={wrapperRef} className={popconfirm_class}>
//             <div className='popconfirm__title'>
//                 <Icon icon={IconExclamation} className='popconfirm__icon_exclamation' />
//                 <h4 className='popconfirm__header'>{message}</h4>
//             </div>
//             <div className='popconfirm__button-wrapper'>
//                 <div
//                     className='popconfirm__button btn btn--flat effect'
//                     onClick={onClose}
//                 >
//                     <span className='popconfirm__button-text'>{cancel_text}</span>
//                 </div>
//                 <div
//                     className='popconfirm__button btn btn--flat effect'
//                     onClick={onConfirm}
//                 >
//                     <span className='popconfirm__button-text'>{confirm_text}</span>
//                 </div>
//             </div>
//         </div>
//     );
// };
//
// PopConfirmElement.propTypes = {
//     alignment   : PropTypes.string,
//     cancel_text : PropTypes.string,
//     confirm_text: PropTypes.string,
//     is_visible  : PropTypes.bool,
//     message     : PropTypes.string,
//     onClose     : PropTypes.func,
//     onConfirm   : PropTypes.func,
//     wrapperRef  : PropTypes.func,
// };
//
// export { PopConfirmElement };
