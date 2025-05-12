'use client';

import React, { ButtonHTMLAttributes } from 'react';

interface IButton extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export default function Button({ children, ...rest }: IButton) {
  return <button {...rest}>{children}</button>;
}
