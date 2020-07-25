"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.define = exports.selector = exports.reducer = void 0;

var _lodash = _interopRequireDefault(require("lodash"));

var _reactn = require("reactn");

var _reactnDevtools = _interopRequireDefault(require("reactn-devtools"));

var _react = _interopRequireDefault(require("react"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var reducer = function reducer(fn) {
  return function (state, setState) {
    if (_lodash["default"].isArray(fn)) {
      return /*#__PURE__*/_asyncToGenerator(function* () {
        var chainedState = state;

        var _iterator = _createForOfIteratorHelper(fn),
            _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var subFn = _step.value;
            chainedState = yield reducer(subFn)(chainedState, setState).apply(void 0, arguments);
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }

        return state;
      });
    } else return /*#__PURE__*/_asyncToGenerator(function* () {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return new Promise(function (resolve) {
        setTimeout( /*#__PURE__*/_asyncToGenerator(function* () {
          var newState = yield fn.apply(void 0, [state].concat(args));

          if (!_lodash["default"].isEqual(_lodash["default"].keys(state), _lodash["default"].keys(newState))) {
            console.warn('Component not re-rendering? Ensure adding new keys to initial state.');
          }

          setState(newState);
          resolve(newState);
        }));
      });
    });
  };
};

exports.reducer = reducer;

var selector = function selector(fn) {
  return function (state) {
    return function () {
      for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      return fn.apply(void 0, [state].concat(args));
    };
  };
};

exports.selector = selector;

var define = function define(initialState, defintion) {
  var initialized = false;
  return {
    init: function init(props) {
      var Provider = (0, _reactn.createProvider)(initialState(props));
      (0, _reactnDevtools["default"])(Provider);
      return function (_ref4) {
        var children = _ref4.children;
        initialized = true;
        return _react["default"].createElement(Provider, null, children);
      };
    },
    use: function use() {
      if (!initialized) throw new Error('Must use <Provider /> from model.init');

      var _useGlobal = (0, _reactn.useGlobal)(),
          _useGlobal2 = _slicedToArray(_useGlobal, 2),
          state = _useGlobal2[0],
          setState = _useGlobal2[1];

      var api = _lodash["default"].mapValues(defintion, function (cb) {
        return cb(state, setState);
      });

      return _objectSpread({
        state: state
      }, api);
    }
  };
};

exports.define = define;

