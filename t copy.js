function move(n) {
  return new Promise(function (resolve) {
    let position = 0;
    let inter = setInterval(() => {
      position += 1;
      console.log(position);
      if (position == n) {
        clearInterval(inter);
        resolve("Interval finished");
      }
    }, 1000);
  });
}

function wait() {
  return new Promise(function (resolve) {
    setTimeout(() => resolve(console.log("Waited")), 3000);
  });
}

async function callMove(n) {
  for (let i = 0; i < n; i++) {
    await wait();
  }
}

callMove(5);
