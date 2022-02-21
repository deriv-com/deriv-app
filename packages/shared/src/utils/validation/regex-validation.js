export const regex_checks = {
    address_details: {
        address_city: /^\p{L}[\p{L}\s'.-]{0,99}$/u,
        address_line_1: /^[a-zA-Z0-9\s'.,:;()@#/-]{1,70}$/,
        address_line_2: /^[a-zA-Z0-9\s'.,:;()@#/-]{0,70}$/,
        address_postcode: /^[a-zA-Z0-9\s-]{0,20}$/,
        address_state: /^[\w\s\W'.;,-]{0,35}$/,
        non_jersey_postcode: /^(?!\s*je.*)[a-zA-Z0-9\s-]*/i,
    },
};
