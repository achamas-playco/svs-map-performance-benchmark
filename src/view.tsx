import * as React from 'react';
import { useEffect, useRef } from 'react';
import * as PIXI from 'pixi.js';
import emitter from './emitter';
import { FpsView } from 'react-fps';
import { useGesture } from '@use-gesture/react';
import Map from './map';
import Select from './select';
import state, { defaultItemCount } from './state';
import { numberWithCommas } from './util';
import MiniMap from './minimap';

document.addEventListener('gesturestart', (e) => e.preventDefault());
document.addEventListener('gesturechange', (e) => e.preventDefault());

const scaleFactor = 0.1;
const scaleMin = 0.25;
const scaleMax = 5;

const setScale = (value: number) => {
  state.view.scale = Math.max(scaleMin, Math.min(scaleMax, value));
  emitter.emit('updateView');
};

export default function View({ app }: { app?: PIXI.Application }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const { current } = ref;

    if (current && app) {
      app.resizeTo = current;

      new Map(app);

      current.appendChild(app.view);

      const updateLayout = () => setTimeout(() => emitter.emit('doLayout'), 0);

      const update = (propName: string) => (value: number) => {
        if (ref.current && app) {
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
  }, [app]);

  const onInteractiveChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    state.item.interactive = e.target.checked;
    document.getElementById('highlight')!.style.display = state.item.interactive
      ? 'block'
      : 'none';
    emitter.emit('doLayout');
  };

  const bind = useGesture(
    {
      onDragStart: (args) => {
        state.drag.startX = state.view.x;
        state.drag.startY = state.view.y;
      },
      onDrag: (args) => {
        if (args.pinching) {
          return;
        }
        const deltaX =
          state.drag.endX === undefined
            ? args.offset[0]
            : args.offset[0] - state.drag.endX;
        const deltaY =
          state.drag.endY === undefined
            ? args.offset[1]
            : args.offset[1] - state.drag.endY;
        state.view.x = state.drag.startX + deltaX;
        state.view.y = state.drag.startY + deltaY;
        emitter.emit('updateView');
      },
      onDragEnd: (args) => {
        state.drag.endX = args.offset[0];
        state.drag.endY = args.offset[1];
      },
      onPinch: (args) => {
        setScale(args.offset[0]);
        emitter.emit('updateView');
      },
      onWheel: (args) => {
        const deltaY = args.delta[1];
        if (deltaY > 0) {
          setScale(state.view.scale + scaleFactor);
        } else if (deltaY < 0) {
          setScale(state.view.scale - scaleFactor);
        }
      },
    },
    {}
  );

  return (
    <div id="view" {...bind()}>
      <div id="view-container" ref={ref}></div>
      <MiniMap />
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
          '7500',
          '10,000',
          '15,000',
          '20,000',
          '25,000',
          '30,000',
          '35,000',
          '50,000',
          '100,000',
          '1,000,000',
        ]}
        onChange={(value) => {
          state.item.count = parseInt(value.replace(/,/g, ''));
        }}
      />
      <label id="interactive">
        Interactive:{' '}
        <input
          type="checkbox"
          defaultChecked={state.item.interactive}
          onChange={onInteractiveChange}
        />
      </label>
      <span
        id="highlight"
        className="text"
        style={{ display: state.item.interactive ? 'block' : 'none' }}
      ></span>
      <span id="size" className="text"></span>
      <div id="debug" className="text"></div>
    </div>
  );
}
