import type { ReactNode } from 'react';

type RootElementProps = { children: ReactNode };

export default async function RootElement({ children }: RootElementProps) {
  return (
    <html lang="en">
      <head />
      <body>{children}</body>
    </html>
  );
}

export const getConfig = async () => {
  return {
    render: 'static',
  } as const;
};
