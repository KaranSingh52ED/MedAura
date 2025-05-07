import React, { useEffect } from 'react';

/**
 * A utility component to debug React hook rendering issues.
 * Place this in components that might be causing "rendered more hooks than during previous render" errors.
 * 
 * @param name Name of the component for logging
 * @param props Additional debugging props
 */
export const HookCheck = ({ 
  name, 
  ...props 
}: { 
  name: string;
  [key: string]: any;
}) => {
  // This effect will help track component mount/unmount
  useEffect(() => {
    console.log(`HookCheck: ${name} mounted with props:`, props);
    return () => {
      console.log(`HookCheck: ${name} unmounted`);
    };
  }, [name, props]);

  return null; // Renders nothing, just for debugging
};

/**
 * Debug any hook-related issues by tracking render counts
 * @param componentName The name of the component to track
 */
export const useRenderCount = (componentName: string) => {
  const count = React.useRef(0);
  
  console.log(`${componentName} rendering, count: ${++count.current}`);
  
  useEffect(() => {
    console.log(`${componentName} mounted, render count: ${count.current}`);
    return () => {
      console.log(`${componentName} unmounted after ${count.current} renders`);
    };
  }, [componentName]);
  
  return count.current;
}; 