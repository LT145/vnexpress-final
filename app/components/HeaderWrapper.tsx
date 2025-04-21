"use client";

import { usePathname } from 'next/navigation';
import Header from "@/components/Header";
import { memo, useContext } from 'react';
import { HeaderContext } from '@/context/HeaderContext';

function HeaderWrapperComponent() {
  const pathname = usePathname();
  const context = useContext(HeaderContext);
  if (!context) {
    return null;
  }
  const { headerVisible } = context;
  return !pathname.startsWith('/dashboard') && headerVisible ? <Header /> : null;
}

export default memo(HeaderWrapperComponent);