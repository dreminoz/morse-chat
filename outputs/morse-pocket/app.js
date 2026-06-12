const MORSE = {
  A: ".-", B: "-...", C: "-.-.", D: "-..", E: ".", F: "..-.", G: "--.", H: "....",
  I: "..", J: ".---", K: "-.-", L: ".-..", M: "--", N: "-.", O: "---", P: ".--.",
  Q: "--.-", R: ".-.", S: "...", T: "-", U: "..-", V: "...-", W: ".--", X: "-..-",
  Y: "-.--", Z: "--..", 0: "-----", 1: ".----", 2: "..---", 3: "...--", 4: "....-",
  5: ".....", 6: "-....", 7: "--...", 8: "---..", 9: "----.",
  ".": ".-.-.-", ",": "--..--", "?": "..--..", "!": "-.-.--", "/": "-..-.", "@": ".--.-.", "-": "-....-"
};

const $ = (selector) => document.querySelector(selector);
const I18N_PAIRS = [
  ["이 기기에서는 진동 재생을 지원하지 않습니다.", "This device does not support vibration playback."],
  ["이 숨김 신호는 재생 횟수를 모두 사용했습니다.", "This hidden signal has no plays remaining."],
  ["스와이프할 때까지 현재 항목 무한 반복", "Repeat the current item until you swipe"],
  ["좌우 스와이프 · 재생 후 자동 이동", "Swipe left or right · Move automatically after playback"],
  ["좌우 스와이프 · 탭하면 현재 항목 재생", "Swipe left or right · Tap to replay the current item"],
  ["카드 탭: 정답 보기 · 좌우 스와이프: 문제 이동", "Tap card: reveal answer · Swipe: move between questions"],
  ["문장 훈련은 저장한 영문 문장을 우선 사용합니다.", "Sentence training uses your saved English sentences first."],
  ["왼쪽 스와이프: 정답 확인 · 오른쪽: 지우기", "Swipe left: submit answer · Right: clear"],
  ["3단위 휴식: 글자 확정 · 7단위 휴식: 띄어쓰기", "3-unit pause: confirm letter · 7-unit pause: add space"],
  ["오른쪽: 글자 확정 · 왼쪽: 띄어쓰기", "Right: confirm letter · Left: add space"],
  ["왼쪽: 글자 확정 · 오른쪽: 띄어쓰기", "Left: confirm letter · Right: add space"],
  ["오른쪽 스와이프: 글자 확정 · 왼쪽: 띄어쓰기", "Swipe right: confirm letter · Left: add space"],
  ["왼쪽 스와이프: 글자 확정 · 오른쪽: 띄어쓰기", "Swipe left: confirm letter · Right: add space"],
  ["쉬는 시간으로 글자·띄어쓰기 확정", "Confirm letters and spaces after a pause"],
  ["좌우 스와이프로 직접 확정", "Confirm manually with left and right swipes"],
  ["말풍선을 누르면 모스 진동 재생", "Tap a bubble to play Morse vibration"],
  ["친구를 눌러 모스 메시지를 보내보세요.", "Tap a friend to send a Morse message."],
  ["사진을 ASCII 아트로 보내기", "Send photo as ASCII art"],
  ["사진", "Photo"],
  ["우주", "Space"],
  ["랜덤 시그널", "Random Signal"],
  ["연결되면 서로 이름을 공개하지 않고 대화할 수 있습니다.", "Once connected, you can chat without revealing your names."],
  ["근처의 새로운 시그널을 탐색하고 있습니다.", "Searching for a new nearby signal."],
  ["랜덤한 상대와 연결합니다", "Connect with a random person"],
  ["상대를 찾는 중...", "Searching for someone..."],
  ["연결 대기 중", "Waiting to connect"],
  ["시그널이 연결되었습니다.", "Signal connected."],
  ["첫 메시지를 보내보세요.", "Send the first message."],
  ["시그널 연결이 취소되었습니다.", "Signal connection canceled."],
  ["시그널 연결이 끊어졌습니다.", "Signal disconnected."],
  ["연결이 끊겼습니다. 마지막 문장을 보낼지 선택하세요.", "Disconnected. Choose whether to send one final sentence."],
  ["라스트 시그널을 보냈습니다.", "Last Signal sent."],
  ["마지막 문장을 입력하세요", "Enter your final sentence"],
  ["라스트 시그널 보내기", "Send Last Signal"],
  ["라스트 시그널", "Last Signal"],
  ["보내지 않기", "Do not send"],
  ["하루에 하나의 시그널을 우주로 보내고, 누군가의 시그널을 수신합니다.", "Send one signal into space each day and receive someone else's signal."],
  ["오늘의 시그널 발신", "Transmit today's signal"],
  ["랜덤 시그널 수신", "Receive random signal"],
  ["모스 진동으로 읽기", "Read as Morse vibration"],
  ["우주로 보낼 문장을 입력하세요", "Enter a sentence to send into space"],
  ["오늘은 이미 시그널을 발신했습니다.", "You already transmitted a signal today."],
  ["오늘 아직 시그널을 발신하지 않았습니다.", "You have not transmitted a signal today."],
  ["우주로 시그널을 발신했습니다.", "Signal transmitted into space."],
  ["시그널 발신", "Signal Transmit"],
  ["시그널 수신", "Signal Receive"],
  ["시그널 재생 횟수", "Signal play limit"],
  ["친구의 시그널 ID를 입력하세요.", "Enter your friend's Signal ID."],
  ["서버 연결에 실패했습니다.", "Failed to connect to the server."],
  ["서버에 연결되었습니다.", "Connected to server."],
  ["연결 확인 중", "Checking connection"],
  ["연결 안 됨", "Disconnected"],
  ["내 시그널 ID", "My Signal ID"],
  ["서버 주소", "Server address"],
  ["서버 연결", "Connect server"],
  ["친구의 시그널 ID", "Friend's Signal ID"],
  ["수신할 우주 시그널이 아직 없습니다.", "There are no Space signals to receive yet."],
  ["대화, 우주, 랜덤 시그널을 사용하려면 Google 계정과 닉네임·비밀번호가 필요합니다.", "A Google account, nickname, and password are required for Conversations, Space, and Random Signal."],
  ["Google 계정을 먼저 선택하세요.", "Select a Google account first."],
  ["Google 로그인이 설정되지 않았습니다.", "Google Sign-In is not configured."],
  ["닉네임은 2자 이상, 비밀번호는 8자 이상 입력하세요.", "Enter a nickname of at least 2 characters and a password of at least 8 characters."],
  ["회원가입 / 로그인", "Register / Sign in"],
  ["훈련장으로 돌아가기", "Return to Training"],
  ["로그인하지 않음", "Not signed in"],
  ["계정 연결", "Connect account"],
  ["회원가입", "Register"],
  ["로그인", "Sign in"],
  ["로그아웃", "Sign out"],
  ["닉네임", "Nickname"],
  ["Google 계정이 확인되었습니다.", "Google account verified."],
  ["회원가입 또는 로그인에 실패했습니다.", "Registration or sign-in failed."],
  ["회원가입되었습니다.", "Registration complete."],
  ["로그인되었습니다.", "Signed in."],
  ["비밀번호", "Password"],
  ["계정", "Account"],
  ["시그널 연결", "Connect Signal"],
  ["시그널 끊기", "Disconnect Signal"],
  ["연결됨", "Connected"],
  ["메시지를 입력하세요", "Enter a message"],
  ["은하 너머로 모스 신호를 보내고 받아보세요.", "Send and receive Morse signals across the galaxy."],
  ["정체를 알 수 없는 A-Z 신호를 주고받습니다.", "Exchange unknown A-Z signals."],
  ["신호 보내기", "Send Signal"],
  ["신호 받기", "Receive Signal"],
  ["랜덤 신호 보내기", "Send Random Signal"],
  ["랜덤 신호 받기", "Receive Random Signal"],
  ["기능 선택", "Choose feature"],
  ["메인으로", "Back to main"],
  ["준비 중", "Coming soon"],
  ["신호를 입력하세요.", "Enter a signal."],
  ["우주 신호를 보냈습니다.", "Space signal sent."],
  ["랜덤 신호를 보냈습니다.", "Random signal sent."],
  ["신호를 수신했습니다.", "Signal received."],
  ["사진 원본은 저장되지 않습니다", "The original photo is not saved"],
  ["오른쪽 밀기: 숨김 신호", "Swipe right: hidden signal"],
  ["짧게 누르면 · 점 / 길게 누르면 − 선", "Short press: dot · Long press: dash"],
  ["짧게 누르면 점 · 길게 누르면 선", "Short press: dot · Long press: dash"],
  ["쉬면 자동으로 정답을 확인합니다", "Pause to check the answer automatically"],
  ["3단위 쉬면 자동으로 정답 확인", "Pause 3 units to check the answer"],
  ["영문, 숫자, 주요 문장부호를 지원합니다.", "Supports English letters, numbers, and common punctuation."],
  ["문구를 저장하면", "Save a phrase and"],
  ["여기에 차곡차곡 모입니다.", "it will appear here."],
  ["좌우로 밀어 이전·다음 항목 보기", "Swipe to view previous or next item"],
  ["시험 중에는 이전 문제로 갈 수 없습니다.", "You cannot return to a previous question during an exam."],
  ["시험 중에는 퀴즈 유형을 바꿀 수 없습니다.", "You cannot change quiz type during an exam."],
  ["해당 모스 조합의 알파벳이 없습니다.", "No letter matches this Morse sequence."],
  ["진동을 듣고 알파벳을 입력하세요", "Listen to the vibration and enter the letter"],
  ["사진을 ASCII 아트로 보냈습니다.", "Photo sent as ASCII art."],
  ["숨김 신호 재생 횟수", "Hidden signal play limit"],
  ["숨김 신호를", "Hidden signal can be played"],
  ["재생할 수 있습니다.", "times."],
  ["사진 파일만 선택할 수 있습니다.", "Only image files can be selected."],
  ["사진을 읽을 수 없습니다.", "Could not read the photo."],
  ["지원하지 않는 문자:", "Unsupported characters:"],
  ["아직 친구가 없습니다.", "No friends yet."],
  ["이름을 입력해 친구를 추가하세요.", "Enter a name to add a friend."],
  ["아직 메시지가 없습니다.", "No messages yet."],
  ["첫 모스 메시지를 보내보세요.", "Send your first Morse message."],
  ["아직 시험 기록이 없습니다.", "No exam records yet."],
  ["메시지를 삭제했습니다.", "Message deleted."],
  ["문구를 저장했습니다.", "Phrase saved."],
  ["신호 받을 준비 완료", "Ready to receive a signal"],
  ["숨김 모스 신호", "Hidden Morse signal"],
  ["만료된 숨김 모스 신호", "Expired hidden Morse signal"],
  ["ASCII 아트 사진", "ASCII art photo"],
  ["문자 메시지", "Text message"],
  ["모스코드를 입력하세요", "Enter Morse code"],
  ["현재 글자: 비어 있음", "Current letter: empty"],
  ["현재 글자:", "Current letter:"],
  ["글자를 입력하세요", "Enter a letter"],
  ["문장을 입력하세요", "Enter a sentence"],
  ["점과 선을 입력하세요", "Enter dots and dashes"],
  ["· 점과 − 선을 눌러 시작하세요", "Press · dot and − dash to begin"],
  ["작성 문장 재생", "Play written sentence"],
  ["글자·띄어쓰기 확정", "Confirm letters and spaces"],
  ["글자 확정", "Confirm letter"],
  ["띄어쓰기", "Add space"],
  ["스와이프", "Swipe"],
  ["오른쪽", "Right"],
  ["왼쪽", "Left"],
  ["대화 모스 입력 확정", "Chat Morse confirmation"],
  ["좌우 방향 반전", "Reverse left and right"],
  ["앱 전체를 한국어로 표시", "Show the entire app in Korean"],
  ["설정 열기", "Open settings"],
  ["설정 닫기", "Close settings"],
  ["대화 목록으로 돌아가기", "Back to conversations"],
  ["대화와 훈련장 선택", "Choose conversations or training room"],
  ["화면 선택", "Choose screen"],
  ["진동 속도", "Vibration speed"],
  ["훈련 유형", "Training type"],
  ["재생 방식", "Playback mode"],
  ["항목당 반복", "Repeats per item"],
  ["다음 항목까지", "Until next item"],
  ["반복 간격", "Repeat interval"],
  ["모스부호 답 보기", "Show Morse answer"],
  ["진동 듣고 맞히기", "Guess from vibration"],
  ["글자 보고 입력하기", "Enter Morse from a letter"],
  ["시험 시작 · A-Z 전체", "Start exam · All A-Z"],
  ["시험 종료", "End exam"],
  ["기록 보기", "View records"],
  ["정답 확인", "Check answer"],
  ["입력 확정", "Input confirmation"],
  ["한 글자 확인", "Check one letter"],
  ["문장 입력", "Sentence input"],
  ["한 칸 지우기", "Delete one"],
  ["전체 지우기", "Clear current code"],
  ["사진 변환 결과", "Photo conversion result"],
  ["알파벳 모스부호", "Alphabet Morse code"],
  ["모스부호순", "Morse order"],
  ["알파벳순", "Alphabetical"],
  ["문장 훈련", "Sentence training"],
  ["랜덤 알파벳", "Random alphabet"],
  ["무한 반복", "Infinite repeat"],
  ["훈련 시작", "Start training"],
  ["훈련 끝내기", "End training"],
  ["모두 정답", "All correct"],
  ["틀린 항목:", "Wrong items:"],
  ["정답 보기", "Reveal answer"],
  ["미응답", "No answer"],
  ["정답:", "Answer:"],
  ["정답!", "Correct!"],
  ["오답!", "Wrong!"],
  ["오답", "Wrong"],
  ["현재 오답", "Current wrong"],
  ["시험 완료", "Exam complete"],
  ["시험", "Exam"],
  ["듣기", "Listen"],
  ["입력", "Input"],
  ["문구 삭제", "Delete phrase"],
  ["메시지 삭제", "Delete message"],
  ["친구 이름", "Friend name"],
  ["친구 추가", "Add friend"],
  ["문구 저장", "Save phrase"],
  ["전달할 문구를 입력하세요", "Enter a phrase to send"],
  ["사진을 ASCII 아트로 보내기", "Send photo as ASCII art"],
  ["숨김 신호 재생", "Play hidden signal"],
  ["재생 중", "Playing"],
  ["재생", "Play"],
  ["아주 빠름", "Very fast"],
  ["아주 느림", "Very slow"],
  ["빠르게", "Faster"],
  ["느리게", "Slower"],
  ["보통", "Normal"],
  ["느림", "Slow"],
  ["설정", "Settings"],
  ["언어", "Language"],
  ["한국어", "Korean"],
  ["대화", "Conversations"],
  ["훈련장", "Training"],
  ["저장", "Saved"],
  ["훈련", "Training"],
  ["퀴즈", "Quiz"],
  ["쓰기", "Writer"],
  ["목록", "Reference"],
  ["랜덤", "Random"],
  ["문장", "Sentence"],
  ["자동", "Auto"],
  ["수동", "Manual"],
  ["탭", "Tap"],
  ["무제한", "Unlimited"],
  ["지우기", "Delete"],
  ["보내기", "Send"],
  ["초기화", "Reset"],
  ["중지", "Stop"],
  ["취소", "Cancel"],
  ["회", " times"],
  ["초", "s"],
  ["개", ""]
];
const KO_TO_EN = [...I18N_PAIRS].sort((a, b) => b[0].length - a[0].length);
const EN_TO_KO = I18N_PAIRS
  .filter(([, en]) => en.length >= 3)
  .map(([ko, en]) => [en, ko])
  .sort((a, b) => b[0].length - a[0].length);

