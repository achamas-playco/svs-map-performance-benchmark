import { useState } from 'react';

export function numberWithCommas(num: number) {
  if (num < 9999) {
    return num.toString();
  }
  const parts = num.toString().split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
}

export function useForceUpdate() {
  const [_, refresher] = useState(0);
  return () => refresher(Date.now() + Math.random());
}
