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
                        <path className='transparent' d='M0 16h16V0H0z' />
                        <path className='color1-fill' fill='#2A3052'd='M1 10.667h13.333V9.334H1zM1 6.667h13.333v-1H1zM1 4h13.333V3H1z' />
                        <path className='color1-fill' fill='#2A3052'fillRule='nonzero' d='M7.765 6.093l5.541 6.427-1.01.87-4.728-5.483L6.22 8.918l-4.737-5.83 1.034-.842 3.93 4.836z' />
                        <path className='color1-fill' fill='#2A3052'd='M13.576 13.6v-2.208l-1.006-1.007v2.19h-2.266l1.052 1.025z' />
                    </g>
                );
                break;
            case 'asianu':
                IconType = (
                    <g fill='none' fillRule='evenodd'>
                        <path className='transparent' d='M0 0h16v16H0z' />
                        <path className='color1-fill' fill='#2A3052'd='M1 5.333h13.333v1.333H1zM1 9.333h13.333v1H1zM1 12h13.333v1H1z' />
                        <path className='color1-fill' fill='#2A3052'fillRule='nonzero' d='M7.765 9.907l5.541-6.427-1.01-.87-4.728 5.483L6.22 7.082l-4.737 5.83 1.034.842 3.93-4.836z' />
                        <path className='color1-fill' fill='#2A3052'd='M13.576 2.4v2.208L12.57 5.615v-2.19h-2.266L11.356 2.4z' />
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
                    <g className='color1-fill' fill='#2A3052'fillRule='evenodd'><rect transform='rotate(180 8 5)' y='4.5' width='16' height='1' rx='.5' />
                        <rect transform='rotate(180 8 11)' y='10.5' width='16' height='1' rx='.5' />
                        <g fillRule='nonzero'><path d='M13.646 3.146a.5.5 0 1 0 .708.708l1.5-1.5a.5.5 0 0 0 0-.708l-1.5-1.5a.5.5 0 1 0-.708.708L14.793 2l-1.147 1.146z' />
                            <path d='M15.5 1.5h-5a.5.5 0 0 0 0 1h5a.5.5 0 1 0 0-1z' />
                        </g>
                    </g>
                );
                break;
            case 'expiryrange':
                IconType = (
                    <g className='color1-fill' fill='#2A3052'fillRule='evenodd'>
                        <rect transform='rotate(180 8 5)' y='4.5' width='16' height='1' rx='.5' />
                        <rect transform='rotate(180 8 11)' y='10.5' width='16' height='1' rx='.5' />
                        <g fillRule='nonzero'><path d='M13.646 9.146a.5.5 0 1 0 .708.708l1.5-1.5a.5.5 0 0 0 0-.708l-1.5-1.5a.5.5 0 1 0-.708.708L14.793 8l-1.147 1.146z' />
                            <path d='M15.5 7.5h-5a.5.5 0 0 0 0 1h5a.5.5 0 1 0 0-1z' />
                        </g>
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
                    <g fill='none' fillRule='evenodd'>
                        <path className='transparent' d='M0 16h16V0H0z' />
                        <path d='M.5 11a.5.5 0 0 0 0 1h15a.5.5 0 1 0 0-1H.5z' className='color1-fill' fill='#2A3052'fillRule='nonzero' />
                        <g className='color1-fill' fill='#2A3052'fillRule='nonzero'><path d='M12.5 9V3a.5.5 0 0 1 1 0v6a.5.5 0 0 1-1 0z' />
                            <path d='M13.021 8.586l1.061-1.06a.5.5 0 1 1 .707.706l-1.414 1.414a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.06 1.06zM13.021 3.172l1.061 1.06a.5.5 0 1 0 .707-.707l-1.414-1.414a.5.5 0 0 0-.707 0l-1.414 1.414a.5.5 0 0 0 .707.707l1.06-1.06z' />
                        </g>
                        <g className='color1-fill' fill='#2A3052'fillRule='nonzero'>
                            <path d='M.812 7.11a.5.5 0 0 0-.624.78l2.5 2a.5.5 0 0 0 .68-.05l6-6.5a.5.5 0 1 0-.735-.68L2.949 8.82.812 7.109z' />
                            <path d='M9 3v1.5a.5.5 0 1 0 1 0v-2a.5.5 0 0 0-.5-.5h-2a.5.5 0 1 0 0 1H9z' />
                        </g>
                    </g>
                );
                break;
            case 'lbfloatput':
                IconType = (
                    <g fill='none' fillRule='evenodd'>
                        <path className='transparent' d='M0 0h16v16H0z' />
                        <path d='M.5 5a.5.5 0 0 1 0-1h15a.5.5 0 1 1 0 1H.5z' className='color1-fill' fill='#2A3052'fillRule='nonzero' />
                        <g className='color1-fill' fill='#2A3052'fillRule='nonzero'>
                            <path d='M12.5 7v6a.5.5 0 0 0 1 0V7a.5.5 0 0 0-1 0z' />
                            <path d='M13.021 7.414l1.061 1.06a.5.5 0 1 0 .707-.706l-1.414-1.414a.5.5 0 0 0-.707 0l-1.414 1.414a.5.5 0 0 0 .707.707l1.06-1.06zM13.021 12.828l1.061-1.06a.5.5 0 1 1 .707.707l-1.414 1.414a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.06 1.06z' />
                        </g>
                        <g className='color1-fill' fill='#2A3052'fillRule='nonzero'>
                            <path d='M.812 8.89a.5.5 0 0 1-.624-.78l2.5-2a.5.5 0 0 1 .68.05l6 6.5a.5.5 0 1 1-.735.68L2.949 7.18.812 8.891z' />
                            <path d='M9 13v-1.5a.5.5 0 1 1 1 0v2a.5.5 0 0 1-.5.5h-2a.5.5 0 1 1 0-1H9z' />
                        </g>
                    </g>
                );
                break;
            case 'lbhighlow':
                IconType = (
                    <g fill='none' fillRule='evenodd'>
                        <path className='transparent' d='M0 0h16v16H0z' />
                        <path d='M.5 14a.5.5 0 1 1 0-1h15a.5.5 0 1 1 0 1H.5zM.5 3a.5.5 0 0 1 0-1h15a.5.5 0 1 1 0 1H.5z' className='color1-fill' fill='#2A3052'fillRule='nonzero' />
                        <g className='color1-fill' fill='#2A3052'fillRule='nonzero'>
                            <path d='M12.5 4.536v6.428c0 .296.224.536.5.536s.5-.24.5-.536V4.536C13.5 4.24 13.276 4 13 4s-.5.24-.5.536z' />
                            <path d='M13.021 4.914l1.061 1.06a.5.5 0 1 0 .707-.706l-1.414-1.414a.5.5 0 0 0-.707 0l-1.414 1.414a.5.5 0 0 0 .707.707l1.06-1.06zM13.021 11.088l1.061-1.06a.5.5 0 1 1 .707.707l-1.414 1.414a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.06 1.06z' />
                        </g>
                        <g className='color1-fill' fill='#2A3052'fillRule='nonzero'>
                            <path d='M9.496 6.5V8a.5.5 0 1 0 1 0V6a.5.5 0 0 0-.5-.5h-2a.5.5 0 1 0 0 1h1.5z' />
                            <path d='M5.246 10.923L3.486 3.88c-.125-.497-.826-.508-.967-.016l-2 7a.5.5 0 1 0 .962.274l1.487-5.204 1.547 6.188a.5.5 0 0 0 .87.2l5-6a.5.5 0 1 0-.77-.641l-4.369 5.243z' />
                        </g>
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
                        <path className='transparent' d='M0 0h16v16H0z' />
                        <rect className='color1-fill' fill='#2A3052'transform='rotate(180 8 11.5)' y='11' width='16' height='1' rx='.5' />
                        <rect className='color1-fill' fill='#2A3052'transform='rotate(180 8 4.5)' y='4' width='16' height='1' rx='.5' />
                        <path d='M12.646 9.146a.5.5 0 0 0 .708.708l1.5-1.5a.5.5 0 0 0 0-.708l-1.5-1.5a.5.5 0 0 0-.708.708L13.793 8l-1.147 1.146z' className='color1-fill' fill='#2A3052'fillRule='nonzero' />
                        <path d='M11.167 7.5L9.3 6.1a.5.5 0 0 0-.716.123L6.955 8.665 4.885 6.18a.5.5 0 0 0-.739-.034L2.293 8H.5a.5.5 0 0 0 0 1h2a.5.5 0 0 0 .354-.146L4.466 7.24l2.15 2.58a.5.5 0 0 0 .8-.044l1.707-2.56L10.7 8.4a.5.5 0 0 0 .3.1h3.5a.5.5 0 1 0 0-1h-3.333z' className='color1-fill' fill='#2A3052'fillRule='nonzero' />
                    </g>
                );
                break;
            case 'upordown':
                IconType = (
                    <g fill='none' fillRule='evenodd'>
                        <path className='transparent' d='M0 0h16v16H0z' />
                        <rect className='color1-fill' fill='#2A3052'transform='rotate(180 8 12)' y='11.5' width='16' height='1' rx='.5' />
                        <rect className='color1-fill' fill='#2A3052'transform='rotate(180 8 5)' y='4.5' width='16' height='1' rx='.5' />
                        <path d='M13.277 3.772a.5.5 0 0 0 .966-.259l-.55-2.049a.5.5 0 0 0-.612-.353l-2.049.549a.5.5 0 0 0 .259.966l1.566-.42.42 1.566z' className='color1-fill' fill='#2A3052'fillRule='nonzero' />
                        <path d='M4.876 6.17a.5.5 0 0 0-.766.018L2.26 8.5H.5a.5.5 0 0 0 0 1h2a.5.5 0 0 0 .39-.188L4.517 7.28l3.107 3.55a.5.5 0 0 0 .807-.075l5-8.5a.5.5 0 0 0-.862-.508L7.92 9.65 4.876 6.17z' className='color1-fill' fill='#2A3052'fillRule='nonzero' />
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

export { IconTradeType };
