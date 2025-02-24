import { createSharedPathnamesNavigation } from 'next-intl/navigation';

export const locales = ['he'] as const;
export const { Link, redirect, usePathname, useRouter } = createSharedPathnamesNavigation({ locales }); 