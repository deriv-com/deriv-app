import React                 from 'react';
import IconBarrierDark       from 'Assets/SvgComponents/contract_details/dark/ic-barrier.svg';
import IconResetBarrierDark  from 'Assets/SvgComponents/contract_details/dark/ic-reset-barrier.svg';
import IconResetTimeDark     from 'Assets/SvgComponents/contract_details/dark/ic-resettime.svg';
import IconDurationDark      from 'Assets/SvgComponents/contract_details/dark/ic-duration.svg';
import IconEntrySpotDark     from 'Assets/SvgComponents/contract_details/dark/ic-entryspot.svg';
import IconExitSpotWinDark   from 'Assets/SvgComponents/contract_details/dark/ic-exitspot-win.svg';
import IconExitSpotLossDark  from 'Assets/SvgComponents/contract_details/dark/ic-exitspot-loss.svg';
import IconExitTimeWinDark   from 'Assets/SvgComponents/contract_details/dark/ic-exittime-win.svg';
import IconExitTimeLossDark  from 'Assets/SvgComponents/contract_details/dark/ic-exittime-loss.svg';
import IconIdDark            from 'Assets/SvgComponents/contract_details/dark/ic-id.svg';
import IconStartDark         from 'Assets/SvgComponents/contract_details/dark/ic-starttime.svg';
import IconTargetDark        from 'Assets/SvgComponents/contract_details/dark/ic-target.svg';
import IconBarrierLight      from 'Assets/SvgComponents/contract_details/light/ic-barrier.svg';
import IconResetBarrierLight from 'Assets/SvgComponents/contract_details/light/ic-reset-barrier.svg';
import IconResetTimeLight    from 'Assets/SvgComponents/contract_details/light/ic-resettime.svg';
import IconDurationLight     from 'Assets/SvgComponents/contract_details/light/ic-duration.svg';
import IconEntrySpotLight    from 'Assets/SvgComponents/contract_details/light/ic-entryspot.svg';
import IconExitSpotWinLight  from 'Assets/SvgComponents/contract_details/light/ic-exitspot-win.svg';
import IconExitSpotLossLight from 'Assets/SvgComponents/contract_details/light/ic-exitspot-loss.svg';
import IconExitTimeWinLight  from 'Assets/SvgComponents/contract_details/light/ic-exittime-win.svg';
import IconExitTimeLossLight from 'Assets/SvgComponents/contract_details/light/ic-exittime-loss.svg';
import IconIdLight           from 'Assets/SvgComponents/contract_details/light/ic-id.svg';
import IconStartLight        from 'Assets/SvgComponents/contract_details/light/ic-starttime.svg';
import IconTargetLight       from 'Assets/SvgComponents/contract_details/light/ic-target.svg';

export const getThemedIcon = (type, is_dark_theme) => {
    let IconType;
    if (type) {
        switch (type) {
            case 'id':
                IconType = is_dark_theme ? <IconIdDark /> : <IconIdLight />;
                break;
            case 'duration':
                IconType = is_dark_theme ? <IconDurationDark /> : <IconDurationLight />;
                break;
            case 'barrier':
                IconType = is_dark_theme ? <IconBarrierDark /> : <IconBarrierLight />;
                break;
            case 'target':
                IconType = is_dark_theme ? <IconTargetDark /> : <IconTargetLight />;
                break;
            case 'reset_barrier':
                IconType = is_dark_theme ? <IconResetBarrierDark /> : <IconResetBarrierLight />;
                break;
            case 'reset_time':
                IconType = is_dark_theme ? <IconResetTimeDark /> : <IconResetTimeLight />;
                break;
            case 'start_time':
                IconType = is_dark_theme ? <IconStartDark /> : <IconStartLight />;
                break;
            case 'entry_spot':
                IconType = is_dark_theme ? <IconEntrySpotDark /> : <IconEntrySpotLight />;
                break;
            case 'exit_spot_win':
                IconType = is_dark_theme ? <IconExitSpotWinDark /> : <IconExitSpotWinLight />;
                break;
            case 'exit_spot_loss':
                IconType = is_dark_theme ? <IconExitSpotLossDark /> : <IconExitSpotLossLight />;
                break;
            case 'exit_time_win':
                IconType = is_dark_theme ? <IconExitTimeWinDark /> : <IconExitTimeWinLight />;
                break;
            case 'exit_time_loss':
                IconType = is_dark_theme ? <IconExitTimeLossDark /> : <IconExitTimeLossLight />;
                break;
            default:
                break;
        }
    }
    if (!IconType) return null;
    return IconType;
};
