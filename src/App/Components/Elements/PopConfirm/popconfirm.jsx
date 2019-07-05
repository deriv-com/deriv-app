// import React                 from 'react';
// import PropTypes             from 'prop-types';
// import { PopConfirmElement } from './popconfirm-element.jsx';
//
// class PopConfirm extends React.PureComponent {
//     state = {
//         is_open: false,
//     };
//
//     componentDidMount() {
//         document.addEventListener('mousedown', this.handleClickOutside);
//     }
//
//     componentWillUnmount() {
//         document.removeEventListener('mousedown', this.handleClickOutside);
//     }
//
//     setWrapperRef = (node) => {
//         this.wrapper_ref = node;
//     };
//
//     handleClickOutside = (event) => {
//         if (this.wrapper_ref && !this.wrapper_ref.contains(event.target) && this.state.is_open) {
//             this.setState({ is_open: false });
//         }
//     };
//
//     handleClose = () => {
//         this.setState({ is_open: false });
//     };
//
//     handleOpen = (event) => {
//         if (!this.wrapper_ref.contains(event.target)) {
//             this.setState({ is_open: true });
//         }
//     };
//
//     render() {
//         const popconfirm_element = (
//             <PopConfirmElement
//                 wrapperRef={this.setWrapperRef}
//                 alignment={this.props.alignment}
//                 cancel_text={this.props.cancel_text}
//                 confirm_text={this.props.confirm_text}
//                 is_visible={this.state.is_open}
//                 message={this.props.message}
//                 onConfirm={this.props.children.props.onClick}
//                 onClose={this.handleClose}
//             />
//         );
//         return (
//             <React.Fragment>
//                 {React.Children.map(this.props.children, child => (
//                     React.cloneElement(child, {
//                         onClick: this.handleOpen,
//                     })
//                 ))}
//                 {popconfirm_element}
//             </React.Fragment>
//         );
//     }
// }
//
// PopConfirm.propTypes = {
//     alignment   : PropTypes.string,
//     cancel_text : PropTypes.string,
//     children    : PropTypes.object,
//     confirm_text: PropTypes.string,
//     message     : PropTypes.string,
// };
//
// export { PopConfirm };
