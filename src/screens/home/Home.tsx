'use client';
import React, { useState } from 'react';
import Main from '@/components/Main';
import Header from '@/components/Header';
import Breadcrumb from '@/components/Breadcrumb';

export default function HomeScreen() {
  const [currentPackage, setCurrentPackage] = useState<string>('');

  return (
    <>
      <Header title="nav.packages">
        <Breadcrumb
          path={currentPackage.replace(/\./g, '/')}
          onNavigate={(path: string) => setCurrentPackage(path.replace(/\//g, '.'))}
        />
      </Header>
      <Main currentPackage={currentPackage} setCurrentPackage={setCurrentPackage} />
    </>
  );
}
