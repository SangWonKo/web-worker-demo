// import { exposeWorker } from 'react-hooks-worker';

// const fib = (i) => (i <= 1 ? i : fib(i - 1) + fib(i - 2));

onmessage = (evt) => {
  // console.log(evt);
  // postMessage(fib(evt.data));
  let intervalID = null;
  let message = evt.data;
  intervalID = setInterval(() => {
    message.count = message.count + 1;
    postMessage(message);
    if (message.count >= message.limit) {
      clearInterval(intervalID);
      message.stop = true;
      postMessage(message);
    }
  }, 1000);
};
// exposeWorker(fib);
