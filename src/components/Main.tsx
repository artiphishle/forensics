import { PropsWithChildren } from 'react';

export default function Main({ children }: IMain) {
  return <main className="dark:bg-white dark:text-white h-full py-6">{children}</main>;
}

interface IMain extends PropsWithChildren {}