function translateString(value, language) {
  const pairs = language === "en" ? KO_TO_EN : EN_TO_KO;
  return pairs.reduce((result, [from, to]) => result.includes(from) ? result.replaceAll(from, to) : result, value);
}

function translateElement(root, language) {
  const elements = root.nodeType === Node.ELEMENT_NODE ? [root, ...root.querySelectorAll("*")] : [];
  elements.forEach(element => {
    if (element.closest("[data-no-i18n]")) return;
    if (element.matches("#chatMorseText, #friendInput, #phraseInput, #quizLetterInput, #randomChatInput, #lastSignalInput, #spaceSendInput")) {
      if (element.placeholder) element.placeholder = translateString(element.placeholder, language);
    }
    ["aria-label", "title"].forEach(attribute => {
      if (element.hasAttribute(attribute)) element.setAttribute(attribute, translateString(element.getAttribute(attribute), language));
    });
    [...element.childNodes].filter(node => node.nodeType === Node.TEXT_NODE && node.nodeValue.trim()).forEach(node => {
      node.nodeValue = translateString(node.nodeValue, language);
    });
  });
}

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
function createSignalId() {
  return `SIGNAL-${globalThis.crypto?.randomUUID?.().slice(0, 8).toUpperCase() || Math.random().toString(36).slice(2, 10).toUpperCase()}`;
}
function compareMorse(a, b) {
  const lengthDifference = MORSE[a].length - MORSE[b].length;
  if (lengthDifference) return lengthDifference;
  const aKey = MORSE[a].replaceAll(".", "0").replaceAll("-", "1");
  const bKey = MORSE[b].replaceAll(".", "0").replaceAll("-", "1");
  return aKey < bKey ? -1 : aKey > bKey ? 1 : 0;
}
const MORSE_ORDER = [...LETTERS].sort(compareMorse);
const REVERSE_MORSE = Object.fromEntries(Object.entries(MORSE).map(([key, value]) => [value, key]));
const SENTENCES = [
  "KEEP GOING",
  "HELLO WORLD",
  "GOOD SIGNAL",
  "READY TO SEND",
  "STAY CALM",
  "LISTEN CLOSELY",
  "SEND IT NOW",
  "JUMP AND COPY THIS",
  "CLEAR MESSAGE",
  "ZERO SIGNAL READY",
  "WAIT AND LISTEN",
  "READ THE SIGNAL",
  "WRITE IT DOWN",
  "START WITH DOTS",
  "END WITH DASHES",
  "KEEP A STEADY PACE",
  "PRACTICE EVERY DAY",
  "LEARN EACH LETTER",
  "TRUST YOUR HANDS",
  "FOLLOW THE RHYTHM",
  "PRACTICE MAKES PROGRESS",
  "STAY CALM AND LISTEN",
  "SEND A CLEAR SIGNAL",
  "MORSE IS A QUIET LANGUAGE",
  "LEARN ONE STEP AT A TIME",
  "THE QUICK BROWN FOX",
  "THE SIGNAL IS STRONG",
  "THE MESSAGE IS CLEAR",
  "THE RADIO IS READY",
  "THE CHANNEL IS OPEN",
  "CHECK THE NEXT LETTER",
  "REPEAT THE LAST WORD",
  "WAIT FOR THE SIGNAL",
  "ANSWER WHEN READY",
  "COPY THE FULL MESSAGE",
  "SEND THE FIRST WORD",
  "KEEP THE SPEED STEADY",
  "COUNT EACH SHORT PULSE",
  "COUNT EACH LONG PULSE",
  "PAUSE BETWEEN LETTERS",
  "PAUSE BETWEEN WORDS",
  "LISTEN BEFORE YOU ANSWER",
  "READ BEFORE YOU SEND",
  "WRITE WHAT YOU HEAR",
  "SEND WHAT YOU SEE",
  "EVERY LETTER HAS A RHYTHM",
  "SHORT PULSES MAKE DOTS",
  "LONG PULSES MAKE DASHES",
  "A QUIET ROOM HELPS",
  "FOCUS ON THE PATTERN",
  "REMEMBER THE FIRST SOUND",
  "REMEMBER THE LAST SOUND",
  "SLOW DOWN AND BE CLEAR",
  "SPEED COMES WITH PRACTICE",
  "ACCURACY COMES BEFORE SPEED",
  "SMALL STEPS BUILD SKILL",
  "STRONG HABITS TAKE TIME",
  "GOOD TIMING MAKES IT CLEAR",
  "CLEAR SPACING HELPS A LOT",
  "TRY THE MESSAGE AGAIN",
  "DO NOT RUSH THE SIGNAL",
  "KEEP YOUR INPUT SIMPLE",
  "USE A LIGHT TOUCH",
  "HOLD LONGER FOR A DASH",
  "TAP QUICKLY FOR A DOT",
  "LEAVE SPACE BETWEEN WORDS",
  "FINISH ONE LETTER AT A TIME",
  "CHECK YOUR ANSWER CAREFULLY",
  "LEARN FROM EVERY MISTAKE",
  "BEGIN AGAIN WITH CONFIDENCE",
  "THE NEXT SIGNAL WILL BE EASY",
  "YOUR TIMING IS GETTING BETTER",
  "YOUR MEMORY GROWS WITH PRACTICE",
  "A CLEAR SIGNAL TRAVELS FAR",
  "A GOOD OPERATOR STAYS CALM",
  "A SHORT MESSAGE CAN MATTER",
  "SIMPLE WORDS ARE GOOD PRACTICE",
  "LONG WORDS TEST YOUR MEMORY",
  "LISTEN FOR THE SPACE BETWEEN",
  "FEEL THE DIFFERENCE IN LENGTH",
  "ONE DOT CAN CHANGE A LETTER",
  "ONE DASH CAN CHANGE A WORD",
  "THE FIRST TRY MAY BE SLOW",
  "THE SECOND TRY WILL BE BETTER",
  "THE FINAL MESSAGE IS READY",
  "WE ARE READY TO BEGIN",
  "WE CAN HEAR YOU CLEARLY",
  "PLEASE SEND THE MESSAGE AGAIN",
  "PLEASE WAIT FOR MY ANSWER",
  "THANK YOU FOR THE CLEAR SIGNAL",
  "TODAY IS A GOOD DAY TO PRACTICE",
  "TRAIN YOUR EAR AND YOUR HAND",
  "BUILD SPEED WITHOUT LOSING FORM",
  "USE THE RHYTHM TO FIND THE LETTER",
  "KEEP LISTENING UNTIL IT FEELS NATURAL",
  "A STEADY HAND MAKES A STEADY SIGNAL",
  "THE BEST WAY TO LEARN IS TO PRACTICE",
  "EVERY CLEAR MESSAGE STARTS WITH PATIENCE",
  "MORSE CODE CONNECTS DOTS DASHES AND TIME",
  "SEND EACH LETTER WITH CARE AND CONFIDENCE"
];
const state = {
  phrases: JSON.parse(localStorage.getItem("morse-phrases") || "[]"),
  friends: JSON.parse(localStorage.getItem("morse-friends") || "[]"),
  chats: JSON.parse(localStorage.getItem("morse-chats") || "{}"),
  activeFriend: null,
  chatSignal: "",
  chatMorseText: "",
  chatLetterTimer: null,
  chatSpaceTimer: null,
  chatDeleteTimer: null,
  chatDeleteInterval: null,
  chatDeleteHeld: false,
  chatSendStartX: 0,
  chatSendSwiped: false,
  chatSendLongPressed: false,
  chatSendHoldTimer: null,
  hiddenViewLimit: localStorage.getItem("morse-hidden-view-limit") || "1",
  chatKeyerMode: localStorage.getItem("morse-chat-keyer-mode") || "auto",
  reverseChatSwipe: localStorage.getItem("morse-chat-swipe-reverse") === "true",
  chatKeyerStartX: 0,
  chatKeyerStartY: 0,
  asciiDraft: "",
  asciiTarget: "friend",
  language: localStorage.getItem("morse-language") || "ko",
  world: localStorage.getItem("morse-world") || "hall",
  unit: Number(localStorage.getItem("morse-speed")) || 120,
  trainingMode: localStorage.getItem("morse-mode") || "auto",
  trainingType: localStorage.getItem("morse-training-type") || "random",
  repeatCount: Number(localStorage.getItem("morse-repeat-count")) || 1,
  nextDelay: Number(localStorage.getItem("morse-next-delay")) || 1000,
  training: false,
  trainingTimer: null,
  playTimer: null,
  currentItem: "A",
  sequenceIndex: -1,
  randomBag: [],
  swipeStartX: 0,
  swipeStartY: 0,
  didSwipe: false,
  quizMode: "listen",
  quizAnswer: "A",
  quizSignal: "",
  quizHistory: [],
  quizIndex: -1,
  quizSwipeX: 0,
  quizSwipeY: 0,
  quizDidSwipe: false,
  quizGraded: false,
  examActive: false,
  examTotal: LETTERS.length,
  examResults: [],
  quizRecords: JSON.parse(localStorage.getItem("morse-quiz-records") || "[]"),
  quizKeyerMode: localStorage.getItem("morse-quiz-keyer-mode") || "auto",
  writerSignal: "",
  writerText: "",
  writerMode: localStorage.getItem("morse-writer-mode") || "single",
  writerKeyerMode: localStorage.getItem("morse-writer-keyer-mode") || "auto",
  keyerPressStart: 0,
  keyerStartX: 0,
  keyerStartY: 0,
  quizCommitTimer: null,
  writerLetterTimer: null,
  writerSpaceTimer: null,
  randomSignalState: "idle",
  randomSignalTimer: null,
  randomReplyTimer: null,
  randomPartner: "",
  randomMessages: [],
  randomChatText: "",
  randomChatSignal: "",
  randomChatLetterTimer: null,
  randomChatSpaceTimer: null,
  randomChatKeyerStartX: 0,
  randomChatKeyerStartY: 0,
  randomHiddenLimit: localStorage.getItem("morse-random-hidden-limit") || "1",
  randomSendHoldTimer: null,
  randomSendLongPressed: false,
  spaceSignals: JSON.parse(localStorage.getItem("morse-space-signals") || "[]"),
  spaceReceivedText: "",
  spaceReceivedMorse: "",
  userId: localStorage.getItem("morse-user-id") || createSignalId(),
  serverUrl: localStorage.getItem("morse-server-url") || (location.protocol.startsWith("http") ? location.origin : "http://localhost:8787"),
  serverConnected: false,
  eventSource: null,
  receivedDirectIds: new Set(JSON.parse(localStorage.getItem("morse-received-direct-ids") || "[]")),
  authToken: localStorage.getItem("morse-auth-token") || "",
  account: JSON.parse(localStorage.getItem("morse-account") || "null"),
  googleCredential: "",
  authMode: "register",
  googleClientId: ""
};
if (state.account?.signalId) state.userId = state.account.signalId;
localStorage.setItem("morse-user-id", state.userId);

