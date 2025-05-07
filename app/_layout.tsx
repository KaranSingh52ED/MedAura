import React from 'react';
import { Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

// Root layout for the app
export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Slot />
    </>
  );
} 