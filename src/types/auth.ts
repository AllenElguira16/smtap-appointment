import type { User } from '@prisma/client';

export type SignInForm = Pick<User, 'email' | 'password'>;

export type SignUpForm = Omit<User, 'id' | 'createdAt' | 'role'>;

export type EditForm = Omit<User, 'createdAt' | 'role'>;
