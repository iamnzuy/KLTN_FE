/**
 * Utility to map NextAuth user ID to backend user_id
 * Since NextAuth uses UUID string and backend uses Long, we need to handle mapping
 */

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { userApi } from './backend-api';

/**
 * Get backend user ID from NextAuth session
 * This will try to find the user in backend by email or create a mapping
 */
export function useBackendUserId(): number | null {
  const { data: session, status } = useSession();
  const [backendUserId, setBackendUserId] = useState<number | null>(null);

  useEffect(() => {
    async function fetchBackendUserId() {
      if (status !== 'authenticated' || !session?.user?.email) {
        return;
      }

      try {
        // Try to find user by email/username in backend
        const response = await userApi.getByUsername(session.user.email);
        if (response.data) {
          setBackendUserId(response.data.userId);
        } else {
          // If user doesn't exist in backend, create one
          const createResponse = await userApi.create({
            username: session.user.email,
            email: session.user.email,
            preferences: JSON.stringify({ name: session.user.name }),
          });
          if (createResponse.data) {
            setBackendUserId(createResponse.data.userId);
          }
        }
      } catch (error) {
        console.error('Failed to get backend user ID:', error);
        // Try to create user if lookup fails
        try {
          const createResponse = await userApi.create({
            username: session.user.email,
            email: session.user.email,
            preferences: JSON.stringify({ name: session.user.name }),
          });
          if (createResponse.data) {
            setBackendUserId(createResponse.data.userId);
          }
        } catch (createError) {
          console.error('Failed to create backend user:', createError);
        }
      }
    }

    fetchBackendUserId();
  }, [session, status]);

  return backendUserId;
}

