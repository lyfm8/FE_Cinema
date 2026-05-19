export const AUTH_ACTION_TYPES = {
  LOGIN_START: 'LOGIN_START',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_ERROR: 'LOGIN_ERROR',
  LOGOUT: 'LOGOUT',
  HYDRATE: 'HYDRATE',
};

export const loginStart = () => ({
  type: AUTH_ACTION_TYPES.LOGIN_START,
});

export const loginSuccess = (payload) => ({
  type: AUTH_ACTION_TYPES.LOGIN_SUCCESS,
  payload,
});

export const loginError = (payload) => ({
  type: AUTH_ACTION_TYPES.LOGIN_ERROR,
  payload,
});

export const logout = () => ({
  type: AUTH_ACTION_TYPES.LOGOUT,
});

export const hydrateAuth = (payload) => ({
  type: AUTH_ACTION_TYPES.HYDRATE,
  payload,
});

export default {
  AUTH_ACTION_TYPES,
  loginStart,
  loginSuccess,
  loginError,
  logout,
  hydrateAuth,
};
