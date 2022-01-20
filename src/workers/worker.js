// import { exposeWorker } from 'react-hooks-worker';

// const fib = (i) => (i <= 1 ? i : fib(i - 1) + fib(i - 2));
let intervalId = null;
onmessage = (evt) => {
  let msg = evt.data;

  if(msg.active && !msg.pause) {
    intervalId = setInterval(() => {
      msg.count = msg.count + 1;
      postMessage(msg);

      if (msg.count >= msg.limit) {
        clearInterval(intervalId);
        postMessage(msg);
      }
    }, 1000);
  } else {
    clearInterval(intervalId);
    
  }
};
// exposeWorker(fib);
