import classNames from 'classnames';
import PropTypes  from 'prop-types';
import React      from 'react';

const IconCountryFlag = ({ type, className }) => {
    let IconCountry;
    if (type) {
        switch (type) {
            case 'de':
                IconCountry = (
                    <React.Fragment>
                        <defs>
                            <rect id='a' width='24' height='16' rx='2' />
                        </defs>
                        <g fill='none' fillRule='evenodd'>
                            <mask id='b' fill='#fff'>
                                <use xlinkHref='#a' />
                            </mask>
                            <path fill='#333' mask='url(#b)' d='M0 0h24v5H0z' />
                            <path fill='#FFCD00' mask='url(#b)' d='M0 11h24v5H0z' />
                            <path fill='#F10000' mask='url(#b)' d='M0 5h24v6H0z' />
                            <rect strokeOpacity='.04' stroke='#000' mask='url(#b)' x='.5' y='.5' width='23' height='15' rx='2' />
                        </g>
                    </React.Fragment>
                );
                break;
            case 'es':
                IconCountry = (
                    <React.Fragment>
                        <defs>
                            <rect id='a' width='24' height='16' rx='2' />
                        </defs>
                        <g fill='none' fillRule='evenodd'>
                            <mask id='b' fill='#fff'>
                                <use xlinkHref='#a' />
                            </mask>
                            <path fill='#DD172C' mask='url(#b)' d='M0 0h24v4H0zm0 12h24v4H0z' />
                            <path fill='#FFD133' mask='url(#b)' d='M0 4h24v8H0z' />
                            <g mask='url(#b)'>
                                <path fill='#FFEDB1' d='M5.333 7.333h1.334V8H5.333z' />
                                <path d='M4.054 7.3l.167 2.007a1.138 1.138 0 0 0 1.112 1.026c.566 0 1.065-.461 1.112-1.026L6.613 7.3c.014-.174-.105-.3-.288-.3H4.341c-.176 0-.301.133-.287.3z' stroke='#A41517' strokeWidth='.667' />
                                <path fill='#A41517' d='M4 8h2.667v.667H6L5.333 10l-.666-1.333H4zM2 6h1.333v4.667H2zm5.333 0h1.333v4.667H7.333zM4 5.333c0-.368.306-.666.673-.666h1.32c.372 0 .674.296.674.666v.33A.33.33 0 0 1 6.34 6H4.327A.327.327 0 0 1 4 5.664v-.33z' />
                            </g>
                            <rect strokeOpacity='.04' stroke='#000' mask='url(#b)' x='.5' y='.5' width='23' height='15' rx='2' />
                        </g>
                    </React.Fragment>
                );
                break;
            case 'fr':
                IconCountry = (
                    <React.Fragment>
                        <defs>
                            <rect id='a' width='24' height='16' rx='2' />
                        </defs>
                        <g fill='none' fillRule='evenodd'>
                            <mask id='b' fill='#fff'>
                                <use xlinkHref='#a' />
                            </mask>
                            <path fill='#001F9B' mask='url(#b)' d='M0 0h8v16H0z' />
                            <path fill='#FF002D' mask='url(#b)' d='M16 0h8v16h-8z' />
                            <path fill='#FFF' mask='url(#b)' d='M8 0h8v16H8z' />
                            <rect strokeOpacity='.04' stroke='#000' mask='url(#b)' x='.5' y='.5' width='23' height='15' rx='2' />
                        </g>
                    </React.Fragment>
                );
                break;
            case 'id':
                IconCountry = (
                    <React.Fragment>
                        <defs>
                            <rect id='a' width='24' height='16' rx='2' />
                        </defs>
                        <g fill='none' fillRule='evenodd'>
                            <mask id='b' fill='#fff'>
                                <use xlinkHref='#a' />
                            </mask>
                            <path fill='#E12237' mask='url(#b)' d='M0 0h24v8H0z' />
                            <path fill='#FFF' mask='url(#b)' d='M0 8h24v8H0z' />
                            <rect strokeOpacity='.04' stroke='#000' mask='url(#b)' x='.5' y='.5' width='23' height='15' rx='2' />
                        </g>
                    </React.Fragment>
                );
                break;
            case 'it':
                IconCountry = (
                    <React.Fragment>
                        <defs>
                            <rect id='a' width='24' height='16' rx='2' />
                        </defs>
                        <g fill='none' fillRule='evenodd'>
                            <mask id='b' fill='#fff'>
                                <use xlinkHref='#a' />
                            </mask>
                            <path fill='#1BB65D' mask='url(#b)' d='M0 0h8v16H0z' />
                            <path fill='#E43D4C' mask='url(#b)' d='M16 0h8v16h-8z' />
                            <path fill='#FFF' mask='url(#b)' d='M8 0h8v16H8z' />
                            <rect strokeOpacity='.04' stroke='#000' mask='url(#b)' x='.5' y='.5' width='23' height='15' rx='2' />
                        </g>
                    </React.Fragment>
                );
                break;
            case 'pl':
                IconCountry = (
                    <g fill='none' fillRule='evenodd'>
                        <g fillRule='nonzero'>
                            <path d='M0 14.16c0 1.01.805 1.827 1.797 1.827h20.406c.992 0 1.797-.818 1.797-1.826V8H0v6.16z' fill='#F44336' />
                            <path d='M22.203.013H1.797C.805.013 0 .831 0 1.84V8h24V1.84C24 .83 23.195.012 22.203.012z' fill='#FFF' />
                        </g>
                        <rect strokeOpacity='.04' stroke='#000' x='.5' y='.5' width='23' height='15' rx='2' />
                    </g>
                );
                break;
            case 'pt':
                IconCountry = (
                    <React.Fragment>
                        <defs>
                            <rect id='a' width='24' height='16' rx='2' />
                        </defs>
                        <g fill='none' fillRule='evenodd'>
                            <mask id='b' fill='#fff'>
                                <use xlinkHref='#a' />
                            </mask>
                            <path fill='#128415' mask='url(#b)' d='M0 0h8v16H0z' />
                            <path fill='#FF2936' mask='url(#b)' d='M8 0h16v16H8z' />
                            <circle stroke='#FAF94F' mask='url(#b)' cx='8' cy='8' r='3.5' />
                            <g mask='url(#b)'>
                                <path d='M6.5 6.341c0-.188.145-.341.333-.341h2.334c.184 0 .333.152.333.341v2.327C9.5 9.404 8.907 10 8.175 10h-.35C7.093 10 6.5 9.41 6.5 8.668V6.341z' fill='#FFF' />
                                <path d='M8 8.92c.414 0 .75-1.086.75-1.5a.75.75 0 1 0-1.5 0c0 .414.336 1.5.75 1.5z' fill='#1D50B5' />
                            </g>
                            <rect strokeOpacity='.04' stroke='#000' mask='url(#b)' x='.5' y='.5' width='23' height='15' rx='2' />
                        </g>
                    </React.Fragment>
                );
                break;
            case 'ru':
                IconCountry = (
                    <React.Fragment>
                        <defs>
                            <rect id='a' width='24' height='16' rx='2' />
                        </defs>
                        <g fill='none' fillRule='evenodd'>
                            <mask id='b' fill='#fff'>
                                <use xlinkHref='#a' />
                            </mask>
                            <path fill='#FFF' mask='url(#b)' d='M0 0h24v5H0z' />
                            <path fill='#E53B35' mask='url(#b)' d='M0 11h24v5H0z' />
                            <path fill='#0C47B7' mask='url(#b)' d='M0 5h24v6H0z' />
                            <rect strokeOpacity='.04' stroke='#000' mask='url(#b)' x='.5' y='.5' width='23' height='15' rx='2' />
                        </g>
                    </React.Fragment>
                );
                break;
            case 'th':
                IconCountry = (
                    <React.Fragment>
                        <defs>
                            <rect id='a' width='24' height='16' rx='2' />
                        </defs>
                        <g fill='none' fillRule='evenodd'>
                            <mask id='b' fill='#fff'>
                                <use xlinkHref='#a' />
                            </mask>
                            <use fill='#F12532' xlinkHref='#a' />
                            <path fill='#FFF' mask='url(#b)' d='M0 3h24v10H0z' />
                            <path fill='#322B6C' mask='url(#b)' d='M0 5h24v6H0z' />
                            <rect strokeOpacity='.04' stroke='#000' mask='url(#b)' x='.5' y='.5' width='23' height='15' rx='2' />
                        </g>
                    </React.Fragment>
                );
                break;
            case 'vi':
                IconCountry = (
                    <React.Fragment>
                        <defs>
                            <rect id='a' width='24' height='16' rx='2' />
                        </defs>
                        <g fill='none' fillRule='evenodd'>
                            <mask id='b' fill='#fff'>
                                <use xlinkHref='#a' />
                            </mask>
                            <use fill='#EA403F' xlinkHref='#a' />
                            <path fill='#FFFE4E' mask='url(#b)' d='M12 10.45l-2.939 2.095 1.084-3.442-2.9-2.148 3.609-.033L12 3.5l1.146 3.422 3.61.033-2.901 2.148 1.084 3.442z' />
                            <rect strokeOpacity='.04' stroke='#000' mask='url(#b)' x='.5' y='.5' width='23' height='15' rx='2' />
                        </g>
                    </React.Fragment>
                );
                break;
            case 'zh_cn':
                IconCountry = (
                    <React.Fragment>
                        <defs>
                            <rect id='a' width='24' height='16' rx='2' />
                        </defs>
                        <g fill='none' fillRule='evenodd'>
                            <mask id='b' fill='#fff'>
                                <use xlinkHref='#a' />
                            </mask>
                            <rect strokeOpacity='.04' stroke='#000' fill='#ED3C3C' mask='url(#b)' x='.5' y='.5' width='23' height='15' rx='2' />
                            <path d='M7.742 7.186h1.04V13h-1.04V7.186zm7.453 5.77h-.952l-.255-.927.996.032c.244 0 .366-.161.366-.474V6.883h-4.11v-.938h5.15v5.922c0 .723-.399 1.09-1.196 1.09zM9.968 7.64h4.175v4.207H9.968V7.639zm3.2 3.355v-.863h-2.203v.863h2.203zM10.965 9.31h2.203v-.842h-2.203v.842zM9.082 5.503c.576.496 1.019.938 1.329 1.327l-.775.517c-.333-.41-.776-.863-1.33-1.38l.776-.464zm-.3-.874a7.406 7.406 0 0 1-.896 1.23L7 5.298C7.664 4.586 8.13 3.82 8.417 3l1.02.216c-.067.183-.145.356-.211.518h2.746v.895h-1.461c.232.324.42.636.564.917l-.93.334a9.512 9.512 0 0 0-.73-1.251h-.632zm4.707 0a6.6 6.6 0 0 1-.686 1.068l-.886-.561c.543-.658.93-1.37 1.152-2.125l1.007.216c-.066.172-.121.345-.177.507H17v.895h-1.661c.21.291.387.572.531.83l-.93.335a9.04 9.04 0 0 0-.697-1.165h-.754z' fill='#FFF' mask='url(#b)' />
                        </g>
                    </React.Fragment>
                );
                break;
            case 'zh_tw':
                IconCountry = (
                    <React.Fragment>
                        <defs>
                            <rect id='a' width='24' height='16' rx='2' />
                        </defs>
                        <g fill='none' fillRule='evenodd'>
                            <mask id='b' fill='#fff'>
                                <use xlinkHref='#a' />
                            </mask>
                            <rect strokeOpacity='.04' stroke='#000' fill='#ED3C3C' mask='url(#b)' x='.5' y='.5' width='23' height='15' rx='2' />
                            <path d='M8.602 4.413c-.13.151-.26.302-.38.432h3.605c0 .431-.011.83-.033 1.175h.617v.648h-.67l-.098.68h.444v.528h-.563c-.022.065-.033.119-.054.173l.314.237c-.585.291-1.18.54-1.786.744a165.06 165.06 0 0 1 2.23-.075c.454-.227.908-.475 1.374-.734l.725.475a18.267 18.267 0 0 1-4.091 1.683 126.13 126.13 0 0 0 4.177-.248c-.238-.173-.487-.356-.746-.53l.725-.441c1.028.647 1.818 1.208 2.37 1.704l-.812.561a12.63 12.63 0 0 0-.768-.69c-.93.054-1.818.108-2.663.15v1.263c0 .56-.335.852-.995.852h-1.018l-.173-.82c.314.033.617.054.899.054.205 0 .313-.108.313-.302v-1.003c-1.287.065-2.478.108-3.56.14l-.217-.841c.282.01.552.021.823.021.78-.162 1.59-.42 2.446-.766l-2.468.087-.151-.712c.368 0 .617-.033.768-.097a12.58 12.58 0 0 0 1.44-.637c.021-.086.054-.173.075-.248H7.574c.075-.41.14-.81.205-1.208h-.703V6.02h.779c.043-.312.076-.614.097-.916a6.4 6.4 0 0 1-.422.366L7 4.834c.595-.442 1.115-1.047 1.548-1.823l.844.183c-.098.173-.195.345-.292.507h3.181v.712h-3.68zm0 2.168l-.13.766h1.656a7.341 7.341 0 0 0-1.147-.41l.227-.356h-.606zm1.558.766h.671a9.43 9.43 0 0 0 .13-.766h-1.71c.422.12.8.249 1.147.4l-.238.366zm.844-1.219l.033-.766H8.742c-.021.26-.054.518-.086.766h1.504a6.009 6.009 0 0 0-1.017-.399l.249-.356c.39.108.757.26 1.093.432l-.206.323h.725zm2.587-1.337a3.23 3.23 0 0 0 .941 1.424c.347-.41.617-.885.79-1.424h-1.731zm.335 1.985a4.244 4.244 0 0 1-.876-1.316 7.07 7.07 0 0 1-.52.582l-.54-.647c.562-.583 1.049-1.381 1.46-2.395l.877.194c-.108.28-.227.54-.346.788h2.813v.809h-.627c-.195.776-.52 1.413-.953 1.93.498.324 1.093.594 1.786.82l-.465.81c-.78-.28-1.429-.615-1.948-1.004-.542.432-1.202.745-1.96.95l-.475-.745c.714-.172 1.298-.431 1.774-.776zm-.173 4.347c1.082.259 2.078.583 2.976.97l-.519.81a16.903 16.903 0 0 0-2.965-1.025l.508-.755zm-3.798.043l.54.615c-.8.453-1.785.83-2.943 1.133l-.379-.799c1.126-.237 2.056-.56 2.782-.949z' fill='#FFF' mask='url(#b)' />
                        </g>
                    </React.Fragment>
                );
                break;
            default: // en
                IconCountry = (
                    <g fill='none' fillRule='evenodd'>
                        <g fillRule='nonzero'>
                            <path d='M22.203.013H1.797C.805.013 0 .831 0 1.84v12.322c0 1.008.805 1.826 1.797 1.826h20.406c.992 0 1.797-.818 1.797-1.826V1.839C24 .831 23.195.013 22.203.013z' fill='#0D47A1' />
                            <path d='M23.975 1.537A1.806 1.806 0 0 0 22.203.013h-.468l-7.666 5.102V.013H9.931v5.102L2.265.013h-.468C.906.013.167.673.025 1.537l6.552 4.361H0v4.204h6.577l-6.552 4.36a1.806 1.806 0 0 0 1.772 1.525h.468l7.666-5.102v5.102h4.138v-5.102l7.666 5.102h.468c.891 0 1.63-.66 1.772-1.524l-6.552-4.361H24V5.898h-6.577l6.552-4.36z' fill='#FFF' />
                            <path d='M13.241.013V6.74H24v2.52H13.241v6.726H10.76V9.26H0V6.74h10.759V.013h2.482zM1.162 15.87a1.8 1.8 0 0 1-.73-.52l7.956-5.247h1.52L1.162 15.87zm15.075-5.767l7.527 4.963a1.82 1.82 0 0 1-.576.623l-8.471-5.586h1.52zM.19 1.022C.316.767.5.545.725.374l8.378 5.525h-1.52L.19 1.023zm15.399 4.876h-1.52L22.824.125a1.8 1.8 0 0 1 .735.517l-7.97 5.256z' fill='#F44336' />
                        </g>
                        <rect strokeOpacity='.04' stroke='#000' x='.5' y='.5' width='23' height='15' rx='2' />
                    </g>
                );
                break;
        }
    }
    return (
        <svg className={classNames('inline-icon', className)} width='24' height='16' viewBox='0 0 24 16'>
            {IconCountry}
        </svg>

    );
};

IconCountryFlag.propTypes = {
    className: PropTypes.string,
    type     : PropTypes.string,
};

export default IconCountryFlag;
