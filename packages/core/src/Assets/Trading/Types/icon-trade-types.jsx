import classNames from 'classnames';
import PropTypes  from 'prop-types';
import React      from 'react';

const IconTradeType = ({ type, className }) => {
    let IconType;
    if (type) {
        switch (type) {
            case 'asiand':
                IconType = (
                    <g fill='none' fillRule='evenodd'>
                        <path className='color1-fill' d='M6.91269732 8.38309859H.18028169V6.26478873H15.9323944v2.11830986H9.88544601l3.90610329 3.96619721v-.9915493c0-1.171831.9464789-2.14084509 2.1408451-2.14084509v6.76056339H9.28450704c0-1.171831.94647886-2.1183099 2.11830986-2.1183099h.9239437L6.91269732 8.38309859zM.13521127 12.3492958h8.15774648v2.1183098H.13521127v-2.1183098zM15.9098592.2028169v2.14084507H3.94366197L1.8028169.2028169h14.1070423z' fill='#336' />
                        <path fill='#F93' d='M4.93521127 5.02535211l-4.8-4.75492958v2.97464789l1.78028169 1.78028169z' />
                    </g>
                );
                break;
            case 'asianu':
                IconType = (
                    <g fill='none' fillRule='evenodd'>
                        <path className='color1-fill' d='M9.79530516 7.7971831h6.02441314v2.11830986H.06760563V7.7971831h6.75495084l5.41406323-5.47605634h-.9239436c-1.171831 0-2.1183099-.94647887-2.1183099-2.11830986h6.6478873v6.76056338c-1.1943662-.02253521-2.140845-.96901408-2.140845-2.14084507v-.99154929L9.79530516 7.7971831zM.04507042 1.69014085H8.2028169V3.8084507H.04507042V1.69014085zM15.8197183 15.9549296H1.69014085l2.14084507-2.1183099H15.8197183v2.1183099z' fill='#336' />
                        <path fill='#F93' d='M4.84507042 11.1549296l-4.8 4.7549296v-2.9971831l1.78028169-1.7577465z' />
                    </g>
                );
                break;
            case 'call_barrier':
                IconType = (
                    <g fill='none' fillRule='evenodd'>
                        <path className='transparent' d='M0 0h16v16H0z' />
                        <path className='color1-fill' fill='#2A3052'd='M7.234 9.316l5.183-5.193H10.14a1.988 1.988 0 0 1-1.983-1.988h7.662v5.713h-1.983V5.523L10.05 9.316h5.769v1.987H.045V9.316h7.189z' />
                        <path className='color2-fill important' fill='#F93' d='M3.425 15.91H.045v-3.387h2.073v1.874l1.87-1.874h2.818z' />
                    </g>
                );
                break;
            case 'calle':
            case 'call' :
                IconType = (
                    <g fill='none' fillRule='evenodd'>
                        <path className='transparent' d='M0 0h16v16H0z' />
                        <path className='color1-fill' fill='#2A3052'd='M8.721.162c0 1.13.902 2.03 1.983 2.03h1.848l-7.55 7.731v2.885l8.97-9.185v1.892c0 1.131.901 2.031 1.983 2.031V.138H8.72v.024z' />
                        <path className='color2-fill important' fill='#F93' d='M.135 12.808v2.123h2.817l2.05-2.123z' />
                    </g>
                );
                break;
            case 'calle_light':
                IconType = (
                    <path d='M6.671 8l3.422-4.79A.5.5 0 0 1 10.5 3h1.79l-1.144-1.147a.5.5 0 1 1 .708-.706l1.963 1.966a.499.499 0 0 1 0 .774l-1.963 1.966a.5.5 0 0 1-.708-.706L12.291 4h-1.534L7.9 8h4.6a.5.5 0 1 1 0 1H7.186l-1.28 1.79a.5.5 0 0 1-.76.064l-2-2A.498.498 0 0 1 3.5 8h3.171zm-.714 1h-1.25l.73.73.52-.73zm6.897-2.147a.5.5 0 0 1-.708-.706l1.997-2a.5.5 0 1 1 .707.706l-1.996 2z' className='color1-fill' fill='#2A3052'fillRule='evenodd' />
                );
                break;
            case 'callspread':
                IconType = (
                    <g fill='none' fillRule='evenodd'>
                        <path d='M0 0h16v16H0z' />
                        <path className='color1-fill' fill='#2A3052' d='M0 0h6.56v1.99619048H0zM0 14h16v1.99619048H0zM15.9838393 7h-4.9876488L9 8.99619048h3.1666964l-.5714285.57904762c-.3769008.37219104-.5890419.8798254-.5890419 1.4095238 0 .5296984.2121411 1.0373328.5890419 1.4095238l4.3885714-4.39619046V7z' />
                        <path d='M7.74095238 0v.34285714c-.00004229.4424804.17728182.86651358.49230322 1.17723923.31502139.31072565.74144914.48221135 1.18388726.47609411h1.52380954L5.82857143 7.06285714H0v1.99619048h6.65142857l5.65333333-5.65333333v2.28571428h1.9961905V0H7.74095238z' fill='#F93' />
                    </g>
                );
                break;
            case 'putspread':
                IconType = (
                    <g fill='none' fillRule='evenodd'>
                        <path d='M0 0h16v16H0z' />
                        <path className='color1-fill' fill='#2A3052' d='M0 16.0000005h6.56v-1.99619048H0zM0 2.00000048h16V.00381H0zM15.9838393 9.00000048h-4.9876488L9 7.00381h3.1666964l-.5714285-.57904762c-.3769008-.37219104-.5890419-.87982544-.5890419-1.40952381 0-.52969836.2121411-1.03733276.5890419-1.40952381l4.3885714 4.39619048v.99809524z' />
                        <path d='M7.74095238 16.0000005v-.34285714c-.00004229-.4424804.17728182-.86651358.49230322-1.17723922.31502139-.31072565.74144914-.48221136 1.18388726-.47609411h1.52380954L5.82857143 8.9371434H0V6.9409529h6.65142857l5.65333333 5.6533334V10.308572h1.9961905v5.6914285H7.74095238z' fill='#F93' />
                    </g>
                );
                break;
            case 'digitdiff':
                IconType = (
                    <g fill='none' fillRule='evenodd'>
                        <path className='transparent' d='M0 0h16v16H0z' />
                        <path className='color1-fill' fill='#2A3052'd='M3.493.654l5.746 5.723-5.746 5.747c-.766-.789-.789-2.028 0-2.817l1.848-1.848H.045V5.476H5.5L3.493 3.47a1.973 1.973 0 0 1 0-2.816zm3.448 11.808h1.983v3.493H6.94v-3.493zM6.94.18h1.983v1.893H6.94V.18z' />
                        <path className='color2-fill important' fill='#F93' d='M15.82 8.563h-4.305l1.848-1.848c.767-.766.767-2.028 0-2.816L10.051 7.21a.844.844 0 0 1 0 1.172l-1.826 1.825 5.138 5.138c.609-.923.474-2.343-.315-3.132l-1.69-1.69h4.44v-1.96h.022z' />
                    </g>
                );
                break;
            case 'digiteven':
                IconType = (
                    <g fill='none' fillRule='evenodd'>
                        <path className='transparent' d='M0 0h16v16H0z' />
                        <path className='color2-fill important' fill='#F93' d='M.135 6.49V.158h6.333V6.49H.135zM4.26 2.39H2.366v1.893H4.26V2.389zM9.6 16V9.668h6.332V16H9.6zm4.101-4.124h-1.893v1.893h1.893v-1.893z' />
                        <path className='color1-fill' fill='#2A3052'd='M9.6.158h6.332V6.49H9.6V.158zm2.208 4.124h1.893V2.389h-1.893v1.893zM.135 16V9.668h6.333V16H.135zm4.124-4.124H2.366v1.893H4.26v-1.893z' />
                    </g>
                );
                break;
            case 'digitmatch':
                IconType = (
                    <g fill='none' fillRule='evenodd'>
                        <path className='transparent' d='M0 0h16v16H0z' />
                        <path className='color1-fill' fill='#2A3052'd='M3.556 2.231l5.666 5.724L3.556 13.7c-.756-.788-.778-2.028 0-2.816l1.822-1.848H.156V7.054h5.377L3.556 5.048a1.992 1.992 0 0 1 0-2.817zm3.377 10.231H8.89v3.47H6.933v-3.47zm0-12.304H8.89v3.56H6.933V.158z' />
                        <path className='color2-fill important' fill='#F93' d='M12.156 2.344c.755.788.755 2.05-.023 2.817l-1.466 1.487L9.289 5.25l2.867-2.907zm0 11.493L9.2 10.817l1.378-1.397 1.578 1.6c.755.788.755 2.05 0 2.817zm-1.223-4.778l1.045-1.082-.911-.923h4.622v2.005h-4.756z' />
                    </g>
                );
                break;
            case 'digitodd':
                IconType = (
                    <g fill='none' fillRule='evenodd'>
                        <path className='transparent' d='M0 0h16v16H0z' />
                        <path className='color2-fill important' fill='#F93' d='M11.628 7.827H4.237L7.91 2l3.718 5.827zM7.256 6.155h1.352l-.676-1.068-.676 1.068z' />
                        <path className='color1-fill' fill='#2A3052'd='M7.46 14.86H.067L3.74 9.035l3.718 5.827zm-4.395-1.67h1.352L3.74 12.12l-.676 1.068zm12.755 1.67H8.428l3.673-5.826 3.719 5.827zm-4.372-1.67H12.8l-.676-1.069-.676 1.068z' />
                    </g>
                );
                break;
            case 'digitover':
                IconType = (
                    <g fill='none' fillRule='evenodd'>
                        <path className='transparent' d='M0 0h16v16H0z' />
                        <path className='color2-fill important' fill='#F93' d='M6.513 12.544L3.02 15.912H.203l4.89-4.746z' />
                        <path className='color1-fill' fill='#2A3052'd='M.045 11.034H15.82v1.925H.045v-1.925zM13.837 8.06V5.412l-5.792 5.622V8.3l4.372-4.244H9.69c-1.104 0-1.983-.875-1.983-1.925h8.113v7.875c-1.105 0-1.983-.875-1.983-1.947z' />
                    </g>
                );
                break;
            case 'digitunder':
                IconType = (
                    <g fill='none' fillRule='evenodd'>
                        <path className='transparent' d='M0 0h16v16H0z' />
                        <path className='color2-fill important' fill='#F93' d='M6.603 5.478L3.11 2.088H.293l4.913 4.768z' />
                        <path className='color1-fill' fill='#2A3052'd='M.135 5.04H15.91v1.926H.135V5.04zm13.792 4.9c0-1.071.901-1.924 1.983-1.946v7.875H7.797c0-1.05.88-1.925 1.983-1.925h2.727L8.135 9.7V6.966l5.792 5.621V9.941z' />
                    </g>
                );
                break;
            case 'expirymiss':
                IconType = (
                    <g fill='none' fillRule='evenodd'>
                        <path className='color1-fill' d='M11.628169 8.36056338l4.1239437-4.12394366L11.6056338.09014085c-.7661972.78873239-.7661972 2.02816901 0 2.8169014l.3380282.33802817H6.8056338v1.98309859h5.1380282l-.315493.31549296c-.7887324.76619718-.7887324 2.02816902 0 2.81690141z' fill='#336' />
                        <path d='M.04507042 6.28732394h9.64507043v1.9830986H.04507042v-1.9830986zm15.77464788.02253521v1.96056339h-1.9605634l1.9605634-1.96056339zM.04507042 13.971831H15.8197183v1.9830986H.04507042V13.971831z' fill='#F93' />
                    </g>
                );
                break;
            case 'expiryrange':
                IconType = (
                    <g fill='none' fillRule='evenodd'>
                        <path className='color1-fill' d='M6.76056338 8.92394366H12.056338l-.5859155.58591549c-.7661971.76619715-.7661971 2.02816905 0 2.81690145l4.3943662-4.39436623-4.3492957-4.34929578c-.7661972.7887324-.7661972 2.02816902 0 2.81690141l.540845.54084507H6.76056338v1.98309859z' fill='#336' />
                        <path d='M.13521127.06760563H15.9098592v1.9830986H.13521127V.06760563zm0 13.76901407H15.9098592v1.9830986H.13521127v-1.9830986z' fill='#F93' />
                    </g>
                );
                break;
            case 'expiryrangee':
                IconType = (
                    <g className='color1-fill' fill='#2A3052'fillRule='evenodd'><rect transform='rotate(180 8 5)' y='4.5' width='16' height='1' rx='.5' />
                        <rect transform='rotate(180 8 11)' y='10.5' width='16' height='1' rx='.5' />
                        <g fillRule='nonzero'>
                            <path d='M13.646 9.146a.5.5 0 1 0 .708.708l1.5-1.5a.5.5 0 0 0 0-.708l-1.5-1.5a.5.5 0 1 0-.708.708L14.793 8l-1.147 1.146z' />
                            <path d='M15.5 7.5h-5a.5.5 0 0 0 0 1h5a.5.5 0 1 0 0-1z' />
                        </g>
                    </g>
                );
                break;
            case 'lbfloatcall':
                IconType = (
                    <g fill='none' fillRule='evenodd'><path d='M0-2h16v16H0z' />
                        <path className='color1-fill' d='M12.3267606.109375h1.9830986V10.89375h-1.9830986V.109375zM.09014085 11.965625H15.8647887v1.925H.09014085v-1.925zM9.28450704 6.08125v-1.225L5.02535211 8.925V6.234375L7.84225352 3.54375H6.69295775c-1.10422536 0-1.9830986-.875-1.9830986-1.925h6.55774645v6.409375c-1.1042253-.021875-1.98309856-.875-1.98309856-1.946875z' fill='#336' />
                        <path d='M2.95211268 10.89375H.09014085V8.946875H5.0028169z' fill='#F93' />
                    </g>
                );
                break;
            case 'lbfloatput':
                IconType = (
                    <g fill='none' fillRule='evenodd'>
                        <path d='M0 0h16v16H0z' />
                        <path className='color1-fill' d='M12.3042254 3.084375h1.9830985V13.86875h-1.9830985V3.084375zM.04507042.0875H15.8197183v1.925H.04507042V.0875zm9.1943662 7.83125c0-1.071875.90140848-1.946875 2.00563378-1.946875v6.409375H4.66478873c0-1.05.87887324-1.925 1.98309859-1.925H7.7971831L4.98028169 7.765625V5.075l4.25915493 4.06875v-1.225z' fill='#336' />
                        <path fill='#F93' d='M2.92957746 3.10625H.04507042v1.925h4.91267606z' />
                    </g>
                );
                break;
            case 'lbhighlow':
                IconType = (
                    <g fill='none' fillRule='evenodd'>
                        <path className='color1-fill' d='M12.3943662 3.17746479h1.9830986v9.57746481h-1.9830986V3.17746479zM.13521127 13.9042254H15.9098592v1.9830985H.13521127v-1.9830985zm0-13.81408455H15.9098592v1.98309859H.13521127V.09014084zm4.61971831 3.06478873h6.55774652v6.58028169c-1.0816902 0-1.98309864-.87887324-1.98309864-1.98309859V6.49014085L5.02535211 10.7267606V7.95492958l2.86197183-2.81690141H6.73802817c-1.08169014 0-1.98309859-.87887324-1.98309859-1.98309859z' fill='#336' />
                        <path d='M.13521127 10.7492962V12.75493H2.9971831l2.02816901-2.0056338z' fill='#F93' />
                    </g>
                );
                break;
            case 'notouch':
                IconType = (
                    <g fill='none' fillRule='evenodd'>
                        <path className='transparent' d='M0 0h16v16H0z' />
                        <path className='color1-fill' fill='#2A3052'd='M.068.07h15.774V2.1H.068V.07zm13.769 8.007c0-1.13.878-2.03 1.983-2.054v6.646H9.33c0-1.107.878-2.03 1.983-2.03h1.104L9.059 7.2l-5.363 5.515V9.831l5.363-5.516 4.778 4.893V8.077z' />
                        <path className='color2-fill important' fill='#F93' d='M.068 12.692v2.123h1.6l2.05-2.123z' />
                    </g>
                );
                break;
            case 'onetouch':
                IconType = (
                    <g fill='none' fillRule='evenodd'>
                        <path className='transparent' d='M0 0h16v16H0z' />
                        <path className='color1-fill' fill='#2A3052'd='M11.989 2.1h1.983V.07h1.96V2.1h-1.938v7.408c-1.081 0-1.983-.9-1.983-2.031V5.585l-6.94 7.107V9.785l5.52-5.654H8.745c-1.082 0-1.983-.9-1.983-2.031H.158V.07h11.83V2.1z' />
                        <path className='color2-fill important' fill='#F93' d='M.158 12.692v2.123H3.02l2.05-2.123z' />
                    </g>
                );
                break;
            case 'put_barrier':
                IconType = (
                    <g fill='none' fillRule='evenodd'>
                        <path className='transparent' d='M0 0h16v16H0z' />
                        <path className='color1-fill' fill='#2A3052'd='M10.14 8.706l3.787 3.794v-2.326h1.983v5.713H8.248c0-1.084.879-1.987 1.983-1.987h2.276L7.324 8.706H.135V6.72H15.91v1.987h-5.77z' />
                        <path className='color2-fill important' fill='#F93' d='M3.515 2.113H.135V5.5h2.073V3.626L4.078 5.5h2.818z' />
                    </g>
                );
                break;
            case 'pute':
            case 'put' :
                IconType = (
                    <g fill='none' fillRule='evenodd'>
                        <path className='transparent' d='M0 0h16v16H0z' />
                        <path className='color1-fill' fill='#2A3052'd='M8.631 14.862c0-1.131.901-2.031 1.983-2.031h1.848L4.912 5.1V2.215l8.97 9.185V9.508c0-1.131.901-2.031 1.983-2.031v7.408H8.63v-.023z' />
                        <path className='color2-fill important' fill='#F93' d='M.045 2.215V.092h2.817l2.05 2.123z' />
                    </g>
                );
                break;
            case 'range':
                IconType = (
                    <g fill='none' fillRule='evenodd'>
                        <path className='color1-fill' d='M7.81971831 9.01408451H7.7971831V7.03098592h4.2366197l-.5408451-.54084507c-.7661971-.7887324-.7661971-2.02816902 0-2.81690141l4.371831 4.34929577-4.3943662 4.39436619c-.7661971-.7887324-.7661971-2.028169 0-2.8169014l.5859155-.58591549H7.81971831zm-3.10985916-2.7943662h1.9830986v3.56056338h-1.9830986V6.21971831zM.13521127.15774648H15.9098592v1.98309859H.13521127V.15774647zm0 13.76901412H15.9098592v1.9830986H.13521127v-1.9830986z' fill='#336' />
                        <path fill='#F93' d='M.13521127 7.0084507h3.51549296v1.98309859H.13521127z' />
                    </g>
                );
                break;
            case 'resetcall':
                IconType = (
                    <g fill='none' fillRule='evenodd'>
                        <path d='M0 0h16v16H0z' />
                        <path className='color1-fill' fill='#2A3052' d='M5 9.39630839l2-2.00345125V0H5zM0 0h4v1.99619048H0zM7 16v-5.5906593l-2 1.9188191V16zM8.87087912 0c0 1.18801912.96307978 2.1510989 2.15109888 2.1510989h1.2527473L7 7.39285714v3.01648356l6.8489011-6.77472532v1.35989011c0 1.18801912.9630798 2.15109891 2.1510989 2.15109891V0H8.87087912z' />
                        <path fill='#F93' d='M0 11h3.33096617l2.08398134-2H0z' />
                        <path className='color1-fill' fill='#2A3052' d='M9 14h7v1.99619048H9zM0 14h4v1.99619048H0z' />
                    </g>
                );
                break;
            case 'resetput':
                IconType = (
                    <g fill='none' fillRule='evenodd'>
                        <path d='M0 0h16v16H0z' />
                        <path className='color1-fill' fill='#2A3052' d='M5 6.6036916l2 2.0034513V16H5zM0 16h4v-1.99619048H0zM7 0v5.59065934L5 3.67184015V0zM8.87087912 16c0-1.18801912.96307978-2.1510989 2.15109888-2.1510989h1.2527473L7 8.6071428V5.5906593l6.8489011 6.77472531V11.0054945c0-1.1880192.9630798-2.1510989 2.1510989-2.1510989V16H8.87087912z' />
                        <path fill='#F93' d='M0 5h3.33096617l2.08398134 2H0z' />
                        <path className='color1-fill' fill='#2A3052' d='M9 2h7V.00380952H9zM0 2h4V.00380952H0z' />
                    </g>
                );
                break;
            case 'runhigh':
                IconType = (
                    <g fill='none' fillRule='evenodd'>
                        <path d='M0 0h16v16H0z' />
                        <path className='color1-fill' fill='#2A3052' d='M10 8h1.99619048v8H10zM6 12h1.99619048v4H6z' />
                        <path fill='#F93' d='M0 11.287619h1.90625L4 9.28761905H0z' />
                        <path className='color1-fill' d='M5.37904762 0C5.38318978 1.09357012 6.26645384 1.98023135 7.36 1.98857143h1.15809524L4 6.47619048v2.78095238L9.96571429 3.36v1.28c0 1.10246556.89372491 1.99619048 1.99619051 1.99619048V.03047619L5.37904762 0zM14 0h1.99619048v16H14zM2 14h1.99619048v1.99619048H2z' fill='#2A3052' />
                    </g>
                );
                break;
            case 'runlow':
                IconType = (
                    <g fill='none' fillRule='evenodd'>
                        <path d='M0 0h16v16H0z' />
                        <path className='color1-fill' fill='#2A3052' d='M0 0h1.99619048v16H0zM4 5h1.99619048v11H4zM8 13h1.99619048v3H8zM12 14h1.99619048v1.99619048H12z' />
                        <path fill='#F93' d='M4 2V0h1.79876797L8 2z' />
                        <path className='color1-fill' d='M9.36380952 11.28c0-1.0982577.89031378-1.98857143 1.98857148-1.98857143h1.1580952L8 4.78095238V2l5.9657143 5.89714286V6.64761905c-.0020258-.5287208.2065892-1.03648127.5797385-1.41106024.3731492-.37457896.8801082-.58513412 1.4088329-.58513024v6.60571433L9.36380952 11.28z' fill='#2A3052' />
                    </g>
                );
                break;
            case 'tickhigh':
                IconType = (
                    <g fill='none' fillRule='evenodd'>
                        <path d='M0 0h16v16H0z' />
                        <path fill='#F93' d='M3 10.1060363l5-4.39964528V3L3 7.39914863z' />
                        <path className='color1-fill' d='M9.37473348 12c0-1.0697157.89686242-1.9368915 2.00319832-1.9368915h1.1609808L8 5.70639102V3l5.9968017 5.73336388V7.51494674C13.997096 6.44534895 14.893786 5.57833971 16 5.57805521V12H9.37473348zM9.92783367 0v.0005315L7.94473508 1.9649216 5.96163649.00053149V0H0v2h16V0zM0 14h16v2H0z' fill='#2A3052' />
                        <path d='M0 8.37966868l3 1.72636762V7.39914863C1.0481655 6.24719915.0481655 5.65792982 0 5.63134064v2.74832804z' fill='#F93' />
                    </g>
                );
                break;
            case 'ticklow':
                IconType = (
                    <g fill='none' fillRule='evenodd'>
                        <path d='M0 0h16v16H0z' />
                        <path fill='#F93' d='M3 5.8939637l5 4.39964528V13L3 8.6008514z' />
                        <path className='color1-fill' d='M9.37473348 4c0 1.0697157.89686242 1.9368915 2.00319832 1.9368915h1.1609808L8 10.29360898V13l5.9968017-5.73336388v1.21841714C13.997096 9.55465105 14.893786 10.42166029 16 10.42194479V4H9.37473348zM9.92783367 16v-.0005315l-1.98309859-1.9643901-1.98309859 1.9643901V16H0v-2h16v2zM0 2h16V0H0z' fill='#2A3052' fillRule='nonzero' />
                        <path d='M0 7.62033136L3 5.8939637v2.70688771C1.0481655 9.75280089.0481655 10.34207022 0 10.3686594V7.62033136z' fill='#F93' />
                    </g>
                );
                break;
            case 'upordown':
                IconType = (
                    <g fill='none' fillRule='evenodd'>
                        <path className='color1-fill' d='M8.24788732 6.28732394l4.14647888-4.14647887H10.884507c-.90140841 0-1.64507038-.72112676-1.64507038-1.64507042V.13521127h6.53521128v5.04788732h-1.9830986V3.53802817l-2.7492958 2.74929577h4.7774648v1.9830986H.04507042v-1.9830986h8.2028169zM.04507042 13.9492958H15.8197183v1.9830986H.04507042v-1.9830986z' fill='#336' />
                        <path fill='#F93' d='M4.43943662 10.1183099H.04507042v1.9830986h5.22816902l3.06478873-3.04225357H5.52112676z' />
                    </g>
                );
                break;
            default:
                IconType = (
                    <path fill='#B0B3BF' fillRule='evenodd' d='M7 10.4L7.4 9 8 7.9l1-1c.4-.5.6-1 .6-1.5 0-.6-.1-1-.4-1.3-.2-.3-.6-.4-1.2-.4-.5 0-.9.1-1.2.4-.3.3-.4.6-.4 1H5c0-.7.3-1.4.9-1.9.5-.5 1.2-.7 2.1-.7 1 0 1.7.3 2.2.8.5.5.8 1.1.8 2 0 .9-.4 1.7-1.2 2.6l-.8.8c-.4.4-.5 1-.5 1.7H7zm0 2.3c0-.2 0-.4.2-.5l.6-.3c.3 0 .5.1.6.3.2.1.2.3.2.5 0 .3 0 .4-.2.6l-.6.2c-.2 0-.4 0-.6-.2a.8.8 0 0 1-.2-.6z' />
                );
                break;
        }
    }
    return (
        <svg className={classNames('trade-type-icon', className)} width='16' height='16' viewBox='0 0 16 16'>
            {IconType}
        </svg>

    );
};

IconTradeType.propTypes = {
    className: PropTypes.string,
    type     : PropTypes.string,
};

export default IconTradeType;
