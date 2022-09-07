function time() {
  return new Promise(function (resolve) {
    setTimeout(() => resolve(console.log("fifnished")), 2000);
  });
}

async function caller() {
  await time();
  console.log("after time");
}

caller();

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
  await move(n);
  await wait();
}

// callMove(3);