async function api(path, options = {}) {
  const response = await fetch(`${state.serverUrl}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(state.authToken ? { Authorization: `Bearer ${state.authToken}` } : {}),
      ...(options.headers || {})
    }
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw Object.assign(new Error(body.error || "server-error"), { status: response.status, body });
  return body;
}

function connectServer() {
  state.eventSource?.close();
  state.serverConnected = false;
  renderSettings();
  let stream;
  try {
    if (!state.authToken) return;
    stream = new EventSource(`${state.serverUrl}/api/events?token=${encodeURIComponent(state.authToken)}`);
  } catch {
    showToast("서버 연결에 실패했습니다.");
    return;
  }
  state.eventSource = stream;
  stream.addEventListener("ready", () => {
    state.serverConnected = true;
    renderSettings();
    syncDirectInbox();
  });
  stream.onerror = () => {
    state.serverConnected = false;
    renderSettings();
  };
  stream.addEventListener("direct-message", event => receiveDirectMessage(JSON.parse(event.data)));
  stream.addEventListener("random-connected", event => {
    state.randomSignalState = "connected";
    state.randomPartner = JSON.parse(event.data).partner;
    state.randomMessages = [];
    resetRandomChatInput();
    renderRandomSignal();
    showToast("시그널이 연결되었습니다.");
  });
  stream.addEventListener("random-message", event => {
    state.randomMessages.push({ mine: false, ...JSON.parse(event.data).message });
    renderRandomSignal();
    navigator.vibrate?.([state.unit, state.unit, state.unit]);
  });
  stream.addEventListener("random-disconnected", () => {
    if (state.randomSignalState === "connected") beginLastSignal(false);
  });
  stream.addEventListener("random-last", event => {
    const message = JSON.parse(event.data).message;
    showToast(`라스트 시그널: ${message.text || message}`);
    if (message.text && vibrationPattern(message.text).length) playMorse(message.text);
  });
}

function setAccount(token, account) {
  state.authToken = token;
  state.account = account;
  state.userId = account.signalId;
  localStorage.setItem("morse-auth-token", token);
  localStorage.setItem("morse-account", JSON.stringify(account));
  localStorage.setItem("morse-user-id", account.signalId);
  $("#authPanel").hidden = true;
  connectServer();
  renderSettings();
}

function logoutAccount() {
  state.eventSource?.close();
  state.authToken = "";
  state.account = null;
  state.serverConnected = false;
  localStorage.removeItem("morse-auth-token");
  localStorage.removeItem("morse-account");
  switchWorld("hall");
  renderSettings();
}

function openAuthPanel() {
  $("#authPanel").hidden = false;
  $("#authStatus").textContent = state.googleClientId ? "Google 계정을 먼저 선택하세요." : "Google 로그인이 설정되지 않았습니다.";
}

function renderGoogleButton() {
  if (!state.googleClientId || !globalThis.google?.accounts?.id) return;
  google.accounts.id.initialize({
    client_id: state.googleClientId,
    callback: response => {
      state.googleCredential = response.credential;
      $("#authFields").hidden = false;
      $("#authStatus").textContent = "Google 계정이 확인되었습니다.";
    }
  });
  google.accounts.id.renderButton($("#googleSignInButton"), { theme: "outline", size: "large", width: 330 });
}

async function initializeAuth() {
  try {
    const config = await fetch(`${state.serverUrl}/api/auth/config`).then(response => response.json());
    state.googleClientId = config.googleClientId || "";
    let attempts = 0;
    const timer = setInterval(() => {
      attempts += 1;
      if (globalThis.google?.accounts?.id || attempts > 30) {
        clearInterval(timer);
        renderGoogleButton();
      }
    }, 200);
    if (state.authToken) {
      const { account } = await api("/api/auth/me");
      setAccount(state.authToken, account);
    } else {
      renderSettings();
    }
  } catch {
    renderSettings();
  }
}

function receiveDirectMessage(item, silent = false) {
  if (item.id && state.receivedDirectIds.has(item.id)) return;
  if (item.id) {
    state.receivedDirectIds.add(item.id);
    localStorage.setItem("morse-received-direct-ids", JSON.stringify([...state.receivedDirectIds].slice(-1000)));
  }
  const friend = item.from;
  if (!state.friends.includes(friend)) {
    state.friends.push(friend);
    localStorage.setItem("morse-friends", JSON.stringify(state.friends));
  }
  state.chats[friend] ||= [];
  state.chats[friend].push(item.message);
  saveChats();
  renderFriends();
  if (state.activeFriend === friend) renderChat();
  if (!silent) navigator.vibrate?.([state.unit, state.unit, state.unit]);
}

function syncDirectInbox() {
  api(`/api/direct/inbox?user=${encodeURIComponent(state.userId)}`)
    .then(({ messages }) => messages.forEach(item => receiveDirectMessage(item, true)))
    .catch(() => {});
}

function textToMorse(text) {
  return [...text.toUpperCase()].map(char => char === " " ? "/" : MORSE[char]).filter(Boolean).join(" ");
}

function unsupportedChars(text) {
  return [...new Set([...text.toUpperCase()].filter(char => char !== " " && !MORSE[char]))];
}

function vibrationPattern(text) {
  const units = [];
  const chars = [...text.toUpperCase()].filter(char => char === " " || MORSE[char]);
  chars.forEach((char, charIndex) => {
    if (char === " ") {
      if (units.length) units[units.length - 1] = state.unit * 7;
      return;
    }
    [...MORSE[char]].forEach((mark, markIndex) => {
      units.push(state.unit * (mark === "." ? 1 : 3));
      if (markIndex < MORSE[char].length - 1) units.push(state.unit);
    });
    if (charIndex < chars.length - 1) units.push(state.unit * 3);
  });
  return units;
}

function playMorse(text, onComplete, playerLabel = text) {
  stopMorse(false);
  const pattern = vibrationPattern(text);
  if (!pattern.length) return;
  const duration = pattern.reduce((sum, value) => sum + value, 0);
  if (window.AndroidVibration) window.AndroidVibration.vibrate(pattern.join(","));
  else if (navigator.vibrate) navigator.vibrate(pattern);
  else showToast("이 기기에서는 진동 재생을 지원하지 않습니다.");
  $("#playerText").textContent = playerLabel;
  $("#player").hidden = false;
  $("#playerPulse").classList.add("active");
  state.playTimer = setTimeout(() => {
    $("#player").hidden = true;
    $("#playerPulse").classList.remove("active");
    state.playTimer = null;
    if (onComplete) onComplete();
  }, duration + 100);
}

function stopMorse(stopTraining = true) {
  if (window.AndroidVibration) window.AndroidVibration.cancel();
  else navigator.vibrate?.(0);
  clearTimeout(state.playTimer);
  state.playTimer = null;
  $("#player").hidden = true;
  $("#playerPulse").classList.remove("active");
  if (stopTraining && state.training) endTraining();
}

const RANDOM_REPLIES = {
  ko: [
    "안녕하세요. 시그널이 잘 들려요.",
    "반가워요.",
    "어디에서 보내고 있나요?",
    "저도 모스부호를 연습하고 있어요.",
    "메시지가 선명하게 도착했어요.",
    "무슨 이야기를 해볼까요?",
    "좋은 시그널이에요.",
    "랜덤 시그널 기능이 재미있네요."
  ],
  en: [
    "HELLO. YOUR SIGNAL IS CLEAR.",
    "NICE TO MEET YOU.",
    "WHERE ARE YOU SENDING FROM?",
    "I AM PRACTICING MORSE TOO.",
    "THAT MESSAGE CAME THROUGH CLEARLY.",
    "WHAT SHOULD WE TALK ABOUT?",
    "GOOD SIGNAL. KEEP GOING.",
    "I LIKE THE IDEA OF RANDOM SIGNALS."
  ]
};

function renderRandomSignal() {
  const mode = state.randomSignalState;
  $("#randomSignalIdle").hidden = mode !== "idle";
  $("#randomSignalSearching").hidden = mode !== "searching";
  $("#randomSignalConnected").hidden = mode !== "connected";
  $("#randomSignalLast").hidden = mode !== "last";
  $("#randomSignalStatus").textContent = mode === "connected"
    ? `연결됨 · ${state.randomPartner}`
    : mode === "searching" ? "상대를 찾는 중..."
    : mode === "last" ? "라스트 시그널"
    : "연결 대기 중";

  if (mode === "last") return;
  if (mode !== "connected") return;
  $("#randomChatMessages").innerHTML = state.randomMessages.length
    ? state.randomMessages.map((message, index) => {
      const hidden = message.hidden;
      const ascii = message.type === "ascii";
      const exhausted = hiddenSignalExhausted(message);
      return `
      <div class="random-chat-row ${message.mine ? "mine" : ""}">
        <button type="button" class="random-chat-bubble${hidden ? " hidden-signal" : ""}${exhausted ? " exhausted" : ""}${ascii ? " ascii-message" : ""}" data-random-message="${index}">
          ${hidden ? "" : ascii ? `<pre data-no-i18n>${escapeHtml(message.text)}</pre>` : `<span data-no-i18n>${escapeHtml(message.text)}</span>`}
        </button>
      </div>
    `}).join("")
    : `<p class="random-chat-empty">시그널이 연결되었습니다.<br>첫 메시지를 보내보세요.</p>`;
  $("#randomChatMessages").scrollTop = $("#randomChatMessages").scrollHeight;
  renderRandomChatComposer();
}

function renderRandomChatComposer() {
  $("#randomChatInput").value = state.randomChatText;
  $("#randomChatSignal").textContent = state.randomChatSignal
    ? `현재 글자: ${prettyMorse(state.randomChatSignal)}`
    : "현재 글자: 비어 있음";
  $("#randomChatKeyer").querySelector("small").textContent = state.chatKeyerMode === "auto"
    ? "3단위 휴식: 글자 확정 · 7단위 휴식: 띄어쓰기"
    : `${state.reverseChatSwipe ? "오른쪽" : "왼쪽"} 스와이프: 글자 확정 · ${state.reverseChatSwipe ? "왼쪽" : "오른쪽"}: 띄어쓰기`;
  document.querySelectorAll("[data-random-limit]").forEach(button =>
    button.classList.toggle("active", button.dataset.randomLimit === state.randomHiddenLimit)
  );
}

function resetRandomChatInput() {
  clearTimeout(state.randomChatLetterTimer);
  clearTimeout(state.randomChatSpaceTimer);
  state.randomChatText = "";
  state.randomChatSignal = "";
  renderRandomChatComposer();
}

function commitRandomChatLetter() {
  clearTimeout(state.randomChatLetterTimer);
  state.randomChatLetterTimer = null;
  if (!state.randomChatSignal) return false;
  const decoded = REVERSE_MORSE[state.randomChatSignal];
  if (!decoded || !LETTERS.includes(decoded)) {
    showToast("해당 모스 조합의 알파벳이 없습니다.");
    state.randomChatSignal = "";
    renderRandomChatComposer();
    return false;
  }
  state.randomChatText += decoded;
  state.randomChatSignal = "";
  renderRandomChatComposer();
  return true;
}

function commitRandomChatSpace() {
  commitRandomChatLetter();
  if (state.randomChatText && !state.randomChatText.endsWith(" ")) state.randomChatText += " ";
  renderRandomChatComposer();
}

function addRandomChatSignal(mark) {
  clearTimeout(state.randomChatLetterTimer);
  clearTimeout(state.randomChatSpaceTimer);
  if (state.randomChatSignal.length >= 6) return;
  pulseSignal(mark);
  state.randomChatSignal += mark;
  renderRandomChatComposer();
  if (state.chatKeyerMode === "auto") {
    state.randomChatLetterTimer = setTimeout(commitRandomChatLetter, state.unit * 3);
    state.randomChatSpaceTimer = setTimeout(commitRandomChatSpace, state.unit * 7);
  }
}

function connectRandomSignal() {
  clearTimeout(state.randomSignalTimer);
  clearLastSignalTimers();
  state.randomSignalState = "searching";
  renderRandomSignal();
  api("/api/random/join", {
    method: "POST",
    body: JSON.stringify({ userId: state.userId })
  }).catch(() => {
    state.randomSignalState = "idle";
    renderRandomSignal();
    showToast("서버 연결에 실패했습니다.");
  });
}

function stopRandomSignal(message) {
  clearTimeout(state.randomSignalTimer);
  clearTimeout(state.randomReplyTimer);
  clearLastSignalTimers();
  state.randomSignalState = "idle";
  state.randomPartner = "";
  state.randomMessages = [];
  resetRandomChatInput();
  renderRandomSignal();
  if (message) showToast(message);
}

function clearLastSignalTimers() {
  // Kept as a no-op so older callers can safely reset Last Signal state.
}

function beginLastSignal(notifyServer = true) {
  if (notifyServer) api("/api/random/leave", {
    method: "POST",
    body: JSON.stringify({ userId: state.userId })
  }).catch(() => showToast("서버 연결에 실패했습니다."));
  clearTimeout(state.randomReplyTimer);
  clearLastSignalTimers();
  state.randomSignalState = "last";
  $("#lastSignalInput").value = "";
  renderRandomSignal();
  $("#lastSignalInput").focus();
}

function sendLastSignal(text) {
  const cleanText = text.trim();
  if (!cleanText || state.randomSignalState !== "last") return;
  api("/api/random/last", {
    method: "POST",
    body: JSON.stringify({ userId: state.userId, message: { text: cleanText } })
  }).catch(() => showToast("서버 연결에 실패했습니다."));
  stopRandomSignal("라스트 시그널을 보냈습니다.");
}

function sendRandomChat(text, hidden = false) {
  const cleanText = text.trim();
  if (!cleanText || state.randomSignalState !== "connected") return;
  const outgoing = hidden
    ? { mine: true, text: cleanText, hidden: true, limit: state.randomHiddenLimit, views: 0 }
    : { mine: true, text: cleanText };
  state.randomMessages.push(outgoing);
  resetRandomChatInput();
  renderRandomSignal();
  api("/api/random/send", {
    method: "POST",
    body: JSON.stringify({ userId: state.userId, message: { ...outgoing, mine: false } })
  }).catch(() => showToast("서버 연결에 실패했습니다."));
}

const SPACE_SAMPLE_SIGNALS = {
  ko: [
    { text: "오늘도 좋은 하루 보내세요.", morse: "HAVE A GOOD DAY" },
    { text: "멀리 있어도 같은 하늘을 보고 있어요.", morse: "WE SEE THE SAME SKY" },
    { text: "당신의 시그널이 잘 도착했습니다.", morse: "YOUR SIGNAL ARRIVED CLEARLY" },
    { text: "천천히 가도 괜찮아요.", morse: "IT IS OKAY TO GO SLOW" }
  ],
  en: [
    { text: "HAVE A GOOD DAY.", morse: "HAVE A GOOD DAY" },
    { text: "WE SEE THE SAME SKY.", morse: "WE SEE THE SAME SKY" },
    { text: "YOUR SIGNAL ARRIVED CLEARLY.", morse: "YOUR SIGNAL ARRIVED CLEARLY" },
    { text: "IT IS OKAY TO GO SLOW.", morse: "IT IS OKAY TO GO SLOW" }
  ]
};

function todayKey() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

function renderSpace() {
  const sentToday = localStorage.getItem("morse-space-last-sent") === todayKey();
  $("#spaceSendStatus").textContent = sentToday ? "오늘은 이미 시그널을 발신했습니다." : "오늘 아직 시그널을 발신하지 않았습니다.";
  $("#spaceSendInput").disabled = sentToday;
  $("#spaceSendForm").querySelector("button").disabled = sentToday;
}

function speedName(value) {
  if (value <= 90) return "아주 빠름";
  if (value <= 140) return "보통";
  if (value <= 210) return "느림";
  return "아주 느림";
}

function renderSpeed() {
  $("#speed").value = state.unit;
  $("#speedLabel").textContent = `${speedName(state.unit)} · ${state.unit}ms`;
}

function renderPhrases() {
  $("#emptyState").hidden = state.phrases.length > 0;
  $("#phraseList").innerHTML = state.phrases.map((phrase, index) => `
    <article class="phrase">
      <span class="play-icon">▶</span>
      <button class="phrase-main" data-play="${index}">
        <strong data-no-i18n>${escapeHtml(phrase)}</strong>
        <small>${textToMorse(phrase).replaceAll(".", "·").replaceAll("-", "−")}</small>
      </button>
      <button class="delete" data-delete="${index}" aria-label="문구 삭제">×</button>
    </article>
  `).join("");
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function savePhrases() {
  localStorage.setItem("morse-phrases", JSON.stringify(state.phrases));
  renderPhrases();
}

function renderFriends() {
  $("#friendList").innerHTML = state.friends.length
    ? state.friends.map((friend, index) => `
      <button type="button" class="friend-card" data-friend-index="${index}">
        <span class="friend-avatar">${escapeHtml(friend).charAt(0).toUpperCase()}</span>
        <div class="friend-info">
          <strong data-no-i18n>${escapeHtml(friend)}</strong>
          <small>${state.chats[friend]?.length ? chatPreview(state.chats[friend][state.chats[friend].length - 1]) : "신호 받을 준비 완료"}</small>
        </div>
      </button>`).join("")
    : '<article class="record-item"><strong>아직 친구가 없습니다.</strong><span>이름을 입력해 친구를 추가하세요.</span></article>';
}

function saveChats() {
  localStorage.setItem("morse-chats", JSON.stringify(state.chats));
}

function chatMessageText(message) {
  return typeof message === "string" ? message : message.text || "";
}

function chatPreview(message) {
  if (typeof message === "object" && message.type === "ascii") return "ASCII 아트 사진";
  return typeof message === "object" && message.hidden
    ? "숨김 모스 신호"
    : escapeHtml(chatMessageText(message));
}

function hiddenLimitLabel(limit = state.hiddenViewLimit) {
  return limit === "unlimited" ? "무제한" : `${limit}회`;
}

function hiddenSignalExhausted(message) {
  return typeof message === "object"
    && message.hidden
    && message.limit
    && message.limit !== "unlimited"
    && Number(message.views || 0) >= Number(message.limit);
}

function renderChat() {
  const friend = state.activeFriend;
  if (!friend) return;
  const messages = state.chats[friend] || [];
  $("#chatFriendName").textContent = friend;
  $("#chatAvatar").textContent = friend.charAt(0).toUpperCase();
  $("#chatMessages").innerHTML = messages.length
    ? messages.map((message, index) => {
      const text = chatMessageText(message);
      const hidden = typeof message === "object" && message.hidden;
      const ascii = typeof message === "object" && message.type === "ascii";
      const exhausted = hiddenSignalExhausted(message);
      return `
      <div class="chat-message-row">
        <button type="button" class="chat-delete" data-delete-chat="${index}" aria-label="메시지 삭제">×</button>
        <button type="button" class="chat-bubble${hidden ? " hidden-signal" : ""}${exhausted ? " exhausted" : ""}${ascii ? " ascii-message" : ""}" data-chat-message="${index}" aria-label="${hidden ? (exhausted ? "만료된 숨김 모스 신호" : "숨김 모스 신호 재생") : (ascii ? "ASCII 아트 사진" : "문자 메시지")}">
          ${hidden ? "" : (ascii ? `<pre data-no-i18n>${escapeHtml(text)}</pre>` : `<span data-no-i18n>${escapeHtml(text)}</span>`)}
          ${hidden || ascii ? "" : `<small>${textToMorse(text).replaceAll(".", "·").replaceAll("-", "−")}</small>`}
        </button>
      </div>`;
    }).join("")
    : '<p class="chat-empty">아직 메시지가 없습니다.<br>첫 모스 메시지를 보내보세요.</p>';
  $("#chatMessages").scrollTop = $("#chatMessages").scrollHeight;
}

function renderChatComposer() {
  $("#chatMorseText").value = state.chatMorseText;
  $("#chatMorseSignal").textContent = state.chatSignal
    ? `현재 글자: ${prettyMorse(state.chatSignal)}`
    : "현재 글자: 비어 있음";
  $("#hiddenLimitHint").textContent = `오른쪽 밀기: 숨김 신호 · ${hiddenLimitLabel()}`;
  document.querySelectorAll("[data-hidden-limit]").forEach(button =>
    button.classList.toggle("active", button.dataset.hiddenLimit === state.hiddenViewLimit)
  );
  $("#chatKeyer").querySelector("small").textContent = state.chatKeyerMode === "auto"
    ? "3단위 휴식: 글자 확정 · 7단위 휴식: 띄어쓰기"
    : `${state.reverseChatSwipe ? "오른쪽" : "왼쪽"} 스와이프: 글자 확정 · ${state.reverseChatSwipe ? "왼쪽" : "오른쪽"}: 띄어쓰기`;
}

function renderSettings() {
  document.querySelectorAll("[data-chat-keyer-mode]").forEach(button =>
    button.classList.toggle("active", button.dataset.chatKeyerMode === state.chatKeyerMode)
  );
  $("#reverseChatSwipe").checked = state.reverseChatSwipe;
  $("#swipeReverseSetting").classList.toggle("disabled", state.chatKeyerMode !== "manual");
  $("#swipeDirectionHint").textContent = state.reverseChatSwipe
    ? "오른쪽: 글자 확정 · 왼쪽: 띄어쓰기"
    : "왼쪽: 글자 확정 · 오른쪽: 띄어쓰기";
  document.querySelectorAll("[data-language]").forEach(button =>
    button.classList.toggle("active", button.dataset.language === state.language)
  );
  $("#mySignalId").value = state.userId;
  $("#serverUrl").value = state.serverUrl;
  $("#serverConnectionStatus").textContent = state.serverConnected ? "서버에 연결되었습니다." : "연결 안 됨";
  $("#accountStatus").textContent = state.account ? `${state.account.nickname} · ${state.account.signalId}` : "로그인하지 않음";
  $("#openAuthSettings").hidden = Boolean(state.account);
  $("#logoutAccount").hidden = !state.account;
}

function refreshLocalizedViews() {
  renderSpeed();
  renderPhrases();
  renderFriends();
  if (state.activeFriend) {
    renderChat();
    renderChatComposer();
  }
  if (state.randomSignalState === "connected") renderRandomSignal();
  renderSpace();
  renderTrainingCard();
  renderTrainingHint();
  renderAutoSettings();
  renderQuiz();
  renderQuizRecords();
  renderWriter();
  renderSettings();
}

function applyLanguage(language) {
  state.language = language;
  localStorage.setItem("morse-language", language);
  document.documentElement.lang = language;
  translateElement(document.body, language);
  document.title = "MORSE CHAT";
}

function resetChatMorse() {
  clearTimeout(state.chatLetterTimer);
  clearTimeout(state.chatSpaceTimer);
  state.chatLetterTimer = null;
  state.chatSpaceTimer = null;
  state.chatSignal = "";
  state.chatMorseText = "";
  renderChatComposer();
}

function commitChatLetter() {
  clearTimeout(state.chatLetterTimer);
  state.chatLetterTimer = null;
  if (!state.chatSignal) return false;
  const decoded = REVERSE_MORSE[state.chatSignal];
  if (!decoded || !LETTERS.includes(decoded)) {
    showToast("해당 모스 조합의 알파벳이 없습니다.");
    state.chatSignal = "";
    renderChatComposer();
    return false;
  }
  state.chatMorseText += decoded;
  state.chatSignal = "";
  renderChatComposer();
  return true;
}

function addChatSignal(mark) {
  clearTimeout(state.chatLetterTimer);
  clearTimeout(state.chatSpaceTimer);
  if (state.chatSignal.length >= 6) return;
  pulseSignal(mark);
  state.chatSignal += mark;
  renderChatComposer();
  if (state.chatKeyerMode === "auto") {
    state.chatLetterTimer = setTimeout(commitChatLetter, state.unit * 3);
    state.chatSpaceTimer = setTimeout(() => {
      commitChatLetter();
      if (state.chatMorseText && !state.chatMorseText.endsWith(" ")) state.chatMorseText += " ";
      renderChatComposer();
    }, state.unit * 7);
  }
}

function commitChatSpace() {
  commitChatLetter();
  if (state.chatMorseText && !state.chatMorseText.endsWith(" ")) state.chatMorseText += " ";
  renderChatComposer();
}

function sendChatMessage(message, hidden = false) {
  if (!message || !state.activeFriend) return;
  const outgoing = hidden
    ? { text: message, hidden: true, limit: state.hiddenViewLimit, views: 0 }
    : message;
  state.chats[state.activeFriend].push(outgoing);
  saveChats();
  renderChat();
  api("/api/direct/send", {
    method: "POST",
    body: JSON.stringify({ from: state.userId, to: state.activeFriend, message: outgoing })
  }).catch(() => showToast("서버 연결에 실패했습니다."));
}

function imageToAscii(image) {
  const aspect = image.height / image.width;
  const width = aspect > 1.15 ? 64 : aspect < .72 ? 104 : 88;
  const height = Math.min(220, Math.max(16, Math.round(aspect * width * 0.55)));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d", { willReadFrequently: true });
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";
  context.fillStyle = "white";
  context.fillRect(0, 0, width, height);
  context.drawImage(image, 0, 0, width, height);
  const pixels = context.getImageData(0, 0, width, height).data;
  const brightnessValues = [];
  for (let offset = 0; offset < pixels.length; offset += 4) {
    brightnessValues.push(pixels[offset] * .299 + pixels[offset + 1] * .587 + pixels[offset + 2] * .114);
  }
  const sorted = [...brightnessValues].sort((a, b) => a - b);
  const dark = sorted[Math.floor(sorted.length * .02)];
  const light = sorted[Math.floor(sorted.length * .98)];
  const range = Math.max(24, light - dark);
  const shades = "@%#*+=-:. ";
  const normalizedValues = brightnessValues.map(value => Math.max(0, Math.min(1, (value - dark) / range)));
  const lines = [];
  for (let y = 0; y < height; y++) {
    let line = "";
    for (let x = 0; x < width; x++) {
      const index = y * width + x;
      const normalized = normalizedValues[index];
      const left = normalizedValues[y * width + Math.max(0, x - 1)];
      const right = normalizedValues[y * width + Math.min(width - 1, x + 1)];
      const up = normalizedValues[Math.max(0, y - 1) * width + x];
      const down = normalizedValues[Math.min(height - 1, y + 1) * width + x];
      const edgeX = right - left;
      const edgeY = down - up;
      const edge = Math.sqrt(edgeX * edgeX + edgeY * edgeY);
      const localAverage = (left + right + up + down + normalized) / 5;
      const localContrast = normalized - localAverage;
      if (edge > .18) {
        const horizontal = Math.abs(edgeX) > Math.abs(edgeY) * 1.7;
        const vertical = Math.abs(edgeY) > Math.abs(edgeX) * 1.7;
        line += horizontal ? "|" : vertical ? "_" : edgeX * edgeY > 0 ? "/" : "\\";
      } else {
        const detailed = Math.max(0, Math.min(1, normalized + localContrast * 1.8));
        const corrected = Math.pow(detailed, .9);
        line += shades[Math.min(shades.length - 1, Math.floor(corrected * shades.length))];
      }
    }
    lines.push(line);
  }
  return lines.join("\n");
}

function deleteChatInputCharacter() {
  clearTimeout(state.chatLetterTimer);
  clearTimeout(state.chatSpaceTimer);
  if (state.chatSignal) state.chatSignal = state.chatSignal.slice(0, -1);
  else state.chatMorseText = state.chatMorseText.slice(0, -1);
  renderChatComposer();
}

function openChat(friend) {
  state.activeFriend = friend;
  document.body.classList.add("chat-open");
  $("#hiddenViewPicker").hidden = true;
  resetChatMorse();
  state.chats[friend] ||= [];
  $("#conversationList").hidden = true;
  $("#chatRoom").hidden = false;
  renderChat();
  renderChatComposer();
  api(`/api/direct/history?user=${encodeURIComponent(state.userId)}&friend=${encodeURIComponent(friend)}`)
    .then(({ messages }) => {
      state.chats[friend] = messages.map(item => item.message);
      saveChats();
      renderChat();
    })
    .catch(() => {});
}

function closeChat() {
  document.body.classList.remove("chat-open");
  $("#hiddenViewPicker").hidden = true;
  $("#asciiPreview").hidden = true;
  state.asciiDraft = "";
  clearTimeout(state.chatSendHoldTimer);
  resetChatMorse();
  state.activeFriend = null;
  $("#chatRoom").hidden = true;
  $("#conversationList").hidden = false;
  renderFriends();
}

function switchWorld(world) {
  if (!["friends", "hall", "space", "randomSignal"].includes(world)) world = "hall";
  if (world !== "hall" && !state.account) {
    openAuthPanel();
    world = "hall";
  }
  state.world = world;
  localStorage.setItem("morse-world", world);
  $("#friendsWorld").hidden = world !== "friends";
  $("#trainingHall").hidden = world !== "hall";
  $("#spaceWorld").hidden = world !== "space";
  $("#randomSignalWorld").hidden = world !== "randomSignal";
  document.querySelectorAll(".world-tab").forEach(button =>
    button.classList.toggle("active", button.dataset.world === world)
  );
  if (world !== "hall") {
    stopMorse(false);
    if (state.training) endTraining();
    if (state.examActive) {
      state.examActive = false;
      $("#toggleExam").textContent = "시험 시작 · A-Z 전체";
      renderExamStatus();
    }
  }
  if (world === "space") renderSpace();
  if (world === "randomSignal") renderRandomSignal();
}

function showToast(message) {
  $("#toast").textContent = message;
  $("#toast").classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => $("#toast").classList.remove("show"), 2200);
}

function pulseSignal(mark) {
  const duration = state.unit * (mark === "." ? 1 : 3);
  if (window.AndroidVibration) window.AndroidVibration.vibrate(String(duration));
  else navigator.vibrate?.(duration);
}

function clearKeyerTimers(target) {
  if (target === "quiz") {
    clearTimeout(state.quizCommitTimer);
    state.quizCommitTimer = null;
  } else {
    clearTimeout(state.writerLetterTimer);
    clearTimeout(state.writerSpaceTimer);
    state.writerLetterTimer = null;
    state.writerSpaceTimer = null;
  }
}

function addKeyerSignal(target, mark) {
  clearKeyerTimers(target);
  pulseSignal(mark);
  if (target === "quiz") {
    if (state.quizSignal.length >= 6) return;
    state.quizSignal += mark;
    renderQuiz();
    if (state.quizKeyerMode === "auto") {
      state.quizCommitTimer = setTimeout(() => {
        gradeQuiz(REVERSE_MORSE[state.quizSignal] || "");
      }, state.unit * 3);
    }
  } else {
    if (state.writerSignal.length >= 6) return;
    state.writerSignal += mark;
    renderWriter();
    if (state.writerKeyerMode === "auto") {
      state.writerLetterTimer = setTimeout(() => commitWriterLetter(), state.unit * 3);
      state.writerSpaceTimer = setTimeout(() => {
        commitWriterLetter();
        if (state.writerMode === "sentence" && state.writerText && !state.writerText.endsWith(" ")) state.writerText += " ";
        renderWriter();
      }, state.unit * 7);
    }
  }
}

function setupKeyer(target, selector) {
  const keyer = $(selector);
  keyer.addEventListener("pointerdown", event => {
    clearKeyerTimers(target);
    state.keyerPressStart = performance.now();
    state.keyerStartX = event.clientX;
    state.keyerStartY = event.clientY;
    keyer.classList.add("pressed");
    keyer.setPointerCapture?.(event.pointerId);
  });
  keyer.addEventListener("pointerup", event => {
    keyer.classList.remove("pressed");
    const deltaX = event.clientX - state.keyerStartX;
    const deltaY = event.clientY - state.keyerStartY;
    if (Math.abs(deltaX) >= 45 && Math.abs(deltaX) > Math.abs(deltaY) * 1.25) {
      if (target === "quiz") {
        if (deltaX < 0) gradeQuiz(REVERSE_MORSE[state.quizSignal] || "");
        else {
          state.quizSignal = "";
          renderQuiz();
        }
      } else if (deltaX < 0) {
        commitWriterLetter();
      } else {
        commitWriterLetter();
        if (state.writerMode === "sentence" && state.writerText && !state.writerText.endsWith(" ")) state.writerText += " ";
        renderWriter();
      }
      return;
    }
    const held = performance.now() - state.keyerPressStart;
    addKeyerSignal(target, held < state.unit * 2 ? "." : "-");
  });
  keyer.addEventListener("pointercancel", () => keyer.classList.remove("pressed"));
}

function feedbackVibration(correct) {
  const pattern = correct ? [70, 70, 70] : [300];
  if (window.AndroidVibration) window.AndroidVibration.vibrate(pattern.join(","));
  else navigator.vibrate?.(pattern);
}

function prettyMorse(code) {
  return code.replaceAll(".", "·").replaceAll("-", "−");
}

function createQuizAnswer() {
  const previous = state.quizHistory[state.quizHistory.length - 1] || state.quizAnswer;
  const choices = LETTERS.filter(letter => letter !== previous);
  return choices[secureRandom(choices.length)];
}

function loadQuiz(answer, direction = 1) {
  stopMorse(false);
  clearKeyerTimers("quiz");
  state.quizAnswer = answer;
  state.quizSignal = "";
  state.quizGraded = false;
  $("#quizFeedback").textContent = "";
  $("#quizFeedback").className = "quiz-feedback";
  $("#quizLetterInput").value = "";
  renderQuiz();
  const card = $("#quizCard");
  card.classList.remove("swipe-next", "swipe-prev");
  void card.offsetWidth;
  card.classList.add(direction < 0 ? "swipe-prev" : "swipe-next");
  if (state.quizMode === "listen") setTimeout(() => playMorse(state.quizAnswer, null, "QUIZ"), 250);
}

function newQuiz() {
  state.quizHistory = [createQuizAnswer()];
  state.quizIndex = 0;
  loadQuiz(state.quizHistory[0]);
}

function moveQuiz(direction) {
  if (state.examActive && direction < 0) {
    showToast("시험 중에는 이전 문제로 갈 수 없습니다.");
    return;
  }
  if (state.examActive && direction > 0) {
    if (!state.quizGraded) recordExamAnswer(false, "미응답");
    if (state.quizIndex + 1 >= state.examTotal) {
      finishExam();
      return;
    }
    state.quizIndex += 1;
    if (!state.quizHistory[state.quizIndex]) state.quizHistory.push(createQuizAnswer());
    loadQuiz(state.quizHistory[state.quizIndex], 1);
    renderExamStatus();
    return;
  }
  if (direction < 0 && state.quizIndex > 0) {
    state.quizIndex -= 1;
    loadQuiz(state.quizHistory[state.quizIndex], -1);
  } else if (direction > 0) {
    state.quizIndex += 1;
    if (!state.quizHistory[state.quizIndex]) state.quizHistory.push(createQuizAnswer());
    loadQuiz(state.quizHistory[state.quizIndex], 1);
  }
}

function renderQuiz() {
  const listening = state.quizMode === "listen";
  $("#listenAnswer").hidden = !listening;
  $("#sendAnswer").hidden = listening;
  $("#quizKicker").textContent = listening ? "LISTEN & GUESS" : "READ & SEND";
  $("#quizPrompt").textContent = listening ? "?" : state.quizAnswer;
  $("#quizInputDisplay").textContent = listening
    ? "진동을 듣고 알파벳을 입력하세요"
    : state.quizSignal ? prettyMorse(state.quizSignal) : "점과 선을 입력하세요";
  $("#quizKeyerHint").textContent = state.quizKeyerMode === "auto"
    ? "3단위 쉬면 자동으로 정답 확인"
    : "왼쪽 스와이프: 정답 확인 · 오른쪽: 지우기";
}

function gradeQuiz(answer) {
  if (state.examActive && state.quizGraded) return;
  const correct = answer === state.quizAnswer;
  $("#quizFeedback").textContent = correct ? "정답!" : "오답!";
  $("#quizFeedback").className = `quiz-feedback ${correct ? "correct" : "wrong"}`;
  feedbackVibration(correct);
  state.quizGraded = true;
  if (!correct && state.quizMode === "send") {
    state.quizSignal = "";
    renderQuiz();
  }
  if (state.examActive) {
    recordExamAnswer(correct, answer || "미응답");
    renderExamStatus();
  }
}

function revealQuizAnswer() {
  if (state.examActive) {
    if (!state.quizGraded) {
      state.quizGraded = true;
      recordExamAnswer(false, "정답 보기");
      feedbackVibration(false);
      renderExamStatus();
    }
    const result = state.examResults.find(item => item.index === state.quizIndex);
    const wrong = result && !result.correct;
    $("#quizFeedback").className = `quiz-feedback ${wrong ? "wrong" : "correct"}`;
    $("#quizFeedback").textContent = `${wrong ? "오답! " : ""}정답: ${state.quizAnswer} ${prettyMorse(MORSE[state.quizAnswer])}`;
    return;
  }
  $("#quizFeedback").className = "quiz-feedback correct";
  $("#quizFeedback").textContent = `정답: ${state.quizAnswer} ${prettyMorse(MORSE[state.quizAnswer])}`;
}

function recordExamAnswer(correct, submitted) {
  if (state.examResults.some(result => result.index === state.quizIndex)) return;
  state.examResults.push({
    index: state.quizIndex,
    answer: state.quizAnswer,
    submitted,
    correct
  });
}

function renderExamStatus() {
  $("#examStatus").hidden = !state.examActive;
  if (state.examActive) {
    const wrong = state.examResults.filter(result => !result.correct).length;
    $("#examStatus").textContent = `시험 ${state.quizIndex + 1}/${state.examTotal} · 현재 오답 ${wrong}개`;
  }
}

function startExam() {
  stopMorse(false);
  state.examActive = true;
  state.examResults = [];
  state.quizHistory = shuffledLetters();
  state.quizIndex = 0;
  $("#toggleExam").textContent = "시험 종료";
  loadQuiz(state.quizHistory[0]);
  renderExamStatus();
}

function finishExam() {
  while (state.quizHistory.length < state.examTotal) state.quizHistory.push(createQuizAnswer());
  for (let index = 0; index < state.examTotal; index++) {
    if (!state.examResults.some(result => result.index === index)) {
      state.examResults.push({ index, answer: state.quizHistory[index], submitted: "미응답", correct: false });
    }
  }
  const wrongItems = state.examResults.filter(result => !result.correct);
  const record = {
    date: new Date().toLocaleString(),
    mode: state.quizMode,
    total: state.examTotal,
    wrong: wrongItems.length,
    items: wrongItems.map(item => `${item.answer}(${item.submitted})`)
  };
  state.quizRecords.unshift(record);
  state.quizRecords = state.quizRecords.slice(0, 30);
  localStorage.setItem("morse-quiz-records", JSON.stringify(state.quizRecords));
  state.examActive = false;
  $("#toggleExam").textContent = "시험 시작 · A-Z 전체";
  renderExamStatus();
  renderQuizRecords();
  showToast(`시험 완료 · 오답 ${record.wrong}개`);
  newQuiz();
}

function renderQuizRecords() {
  $("#quizRecords").innerHTML = state.quizRecords.length
    ? state.quizRecords.map(record => `
      <article class="record-item">
        <strong>${record.date} · ${record.mode === "listen" ? "듣기" : "입력"} · 오답 ${record.wrong}/${record.total}</strong>
        <span>${record.items?.length ? `틀린 항목: ${record.items.join(", ")}` : "모두 정답"}</span>
      </article>`).join("")
    : '<article class="record-item"><strong>아직 시험 기록이 없습니다.</strong></article>';
}

function renderWriter() {
  const single = state.writerMode === "single";
  $("#writerText").textContent = state.writerText || (single ? "글자를 입력하세요" : "문장을 입력하세요");
  $("#writerCurrent").textContent = state.writerSignal
    ? `현재 글자: ${prettyMorse(state.writerSignal)}`
    : "현재 글자: 비어 있음";
  $("#writerMorse").textContent = state.writerText
    ? prettyMorse(textToMorse(state.writerText))
    : "· 점과 − 선을 눌러 시작하세요";
  $("#writerKeyerHint").textContent = state.writerKeyerMode === "auto"
    ? "3단위 휴식: 글자 확정 · 7단위 휴식: 띄어쓰기"
    : "왼쪽 스와이프: 글자 확정 · 오른쪽: 띄어쓰기";
  $("#playWriterText").hidden = single;
}

function commitWriterLetter() {
  clearTimeout(state.writerLetterTimer);
  state.writerLetterTimer = null;
  if (!state.writerSignal) return false;
  const decoded = REVERSE_MORSE[state.writerSignal];
  if (!decoded || !LETTERS.includes(decoded)) {
    showToast("해당 모스 조합의 알파벳이 없습니다.");
    return false;
  }
  state.writerText = state.writerMode === "single" ? decoded : state.writerText + decoded;
  state.writerSignal = "";
  renderWriter();
  return true;
}

function secureRandom(max) {
  if (crypto?.getRandomValues) {
    const range = 0x100000000 - (0x100000000 % max);
    const value = new Uint32Array(1);
    do crypto.getRandomValues(value); while (value[0] >= range);
    return value[0] % max;
  }
  return Math.floor(Math.random() * max);
}

function shuffledLetters() {
  const result = [...LETTERS];
  for (let i = result.length - 1; i > 0; i--) {
    const j = secureRandom(i + 1);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function trainingSequence() {
  if (state.trainingType === "alphabet") return LETTERS;
  if (state.trainingType === "morse") return MORSE_ORDER;
  if (state.trainingType === "sentence") {
    const savedSentences = state.phrases.filter(text => text.length > 1 && /^[A-Za-z ]+$/.test(text));
    return savedSentences.length ? savedSentences : SENTENCES;
  }
  if (!state.randomBag.length) state.randomBag = shuffledLetters();
  return state.randomBag;
}

function renderTrainingItem(direction = 1) {
  const activeSequence = trainingSequence();
  state.currentItem = activeSequence[state.sequenceIndex];
  const isSentence = state.trainingType === "sentence";
  const card = $("#trainingCard");
  card.classList.toggle("sentence-card", isSentence);
  card.classList.remove("swipe-next", "swipe-prev");
  void card.offsetWidth;
  card.classList.add(direction < 0 ? "swipe-prev" : "swipe-next");
  $("#trainingLetter").textContent = state.currentItem;
  $("#trainingMorse").textContent = textToMorse(state.currentItem).replaceAll(".", "· ").replaceAll("-", "− ");
  const names = { random: "랜덤 알파벳", alphabet: "알파벳순", morse: "모스부호순", sentence: "문장 훈련" };
  $("#trainingKicker").textContent = `${names[state.trainingType]} · ${state.sequenceIndex + 1}/${activeSequence.length}`;
}

function moveTrainingItem(direction = 1, play = true) {
  const sequence = trainingSequence();
  if (state.trainingType === "random" && direction > 0 && state.sequenceIndex === sequence.length - 1) {
    state.randomBag = shuffledLetters();
    state.sequenceIndex = 0;
  } else {
    state.sequenceIndex = (state.sequenceIndex + direction + sequence.length) % sequence.length;
  }
  renderTrainingItem(direction);
  if (play) setTimeout(() => playTrainingItem(), 350);
}

function nextTrainingItem(play = true) {
  moveTrainingItem(1, play);
}

function playTrainingItem(repetition = 1) {
  clearTimeout(state.trainingTimer);
  playMorse(state.currentItem, () => {
    if (state.training && state.trainingMode === "loop") {
      state.trainingTimer = setTimeout(() => playTrainingItem(), state.nextDelay);
    } else if (state.training && state.trainingMode === "auto") {
      if (repetition < state.repeatCount) {
        state.trainingTimer = setTimeout(() => playTrainingItem(repetition + 1), Math.max(300, state.unit * 3));
      } else {
        state.trainingTimer = setTimeout(() => nextTrainingItem(true), state.nextDelay);
      }
    }
  });
}

function endTraining() {
  state.training = false;
  clearTimeout(state.trainingTimer);
  $("#toggleTraining").textContent = "훈련 시작";
  renderTrainingHint();
}

function renderTrainingHint() {
  const hints = {
    auto: "좌우 스와이프 · 재생 후 자동 이동",
    tap: "좌우 스와이프 · 탭하면 현재 항목 재생",
    loop: "스와이프할 때까지 현재 항목 무한 반복"
  };
  $("#trainingHint").textContent = hints[state.trainingMode];
}

function renderAutoSettings() {
  const showSettings = state.trainingMode === "auto" || state.trainingMode === "loop";
  $("#autoSettings").hidden = !showSettings;
  $("#autoSettings").classList.toggle("loop-settings", state.trainingMode === "loop");
  $("#nextDelayTitle").textContent = state.trainingMode === "loop" ? "반복 간격" : "다음 항목까지";
  $("#repeatCount").value = state.repeatCount;
  $("#nextDelay").value = state.nextDelay;
  $("#nextDelayLabel").textContent = `${(state.nextDelay / 1000).toFixed(1)}초`;
}

$("#phraseForm").addEventListener("submit", event => {
  event.preventDefault();
  const input = $("#phraseInput");
  const value = input.value.trim();
  if (!value) return;
  const unsupported = unsupportedChars(value);
  if (unsupported.length) {
    showToast(`지원하지 않는 문자: ${unsupported.slice(0, 5).join(" ")}`);
    return;
  }
  state.phrases.unshift(value);
  input.value = "";
  savePhrases();
  showToast("문구를 저장했습니다.");
});

$("#phraseList").addEventListener("click", event => {
  const play = event.target.closest("[data-play]");
  const remove = event.target.closest("[data-delete]");
  if (play) playMorse(state.phrases[Number(play.dataset.play)]);
  if (remove) {
    state.phrases.splice(Number(remove.dataset.delete), 1);
    savePhrases();
  }
});

$("#friendForm").addEventListener("submit", event => {
  event.preventDefault();
  const input = $("#friendInput");
  const name = input.value.trim().toUpperCase();
  if (!name || state.friends.includes(name)) return;
  state.friends.push(name);
  localStorage.setItem("morse-friends", JSON.stringify(state.friends));
  input.value = "";
  renderFriends();
});
$("#friendList").addEventListener("click", event => {
  const card = event.target.closest("[data-friend-index]");
  if (card) openChat(state.friends[Number(card.dataset.friendIndex)]);
});
$("#closeChat").addEventListener("click", closeChat);
$("#chatMessages").addEventListener("click", event => {
  const remove = event.target.closest("[data-delete-chat]");
  if (remove && state.activeFriend) {
    state.chats[state.activeFriend].splice(Number(remove.dataset.deleteChat), 1);
    saveChats();
    renderChat();
    renderFriends();
    showToast("메시지를 삭제했습니다.");
    return;
  }
  const bubble = event.target.closest("[data-chat-message]");
  if (!bubble || !state.activeFriend) return;
  const message = state.chats[state.activeFriend][Number(bubble.dataset.chatMessage)];
  if (typeof message !== "object" || !message.hidden) return;
  if (hiddenSignalExhausted(message)) {
    showToast("이 숨김 신호는 재생 횟수를 모두 사용했습니다.");
    return;
  }
  message.views = Number(message.views || 0) + 1;
  saveChats();
  renderChat();
  playMorse(chatMessageText(message), null, "");
});
$("#chatMorseText").addEventListener("input", event => {
  clearTimeout(state.chatLetterTimer);
  clearTimeout(state.chatSpaceTimer);
  state.chatSignal = "";
  const raw = event.target.value.toUpperCase();
  const unsupported = unsupportedChars(raw);
  state.chatMorseText = [...raw].filter(char => char === " " || MORSE[char]).join("");
  event.target.value = state.chatMorseText;
  $("#chatMorseSignal").textContent = "현재 글자: 비어 있음";
  if (unsupported.length) showToast(`지원하지 않는 문자: ${unsupported.slice(0, 5).join(" ")}`);
});
$("#clearChatMorse").addEventListener("pointerdown", event => {
  state.chatDeleteHeld = false;
  $("#clearChatMorse").setPointerCapture?.(event.pointerId);
  state.chatDeleteTimer = setTimeout(() => {
    state.chatDeleteHeld = true;
    deleteChatInputCharacter();
    state.chatDeleteInterval = setInterval(deleteChatInputCharacter, 110);
  }, 420);
});
$("#clearChatMorse").addEventListener("pointerup", () => {
  clearTimeout(state.chatDeleteTimer);
  clearInterval(state.chatDeleteInterval);
  if (!state.chatDeleteHeld) deleteChatInputCharacter();
});
$("#clearChatMorse").addEventListener("pointercancel", () => {
  clearTimeout(state.chatDeleteTimer);
  clearInterval(state.chatDeleteInterval);
});
$("#sendChatMorse").addEventListener("click", () => {
  if (state.chatSendSwiped || state.chatSendLongPressed) {
    state.chatSendSwiped = false;
    state.chatSendLongPressed = false;
    return;
  }
  commitChatLetter();
  const message = state.chatMorseText.trim();
  if (!message) return;
  sendChatMessage(message);
  resetChatMorse();
});
$("#sendChatMorse").addEventListener("pointerdown", event => {
  state.chatSendStartX = event.clientX;
  state.chatSendSwiped = false;
  state.chatSendLongPressed = false;
  clearTimeout(state.chatSendHoldTimer);
  state.chatSendHoldTimer = setTimeout(() => {
    state.chatSendLongPressed = true;
    $("#sendChatMorse").classList.remove("swiping");
    $("#hiddenViewPicker").hidden = false;
  }, 550);
  $("#sendChatMorse").classList.add("swiping");
  $("#sendChatMorse").setPointerCapture?.(event.pointerId);
});
$("#sendChatMorse").addEventListener("pointerup", event => {
  clearTimeout(state.chatSendHoldTimer);
  $("#sendChatMorse").classList.remove("swiping");
  if (state.chatSendLongPressed) return;
  if (event.clientX - state.chatSendStartX < 70) return;
  state.chatSendSwiped = true;
  commitChatLetter();
  const message = state.chatMorseText.trim();
  if (!message) return;
  sendChatMessage(message, true);
  resetChatMorse();
});
$("#sendChatMorse").addEventListener("pointercancel", () => {
  clearTimeout(state.chatSendHoldTimer);
  $("#sendChatMorse").classList.remove("swiping");
});
$("#hiddenViewPicker").addEventListener("click", event => {
  const button = event.target.closest("[data-hidden-limit]");
  if (!button) return;
  state.hiddenViewLimit = button.dataset.hiddenLimit;
  localStorage.setItem("morse-hidden-view-limit", state.hiddenViewLimit);
  $("#hiddenViewPicker").hidden = true;
  renderChatComposer();
  showToast(`숨김 신호를 ${hiddenLimitLabel()} 재생할 수 있습니다.`);
});
$("#chatPhotoInput").addEventListener("change", event => {
  const file = event.target.files?.[0];
  event.target.value = "";
  if (!file) return;
  state.asciiTarget = "friend";
  prepareAsciiPhoto(file);
});
function prepareAsciiPhoto(file) {
  if (!file.type.startsWith("image/")) {
    showToast("사진 파일만 선택할 수 있습니다.");
    return;
  }
  const image = new Image();
  const objectUrl = URL.createObjectURL(file);
  image.onload = () => {
    state.asciiDraft = imageToAscii(image);
    URL.revokeObjectURL(objectUrl);
    $("#asciiPreviewText").textContent = state.asciiDraft;
    $("#asciiPreview").hidden = false;
  };
  image.onerror = () => {
    URL.revokeObjectURL(objectUrl);
    showToast("사진을 읽을 수 없습니다.");
  };
  image.src = objectUrl;
}
$("#cancelAscii").addEventListener("click", () => {
  state.asciiDraft = "";
  $("#asciiPreview").hidden = true;
});
$("#sendAscii").addEventListener("click", () => {
  if (!state.asciiDraft) return;
  if (state.asciiTarget === "friend" && state.activeFriend) {
    sendChatMessage({ type: "ascii", text: state.asciiDraft });
  } else if (state.asciiTarget === "random" && state.randomSignalState === "connected") {
    const outgoing = { mine: true, type: "ascii", text: state.asciiDraft };
    state.randomMessages.push(outgoing);
    renderRandomSignal();
    api("/api/random/send", {
      method: "POST",
      body: JSON.stringify({ userId: state.userId, message: { ...outgoing, mine: false } })
    }).catch(() => showToast("서버 연결에 실패했습니다."));
  } else return;
  state.asciiDraft = "";
  $("#asciiPreview").hidden = true;
  showToast("사진을 ASCII 아트로 보냈습니다.");
});
$("#openSettings").addEventListener("click", () => {
  renderSettings();
  $("#settingsPanel").hidden = false;
});
$("#closeSettings").addEventListener("click", () => $("#settingsPanel").hidden = true);
$("#openAuthSettings").addEventListener("click", openAuthPanel);
$("#logoutAccount").addEventListener("click", logoutAccount);
$("#closeAuthPanel").addEventListener("click", () => {
  $("#authPanel").hidden = true;
  switchWorld("hall");
});
document.querySelectorAll("[data-auth-mode]").forEach(button => button.addEventListener("click", () => {
  state.authMode = button.dataset.authMode;
  document.querySelectorAll("[data-auth-mode]").forEach(item => item.classList.toggle("active", item === button));
  $("#nicknameField").hidden = state.authMode === "login";
  $("#submitAuth").textContent = state.authMode === "login" ? "로그인" : "회원가입";
}));
$("#submitAuth").addEventListener("click", async () => {
  const nickname = $("#authNickname").value.trim();
  const password = $("#authPassword").value;
  if (!state.googleCredential) return showToast("Google 계정을 먼저 선택하세요.");
  if (password.length < 8 || (state.authMode === "register" && nickname.length < 2)) return showToast("닉네임은 2자 이상, 비밀번호는 8자 이상 입력하세요.");
  try {
    const result = await api(`/api/auth/${state.authMode}`, {
      method: "POST",
      body: JSON.stringify({ credential: state.googleCredential, nickname, password })
    });
    setAccount(result.token, result.account);
    showToast(state.authMode === "login" ? "로그인되었습니다." : "회원가입되었습니다.");
  } catch (error) {
    showToast(error.body?.error || "회원가입 또는 로그인에 실패했습니다.");
  }
});
$("#saveServerSettings").addEventListener("click", () => {
  const value = $("#serverUrl").value.trim().replace(/\/+$/, "");
  if (!value) return;
  state.serverUrl = value;
  localStorage.setItem("morse-server-url", value);
  initializeAuth();
});
document.querySelectorAll("[data-chat-keyer-mode]").forEach(button => button.addEventListener("click", () => {
  state.chatKeyerMode = button.dataset.chatKeyerMode;
  localStorage.setItem("morse-chat-keyer-mode", state.chatKeyerMode);
  clearTimeout(state.chatLetterTimer);
  clearTimeout(state.chatSpaceTimer);
  renderSettings();
  renderChatComposer();
  if (state.randomSignalState === "connected") renderRandomChatComposer();
}));
document.querySelectorAll("[data-language]").forEach(button => button.addEventListener("click", () => {
  const language = button.dataset.language;
  if (language === state.language) return;
  state.language = language;
  refreshLocalizedViews();
  applyLanguage(language);
}));
$("#reverseChatSwipe").addEventListener("change", event => {
  state.reverseChatSwipe = event.target.checked;
  localStorage.setItem("morse-chat-swipe-reverse", String(state.reverseChatSwipe));
  renderSettings();
  renderChatComposer();
  if (state.randomSignalState === "connected") renderRandomChatComposer();
});
$("#chatKeyer").addEventListener("pointerdown", event => {
  clearTimeout(state.chatLetterTimer);
  clearTimeout(state.chatSpaceTimer);
  state.keyerPressStart = performance.now();
  state.chatKeyerStartX = event.clientX;
  state.chatKeyerStartY = event.clientY;
  $("#chatKeyer").classList.add("pressed");
  $("#chatKeyer").setPointerCapture?.(event.pointerId);
});
$("#chatKeyer").addEventListener("pointerup", event => {
  $("#chatKeyer").classList.remove("pressed");
  const deltaX = event.clientX - state.chatKeyerStartX;
  const deltaY = event.clientY - state.chatKeyerStartY;
  if (state.chatKeyerMode === "manual" && Math.abs(deltaX) >= 45 && Math.abs(deltaX) > Math.abs(deltaY) * 1.25) {
    const right = deltaX > 0;
    const commitLetter = state.reverseChatSwipe ? right : !right;
    if (commitLetter) commitChatLetter();
    else commitChatSpace();
    return;
  }
  const held = performance.now() - state.keyerPressStart;
  addChatSignal(held < state.unit * 2 ? "." : "-");
});
$("#chatKeyer").addEventListener("pointercancel", () => $("#chatKeyer").classList.remove("pressed"));
$("#connectRandomSignal").addEventListener("click", connectRandomSignal);
$("#cancelRandomSignal").addEventListener("click", () => {
  api("/api/random/leave", {
    method: "POST",
    body: JSON.stringify({ userId: state.userId })
  }).catch(() => {});
  stopRandomSignal("시그널 연결이 취소되었습니다.");
});
$("#disconnectRandomSignal").addEventListener("click", beginLastSignal);
$("#lastSignalForm").addEventListener("submit", event => {
  event.preventDefault();
  sendLastSignal($("#lastSignalInput").value);
});
$("#skipLastSignal").addEventListener("click", () => {
  api("/api/random/skip-last", {
    method: "POST",
    body: JSON.stringify({ userId: state.userId })
  }).catch(() => {});
  stopRandomSignal("시그널 연결이 끊어졌습니다.");
});
$("#randomChatMessages").addEventListener("click", event => {
  const bubble = event.target.closest("[data-random-message]");
  if (!bubble) return;
  const message = state.randomMessages[Number(bubble.dataset.randomMessage)];
  if (!message) return;
  if (message.hidden) {
    if (hiddenSignalExhausted(message)) {
      showToast("이 숨김 신호는 재생 횟수를 모두 사용했습니다.");
      return;
    }
    message.views = Number(message.views || 0) + 1;
    renderRandomSignal();
  }
  if (vibrationPattern(message.text).length) playMorse(message.text, null, message.hidden ? "" : message.text);
});
$("#randomChatInput").addEventListener("input", event => {
  clearTimeout(state.randomChatLetterTimer);
  clearTimeout(state.randomChatSpaceTimer);
  state.randomChatSignal = "";
  state.randomChatText = event.target.value;
  $("#randomChatSignal").textContent = "현재 글자: 비어 있음";
});
$("#clearRandomChat").addEventListener("click", () => {
  if (state.randomChatSignal) state.randomChatSignal = state.randomChatSignal.slice(0, -1);
  else state.randomChatText = state.randomChatText.slice(0, -1);
  renderRandomChatComposer();
});
$("#sendRandomChat").addEventListener("click", () => {
  if (state.randomSendLongPressed) {
    state.randomSendLongPressed = false;
    return;
  }
  commitRandomChatLetter();
  sendRandomChat(state.randomChatText);
});
$("#sendRandomChat").addEventListener("pointerdown", () => {
  state.randomSendLongPressed = false;
  clearTimeout(state.randomSendHoldTimer);
  state.randomSendHoldTimer = setTimeout(() => {
    state.randomSendLongPressed = true;
    $("#randomHiddenPicker").hidden = false;
  }, 550);
});
$("#sendRandomChat").addEventListener("pointerup", () => clearTimeout(state.randomSendHoldTimer));
$("#sendRandomChat").addEventListener("pointercancel", () => clearTimeout(state.randomSendHoldTimer));
$("#randomHiddenPicker").addEventListener("click", event => {
  const button = event.target.closest("[data-random-limit]");
  if (!button) return;
  state.randomHiddenLimit = button.dataset.randomLimit;
  localStorage.setItem("morse-random-hidden-limit", state.randomHiddenLimit);
  $("#randomHiddenPicker").hidden = true;
  state.randomSendLongPressed = false;
  commitRandomChatLetter();
  sendRandomChat(state.randomChatText, true);
});
$("#randomPhotoInput").addEventListener("change", event => {
  const file = event.target.files?.[0];
  event.target.value = "";
  if (!file) return;
  state.asciiTarget = "random";
  prepareAsciiPhoto(file);
});
$("#randomChatKeyer").addEventListener("pointerdown", event => {
  clearTimeout(state.randomChatLetterTimer);
  clearTimeout(state.randomChatSpaceTimer);
  state.keyerPressStart = performance.now();
  state.randomChatKeyerStartX = event.clientX;
  state.randomChatKeyerStartY = event.clientY;
  $("#randomChatKeyer").classList.add("pressed");
  $("#randomChatKeyer").setPointerCapture?.(event.pointerId);
});
$("#randomChatKeyer").addEventListener("pointerup", event => {
  $("#randomChatKeyer").classList.remove("pressed");
  const deltaX = event.clientX - state.randomChatKeyerStartX;
  const deltaY = event.clientY - state.randomChatKeyerStartY;
  if (state.chatKeyerMode === "manual" && Math.abs(deltaX) >= 45 && Math.abs(deltaX) > Math.abs(deltaY) * 1.25) {
    const right = deltaX > 0;
    const commitLetter = state.reverseChatSwipe ? right : !right;
    if (commitLetter) commitRandomChatLetter();
    else commitRandomChatSpace();
    return;
  }
  const held = performance.now() - state.keyerPressStart;
  addRandomChatSignal(held < state.unit * 2 ? "." : "-");
});
$("#randomChatKeyer").addEventListener("pointercancel", () => $("#randomChatKeyer").classList.remove("pressed"));
document.querySelectorAll("[data-space-view]").forEach(button => button.addEventListener("click", () => {
  document.querySelectorAll("[data-space-view]").forEach(item => item.classList.toggle("active", item === button));
  $("#spaceTransmit").hidden = button.dataset.spaceView !== "transmit";
  $("#spaceReceive").hidden = button.dataset.spaceView !== "receive";
}));
$("#spaceSendForm").addEventListener("submit", event => {
  event.preventDefault();
  const text = $("#spaceSendInput").value.trim();
  if (!text) return;
  api("/api/space/send", {
    method: "POST",
    body: JSON.stringify({ sender: state.userId, text, day: todayKey() })
  }).then(() => {
    localStorage.setItem("morse-space-last-sent", todayKey());
    $("#spaceSendInput").value = "";
    renderSpace();
    showToast("우주로 시그널을 발신했습니다.");
  }).catch(error => showToast(error.status === 409 ? "오늘은 이미 시그널을 발신했습니다." : "서버 연결에 실패했습니다."));
});
$("#receiveSpaceSignal").addEventListener("click", () => {
  api(`/api/space/random?exclude=${encodeURIComponent(state.userId)}`).then(signal => {
    state.spaceReceivedText = signal.text;
    state.spaceReceivedMorse = signal.text;
    $("#spaceReceivedSignal").hidden = false;
    $("#spaceReceivedSignal strong").textContent = state.spaceReceivedText;
  }).catch(() => showToast("수신할 우주 시그널이 아직 없습니다."));
});
$("#spaceReceivedSignal button").addEventListener("click", () => {
  if (state.spaceReceivedMorse) playMorse(state.spaceReceivedMorse, null, state.spaceReceivedText);
});
$("#speed").addEventListener("input", event => {
  state.unit = Number(event.target.value);
  localStorage.setItem("morse-speed", state.unit);
  renderSpeed();
  if (state.training) {
    stopMorse(false);
    playTrainingItem();
  }
});

document.querySelectorAll(".tab").forEach(tab => tab.addEventListener("click", () => {
  document.querySelectorAll(".tab, .view").forEach(item => item.classList.remove("active"));
  tab.classList.add("active");
  $(`#${tab.dataset.view}`).classList.add("active");
  if (tab.dataset.view !== "training" && state.training) endTraining();
  if (tab.dataset.view === "quiz" && !state.examActive) newQuiz();
}));

