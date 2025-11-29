import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatPhone(phone: string): string {
  return phone.replace(/(\d{5})(\d{5})/, '$1 $2');
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}
