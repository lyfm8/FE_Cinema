import { useEffect, useMemo, useReducer } from 'react';
import authReducer, { initialAuthState } from '@/features/auth/store/authReducer';
import {
  hydrateAuth,
  loginError,
  loginStart,
  loginSuccess,
  logout,
} from '@/features/auth/store/authActions';
import { AUTH_STORAGE_KEYS } from '@/utils/constants';
import { login as loginService } from '@/features/auth/services/authService';
import { AuthContext } from '@/features/auth/store/authStore';

function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialAuthState);

  useEffect(() => {
    const token = localStorage.getItem(AUTH_STORAGE_KEYS.TOKEN);
    const userRaw = localStorage.getItem(AUTH_STORAGE_KEYS.USER);

    dispatch(
      hydrateAuth({
        token,
        user: userRaw ? JSON.parse(userRaw) : null,
      }),
    );
  }, []);

  const signIn = async (credentials) => {
    dispatch(loginStart());

    try {
      const data = await loginService(credentials);
      const token = data?.data?.accessToken ?? data?.accessToken ?? data?.token ?? '';
      const user = data?.data?.user ?? data?.user ?? null;

      localStorage.setItem(AUTH_STORAGE_KEYS.TOKEN, token);
      localStorage.setItem(AUTH_STORAGE_KEYS.USER, JSON.stringify(user));

      dispatch(loginSuccess({ token, user }));

      return { ok: true, data };
    } catch (error) {
      const message = error?.response?.data?.message ?? 'Login failed.';
      dispatch(loginError(message));
      return { ok: false, error: message };
    }
  };

  const signOut = () => {
    localStorage.removeItem(AUTH_STORAGE_KEYS.TOKEN);
    localStorage.removeItem(AUTH_STORAGE_KEYS.USER);
    dispatch(logout());
  };

  const value = useMemo(
    () => ({
      ...state,
      signIn,
      signOut,
    }),
    [state],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export { AuthProvider };
export default AuthProvider;