document.querySelectorAll(".mode-button").forEach(button => button.addEventListener("click", () => {
  state.trainingMode = button.dataset.mode;
  localStorage.setItem("morse-mode", state.trainingMode);
  document.querySelectorAll(".mode-button").forEach(item => item.classList.toggle("active", item === button));
  renderAutoSettings();
  renderTrainingHint();
  if (state.training) {
    stopMorse(false);
    playTrainingItem();
  }
}));

$("#repeatCount").addEventListener("change", event => {
  state.repeatCount = Number(event.target.value);
  localStorage.setItem("morse-repeat-count", state.repeatCount);
  if (state.training) {
    stopMorse(false);
    playTrainingItem();
  }
});

$("#nextDelay").addEventListener("input", event => {
  state.nextDelay = Number(event.target.value);
  localStorage.setItem("morse-next-delay", state.nextDelay);
  renderAutoSettings();
});

document.querySelectorAll(".type-button").forEach(button => button.addEventListener("click", () => {
  state.trainingType = button.dataset.type;
  state.sequenceIndex = -1;
  state.randomBag = [];
  localStorage.setItem("morse-training-type", state.trainingType);
  document.querySelectorAll(".type-button").forEach(item => item.classList.toggle("active", item === button));
  stopMorse(false);
  nextTrainingItem(state.training);
}));

