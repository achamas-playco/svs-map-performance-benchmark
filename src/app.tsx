import React, { useState } from 'react';
import View from './view';
import * as PIXI from 'pixi.js';
import { defaultViewHeight, defaultViewWidth } from './state';

export const keys = [
  'red',
  'green',
  'blue',
  'grape',
  'mocha',
  'ice',
  'iron',
  'strawberry',
  'banana',
];

export const textures: Map<string, PIXI.Texture<PIXI.Resource>> = new Map();

export const randomTexture = () => {
  const key = randomColor();
  const texture = textures.get(key);
  return texture;
};

export const randomColor = () => {
  const index = Math.round(Math.random() * (keys.length - 1));
  const key = keys[index];
  return key;
};

export function App() {
  const [app, setApp] = useState<PIXI.Application>();

  if (!app) {
    const pixiApp = new PIXI.Application({
      width: defaultViewWidth,
      height: defaultViewHeight,
      backgroundColor: 0x110000,
    });

    keys.forEach((texture) =>
      pixiApp.loader.add(texture, `img/${texture}.png`)
    );

    pixiApp.loader.load((_, resources) => {
      keys.forEach((texture) => {
        const tex = resources[texture].texture;
        if (tex) {
          textures.set(texture, tex);
        }
      });
      setApp(pixiApp);
    });
  }

  return (
    <div id="app" className="fill">
      <img id="spinner" src="img/spinner.gif" />
      <View app={app} />
    </div>
  );
}
