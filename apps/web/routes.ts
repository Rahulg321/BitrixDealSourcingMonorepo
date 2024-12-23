/**
 *
 *These are the routes that are used for authentication purposes
 *@type{string}
 */
export const AUTH_ROUTES = ["/auth/login"];

/**
 *
 *These are the routes that are protected and user cant access without being logged in
 *@type{string}
 */
export const PROTECTED_ROUTES = ["/", "/raw-deals", "/published-deals"];

/**
 *
 *These are the base routes on all other routes that come after them are protected and user cant access without being logged in
 *@type{string}
 */
export const PROTECTED_BASE_ROUTES = ["/raw-deals"];

/**
 *
 *This is default login redirect that the user will go to after successful login and registration
 *@type{string}
 */
export const DEFAULT_LOGIN_REDIRECT = "/raw-deals";

// export const PUBLIC_ROUTES = [""];
// export const PUBLIC_ROUTES = [""];
