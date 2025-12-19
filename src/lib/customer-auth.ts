// src/lib/customer-auth.ts
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-change-this'
);

export interface CustomerSessionData {
  customerId: number;
  email: string;
  name: string;
}

export async function createCustomerSession(data: CustomerSessionData) {
  const token = await new SignJWT({
    customerId: data.customerId,
    email: data.email,
    name: data.name,
  } as any)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30d') // 30 days
    .sign(SECRET_KEY);

  const cookieStore = await cookies();
  cookieStore.set('customer-session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: '/',
  });
}

export async function getCustomerSession(): Promise<CustomerSessionData | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('customer-session')?.value;

  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    return {
      customerId: payload.customerId as number,
      email: payload.email as string,
      name: payload.name as string,
    };
  } catch {
    return null;
  }
}

export async function deleteCustomerSession() {
  const cookieStore = await cookies();
  cookieStore.delete('customer-session');
}

export async function hashPassword(password: string): Promise<string> {
  const bcrypt = require('bcryptjs');
  return await bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const bcrypt = require('bcryptjs');
  return await bcrypt.compare(password, hash);
}
