import type { Rol } from './types';

export interface MockUser {
  id: string;
  name: string;
  email: string;
  role: Rol;
  password: string;
}

const mockUsers: MockUser[] = [
  {
    id: 'u-admin',
    name: 'Admin',
    email: 'admin@example.com',
    role: 'admin',
    password: 'admin',
  },
  {
    id: 'u-user',
    name: 'Usuario Demo',
    email: 'user@example.com',
    role: 'user',
    password: 'user',
  },
  {
    id: 'u-subscriber',
    name: 'Suscriptor Demo',
    email: 'suscriptor@example.com',
    role: 'suscriptor',
    password: 'suscriptor',
  },
];

export function findUserByEmail(email: string): MockUser | undefined {
  return mockUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
}

export function validateCredentials(email: string, password: string): MockUser | undefined {
  const user = findUserByEmail(email);
  if (!user) return undefined;
  return user.password === password ? user : undefined;
}

export default mockUsers;
