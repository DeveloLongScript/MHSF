// NextTopLoader.tsx
'use client';

import Loader from 'nextjs-toploader';
import { usePathname } from 'next/navigation';
import {useEffect} from "react"
import * as NProgress from "nprogress";
import { useTheme } from 'next-themes';

export default function NextTopLoader() {
  const pathname = usePathname();
  const theme = useTheme()

  useEffect(() => {
    NProgress.done();
  }, [pathname]);

  return (
    <Loader color={theme.resolvedTheme == "dark" ? "white" : "black"} shadow={false}/>
  )
}