import { AUTH_ACTION_TYPES } from '@/features/auth/store/authActions';

export const initialAuthState = {
  loading: false,
  isAuthenticated: false,
  user: null,
  token: null,
  error: null,
};

function authReducer(state, action) {
  switch (action.type) {
    case AUTH_ACTION_TYPES.LOGIN_START:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case AUTH_ACTION_TYPES.LOGIN_SUCCESS:
      return {
        ...state,
        loading: false,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        error: null,
      };

    case AUTH_ACTION_TYPES.LOGIN_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case AUTH_ACTION_TYPES.HYDRATE:
      return {
        ...state,
        isAuthenticated: Boolean(action.payload?.token),
        user: action.payload?.user ?? null,
        token: action.payload?.token ?? null,
      };

    case AUTH_ACTION_TYPES.LOGOUT:
      return {
        ...initialAuthState,
      };

    default:
      return state;
  }
}

export default authReducer;

