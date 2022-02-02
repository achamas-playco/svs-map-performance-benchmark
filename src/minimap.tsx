import * as React from 'react';
import { useEffect } from 'react';
import emitter from './emitter';
import state from './state';

export const calcMiniMap = () => {
  const outerWidth = Math.round(state.view.width * 0.25);
  const outerHeight = Math.round(
    (outerWidth / state.view.width) * state.view.height
  );
  const innerWidth = outerWidth * state.view.scale;
  const innerHeight = outerHeight * state.view.scale;
  const innerOffsetX = Math.round(innerWidth / 2) * -1;
  const innerOffsetY = Math.round(innerHeight / 2) * -1;
  const innerX = outerWidth * (state.view.x / state.view.width);
  const innerY = outerHeight * (state.view.y / state.view.height);

  return {
    outerWidth,
    outerHeight,
    innerWidth,
    innerHeight,
    innerOffsetX,
    innerOffsetY,
    innerX,
    innerY,
  };
};

export default function MiniMap() {
  useEffect(() => {
    const outer = document.getElementById('minimap-outer')!;
    const inner = document.getElementById('minimap-inner')!;

    const updateView = () => {
      const {
        outerWidth,
        outerHeight,
        innerWidth,
        innerHeight,
        innerOffsetX,
        innerOffsetY,
        innerX,
        innerY,
      } = calcMiniMap();

      outer.style.cssText = `width:${outerWidth}px;height:${outerHeight}px;`;
      inner.style.cssText = `width:${innerWidth}px;height:${innerHeight}px;left:${innerX}px;top:${innerY}px;margin-left:${innerOffsetX}px;margin-top:${innerOffsetY}px;`;
    };

    emitter.on('updateView', updateView);
    updateView();
  }, []);

  return (
    <div id="minimap">
      <div id="minimap-outer"></div>
      <div id="minimap-inner"></div>
    </div>
  );
}
