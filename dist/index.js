"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

require("source-map-support/register");

var _interruptibleTimer = _interopRequireDefault(require("interruptible-timer"));

var isTest = function isTest() {
  return process.env.NODE_ENV == 'test';
};

var constructor = function constructor(polling) {
  var publ = {};
  var destructors = new Set();
  var running;
  var stopped;

  publ.start = function () {
    running = true;
    stopped = polling(function () {
      return running;
    }, function (ms) {
      var timer = (0, _interruptibleTimer["default"])(ms, function () {
        destructors["delete"](timer.stop);
        isTest() && console.log('destructors size:', destructors.size);
      });
      destructors.add(timer.stop);
      isTest() && console.log('destructors size:', destructors.size);
      return timer.timeout;
    });

    if (isTest()) {
      return stopped.then(function () {
        console.log('destructors size:', destructors.size);
      });
    }

    return stopped;
  };

  publ.stop = function () {
    running = false;
    destructors.forEach(function (destructor) {
      return destructor();
    });
    return stopped;
  };

  publ.destructor = function () {
    if (running) return publ.stop();
    return undefined;
  };

  return publ;
};

var _default = {
  constructor: constructor
};
exports["default"] = _default;
//# sourceMappingURL=index.js.map