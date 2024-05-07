export const regex_checks = {
    address_details: {
        address_city: /^\p{L}[\p{L}\s'.-]{0,99}$/u,
        address_line_1: /^[\p{L}\p{Nd}\s'.,:;()\u00b0@#/-]{1,70}$/u,
        address_line_2: /^[\p{L}\p{Nd}\s'.,:;()\u00b0@#/-]{0,70}$/u,
        address_postcode: /^(?! )[a-zA-Z0-9\s-]{0,20}$/,
        address_state: /^[\w\s\W'.;,-]{0,99}$/,
    },
};
