'use client';

import Link from 'next/link';
import Button, { type ButtonProps } from '@mui/material/Button';

type LinkButtonProps = ButtonProps & { href: string };

export function LinkButton({ href, children, ...buttonProps }: LinkButtonProps) {
  return (
    <Button component={Link} href={href} {...buttonProps}>
      {children}
    </Button>
  );
}
