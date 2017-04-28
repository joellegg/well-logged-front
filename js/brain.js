'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// modelling functions
var step = function step(a, x) {
  return x >= a ? 1 : 0;
},
    clamp = function clamp(a, b, x) {
  return Math.max(a, Math.min(b, x));
},
    map = function map(a, b, c, d, x) {
  return (x - a) / (b - a) * (d - c) + c;
},
    smoothstep = function smoothstep(a, b, x) {
  var t = clamp(0, 1, map(a, b, 0, 1, x));
  return t * t * t * ((6 * t - 15) * t + 10);
};

var Vec2d = function () {
  function Vec2d(x, y) {
    _classCallCheck(this, Vec2d);

    this.reset(x, y);
  }

  Vec2d.prototype.clone = function clone() {
    return new Vec2d(this.x, this.y);
  };

  Vec2d.prototype.reset = function reset(x, y) {
    this.x = x;this.y = y;return this;
  };

  Vec2d.prototype.neg = function neg() {
    return this.scale(-1);
  };

  Vec2d.prototype.norm = function norm() {
    var m = this.mag;
    if (m > 0) return this.scale(1 / m);
    return this;
  };

  Vec2d.prototype.add = function add(a, b) {
    var x = undefined,
        y = undefined;
    if (a instanceof Vec2d) {
      x = a.x;y = a.y;
    } else {
      x = a;y = b;
    }
    this.x += x;
    this.y += y;
    return this;
  };

  Vec2d.prototype.sub = function sub(a, b) {
    var x = undefined,
        y = undefined;
    if (a instanceof Vec2d) {
      x = a.x;y = a.y;
    } else {
      x = a;y = b;
    }
    this.x -= x;
    this.y -= y;
    return this;
  };

  Vec2d.prototype.scale = function scale(a) {
    this.x *= a;
    this.y *= a;
    return this;
  };

  Vec2d.prototype.dot = function dot(a, b) {
    var x = undefined,
        y = undefined;
    if (a instanceof Vec2d) {
      x = a.x;y = a.y;
    } else {
      x = a;y = b;
    }
    return this.x * x + this.y * y;
  };

  Vec2d.add = function add(a, b) {
    return a.clone().add(b);
  };

  Vec2d.sub = function sub(a, b) {
    return a.clone().sub(b);
  };

  Vec2d.dot = function dot(a, b) {
    return a.dot(b);
  };

  _createClass(Vec2d, [{
    key: 'mag',
    get: function get() {
      return Math.sqrt(this.dot(this));
    }
  }]);

  return Vec2d;
}();

var Particle = function Particle(position) {
  _classCallCheck(this, Particle);

  this.position = position;
  this.force = new Vec2d(0, 0);
};

var Simulation = function () {
  function Simulation(particles) {
    _classCallCheck(this, Simulation);

    this.particles = particles;
  }

  Simulation.getRepulsionForce = function getRepulsionForce(a, b) {
    var f = Vec2d.sub(a.position, b.position),
        m = f.mag;
    return m > this.DISTANCE_CUTOFF ? f.reset(0, 0) : f.norm().scale(this.REPULSION_FORCE / (m * m));
  };

  Simulation.getSpringForce = function getSpringForce(a, b) {
    var f = Vec2d.sub(a.position, b.position),
        m = f.mag;
    return f.norm().scale((this.NODE_DISTANCE - m) * this.SPRING_COEFFICIENT);
  };

  Simulation.prototype.step = function step(dT) {
    var t = dT / 4;
    // process mutual repulsion
    for (var i = 0; i < this.particles.length - 1; i++) {
      for (var j = i + 1; j < this.particles.length; j++) {
        // mutual deflection force
        var a = this.particles[i],
            b = this.particles[j];
        var f = Simulation.getRepulsionForce(a, b);
        a.force.add(f);
        b.force.sub(f);
      }
    }
    // process linkage
    for (var i = 0; i < this.particles.length; i++) {
      var a = this.particles[i],
          b = this.particles[(i + 1) % this.particles.length];
      var f = Simulation.getSpringForce(a, b);
      a.force.add(f);
      b.force.sub(f);
    }
    // apply movement
    this.particles.forEach(function (particle) {
      var f = particle.force.clone().scale(t);
      particle.position.add(f);
      particle.force.reset(0, 0);
    });
  };

  _createClass(Simulation, null, [{
    key: 'NODE_DISTANCE',
    get: function get() {
      return 2;
    }
  }, {
    key: 'DISTANCE_CUTOFF',
    get: function get() {
      return this.NODE_DISTANCE * 8;
    }
  }, {
    key: 'SPRING_COEFFICIENT',
    get: function get() {
      return 0.02;
    }
  }, {
    key: 'REPULSION_FORCE',
    get: function get() {
      return 4;
    }
  }]);

  return Simulation;
}();

// D3 stuff

var container = document.querySelector('#display'),
    canvas = d3.select(container).append('svg').attr({ width: container.offsetWidth, height: container.offsetHeight });

var update = function update(data) {
  var w2 = container.offsetWidth / 2,
      h2 = container.offsetHeight / 2;
  var links = canvas.selectAll('line').data(data);
  var particles = canvas.selectAll('circle').data(data);

  // update the links
  links.enter().append('line');

  links.attr({
    x1: function x1(d) {
      return d.position.x + w2;
    },
    y1: function y1(d) {
      return d.position.y + h2;
    },
    x2: function x2(d, idx) {
      return data[(idx + 1) % data.length].position.x + w2;
    },
    y2: function y2(d, idx) {
      return data[(idx + 1) % data.length].position.y + h2;
    }
  });

  links.exit().remove();

  // update the particles
  particles.enter().append('circle');

  particles.attr({
    cx: function cx(d) {
      return d.position.x + w2;
    },
    cy: function cy(d) {
      return d.position.y + h2;
    },
    r: 3
  });

  particles.exit().remove();
};

// set up the initial world, just start with a circle of 40 particles
var simulation = function () {
  var n = 40,
      particles = [],
      r = 40;
  for (var a = 0; a < 2 * Math.PI; a += 2 * Math.PI / n) {
    particles.push(new Particle(new Vec2d(Math.cos(a) * r, Math.sin(a) * r)));
  }
  return new Simulation(particles);
}();

// loop stuff
var lastTime = null,
    lastGenerated = null;

var tick = function tick(timestamp) {
  if (!lastTime) lastTime = timestamp;
  var elapsed = clamp(0, 16, timestamp - lastTime);
  lastTime = timestamp;

  simulation.step(elapsed);
  update(simulation.particles);

  if (!lastGenerated) lastGenerated = timestamp;
  // generate a new particle every 60ms
  if (simulation.particles.length < 800 && timestamp - lastGenerated > 60) {
    var idx = Math.floor(Math.random() * simulation.particles.length),
        nextIdx = (idx + 1) % simulation.particles.length,
        a = simulation.particles[idx],
        b = simulation.particles[nextIdx];
    simulation.particles.splice(idx, 0, new Particle(a.position.clone().sub(b.position).scale(0.5).add(a.position)));
    lastGenerated = timestamp;
  }

  requestAnimationFrame(tick);
};

requestAnimationFrame(tick);