$("#toggleTraining").addEventListener("click", () => {
  if (state.training) {
    stopMorse();
  } else {
    state.training = true;
    $("#toggleTraining").textContent = "훈련 끝내기";
    if (state.trainingMode === "tap") {
      playTrainingItem();
    } else {
      state.sequenceIndex = -1;
      nextTrainingItem(true);
    }
  }
});

$("#trainingCard").addEventListener("click", () => {
  if (state.didSwipe) {
    state.didSwipe = false;
    return;
  }
  if (state.trainingMode === "tap" || !state.training) playTrainingItem();
});
$("#trainingCard").addEventListener("pointerdown", event => {
  state.swipeStartX = event.clientX;
  state.swipeStartY = event.clientY;
  state.didSwipe = false;
});
$("#trainingCard").addEventListener("pointerup", event => {
  const deltaX = event.clientX - state.swipeStartX;
  const deltaY = event.clientY - state.swipeStartY;
  if (Math.abs(deltaX) < 45 || Math.abs(deltaX) < Math.abs(deltaY) * 1.25) return;
  state.didSwipe = true;
  stopMorse(false);
  moveTrainingItem(deltaX < 0 ? 1 : -1, state.training);
});
$("#showAnswer").addEventListener("change", event => $("#trainingMorse").style.visibility = event.target.checked ? "visible" : "hidden");
$("#stopPlayer").addEventListener("click", () => stopMorse());
document.querySelectorAll(".world-tab").forEach(button => button.addEventListener("click", () => switchWorld(button.dataset.world)));

