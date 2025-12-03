import { useAuth } from '../contexts/AuthContext';
import { useUserData } from '../contexts/UserDataContext';

/**
 * useAppData - Hook composto para acessar dados da aplicação
 * 
 * Combina useAuth e useUserData em uma interface conveniente.
 * Use este hook quando precisar tanto de dados de autenticação quanto de dados do usuário.
 * 
 * @returns Objeto combinado com dados de autenticação e dados do usuário
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { user, isAuthenticated, favorites, toggleFavorite, stats } = useAppData();
 *   
 *   return (
 *     <div>
 *       {isAuthenticated && <p>Bem-vindo, {user.name}!</p>}
 *       <p>Favoritos: {favorites.length}</p>
 *       <p>Pomodoros: {stats.pomodoros}</p>
 *     </div>
 *   );
 * }
 * ```
 */
export function useAppData() {
  const auth = useAuth();
  const userData = useUserData();
  
  return {
    // Auth data
    ...auth,
    
    // User data
    ...userData,
  };
}
