"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
require("./App.css");
var _SpeechToText = _interopRequireDefault(require("./SpeechToText"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function App() {
  return /*#__PURE__*/React.createElement("div", {
    className: "App"
  }, /*#__PURE__*/React.createElement(_SpeechToText.default, null));
}
var _default = exports.default = App;
"use strict";

var _react = require("@testing-library/react");
var _App = _interopRequireDefault(require("./App"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
test('renders learn react link', () => {
  (0, _react.render)( /*#__PURE__*/React.createElement(_App.default, null));
  const linkElement = _react.screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _monsterapi = _interopRequireDefault(require("monsterapi"));
var _monster = require("./assets/monster.svg");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const client = new _monsterapi.default(process.env.REACT_APP_MONSTERAPITOKEN);
const languages = [{
  code: "none",
  name: "None"
}, {
  code: "en",
  name: "English"
}, {
  code: "af",
  name: "Afrikaans"
}, {
  code: "am",
  name: "Amharic"
},
// Add the rest of the languages as objects with 'code' and 'name' properties
{
  code: "ar",
  name: "Arabic"
}, {
  code: "zh",
  name: "Chinese"
}
// Add all the other languages here following the same structure
];
function SpeechToText() {
  const [text, setText] = (0, _react.useState)("");
  const [transcriptionFormat, setTranscriptionFormat] = (0, _react.useState)("text");
  const [beamSize, setBeamSize] = (0, _react.useState)(5);
  const [bestOf, setBestOf] = (0, _react.useState)(8);
  const [numSpeakers, setNumSpeakers] = (0, _react.useState)(2);
  const [diarize, setDiarize] = (0, _react.useState)("false");
  const [removeSilence, setRemoveSilence] = (0, _react.useState)("false");
  const [language, setLanguage] = (0, _react.useState)("en");
  const [isLiveTranscribing, setIsLiveTranscribing] = (0, _react.useState)(false);
  const mediaRecorderRef = (0, _react.useRef)(null);
  const recordingIntervalRef = (0, _react.useRef)(null);
  const [isProcessing, setIsProcessing] = (0, _react.useState)(false);
  const processAudioBlob = async blob => {
    setIsProcessing(true);
    const file = new File([blob], "recorded_audio.wav", {
      type: blob.type
    });
    try {
      const uploadResponse = await client.uploadFile(file);
      const transcriptionResponse = await client.generate("whisper", {
        transcription_format: transcriptionFormat,
        beam_size: beamSize,
        best_of: bestOf,
        num_speakers: numSpeakers,
        diarize: diarize,
        remove_silence: removeSilence,
        language: language,
        file: uploadResponse
      });
      setText(prevText => prevText + " " + (transcriptionResponse === null || transcriptionResponse === void 0 ? void 0 : transcriptionResponse.text));
    } catch (error) {
      console.error("Error during upload or transcription:", error);
    }
    setIsProcessing(false);
  };
  const startRecordingSegment = () => {
    navigator.mediaDevices.getUserMedia({
      audio: true
    }).then(stream => {
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      const chunks = [];
      mediaRecorder.ondataavailable = event => {
        chunks.push(event.data);
      };
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, {
          type: "audio/wav"
        });
        processAudioBlob(blob);
      };
      mediaRecorder.start();
      // Stop recording after 5 seconds and process the audio
      setTimeout(() => {
        if (mediaRecorder.state !== "inactive") {
          mediaRecorder.stop();
        }
      }, 5000);
    }).catch(error => {
      console.error("Error accessing microphone:", error);
    });
  };
  const startLiveTranscription = () => {
    setIsLiveTranscribing(true);
    startRecordingSegment(); // Start the first segment immediately
  };
  const stopLiveTranscription = () => {
    setIsLiveTranscribing(false);
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
    }
    clearInterval(recordingIntervalRef.current);
  };
  (0, _react.useEffect)(() => {
    if (isLiveTranscribing && !isProcessing) {
      // Start a new recording segment after the previous has been processed
      recordingIntervalRef.current = setInterval(() => {
        startRecordingSegment();
      }, 6000); // Slightly longer to account for processing
    }
    return () => {
      clearInterval(recordingIntervalRef.current);
    };
  }, [isLiveTranscribing, isProcessing]);
  return /*#__PURE__*/_react.default.createElement("div", {
    className: "max-w-4xl mx-auto my-10 p-5 shadow-lg bg-white rounded-lg"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "flex flex-col justify-center items-center gap-4"
  }, /*#__PURE__*/_react.default.createElement(_monster.ReactComponent, null), /*#__PURE__*/_react.default.createElement("h1", {
    className: "text-2xl font-bold text-center mb-5"
  }, "Speech to Text Playground")), /*#__PURE__*/_react.default.createElement("div", {
    className: "grid grid-cols-1 md:grid-cols-2 gap-4 mb-5"
  }, /*#__PURE__*/_react.default.createElement("select", {
    className: "form-select appearance-none block w-full px-3 py-2 text-base font-normal text-gray-700 bg-white bg-clip-padding bg-no-repeat border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none",
    value: transcriptionFormat,
    onChange: e => setTranscriptionFormat(e.target.value)
  }, /*#__PURE__*/_react.default.createElement("option", {
    value: "text"
  }, "Text"), /*#__PURE__*/_react.default.createElement("option", {
    value: "word"
  }, "Word"), /*#__PURE__*/_react.default.createElement("option", {
    value: "srt"
  }, "SRT"), /*#__PURE__*/_react.default.createElement("option", {
    value: "verbose"
  }, "Verbose")), /*#__PURE__*/_react.default.createElement("input", {
    type: "number",
    value: beamSize,
    onChange: e => setBeamSize(Number(e.target.value)),
    min: "1",
    max: "100",
    className: "form-input appearance-none block w-full px-3 py-2 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
  }), /*#__PURE__*/_react.default.createElement("input", {
    type: "number",
    value: bestOf,
    onChange: e => setBestOf(Number(e.target.value)),
    min: "1",
    max: "92233",
    className: "form-input appearance-none block w-full px-3 py-2 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
  }), /*#__PURE__*/_react.default.createElement("input", {
    type: "number",
    value: numSpeakers,
    onChange: e => setNumSpeakers(Number(e.target.value)),
    min: "2",
    max: "10",
    className: "form-input appearance-none block w-full px-3 py-2 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
  }), /*#__PURE__*/_react.default.createElement("select", {
    value: diarize,
    onChange: e => setDiarize(e.target.value),
    className: "form-select appearance-none block w-full px-3 py-2 text-base font-normal text-gray-700 bg-white bg-clip-padding bg-no-repeat border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
  }, /*#__PURE__*/_react.default.createElement("option", {
    value: "false"
  }, "False"), /*#__PURE__*/_react.default.createElement("option", {
    value: "true"
  }, "True")), /*#__PURE__*/_react.default.createElement("select", {
    value: removeSilence,
    onChange: e => setRemoveSilence(e.target.value),
    className: "form-select appearance-none block w-full px-3 py-2 text-base font-normal text-gray-700 bg-white bg-clip-padding bg-no-repeat border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
  }, /*#__PURE__*/_react.default.createElement("option", {
    value: "false"
  }, "False"), /*#__PURE__*/_react.default.createElement("option", {
    value: "true"
  }, "True")), /*#__PURE__*/_react.default.createElement("select", {
    value: language,
    onChange: e => setLanguage(e.target.value),
    className: "form-select appearance-none block w-full px-3 py-2 text-base font-normal text-gray-700 bg-white bg-clip-padding bg-no-repeat border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
  }, languages.map(lang => /*#__PURE__*/_react.default.createElement("option", {
    key: lang.code,
    value: lang.code
  }, lang.name)))), /*#__PURE__*/_react.default.createElement("div", {
    className: "flex justify-center gap-4 mb-5"
  }, /*#__PURE__*/_react.default.createElement("button", {
    onClick: startLiveTranscription,
    disabled: isLiveTranscribing,
    className: "px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-700 disabled:bg-blue-300"
  }, "Start Live Transcription"), /*#__PURE__*/_react.default.createElement("button", {
    onClick: stopLiveTranscription,
    disabled: !isLiveTranscribing,
    className: "px-4 py-2 bg-red-500 text-white font-semibold rounded hover:bg-red-700 disabled:bg-red-300"
  }, "Stop Live Transcription"), /*#__PURE__*/_react.default.createElement("button", {
    onClick: () => setText("")
    // disabled={!isLiveTranscribing}
    ,
    className: "px-4 py-2 bg-red-300 text-white font-semibold rounded hover:bg-red-700 "
  }, "Clear")), /*#__PURE__*/_react.default.createElement("div", {
    className: "mt-5"
  }, /*#__PURE__*/_react.default.createElement("p", {
    className: "whitespace-pre-wrap text-gray-700 text-base"
  }, text)), /*#__PURE__*/_react.default.createElement("a", {
    target: "__blank",
    href: "https://monsterapi.ai/playground",
    className: "hover:text-green-300"
  }, "Visit MonsterAPI Playground"));
}
var _default = exports.default = SpeechToText;
"use strict";

var _react = _interopRequireDefault(require("react"));
var _client = _interopRequireDefault(require("react-dom/client"));
require("./index.css");
var _App = _interopRequireDefault(require("./App"));
var _reportWebVitals = _interopRequireDefault(require("./reportWebVitals"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const root = _client.default.createRoot(document.getElementById('root'));
root.render( /*#__PURE__*/_react.default.createElement(_react.default.StrictMode, null, /*#__PURE__*/_react.default.createElement(_App.default, null)));

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
(0, _reportWebVitals.default)();
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const reportWebVitals = onPerfEntry => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    Promise.resolve().then(() => _interopRequireWildcard(require('web-vitals'))).then(_ref => {
      let {
        getCLS,
        getFID,
        getFCP,
        getLCP,
        getTTFB
      } = _ref;
      getCLS(onPerfEntry);
      getFID(onPerfEntry);
      getFCP(onPerfEntry);
      getLCP(onPerfEntry);
      getTTFB(onPerfEntry);
    });
  }
};
var _default = exports.default = reportWebVitals;
"use strict";

require("@testing-library/jest-dom");
