const DigitTicker = (() => {
    let barrier,
        el_container,
        el_peek,
        el_peek_box,
        el_mask,
        total_tick_count,
        contract_status,
        type,
        current_spot;
    let style_offset_correction = 5;

    const array_of_digits         = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

    const init = (container_id, contract_type, shortcode, tick_count, status = 'open') => {
        contract_status      = status;
        total_tick_count     = tick_count;
        type                 = contract_type;
        current_spot         = '-';
        el_container         = document.querySelector(`#${container_id}`);

        setBarrierFromShortcode(type, shortcode);
        populateContainer(el_container);
        highlightWinningNumbers(getWinningNumbers(contract_type, barrier));
        observeResize();
    };

    const populateContainer = (container_element) => {
        // remove previous elements and start fresh.
        while (container_element && container_element.firstChild) {
            container_element.removeChild(container_element.firstChild);
        }

        const temp_epoch_el = document.createElement('div');
        temp_epoch_el.classList.add('epoch');
        const temp_peek_box_el = document.createElement('div');
        temp_peek_box_el.classList.add('peek-box');
        if (contract_status === 'won') {
            temp_peek_box_el.classList.add('digit-winning');
        }
        if (contract_status === 'lost') {
            temp_peek_box_el.classList.add('digit-losing');
        }

        const temp_digits_el = document.createElement('div');
        temp_digits_el.classList.add('digits');
        array_of_digits.forEach(digit => {
            const digit_el = document.createElement('div');
            digit_el.classList.add('digit', `digit-${digit}`);
            digit_el.appendChild(document.createTextNode(digit));
            temp_digits_el.appendChild(digit_el);
        });

        const temp_mask_el = document.createElement('div');
        temp_mask_el.classList.add('mask');
        temp_mask_el.append(document.createTextNode('0 / 0'));

        const temp_peek_el = document.createElement('div');
        temp_peek_el.classList.add('peek');
        // grid peek-box element definition
        const topleft_el = document.createElement('div');
        topleft_el.classList.add('topleft');
        const top_el = document.createElement('div');
        top_el.classList.add('top');
        const topright_el = document.createElement('div');
        topright_el.classList.add('topright');
        const left_el = document.createElement('div');
        left_el.classList.add('left');
        const right_el = document.createElement('div');
        right_el.classList.add('right');
        const bottomleft_el = document.createElement('div');
        bottomleft_el.classList.add('bottomleft');
        const bottom_el = document.createElement('div');
        bottom_el.classList.add('bottom');
        const bottomright_el = document.createElement('div');
        bottomright_el.classList.add('bottomright');
        temp_peek_box_el.appendChild(topleft_el);
        temp_peek_box_el.appendChild(top_el);
        temp_peek_box_el.appendChild(topright_el);
        temp_peek_box_el.appendChild(left_el);
        temp_peek_box_el.appendChild(right_el);
        temp_peek_box_el.appendChild(bottomright_el);
        temp_peek_box_el.appendChild(bottomleft_el);
        temp_peek_box_el.appendChild(bottom_el);
        temp_peek_box_el.appendChild(temp_mask_el);
        temp_peek_box_el.appendChild(temp_peek_el);

        const fragment = document.createDocumentFragment();
        fragment.appendChild(temp_epoch_el);
        fragment.appendChild(temp_peek_box_el);
        fragment.appendChild(temp_digits_el);
        container_element.appendChild(fragment);
        container_element.classList.add('invisible');
    };

    // adjust box sizes for mobile
    const adjustBoxSizes = () => {
        if (el_container.offsetWidth < 360) {
            style_offset_correction = 6;
        }
    };

    // Detect winning numbers against the barrier with the given contract type.
    const getWinningNumbers = (contract_type, spot) => {
        switch (contract_type) {
            case 'DIGITOVER':
                return array_of_digits.filter(digit => +digit > +spot);
            case 'DIGITUNDER':
                return array_of_digits.filter(digit => +digit < +spot);
            case 'DIGITMATCH':
                return array_of_digits.filter(digit => +digit === +spot);
            case 'DIGITDIFF':
                return array_of_digits.filter(digit => +digit !== +spot);
            case 'DIGITODD':
                return array_of_digits.filter(digit => +digit % 2 !== 0);
            case 'DIGITEVEN':
                return array_of_digits.filter(digit => +digit % 2 === 0);
            default:
                throw new Error('Cannot Determine Winning numbers.');
        }
    };

    const highlightWinningNumbers = (winning_numbers) => {
        winning_numbers.forEach(digit => {
            const element = el_container.querySelector(`.digit-${digit}`);
            element.classList.remove('digit-losing');
            element.classList.add('digit-winning');
        });
    };

    const observeResize = () => {
        window.onresize = () => {
            if (el_peek_box) {
                adjustBoxSizes();
                el_peek_box.setAttribute('style', `transform: translateX(${calculateOffset()}px)`);
            }
        };
    };

    // Calculate peek-box left offset.
    const calculateOffset = () => {
        const current_spot_digit = document.querySelector(`.digit-${current_spot}`);
        const left_offset =  current_spot_digit ? current_spot_digit.offsetLeft : 0;
        return left_offset - style_offset_correction;
    };

    const markAsLost = () => {
        if (!el_peek_box || !el_peek) {
            setElements();
        }
        el_peek.classList.remove('digit-winning', 'digit-running');
        el_peek_box.classList.remove('digit-winning', 'digit-running');
        el_peek.classList.add('digit-losing');
        el_peek_box.classList.add('digit-losing');
    };

    const markDigitAsWon = (digit) => {
        if (el_container && el_container.querySelector(`.digit-${digit}`)) {
            el_container.querySelector(`.digit-${digit}`).classList.add('digit-won');
        }
    };

    const markDigitAsLost = (digit) => {
        if (el_container && el_container.querySelector(`.digit-${digit}`)) {
            el_container.querySelector(`.digit-${digit}`).classList.add('digit-lost');
        }
    };

    const markAsWon = () => {
        if (!el_peek_box || !el_peek) {
            setElements();
        }
        el_peek_box.classList.remove('digit-losing', 'digit-running');
        el_peek_box.classList.add('digit-winning');
        el_peek.classList.remove('digit-losing', 'digit-running');
        el_peek.classList.add('digit-winning');
    };

    const setElements = () => {
        el_peek     = el_container ? el_container.querySelector('.peek') : null;
        el_peek_box = el_peek ? el_container.querySelector('.peek-box') : null;
        el_mask     = el_peek_box ? el_peek_box.querySelector('.mask') : null;
    };

    const isBarrierMissing = (contract_type, bar) => !/digit(even|odd)/i.test(type) && !bar;

    const setBarrierFromShortcode = (contract_type, shortcode) => {
        barrier = '';
        if (!/^(digiteven|digitodd)_/i.test(shortcode)) {
            const arr_shortcode = shortcode.split('_');
            barrier = arr_shortcode[arr_shortcode.length - 2];
        }
    };

    const update = (current_tick_count, { quote, epoch }) => {
        if (current_tick_count > total_tick_count) {
            return;
        }
        setElements(epoch);
        el_container.classList.remove('invisible');
        adjustBoxSizes();
        current_spot = quote.substr(-1);

        el_mask.innerText = `${current_tick_count} / ${total_tick_count}`;

        el_peek_box.classList.add('digit-running');
        el_peek.classList.add('digit-running');

        el_peek_box.setAttribute('style', `transform: translateX(${calculateOffset()}px)`);
    };

    const remove = () => {
        window.onresize = null;
        while (el_container && el_container.firstChild) {
            el_container.removeChild(el_container.firstChild);
        }
        if (el_container) el_container.classList.add('invisible');
    };

    const countDecimals = (value) => {
        if (Math.floor(value) !== value) return value.toString().split('.')[1].length || 0;
        return 0;
    };

    const calculateDistance = (old_digit, new_digit) => Math.abs(old_digit - new_digit);

    const countUp = (start, end, duration, element, render) => {
        const decimal_points = countDecimals(start.replace('/,+/', ''));
        const f_start = parseFloat(start.replace(/,+/, ''));
        const range = calculateDistance(f_start, end);
        const step = Math.abs(range / 60);
        const increment = end > f_start ? (1 * step) : (-1 * step);
        let current = f_start;
        let i = 0;

        const renderTick = () => {
            i++;
            current += increment;

            element.innerHTML = render(current.toFixed(decimal_points));

            if (i <= 15) {
                requestAnimationFrame(renderTick);
            } else {
                current = end;
                element.innerHTML = render(current.toFixed(decimal_points));
            }
        };

        requestAnimationFrame(renderTick);
    };

    return {
        init,
        update,
        countUp,
        isBarrierMissing,
        markAsWon,
        markAsLost,
        markDigitAsLost,
        markDigitAsWon,
        remove,
    };
})();

module.exports = DigitTicker;
