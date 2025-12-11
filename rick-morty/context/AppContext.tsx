import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { dbService } from '../services/dbService';
import { AuthState, Action, UserProfile } from '../types';

const initialState: AuthState & { favorites: number[] } = {
  user: null,
  loading: true,
  isAuthenticated: false,
  favorites: JSON.parse(localStorage.getItem('favorites') || '[]'),
};

function appReducer(state: typeof initialState, action: Action): typeof initialState {
  switch (action.type) {
    case 'SET_USER':
      return { 
        ...state, 
        user: action.payload, 
        isAuthenticated: !!action.payload,
        loading: false 
      };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_FAVORITES':
      return { ...state, favorites: action.payload };
    case 'ADD_FAVORITE':
      const newFavsAdd = [...state.favorites, action.payload];
      if (!state.isAuthenticated) localStorage.setItem('favorites', JSON.stringify(newFavsAdd));
      return { ...state, favorites: newFavsAdd };
    case 'REMOVE_FAVORITE':
      const newFavsRem = state.favorites.filter(id => id !== action.payload);
      if (!state.isAuthenticated) localStorage.setItem('favorites', JSON.stringify(newFavsRem));
      return { ...state, favorites: newFavsRem };
    case 'LOGOUT':
      return { ...initialState, loading: false, user: null, isAuthenticated: false, favorites: [] }; // Reset to empty on logout to avoid mixups
    default:
      return state;
  }
}

const AppContext = createContext<{
  state: typeof initialState;
  dispatch: React.Dispatch<Action>;
  toggleFavorite: (id: number) => Promise<void>;
}>({ state: initialState, dispatch: () => null, toggleFavorite: async () => {} });

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Logged In
        const profile = await dbService.getUserProfile(firebaseUser.uid);
        
        // Merge Local Storage Favorites
        const localFavs = JSON.parse(localStorage.getItem('favorites') || '[]');
        if (localFavs.length > 0) {
            const mergedFavs = await dbService.syncFavorites(firebaseUser.uid, localFavs);
            localStorage.removeItem('favorites');
            alert("Your local favorites were merged with your account.");
             dispatch({
              type: 'SET_USER',
              payload: { 
                uid: firebaseUser.uid, 
                email: firebaseUser.email, 
                photoURL: profile.photoURL || firebaseUser.photoURL,
                favorites: mergedFavs
              }
            });
            dispatch({ type: 'SET_FAVORITES', payload: mergedFavs });
        } else {
             dispatch({
              type: 'SET_USER',
              payload: { 
                uid: firebaseUser.uid, 
                email: firebaseUser.email, 
                photoURL: profile.photoURL || firebaseUser.photoURL,
                favorites: profile.favorites || []
              }
            });
            dispatch({ type: 'SET_FAVORITES', payload: profile.favorites || [] });
        }
      } else {
        // Logged Out
        dispatch({ type: 'LOGOUT' });
        // Restore local storage reading for guest
        const guestFavs = JSON.parse(localStorage.getItem('favorites') || '[]');
        dispatch({ type: 'SET_FAVORITES', payload: guestFavs });
      }
    });
    return () => unsubscribe();
  }, []);

  const toggleFavorite = async (id: number) => {
    const isFav = state.favorites.includes(id);
    if (state.isAuthenticated && state.user) {
      if (isFav) {
        await dbService.removeFavorite(state.user.uid, id);
        dispatch({ type: 'REMOVE_FAVORITE', payload: id });
      } else {
        await dbService.addFavorite(state.user.uid, id);
        dispatch({ type: 'ADD_FAVORITE', payload: id });
      }
    } else {
      // Guest
      if (isFav) dispatch({ type: 'REMOVE_FAVORITE', payload: id });
      else dispatch({ type: 'ADD_FAVORITE', payload: id });
    }
  };

  return (
    <AppContext.Provider value={{ state, dispatch, toggleFavorite }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
