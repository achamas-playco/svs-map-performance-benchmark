import EventEmitter from 'eventemitter3';

const emitter = new EventEmitter();

const emit = emitter.emit;

let timeoutId: number;

(emitter as any).emit = (event: string, ...args: any[]) => {
  emit.call(emitter, event, ...args);
  clearTimeout(timeoutId);
  timeoutId = setTimeout(() => {
    emit.call(emitter, '*', event, ...args);
  }, 100) as unknown as number;
};

export default emitter;
