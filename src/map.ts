import state from './state';
import { Application, Container, DisplayObject, Sprite } from 'pixi.js';
import emitter from './emitter';
import { textures, randomColor } from './app';

const margin = {
  horizontal: 1,
  vertical: 1,
};

export default class Map {
  cells: DisplayObject[] = [];
  pfp?: Sprite;
  container: Container = new Container();
  color: string = randomColor();

  constructor(readonly app: Application) {
    emitter.on('*', (eventName) => {
      if (eventName === 'doLayout') {
        if (state.item.count <= 500) {
          this.doLayout();
        } else {
          document.getElementById('view')!.style.opacity = '0';
          setTimeout(() => {
            this.doLayout();
          }, 150);
        }
      }
    });

    emitter.on('updateView', () => {
      this.updateView();
    });

    window.addEventListener('resize', () => {
      state.view.width = app.renderer.view.width;
      state.view.height = app.renderer.view.height;
      emitter.emit('doLayout');
    });

    this.init();
  }

  init() {
    const vector = [1, 1];
    const app = this.app;
    app.stage.addChild(this.container);
    this.app.loader.add('pfp', 'img/pfp.png').load((loader, resources) => {
      const pfp = (this.pfp = new Sprite(resources.pfp.texture));

      pfp.x = app.renderer.width / 2;
      pfp.y = app.renderer.height / 2;
      const width = pfp.width;
      pfp.width = document.documentElement.clientWidth * 0.1;
      pfp.height = pfp.height * (pfp.width / width);

      pfp.anchor.x = 0.5;
      pfp.anchor.y = 0.5;

      app.stage.addChild(pfp);

      app.ticker.add(() => {
        pfp.rotation += 0.01;
        pfp.x += vector[0] * app.renderer.width * 0.01;
        pfp.y += vector[1] * app.renderer.height * 0.005;
        if (pfp.x > app.renderer.width) {
          vector[0] = -1;
        }
        if (pfp.y > app.renderer.height) {
          vector[1] = -1;
        }
        if (pfp.x < 0) {
          vector[0] = 1;
        }
        if (pfp.y < 0) {
          vector[1] = 1;
        }
      });

      this.doLayout();
      this.updateView();
    });
  }

  doLayout() {
    const { view, item } = state;
    const sqrt = Math.sqrt(item.count);
    const columns = Math.round(sqrt);
    const rows = Math.ceil(sqrt);
    const availableWidth = view.width - margin.horizontal * 2;
    const availableHeight = view.height - margin.vertical * 2;
    const cellWidth =
      (availableWidth - margin.horizontal * (columns - 1)) / columns;
    const cellHeight = (availableHeight - margin.vertical * (rows - 1)) / rows;
    const left = 0;
    const top = 0;

    let x = left;
    let y = top;
    let id = 0;

    this.purge();

    for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
      x = left;
      for (let columnIndex = 0; columnIndex < columns; columnIndex++) {
        if (Math.random() < 0.2) {
          this.color = randomColor();
        }
        const cell = this.newCell(++id, x, y, cellWidth, cellHeight);
        this.cells.push(cell);
        x += cellWidth + margin.horizontal;
        if (id === item.count) {
          break;
        }
      }
      y += cellHeight + margin.vertical;
    }

    console.log('doLayout', {
      rows,
      columns,
      availableWidth,
      availableHeight,
      cellWidth,
      cellHeight,
      state,
    });

    document.getElementById('view')!.style.opacity = '1';
    document.getElementById(
      'size'
    )!.innerText = `${this.app.renderer.view.width} x ${this.app.renderer.view.height}`;
  }

  purge() {
    if (this.cells.length) {
      this.cells.forEach((cell) => {
        this.container.removeChild(cell);
        cell.destroy();
      });
    }
    this.cells = [];
  }

  newCell(id: number, x: number, y: number, width: number, height: number) {
    const texture = textures.get(this.color);
    const sprite = new Sprite(texture);

    sprite.interactive = state.item.interactive;
    sprite.x = x;
    sprite.y = y;
    sprite.width = width;
    sprite.height = height;

    const onMouseOver = () => {
      document.getElementById('highlight')!.innerText = String(id);
    };

    const onMouseOut = () => {};

    sprite
      .on('mouseover', onMouseOver)
      .on('touchstart', onMouseOver)
      .on('touchend', onMouseOut)
      .on('mouseout', onMouseOut);

    this.container.addChild(sprite);

    return sprite;
  }

  updateView() {
    const { container } = this;

    const outer = document.getElementById('minimap-outer')!;
    const inner = document.getElementById('minimap-inner')!;
    const outerBounds = outer.getBoundingClientRect();
    const innerBounds = inner.getBoundingClientRect();

    const x =
      ((innerBounds.left - outerBounds.left) / outerBounds.width) *
      state.view.width;
    const y =
      ((innerBounds.top - outerBounds.top) / outerBounds.height) *
      state.view.height;

    container.scale.x = this.container.scale.y = state.view.scale;
    container.x = x;
    container.y = y;
  }
}
