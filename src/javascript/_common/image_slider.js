const getElementById     = require('./common_functions').getElementById;
const applyToAllElements = require('./utility').applyToAllElements;

const ImageSlider = (() => {
    let slider,
        slider_els,
        go_back,
        go_next,
        curr_slide;

    const init = () => {
        slider = getElementById('image_slider');

        if (slider) {
            go_back    = getElementById('go_back');
            go_next    = getElementById('go_next');
            slider_els = document.querySelectorAll('#slider_wrapper .slider-image');
            curr_slide = 0;

            if (slider_els && slider_els.length) {
                slider_els[curr_slide].classList.remove('invisible');
                slider.classList.remove('invisible');
            }

            if (go_back && go_next) {
                go_back.addEventListener('click', goLeft);
                go_next.addEventListener('click', goRight);
            }
        }
    };

    const hideAll = (el) => {
        applyToAllElements(el, (element) => {
            element.classList.add('invisible');
        });
    };

    const goLeft = () => {
        curr_slide = curr_slide === 0 ? slider_els.length - 1 : curr_slide - 1;
        hideAll(slider_els);
        slider_els[curr_slide].classList.remove('invisible');

    };

    const goRight = () => {
        curr_slide = curr_slide === slider_els.length - 1 ? 0 : curr_slide + 1;
        hideAll(slider_els);
        slider_els[curr_slide].classList.remove('invisible');
    };

    const onUnMount = () => {
        if (go_back && go_next) {
            go_back.removeEventListener('click', goLeft);
            go_back.removeEventListener('click', goRight);
        }
    };

    return {
        init,
        onUnMount,
    };
})();

module.exports = ImageSlider;
