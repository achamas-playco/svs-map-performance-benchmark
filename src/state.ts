export const defaultViewWidth = document.documentElement.clientWidth;
export const defaultViewHeight = document.documentElement.clientHeight;
export const defaultItemCount = 10;

interface State {
  view: {
    width: number;
    height: number;
    scale: number;
    x: number;
    y: number;
  };
  drag: {
    startX: number;
    startY: number;
    endX?: number;
    endY?: number;
  };
  item: {
    count: number;
    interactive: boolean;
  };
}

const state: State = {
  view: {
    width: defaultViewWidth,
    height: defaultViewHeight,
    scale: 1,
    x: defaultViewWidth / 2,
    y: defaultViewHeight / 2,
  },
  drag: {
    startX: 0,
    startY: 0,
  },
  item: {
    count: defaultItemCount,
    interactive: true,
  },
};

console.log(state);

export default state;
