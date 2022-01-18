// import { exposeWorker } from 'react-hooks-worker';

// const fib = (i) => (i <= 1 ? i : fib(i - 1) + fib(i - 2));

onmessage = (evt) => {
  // console.log(evt);
  // postMessage(fib(evt.data));
  let intervalID = null;
  let msg = evt.data;
  console.log(msg);
  intervalID = setInterval(() => {
    if (msg.active && !msg.pause) {
      msg.count = msg.count + 1;
      postMessage(msg);

      if (msg.count >= msg.limit || msg.pause) {
        clearInterval(intervalID);
        postMessage(msg);
      }
    }
  }, 1000);
};
// exposeWorker(fib);
