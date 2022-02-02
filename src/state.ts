export const defaultViewWidth = document.documentElement.clientWidth;
export const defaultViewHeight = document.documentElement.clientHeight;
export const defaultItemCount = 10;

interface State {
  view: {
    width: number;
    height: number;
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
  },
  item: {
    count: defaultItemCount,
    interactive: true,
  },
};

console.log(state);

export default state;
