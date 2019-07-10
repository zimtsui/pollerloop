"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

require("source-map-support/register");

var _interruptibleTimer = _interopRequireDefault(require("interruptible-timer"));

// const isTest = () => process.env.NODE_ENV === 'test' && global.logger;

/*
三种情况

- 自动结束
- 手动结束
- 异常结束
*/
var Pollerloop = function Pollerloop(polling) {
  var publ = {};
  var destructors = new Set();
  var running;
  var stopped;
  var stopping;

  publ.start = function (newStopping) {
    stopping = newStopping;
    running = true;
    stopped = polling(function (err) {
      destructors.forEach(function (destructor) {
        return destructor();
      });
      if (err) stopping(err);else stopping();
    }, function () {
      return running;
    }, function (ms) {
      var timer = (0, _interruptibleTimer["default"])(ms, function () {
        destructors["delete"](timer.stop);
      });
      destructors.add(timer.stop);
      return timer.timeout["catch"](function () {});
    });
    return stopped;
  };

  publ.stop = function () {
    running = false;
    destructors.forEach(function (destructor) {
      return destructor();
    });
    return stopped["catch"](function () {});
  };

  publ.destructor = function () {
    if (running) return publ.stop();
    return undefined;
  };

  return publ;
};

var _default = Pollerloop;
exports["default"] = _default;
//# sourceMappingURL=index.js.map