document.querySelectorAll(".quiz-mode").forEach(button => button.addEventListener("click", () => {
  if (state.examActive) {
    showToast("시험 중에는 퀴즈 유형을 바꿀 수 없습니다.");
    return;
  }
  state.quizMode = button.dataset.quizMode;
  document.querySelectorAll(".quiz-mode").forEach(item => item.classList.toggle("active", item === button));
  newQuiz();
}));
$("#submitListenQuiz").addEventListener("click", () => gradeQuiz($("#quizLetterInput").value.trim().toUpperCase()));
$("#quizLetterInput").addEventListener("keydown", event => {
  if (event.key === "Enter") gradeQuiz(event.target.value.trim().toUpperCase());
});
$("#quizCard").addEventListener("click", () => {
  if (state.quizDidSwipe) {
    state.quizDidSwipe = false;
    return;
  }
  revealQuizAnswer();
});
$("#quizCard").addEventListener("pointerdown", event => {
  state.quizSwipeX = event.clientX;
  state.quizSwipeY = event.clientY;
  state.quizDidSwipe = false;
});
$("#quizCard").addEventListener("pointerup", event => {
  const deltaX = event.clientX - state.quizSwipeX;
  const deltaY = event.clientY - state.quizSwipeY;
  if (Math.abs(deltaX) < 45 || Math.abs(deltaX) < Math.abs(deltaY) * 1.25) return;
  state.quizDidSwipe = true;
  moveQuiz(deltaX < 0 ? 1 : -1);
});
$("#toggleExam").addEventListener("click", () => {
  if (state.examActive) finishExam();
  else startExam();
});
$("#toggleRecords").addEventListener("click", () => {
  $("#quizRecords").hidden = !$("#quizRecords").hidden;
  renderQuizRecords();
});

