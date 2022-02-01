import state from './state';
import { Application, Graphics, DisplayObject, Sprite, Text } from 'pixi.js';
import emitter from './emitter';
import Color from 'color';

const margin = {
  horizontal: 1,
  vertical: 1,
};

export default class Map {
  cells: DisplayObject[] = [];
  color: Color = Color('red');
  pfp?: Sprite;

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

    this.init();

    window.addEventListener('resize', () => {
      state.view.width = app.renderer.view.width;
      state.view.height = app.renderer.view.height;
      emitter.emit('doLayout');
    });
  }

  init() {
    const vector = [1, 1];
    const app = this.app;
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
        const cell = this.newCell(
          ++id,
          x,
          y,
          cellWidth,
          cellHeight,
          this.color.rgbNumber()
        );
        this.cells.push(cell);
        x += cellWidth + margin.horizontal;
        if (x > availableWidth) {
          console.log('!!!', x, availableWidth);
        }
        if (id === item.count) {
          break;
        }
        if (Math.random() < 0.3) {
          const randComp = () => Math.round(Math.random() * 255);
          this.color = Color.rgb(randComp(), randComp(), randComp());
        }
      }
      y += cellHeight + margin.vertical;
    }

    this.app.stage.addChild(this.pfp!);

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
        this.app.stage.removeChild(cell);
        cell.destroy();
      });
    }
    this.cells = [];
    this.app.stage.removeChild(this.pfp!);
  }

  newCell(
    id: number,
    x: number,
    y: number,
    width: number,
    height: number,
    color: number = 0xff0000
  ) {
    const graphics = new Graphics();

    const fill = (color: number) => {
      graphics.clear();
      graphics.beginFill(color);
      graphics.drawRect(0, 0, width, height);
      graphics.endFill();
    };

    fill(color);

    const colorObj = Color(color);

    graphics.interactive = true;
    graphics;
    graphics.x = x;
    graphics.y = y;

    const onMouseOver = () => {
      fill(colorObj.lighten(0.3).rgbNumber());
      document.getElementById('highlight')!.innerText = String(id);
    };

    const onMouseOut = () => {
      fill(color);
    };

    graphics
      .on('mouseover', onMouseOver)
      .on('touchstart', onMouseOver)
      .on('touchend', onMouseOut)
      .on('mouseout', onMouseOut);

    this.app.stage.addChild(graphics);

    return graphics;
  }
}
