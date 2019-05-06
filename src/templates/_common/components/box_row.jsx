import React             from 'react';
import { SeparatorLine } from './separator_line.jsx';

export const BoxRow = ({ children, top_row, bottom_row, no_border }) => {
    const children_count = React.Children.count(children);
    if (12 % children_count !== 0) {
        throw new Error(`BoxRow is given an invalid number of children - ${children_count}!`);
    }
    const box_class_name = `gr-${12 / children_count}`;
    const class_list = ['box-row', 'gr-row'];
    if (top_row)    class_list.push('box-row--top');
    if (bottom_row) class_list.push('box-row--bottom');
    if (no_border)  class_list.push('box-row--no-border');
    return (
        <div className={class_list.join(' ')}>
            {React.Children.map(children, child =>
                React.cloneElement(child, { class_name: box_class_name }))}
        </div>
    );
};

export const Box = ({ img_src, title, text, class_name = '' }) => (
    <div className={`box-row__box gr-12-m center-text gr-padding-30 ${class_name}`}>
        {!!img_src && <img className='gr-centered box-row__img' src={img_src} alt={title} />}
        {!!title   && <p><strong>{title}</strong></p>}
        {!!text    && <p>{text}</p>}
    </div>
);

export const BoxOverlayImage = ({ img_src, text, title, alignment = 'left' }) => (
    <div className='box-overlay-image gr-row gr-centered'>
        <div className='gr-12 gr-padding-10'>
            <div className={`box-wrapper ${alignment}`}>
                <div className='box-img'>
                    <img className='responsive' src={img_src} />
                </div>
                <div className='box-content'>
                    <h4 className='box-header'>{title}</h4>
                    <SeparatorLine no_wrapper sub_class='box-headerline' />
                    <p className='box-text'>{text}</p>
                </div>
            </div>
        </div>
    </div>
);
