import React from 'react';

const ImageSlider = ({ id, className, images }) => (
    <div id={id} className={className}>
        <div id='image_slider' className='image-slider gr-row gr-row-align-center invisible'>
            <div id='go_back' className='align-self-center gr-1'>
                <img src={it.url_for('images/pages/home/arrow_left.svg')} />
            </div>
            <div className='gr-10 no-scroll'>
                <ul id='slider_wrapper' className='slider-wrapper'>
                    {images.map((image, idx) => (
                        <li key={idx} className='slider-image invisible'>
                            <img className='responsive' src={it.url_for(image.url)} />
                            {!!image.caption &&
                            <div className='image-caption'>
                                <p>{image.caption}</p>
                            </div>
                            }
                        </li>
                    ))}
                </ul>
            </div>
            <div id='go_next' className='align-self-center gr-1'>
                <img src={it.url_for('images/pages/home/arrow_right.svg')} />
            </div>
        </div>
    </div>
);

export default ImageSlider;
