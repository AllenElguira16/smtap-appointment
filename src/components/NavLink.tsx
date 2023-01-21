import Link, { LinkProps } from 'next/link';
import { useRouter } from 'next/router';
import { HTMLProps } from 'react';

type NavLinkProps = LinkProps & Omit<HTMLProps<HTMLAnchorElement>, 'ref'>;

export function NavLink({
  href,
  children,
  className: baseClassName,
  ...props
}: NavLinkProps) {
  const router = useRouter();
  let className = baseClassName;

  if (router.pathname === href)
    className = className ? `${className} active` : 'active';

  return (
    <Link {...props} href={href} className={className}>
      {children}
    </Link>
  );
}
