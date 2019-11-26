// import { Checkbox }                  from 'deriv-components';
// import PropTypes                     from 'prop-types';
// import React                         from 'react';
// import { localize } from 'deriv-translations';
// import MediaItem, {
//     MediaDescription,
//     MediaHeading,
//     MediaIcon,
// }                                    from 'App/Components/Elements/Media';
// import { Localize } from 'deriv-translations';
// import ConfirmationDisabledLightIcon from 'Assets/SvgComponents/settings/confirmation-disabled.svg';
// import ConfirmationEnabledLightIcon  from 'Assets/SvgComponents/settings/confirmation-enabled.svg';
// import ConfirmationDisabledDarkIcon  from 'Assets/SvgComponents/settings/dark/confirmation-disabled.svg';
// import ConfirmationEnabledDarkIcon   from 'Assets/SvgComponents/settings/dark/confirmation-enabled.svg';
// import LockDisabledDarkIcon          from 'Assets/SvgComponents/settings/dark/lock-disabled.svg';
// import LockEnabledDarkIcon           from 'Assets/SvgComponents/settings/dark/lock-enabled.svg';
// import LockDisabledLightIcon         from 'Assets/SvgComponents/settings/lock-disabled.svg';
// import LockEnabledLightIcon          from 'Assets/SvgComponents/settings/lock-enabled.svg';
// import { connect }                   from 'Stores/connect';
//
// const PurchaseSettings = ({
//     is_dark_mode,
//     is_purchase_confirmed,
//     is_purchase_locked,
//     setPurchaseLock,
//     togglePurchaseConfirmation,
// }) => (
//     <div className='settings-modal__purchase'>
//         <MediaItem>
//             <MediaHeading>
//                 <Localize i18n_default_text='Purchase confirmation' />
//             </MediaHeading>
//             <MediaDescription>
//                 <MediaIcon
//                     disabled={is_dark_mode ? ConfirmationDisabledDarkIcon : ConfirmationDisabledLightIcon }
//                     enabled={is_dark_mode ? ConfirmationEnabledDarkIcon : ConfirmationEnabledLightIcon }
//                     is_enabled={is_purchase_confirmed}
//                 />
//                 <div className='media__form'>
//                     <Checkbox
//                         value={is_purchase_confirmed}
//                         label={localize('Require confirmation before purchasing a contract')}
//                         onClick={togglePurchaseConfirmation}
//                     />
//                 </div>
//             </MediaDescription>
//         </MediaItem>
//         <MediaItem>
//             <MediaHeading>
//                 <Localize i18n_default_text='Purchase lock' />
//             </MediaHeading>
//             <MediaDescription>
//                 <MediaIcon
//                     disabled={is_dark_mode ? LockDisabledDarkIcon : LockDisabledLightIcon}
//                     enabled={is_dark_mode ? LockEnabledDarkIcon : LockEnabledLightIcon}
//                     is_enabled={is_purchase_locked}
//                 />
//                 <div className='media__form'>
//                     <Checkbox
//                         defaultChecked={is_purchase_locked}
//                         label={localize('Lock contract purchase buttons')}
//                         onChange={(e) => { setPurchaseLock(e.target.checked); }}
//                     />
//                 </div>
//             </MediaDescription>
//         </MediaItem>
//     </div>
// );
//
// PurchaseSettings.propTypes = {
//     is_dark_mode              : PropTypes.bool,
//     is_purchase_confirmed     : PropTypes.bool,
//     is_purchase_locked        : PropTypes.bool,
//     togglePurchaseConfirmation: PropTypes.func,
//     togglePurchaseLock        : PropTypes.func,
// };
//
// export default connect(({ ui }) => (
//     {
//         is_dark_mode              : ui.is_dark_mode_on,
//         is_purchase_confirmed     : ui.is_purchase_confirm_on,
//         is_purchase_locked        : ui.is_purchase_lock_on,
//         togglePurchaseConfirmation: ui.togglePurchaseConfirmation,
//         setPurchaseLock           : ui.setPurchaseLock,
//     }
// ))(PurchaseSettings);
