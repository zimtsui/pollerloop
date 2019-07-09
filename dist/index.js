"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

require("source-map-support/register");

var _interruptibleTimer = _interopRequireDefault(require("interruptible-timer"));

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
      });
      destructors.add(timer.stop);
      return timer.timeout;
    });
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