(function() {
  var canvas = document.getElementById("charge7");
  var ctx = canvas.getContext("2d");
  // canvas.width = document.getElementsByTagName("article")[0].clientWidth;
  ctx.font = "24px Arial";
  ctx.fillStyle = "#aaa";
  ctx.textAlign = "center";
  ctx.fillText("click to start simulation", canvas.width / 2, canvas.height / 2);
})();

function charges7(el) {
  el.onclick = null; //stops the function from running on button click
  Charge.setCanvas(el);
  ctx.textAlign = "right";
  // var canvas = el
  // var ctx = canvas.getContext("2d");

  //switch between draw modes
  let drawMode = 1;
  document.addEventListener("keypress", event => {
    if (!pause) {
      if (event.charCode === 49) {
        drawMode = 1; //particle
        el.style.background = "#fff";
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      } else if (event.charCode === 50) {
        drawMode = 2; //particles + electric vector field
        el.style.background = "#fff";
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      } else if (event.charCode === 51) {
        drawMode = 3; //electric potential scalar field
        el.style.background = "#fff";
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      } else if (event.charCode === 52) {
        drawMode = 4; //cloud chamber
        el.style.background = "#000";
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
  });

  //___________________get mouse input___________________
  canvas.addEventListener("mousedown", function(event) {
    Charge.repulse(q, {
      x: (event.offsetX * canvas.width) / canvas.clientWidth,
      y: (event.offsetY * canvas.height) / canvas.clientHeight
    });
  });
  let pause = false;
  el.addEventListener("mouseleave", function() {
    pause = true;
  });
  el.addEventListener("mouseenter", function() {
    pause = false;
    Charge.setCanvas(el);
    if (!pause) requestAnimationFrame(cycle);
  });

  const q = []; //holds the charges
  //spawn p before e to avoid a bug in the class method allPhysics
  const separation = 40;
  const off = 250;

  for (let i = 0; i < Math.ceil((canvas.width + off * 2) / separation); ++i) {
    q[q.length] = new Charge("p", {
      x: separation * i - off,
      y: canvas.height / 2 + separation
    });
    q[q.length] = new Charge("p", {
      x: separation * i - off,
      y: canvas.height / 2
    });
    q[q.length] = new Charge("p", {
      x: separation * i - off,
      y: canvas.height / 2 - separation
    });
  }

  for (let i = 0; i < Math.ceil((canvas.width + off * 2) / separation); ++i) {
    q[q.length] = new Charge(
      "e",
      {
        x: separation * i - off,
        y: canvas.height / 2 + separation
      },
      { x: 2, y: 0 }
    );
    q[q.length] = new Charge(
      "e",
      {
        x: separation * i - off,
        y: canvas.height / 2
      },
      { x: 2, y: 0 }
    );
    q[q.length] = new Charge(
      "e",
      {
        x: separation * i - off,
        y: canvas.height / 2 - separation
      },
      { x: 2, y: 0 }
    );
  }
  // Charge.spawnCharges(q, 25, 'e')
  // Charge.spawnCharges(q, 25, 'p')

  let current = 1 / 60;
  function ammeter() {
    current = current * 0.99 + Charge.teleport(q, 200) * 0.01;
    // console.log((current*60).toFixed(2))
    ctx.fillStyle = "#000";
    ctx.fillText((current * 60).toFixed(1) + " e⁻/s", canvas.width - 3, canvas.height - 3);
  }

  function cycle() {
    Charge.physicsAll(q);
    //choose a draw mode
    if (drawMode === 1) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      Charge.drawAll(q);
    } else if (drawMode === 2) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      Charge.vectorField(q, 33);
      ctx.globalAlpha = 0.5;
      Charge.drawAll(q);
      ctx.globalAlpha = 1;
    } else if (drawMode === 3) {
      Charge.scalarField(q);
    } else if (drawMode === 4) {
      Charge.drawCloudChamber(q);
    }

    ammeter();
    if (!pause) requestAnimationFrame(cycle);
  }
  requestAnimationFrame(cycle);
}
