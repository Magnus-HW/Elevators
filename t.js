async function move(n) {
  let position = 0;
  let inter = setInterval(() => {
    position += 1;
    console.log(position);
    if (position == n) {
      clearInterval(inter);
    }
  }, 1000);
  console.log("end");
}

function wait(k) {
  let i = 0;
  let inter = setInterval(() => {
    i += 1;
    setTimeout(() => console.log("Timeout ended"), 1000);
    if(i==k) clearInterval(inter)
  }, 1000);
}

async function callMove() {
  let _ = await move(4);
  await wait();
}

// callMove()
wait(4);