document.querySelectorAll(".keyer-mode-button").forEach(button => button.addEventListener("click", () => {
  const target = button.dataset.keyerTarget;
  const mode = button.dataset.keyerMode;
  clearKeyerTimers(target);
  if (target === "quiz") {
    state.quizKeyerMode = mode;
    localStorage.setItem("morse-quiz-keyer-mode", mode);
    renderQuiz();
  } else {
    state.writerKeyerMode = mode;
    localStorage.setItem("morse-writer-keyer-mode", mode);
    renderWriter();
  }
  document.querySelectorAll(`[data-keyer-target="${target}"]`).forEach(item =>
    item.classList.toggle("active", item === button)
  );
}));
setupKeyer("quiz", "#quizKeyer");
setupKeyer("writer", "#writerKeyer");
$("#writerBackspace").addEventListener("click", () => {
  clearKeyerTimers("writer");
  if (state.writerSignal) state.writerSignal = state.writerSignal.slice(0, -1);
  else state.writerText = state.writerText.slice(0, -1);
  renderWriter();
});
$("#clearWriterCode").addEventListener("click", () => {
  clearKeyerTimers("writer");
  if (state.writerSignal) state.writerSignal = "";
  else state.writerText = state.writerText.slice(0, -1);
  renderWriter();
});
$("#resetWriter").addEventListener("click", () => {
  clearKeyerTimers("writer");
  state.writerSignal = "";
  state.writerText = "";
  renderWriter();
});
$("#playWriterText").addEventListener("click", () => {
  if (state.writerText.trim()) playMorse(state.writerText.trim());
});
document.querySelectorAll(".writer-mode-button").forEach(button => button.addEventListener("click", () => {
  clearKeyerTimers("writer");
  state.writerMode = button.dataset.writerMode;
  state.writerSignal = "";
  state.writerText = "";
  localStorage.setItem("morse-writer-mode", state.writerMode);
  document.querySelectorAll(".writer-mode-button").forEach(item => item.classList.toggle("active", item === button));
  renderWriter();
}));

