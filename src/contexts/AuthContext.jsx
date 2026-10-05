import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export const AuthContext = createContext({
  user: null,
  session: null,
  profile: null,
  userCompanies: [],
  roles: [],
  isLoading: true,
  isAuthenticated: false,
  authError: null,
  signIn: async () => {},
  signOut: async () => {},
  refreshProfile: async () => {}
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [userCompanies, setUserCompanies] = useState([]);
  const [roles, setRoles] = useState([]);
  const [isLoading, setIsLoading] = useState(isSupabaseConfigured);
  const [authError, setAuthError] = useState(null);

  /**
   * Fetch profile and company memberships for the authenticated user
   */
  const loadUserData = useCallback(async (authUserId) => {
    if (!isSupabaseConfigured || !authUserId) {
      setProfile(null);
      setUserCompanies([]);
      setRoles([]);
      return { profile: null, userCompanies: [], roles: [] };
    }

    try {
      // 1. Fetch profile record from public.profiles
      const { data: profileData, error: profileErr } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUserId)
        .maybeSingle();

      if (profileErr) {
        console.error('[AuthContext] Failed to load profile:', profileErr.message);
        throw new Error('Unable to retrieve user profile.');
      }

      // If user profile is marked inactive, immediately revoke session
      if (profileData && profileData.is_active === false) {
        console.warn('[AuthContext] User account is inactive. Revoking session.');
        await supabase.auth.signOut();
        setUser(null);
        setSession(null);
        setProfile(null);
        setUserCompanies([]);
        setRoles([]);
        const inactiveError = new Error('Your account is currently inactive. Please contact the administrator.');
        setAuthError(inactiveError.message);
        throw inactiveError;
      }

      setProfile(profileData || null);

      // 2. Fetch user_companies with company and role relationships
      let loadedCompanies = [];
      let loadedRoles = [];

      try {
        const { data: ucData, error: ucErr } = await supabase
          .from('user_companies')
          .select(`
            id,
            company_id,
            role_id,
            is_primary,
            is_active,
            company:companies (
              id,
              name,
              slug,
              domain_id,
              is_active,
              domain:domains (
                id,
                name,
                slug
              )
            ),
            role:roles (
              id,
              name,
              slug
            )
          `)
          .eq('user_id', authUserId)
          .eq('is_active', true);

        if (!ucErr && Array.isArray(ucData)) {
          loadedCompanies = ucData;
          loadedRoles = ucData
            .map((item) => item.role?.slug)
            .filter(Boolean);
        }
      } catch (err) {
        console.warn('[AuthContext] Could not load user_companies:', err);
      }

      setUserCompanies(loadedCompanies);
      setRoles(loadedRoles);

      return { profile: profileData, userCompanies: loadedCompanies, roles: loadedRoles };
    } catch (err) {
      setProfile(null);
      setUserCompanies([]);
      setRoles([]);
      throw err;
    }
  }, []);

  /**
   * Initialize and restore session on mount + listen to auth state changes
   */
  useEffect(() => {
    let mounted = true;

    if (!isSupabaseConfigured) {
      return;
    }

    // 1. Initial session restoration
    supabase.auth.getSession()
      .then(async ({ data, error }) => {
        if (!mounted) return;
        if (error) {
          console.warn('[AuthContext] Error retrieving session:', error.message);
          setSession(null);
          setUser(null);
          setIsLoading(false);
          return;
        }

        const activeSession = data?.session || null;
        setSession(activeSession);
        setUser(activeSession?.user || null);

        if (activeSession?.user) {
          try {
            await loadUserData(activeSession.user.id);
          } catch (err) {
            console.warn('[AuthContext] Profile load during init failed:', err.message);
          }
        }
      })
      .catch((err) => {
        console.error('[AuthContext] Failed to get session:', err);
      })
      .finally(() => {
        if (mounted) setIsLoading(false);
      });

    // 2. Auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      if (!mounted) return;

      setSession(newSession);
      setUser(newSession?.user || null);

      if (event === 'SIGNED_OUT' || !newSession?.user) {
        setProfile(null);
        setUserCompanies([]);
        setRoles([]);
        setIsLoading(false);
        return;
      }

      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
        setIsLoading(true);
        try {
          await loadUserData(newSession.user.id);
          setAuthError(null);
        } catch (err) {
          console.warn('[AuthContext] Failed to sync user data on auth event:', err.message);
        } finally {
          if (mounted) setIsLoading(false);
        }
      }
    });

    return () => {
      mounted = false;
      if (authListener?.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, [loadUserData]);

  /**
   * Sign In with Email & Password
   */
  const signIn = async ({ email, password }) => {
    setAuthError(null);
    if (!isSupabaseConfigured) {
      const err = new Error('Authentication service is not configured. Please define VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
      setAuthError(err.message);
      throw err;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password
    });

    if (error) {
      // Map error to friendly user-facing message without leaking internal details
      let friendlyMessage = 'Unable to sign in. Please verify your credentials.';
      if (error.message.includes('Invalid login credentials')) {
        friendlyMessage = 'Invalid email or password. Please try again.';
      } else if (error.message.includes('Email not confirmed')) {
        friendlyMessage = 'Email address has not been confirmed.';
      } else if (error.message.includes('Network') || error.message.includes('Fetch')) {
        friendlyMessage = 'Unable to connect to the authentication server. Please check your network connection.';
      }
      setAuthError(friendlyMessage);
      throw new Error(friendlyMessage);
    }

    if (!data.user) {
      throw new Error('Authentication succeeded but user record was not returned.');
    }

    setUser(data.user);
    setSession(data.session);

    // Verify account status
    try {
      const { profile: userProfile } = await loadUserData(data.user.id);
      if (userProfile && userProfile.is_active === false) {
        throw new Error('Your account is currently inactive. Please contact the administrator.');
      }
      return data;
    } catch (err) {
      setAuthError(err.message);
      throw err;
    }
  };

  /**
   * Sign Out
   */
  const signOut = async () => {
    try {
      if (isSupabaseConfigured) {
        await supabase.auth.signOut();
      }
    } catch (err) {
      console.warn('[AuthContext] Sign out error:', err);
    } finally {
      setUser(null);
      setSession(null);
      setProfile(null);
      setUserCompanies([]);
      setRoles([]);
      setAuthError(null);
    }
  };

  /**
   * Refresh active profile
   */
  const refreshProfile = async () => {
    if (user?.id) {
      return await loadUserData(user.id);
    }
  };

  const isAuthenticated = Boolean(user && profile && profile.is_active !== false);

  const value = {
    user,
    session,
    profile,
    userCompanies,
    roles,
    isLoading,
    isAuthenticated,
    authError,
    signIn,
    signOut,
    refreshProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
