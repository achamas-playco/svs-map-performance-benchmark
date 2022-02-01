import * as React from 'react';
import { useEffect, useRef } from 'react';
import * as PIXI from 'pixi.js';
import emitter from './emitter';
import { FpsView } from 'react-fps';
import Map from './map';

import Select from './select';
import state, {
  defaultItemCount,
  defaultViewHeight,
  defaultViewWidth,
} from './state';
import { numberWithCommas } from './util';

export default function View() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const { current } = ref;

    if (current) {
      const app = new PIXI.Application({
        width: defaultViewWidth,
        height: defaultViewHeight,
        resizeTo: current,
        backgroundColor: 0x110000,
      });

      new Map(app);

      current.appendChild(app.view);

      const updateLayout = () => setTimeout(() => emitter.emit('doLayout'), 0);

      const update = (propName: string) => (value: number) => {
        if (ref.current) {
          ref.current.style[(propName as 'width') || 'height'] = `${value}px`;
          app.resize();
          updateLayout();
        }
      };

      emitter
        .on('item.count', updateLayout)
        .on('view.width', update('width'))
        .on('view.height', update('height'))
        .on('margin.horizontal', updateLayout)
        .on('margin.vertical', updateLayout);
    }
  }, []);
  return (
    <div id="view">
      <div id="view-container" ref={ref}></div>
      <div id="fps">
        <FpsView width={200} height={50} />
      </div>
      <Select
        id="item.count"
        label="Item Count"
        value={numberWithCommas(defaultItemCount)}
        options={[
          '10',
          '100',
          '500',
          '1000',
          '5000',
          '10,000',
          '20,000',
          '50,000',
          '100,000',
          '1,000,000',
        ]}
        onChange={(value) => {
          state.item.count = parseInt(value.replace(/,/g, ''));
        }}
      />
      <span id="highlight" className="text"></span>
      <span id="size" className="text"></span>
    </div>
  );
}