document.querySelectorAll(".mode-button").forEach(button => button.classList.toggle("active", button.dataset.mode === state.trainingMode));
document.querySelectorAll(".type-button").forEach(button => button.classList.toggle("active", button.dataset.type === state.trainingType));
renderTrainingHint();
renderAutoSettings();
renderSpeed();
renderPhrases();
renderFriends();
nextTrainingItem(false);
renderQuiz();
renderQuizRecords();
renderWriter();
renderSettings();
$("#morseReference").innerHTML = LETTERS.map(letter => `
  <button type="button" data-reference-letter="${letter}"><strong>${letter}</strong><span>${prettyMorse(MORSE[letter])}</span></button>
`).join("");
$("#morseReference").addEventListener("click", event => {
  const button = event.target.closest("[data-reference-letter]");
  if (button) playMorse(button.dataset.referenceLetter);
});
document.querySelectorAll(".writer-mode-button").forEach(button =>
  button.classList.toggle("active", button.dataset.writerMode === state.writerMode)
);
document.querySelectorAll(`[data-keyer-target="quiz"]`).forEach(button =>
  button.classList.toggle("active", button.dataset.keyerMode === state.quizKeyerMode)
);
document.querySelectorAll(`[data-keyer-target="writer"]`).forEach(button =>
  button.classList.toggle("active", button.dataset.keyerMode === state.writerKeyerMode)
);
switchWorld(state.world);
applyLanguage(state.language);
initializeAuth();

const languageObserver = new MutationObserver(mutations => {
  mutations.forEach(mutation => {
    if (mutation.type === "characterData") {
      const parent = mutation.target.parentElement;
      if (parent && !parent.closest("[data-no-i18n]")) {
        const translated = translateString(mutation.target.nodeValue, state.language);
        if (translated !== mutation.target.nodeValue) mutation.target.nodeValue = translated;
      }
      return;
    }
    mutation.addedNodes.forEach(node => {
      if (node.nodeType === Node.ELEMENT_NODE) translateElement(node, state.language);
      if (node.nodeType === Node.TEXT_NODE && node.nodeValue.trim() && !node.parentElement?.closest("[data-no-i18n]")) {
        const translated = translateString(node.nodeValue, state.language);
        if (translated !== node.nodeValue) node.nodeValue = translated;
      }
    });
  });
});
languageObserver.observe(document.body, { childList: true, subtree: true, characterData: true });

if ("serviceWorker" in navigator && location.protocol.startsWith("http")) navigator.serviceWorker.register("service-worker.js");
