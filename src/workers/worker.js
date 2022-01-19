// import { exposeWorker } from 'react-hooks-worker';

// const fib = (i) => (i <= 1 ? i : fib(i - 1) + fib(i - 2));
let intervalId = null;

onmessage = (evt) => {
  // console.log(evt);
  // postMessage(fib(evt.data));
  let msg = evt.data;
  // console.log(msg);

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


  // if (msg.pause || !msg.active) {
  //   clearInterval(intervalId);
  //   console.log(msg);
  // } else {
  //   intervalId = setInterval(() => {
  //     msg.count = msg.count + 1;
  //     postMessage(msg);

  //     if (msg.count >= msg.limit) {
  //       clearInterval(intervalId);
  //       postMessage(msg);
  //     }
  //   }, 1000);
  // }
};
// exposeWorker(fib);
