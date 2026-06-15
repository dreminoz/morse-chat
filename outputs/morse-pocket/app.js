const MORSE_CHAT_SERVER = "https://morse-chat.up.railway.app";
const savedServerUrl = localStorage.getItem("morse-server-url");
if (!savedServerUrl || /localhost:8787|127\.0\.0\.1:8787/.test(savedServerUrl)) {
  localStorage.setItem("morse-server-url", MORSE_CHAT_SERVER);
}

const MORSE = {
  A: ".-", B: "-...", C: "-.-.", D: "-..", E: ".", F: "..-.", G: "--.", H: "....",
  I: "..", J: ".---", K: "-.-", L: ".-..", M: "--", N: "-.", O: "---", P: ".--.",
  Q: "--.-", R: ".-.", S: "...", T: "-", U: "..-", V: "...-", W: ".--", X: "-..-",
  Y: "-.--", Z: "--..", 0: "-----", 1: ".----", 2: "..---", 3: "...--", 4: "....-",
  5: ".....", 6: "-....", 7: "--...", 8: "---..", 9: "----.",
  ".": ".-.-.-", ",": "--..--", "?": "..--..", "!": "-.-.--", "/": "-..-.", "@": ".--.-.", "-": "-....-",
  "'": ".----.", "(": "-.--.", ")": "-.--.-", ":": "---...", ";": "-.-.-.", "=": "-...-", "+": ".-.-.",
  "_": "..--.-", "\"": ".-..-.", "$": "...-..-", "&": ".-..."
};
const SPACE_SIGNAL_ALLOWED_RE = /^[A-Za-z0-9 .,?!/@\-'\(\):;=+_"$&]+$/;
const SPACE_SIGNAL_FILTER_RE = /[^A-Za-z0-9 .,?!/@\-'\(\):;=+_"$&]+/g;
const SHOP_ITEMS = [
  { id: "chat_midnight", category: "chatTheme", slot: "chatTheme", name: "Midnight", icon: "MID" },
  { id: "chat_cream", category: "chatTheme", slot: "chatTheme", name: "Soft Cream", icon: "CRM" },
  { id: "chat_ocean", category: "chatTheme", slot: "chatTheme", name: "Deep Ocean", icon: "SEA" },
  { id: "chat_neon", category: "chatTheme", slot: "chatTheme", name: "Signal Neon", icon: "NEO" },
  { id: "random_void", category: "randomTheme", slot: "randomTheme", name: "Signal Void", icon: "VOID" },
  { id: "random_radar", category: "randomTheme", slot: "randomTheme", name: "Radar Grid", icon: "RAD" },
  { id: "random_sunset", category: "randomTheme", slot: "randomTheme", name: "Sunset Signal", icon: "SUN" },
  { id: "random_ice", category: "randomTheme", slot: "randomTheme", name: "Frozen Signal", icon: "ICE" },
  { id: "sound_basic", category: "morseSound", slot: "morseSound", name: "Basic", icon: "BIP", free: true },
  { id: "sound_click", category: "morseSound", slot: "morseSound", name: "Radio Click", icon: "CLK" },
  { id: "sound_drop", category: "morseSound", slot: "morseSound", name: "Water Drop", icon: "DROP" },
  { id: "sound_beep", category: "morseSound", slot: "morseSound", name: "Classic Beep", icon: "BEEP" },
  { id: "sound_chime", category: "morseSound", slot: "morseSound", name: "Glass Chime", icon: "CHM" },
  { id: "border_ring", category: "profile", slot: "profileBorder", name: "Signal Ring", icon: "RING" },
  { id: "border_neon", category: "profile", slot: "profileBorder", name: "Neon Border", icon: "NEON" },
  { id: "border_double", category: "profile", slot: "profileBorder", name: "Double Border", icon: "DBL" },
  { id: "border_dashed", category: "profile", slot: "profileBorder", name: "Morse Border", icon: "DOT" },
  { id: "profile_night", category: "profile", slot: "profileBackground", name: "Night Profile", icon: "NGT" },
  { id: "profile_ocean", category: "profile", slot: "profileBackground", name: "Ocean Profile", icon: "OCN" },
  { id: "profile_sunset", category: "profile", slot: "profileBackground", name: "Sunset Profile", icon: "SET" },
  { id: "profile_cream", category: "profile", slot: "profileBackground", name: "Cream Profile", icon: "CRM" }
];
const SHOP_CATEGORIES = [
  { id: "randomTheme", name: "Random Signal", description: "Random Signal chat decorations" },
  { id: "chatTheme", name: "Chat Theme", description: "Direct and owner-controlled group themes" },
  { id: "morseSound", name: "Morse Sound", description: "Sounds heard when a message is played" },
  { id: "profile", name: "Profile Style", description: "Profile borders and backgrounds" }
];

const $ = (selector) => document.querySelector(selector);
const I18N_PAIRS = [
  ["비밀일기", "Secret Diary"],
  ["비밀번호 입력", "Enter password"],
  ["비밀번호 설정", "Set password"],
  ["비밀번호 확인", "Confirm password"],
  ["비밀일기 열기", "Open Secret Diary"],
  ["비밀일기를 열려면 비밀번호를 입력하세요.", "Enter your password to open the Secret Diary."],
  ["처음 사용할 비밀번호를 설정하세요. 잊으면 일기를 열 수 없습니다.", "Set your first password. A forgotten password cannot be recovered."],
  ["일기를 입력하세요", "Write your diary entry"],
  ["대화 입력 설정을 따릅니다", "Uses conversation input settings"],
  ["오른쪽 밀기: 진동 전용", "Swipe right: vibration only"],
  ["진동 전용 일기", "Vibration-only entry"],
  ["탭해서 모스 진동으로 듣기 · 무제한", "Tap to play Morse vibration · Unlimited"],
  ["아직 작성한 일기가 없습니다.", "No diary entries yet."],
  ["잠그기", "Lock"],
  ["그룹 사진 설정", "Set group photo"],
  ["강퇴", "Remove"],
  ["나가기", "Leave"],
  ["멤버를 불러오는 중입니다.", "Loading members."],
  ["짧게: 점 · 길게: 선", "Short: dot · Long: dash"],
  ["알림 켜기", "Enable notifications"],
  ["알림", "Notifications"],
  ["알림을 켰습니다.", "Notifications enabled."],
  ["브라우저 설정에서 알림을 허용해 주세요.", "Please allow notifications in your browser settings."],
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
  ["상하좌우 스와이프로 직접 입력", "Enter manually with four-way swipes"],
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
  ["Letters, numbers, and Morse symbols", "Letters, numbers, and Morse symbols"],
  ["오늘은 이미 시그널을 발신했습니다.", "You already transmitted a signal today."],
  ["오늘 아직 시그널을 발신하지 않았습니다.", "You have not transmitted a signal today."],
  ["우주로 시그널을 발신했습니다.", "Signal transmitted into space."],
  ["레이더가 우주 시그널을 탐색하고 있습니다.", "Radar is scanning for a Space signal."],
  ["레이더가 시그널을 추적하고 있습니다.", "Radar is tracking a signal."],
  ["우주 시그널을 수신했습니다.", "Space signal received."],
  ["모스 진동에 맞춰 해석 중", "Decoding with Morse vibration"],
  ["해석 완료", "Decoding complete"],
  ["다시 해석하기", "Decode again"],
  ["프로필", "Profile"],
  ["자기소개", "About me"],
  ["자신을 소개해보세요", "Tell others about yourself"],
  ["프로필 사진 선택", "Choose profile photo"],
  ["사진 지우기", "Remove photo"],
  ["프로필 저장", "Save profile"],
  ["닉네임 변경", "Change nickname"],
  ["닉네임 저장", "Save nickname"],
  ["친구 프로필 보기", "View friend profile"],
  ["프로필 닫기", "Close profile"],
  ["아직 자기소개가 없습니다.", "No introduction yet."],
  ["대화하기", "Chat"],
  ["닉네임을 변경했습니다.", "Nickname changed."],
  ["이미 사용 중인 닉네임입니다.", "That nickname is already in use."],
  ["프로필을 저장했습니다.", "Profile saved."],
  ["시그널 발신", "Signal Transmit"],
  ["시그널 수신", "Signal Receive"],
  ["시그널 재생 횟수", "Signal play limit"],
  ["친구의 닉네임을 입력하세요.", "Enter your friend's nickname."],
  ["서버 연결에 실패했습니다.", "Failed to connect to the server."],
  ["서버에 연결되었습니다.", "Connected to server."],
  ["연결 확인 중", "Checking connection"],
  ["연결 안 됨", "Disconnected"],
  ["내 시그널 ID", "My Signal ID"],
  ["친구 닉네임", "Friend nickname"],
  ["수신할 우주 시그널이 아직 없습니다.", "There are no Space signals to receive yet."],
  ["Google 계정으로 계속한 뒤, 최초 한 번만 닉네임을 설정합니다.", "Continue with Google, then choose a nickname once."],
  ["Google 계정을 먼저 선택하세요.", "Select a Google account first."],
  ["Google 로그인이 설정되지 않았습니다.", "Google Sign-In is not configured."],
  ["닉네임은 2자 이상 입력하세요.", "Enter a nickname of at least 2 characters."],
  ["Google 계정으로 계속하기", "Continue with Google"],
  ["훈련장으로 돌아가기", "Return to Training"],
  ["로그인하지 않음", "Not signed in"],
  ["계정 연결", "Connect account"],
  ["로그인", "Sign in"],
  ["로그아웃", "Sign out"],
  ["닉네임", "Nickname"],
  ["Google 계정이 확인되었습니다.", "Google account verified."],
  ["로그인되었습니다.", "Signed in."],
  ["닉네임 설정", "Set nickname"],
  ["Google 계정을 확인하고 있습니다.", "Checking your Google account."],
  ["처음 로그인입니다. 사용할 닉네임을 설정하세요.", "First sign-in. Choose a nickname to use."],
  ["Google 로그인에 실패했습니다.", "Google sign-in failed."],
  ["닉네임이 설정되었습니다.", "Nickname set."],
  ["닉네임 설정에 실패했습니다.", "Failed to set nickname."],
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
  ["알파벳·숫자 모스부호", "Alphabet and number Morse code"],
  ["건의하기", "Send suggestion"],
  ["추가했으면 하는 기능이나 불편한 점을 적어주세요", "Tell us about a feature request or inconvenience"],
  ["건의사항 보내기", "Send suggestion"],
  ["작성 중인 일기", "Diary draft"],
  ["선택한 날짜의 일기", "Entries for selected date"],
  ["저장된 내용", "Saved entries"],
  ["일기 저장을 눌러야 서버에 저장됩니다", "Press Save Diary to store it on the server"],
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
  ["친구 요청 보내기", "Send friend request"],
  ["친구 닉네임", "Friend nickname"],
  ["네이티브 광고", "Native ad"],
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
const NUMBERS = "0123456789".split("");
const INPUT_CHARACTERS = [...LETTERS, ...NUMBERS];
const GRAPHEME_SEGMENTER = globalThis.Intl?.Segmenter
  ? new Intl.Segmenter(undefined, { granularity: "grapheme" })
  : null;
const EMOJI_GRAPHEME = /[\p{Extended_Pictographic}\p{Emoji_Presentation}\p{Emoji_Modifier}\uFE0F\u20E3]/u;

function graphemes(text) {
  return GRAPHEME_SEGMENTER
    ? [...GRAPHEME_SEGMENTER.segment(text)].map(item => item.segment)
    : [...text];
}

function isEmojiGrapheme(value) {
  return EMOJI_GRAPHEME.test(value);
}

function chatInputText(text) {
  return text;
}

function morseCharacters(text) {
  return graphemes(text.toUpperCase())
    .filter(value => !isEmojiGrapheme(value))
    .flatMap(value => [...value])
    .map(char => char === "\n" ? " " : char)
    .filter(char => char === " " || /^[A-Z0-9]$/.test(char));
}

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
const REFERENCE_ITEMS = [...LETTERS, ..."0123456789", "10", ".", ",", "?", "!", "/", "@", "-", "'", "(", ")", ":", ";", "=", "+", "_", "\"", "$", "&"];
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
const GAME_WORD_POOL = ["CODE", "SIGNAL", "RADIO", "MORSE", "LIGHT", "SPACE", "WAVE", "HELLO", "READY", "QUIET", "SPEED", "NIGHT", "WORLD", "CLEAR", "POWER", "VOICE", "DREAM", "POINT", "DASH", "PULSE", "BRAVE", "FOCUS", "QUICK", "START", "TRAIN", "WRITE", "LISTEN", "CLOUD", "STORM", "FLASH"];
const state = {
  phrases: JSON.parse(localStorage.getItem("morse-phrases") || "[]"),
  friends: JSON.parse(localStorage.getItem("morse-friends") || "[]"),
  friendRequests: [],
  sentFriendRequests: [],
  chats: JSON.parse(localStorage.getItem("morse-chats") || "{}"),
  unreadDirect: JSON.parse(localStorage.getItem("morse-unread-direct") || "{}"),
  unreadGroups: JSON.parse(localStorage.getItem("morse-unread-groups") || "{}"),
  unreadRandom: Number(localStorage.getItem("morse-unread-random")) || 0,
  unreadDaily: Number(localStorage.getItem("morse-unread-daily")) || 0,
  groups: [],
  activeGroup: null,
  groupMessages: [],
  dailyGroup: null,
  dailyGroupMessages: [],
  diaryUnlocked: false,
  diaryEntries: JSON.parse(localStorage.getItem("morse-secret-diary-entries") || "[]"),
  diaryHasServerPassword: false,
  diaryPasswordHash: "",
  diarySignal: "",
  diaryText: "",
  diaryLetterTimer: null,
  diarySpaceTimer: null,
  diaryKeyerStartX: 0,
  diaryKeyerStartY: 0,
  diarySelectedDate: new Date().toLocaleDateString("en-CA"),
  diaryCalendarMonth: new Date().toLocaleDateString("en-CA").slice(0, 7),
  diaryDirty: false,
  diaryDraftSegments: [],
  gameWords: [],
  gameIndex: -1,
  gameRunning: false,
  gameStartedAt: 0,
  gameTimerInterval: null,
  gameText: "",
  gameSignal: "",
  gameLetterTimer: null,
  gameSpaceTimer: null,
  gameKeyerStartX: 0,
  gameKeyerStartY: 0,
  gameRanking: [],
  gameMyRank: null,
  groupSignal: "",
  dailyGroupSignal: "",
  groupText: "",
  dailyGroupText: "",
  groupLetterTimer: null,
  groupSpaceTimer: null,
  dailyGroupLetterTimer: null,
  dailyGroupSpaceTimer: null,
  groupKeyerStartedAt: 0,
  groupKeyerStartX: 0,
  groupKeyerStartY: 0,
  groupHiddenViews: JSON.parse(localStorage.getItem("morse-group-hidden-views") || "{}"),
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
  chatKeyerMode: localStorage.getItem("morse-chat-keyer-mode") || "manual",
  reverseChatSwipe: localStorage.getItem("morse-chat-swipe-reverse") === null
    ? true
    : localStorage.getItem("morse-chat-swipe-reverse") === "true",
  autocompletes: JSON.parse(localStorage.getItem("morse-autocompletes") || "[]"),
  autocompleteKeyerPressStart: 0,
  secretActive: false,
  secretPartner: "",
  secretSessionId: "",
  pendingSecretPartner: "",
  pendingSecretSessionId: "",
  secretExitArmed: false,
  secretPointerDown: false,
  secretExitTimer: null,
  chatKeyerStartX: 0,
  chatKeyerStartY: 0,
  asciiDraft: "",
  asciiTarget: "friend",
  profileDraftAscii: null,
  profileCache: {},
  viewingProfileSignalId: "",
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
  quizKeyerMode: localStorage.getItem("morse-chat-keyer-mode") || "manual",
  writerSignal: "",
  writerText: "",
  writerMode: localStorage.getItem("morse-writer-mode") || "single",
  writerKeyerMode: localStorage.getItem("morse-chat-keyer-mode") || "manual",
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
  randomSendStartX: 0,
  randomSendSwiped: false,
  randomSendHoldTimer: null,
  randomSendLongPressed: false,
  spaceSignals: JSON.parse(localStorage.getItem("morse-space-signals") || "[]"),
  receivedSpaceIds: new Set(JSON.parse(localStorage.getItem("morse-received-space-ids") || "[]")),
  spaceReceivedText: "",
  spaceReceivedMorse: "",
  spaceReceivedSignal: null,
  spaceDecodeTimers: [],
  spaceReceiving: false,
  spaceSendText: "",
  spaceSendSignal: "",
  spaceSendLetterTimer: null,
  spaceSendSpaceTimer: null,
  spaceSendKeyerStartX: 0,
  spaceSendKeyerStartY: 0,
  userId: localStorage.getItem("morse-user-id") || createSignalId(),
  serverUrl: location.protocol.startsWith("http") ? location.origin : (localStorage.getItem("morse-server-url") || MORSE_CHAT_SERVER),
  serverConnected: false,
  eventSource: null,
  receivedDirectIds: new Set(JSON.parse(localStorage.getItem("morse-received-direct-ids") || "[]")),
  authToken: localStorage.getItem("morse-auth-token") || "",
  account: JSON.parse(localStorage.getItem("morse-account") || "null"),
  googleCredential: "",
  googleClientId: "",
  authMode: "google",
  usernameChecked: "",
  shopInventory: [],
  shopEquipped: {},
  shopCoins: 0,
  shopDrawCost: 50,
  shopLastDraw: null,
  shopInventoryCategory: "randomTheme",
  chatMessageHoldTimer: null,
  chatMessageHoldIndex: -1,
  chatMessageLongPressed: false,
  chatMessageHoldX: 0,
  chatMessageHoldY: 0,
  backExitArmed: false,
  backExitTimer: null
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
  if (!response.ok) {
    const error = Object.assign(new Error(body.error || "server-error"), { status: response.status, body });
    throw error;
  }
  return body;
}

function showApiFailure(error, fallback = "서버 연결에 실패했습니다.") {
  if (error?.handled) return;
  showToast(fallback);
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
    clearTimeout(state.serverReconnectTimer);
    state.serverConnected = true;
    renderSettings();
    syncDirectInbox();
    loadFriends();
    loadFriendRequests();
  });
  stream.onerror = () => {
    state.serverConnected = false;
    renderSettings();
    clearTimeout(state.serverReconnectTimer);
    state.serverReconnectTimer = setTimeout(() => {
      if (state.authToken && !state.serverConnected) connectServer();
    }, 4000);
  };
  stream.addEventListener("direct-message", event => receiveDirectMessage(JSON.parse(event.data)));
  stream.addEventListener("group-message", event => {
    const message = JSON.parse(event.data);
    const group = state.groups.find(item => item.id === message.groupId);
    if (state.activeGroup?.id === message.groupId && !state.groupMessages.some(item => item.id === message.id)) {
      state.groupMessages.push(message);
      renderGroupMessages();
    }
    if (state.dailyGroup?.id === message.groupId && !state.dailyGroupMessages.some(item => item.id === message.id)) {
      state.dailyGroupMessages.push(message);
      renderDailyGroup();
    }
    if (!message.mine && message.from !== state.userId) {
      if (state.dailyGroup?.id === message.groupId) {
        if (state.world !== "dailyGroup") state.unreadDaily += 1;
      } else if (state.activeGroup?.id !== message.groupId) {
        state.unreadGroups[message.groupId] = Number(state.unreadGroups[message.groupId] || 0) + 1;
        if (group) group.lastMessageAt = message.createdAt || Date.now();
        renderGroups();
      }
      saveUnread();
      showNativeNotification(
        state.dailyGroup?.id === message.groupId
          ? (state.language === "en" ? "Daily Group Chat" : "데일리 그룹챗")
          : (group?.name || (state.language === "en" ? "Group Chat" : "그룹챗")),
        message.hidden ? "Morse Only" : (message.type === "ascii" ? "ASCII Art" : String(message.text || "").slice(0, 100))
      );
    }
  });
  stream.addEventListener("group-updated", () => {
    loadGroups();
    if (state.activeGroup) loadGroupHistory(state.activeGroup.id);
  });
  stream.addEventListener("friend-request", event => {
    const request = JSON.parse(event.data);
    if (!state.friendRequests.some(item => item.id === request.id)) state.friendRequests.unshift(request);
    renderFriendRequests();
    showToast(state.language === "en" ? "New friend request." : "새 친구 요청이 왔습니다.");
  });
  stream.addEventListener("friend-response", event => {
    const request = JSON.parse(event.data);
    if (request.status === "accepted" && !state.friends.includes(request.to)) {
      state.friends.push(request.to);
      localStorage.setItem("morse-friends", JSON.stringify(state.friends));
      loadFriendProfiles();
    }
    showToast(request.status === "accepted"
      ? (state.language === "en" ? "Friend request accepted." : "친구 요청이 수락되었습니다.")
      : (state.language === "en" ? "Friend request rejected." : "친구 요청이 거절되었습니다."));
    loadFriends();
    loadFriendRequests();
  });
  stream.addEventListener("friend-removed", event => {
    const { friend } = JSON.parse(event.data);
    removeLocalFriend(friend);
    showToast(state.language === "en" ? "A friend removed you." : "친구 관계가 해제되었습니다.");
  });
  stream.addEventListener("secret-signal", event => {
    const signal = JSON.parse(event.data);
    if (signal.action === "enter") {
      if (!state.friends.includes(signal.from)) return;
      state.pendingSecretPartner = signal.from;
      state.pendingSecretSessionId = signal.sessionId;
      if (state.activeFriend === signal.from) renderChat();
      showToast(state.language === "en" ? "Secret Communication invitation received." : "시크릿 대화 초대가 도착했습니다.");
      return;
    }
    if (!state.secretActive || signal.from !== state.secretPartner) return;
    if (signal.action === "down") startSecretVibration();
    else if (signal.action === "up") stopSecretVibration();
    else if (signal.action === "exit") {
      state.pendingSecretPartner = "";
      state.pendingSecretSessionId = "";
      closeSecretComm(false);
    }
  });
  stream.addEventListener("random-connected", event => {
    markRandomConnected(JSON.parse(event.data).partner);
    showToast("시그널이 연결되었습니다.");
  });
  stream.addEventListener("random-message", event => {
    state.randomMessages.push({ mine: false, ...JSON.parse(event.data).message });
    if (state.world !== "randomSignal") {
      state.unreadRandom += 1;
      saveUnread();
    }
    renderRandomSignal();
    navigator.vibrate?.([state.unit, state.unit, state.unit]);
  });
  stream.addEventListener("random-disconnected", () => {
    if (state.randomSignalState === "connected") beginLastSignal(false);
  });
  stream.addEventListener("random-last", event => {
    const message = JSON.parse(event.data).message;
    showToast(`라스트 시그널: ${message.text || message}`);
    if (message.text && vibrationPattern(message.text).length) playMorse(message.text, null, message.text, message.senderSound || "");
  });
}

document.addEventListener("visibilitychange", () => {
  if (!document.hidden && state.authToken && !state.serverConnected) connectServer();
});
window.addEventListener("online", () => {
  if (state.authToken && !state.serverConnected) connectServer();
});

function base64UrlToUint8Array(value) {
  const padding = "=".repeat((4 - value.length % 4) % 4);
  const base64 = (value + padding).replace(/-/g, "+").replace(/_/g, "/");
  return Uint8Array.from(atob(base64), character => character.charCodeAt(0));
}

async function setupPushNotifications() {
  if (!state.authToken || !("serviceWorker" in navigator) || !("PushManager" in window) || !("Notification" in window)) return false;
  if (!location.protocol.startsWith("http")) return false;
  try {
    const config = await api("/api/push/config");
    if (!config.enabled || !config.publicKey) return false;
    const permission = Notification.permission === "default" ? await Notification.requestPermission() : Notification.permission;
    if (permission !== "granted") return false;
    const registration = await navigator.serviceWorker.register("service-worker.js");
    let subscription = await registration.pushManager.getSubscription();
    if (!subscription) {
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: base64UrlToUint8Array(config.publicKey)
      });
    }
    await api("/api/push/subscribe", {
      method: "POST",
      body: JSON.stringify({ subscription: subscription.toJSON(), language: state.language })
    });
    return true;
  } catch (error) {
    console.warn("Push notifications are unavailable:", error);
    return false;
  }
}

function setAccount(token, account) {
  state.authToken = token;
  state.account = account;
  state.shopEquipped = account.equipped || {};
  state.userId = account.signalId;
  localStorage.setItem("morse-auth-token", token);
  localStorage.setItem("morse-account", JSON.stringify(account));
  localStorage.setItem("morse-user-id", account.signalId);
  state.profileDraftAscii = account.profileAscii || "";
  $("#authPanel").hidden = true;
  connectServer();
  setupPushNotifications();
  renderSettings();
  loadShop();
  switchWorld(notificationWorldFromHash() || "friends");
  loadFriendProfiles();
}

function notificationWorldFromHash() {
  return {
    "#friends": "friends",
    "#random": "randomSignal",
    "#daily": "dailyGroup",
    "#space": "space"
  }[location.hash] || "";
}

function applyAccountUpdate(account) {
  state.account = account;
  state.shopEquipped = account.equipped || {};
  state.userId = account.signalId;
  state.profileDraftAscii = account.profileAscii || "";
  localStorage.setItem("morse-account", JSON.stringify(account));
  localStorage.setItem("morse-user-id", account.signalId);
  renderSettings();
  renderMyProfile();
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

function setAuthMode(mode) {
  state.authMode = mode;
  state.usernameChecked = "";
  $("#authModeGoogle")?.classList.toggle("active", mode === "google");
  $("#authModeLogin")?.classList.toggle("active", mode === "login");
  $("#authModeRegister")?.classList.toggle("active", mode === "register");
  $("#googleSignInButton").hidden = mode !== "google" || Boolean(window.AndroidAuth);
  $("#androidGoogleSignIn").hidden = mode !== "google" || !window.AndroidAuth;
  $("#authFields").hidden = true;
  $("#localAuthFields").hidden = mode === "google";
  $("#localNicknameLabel").hidden = mode !== "register";
  $("#localPasswordConfirmLabel").hidden = mode !== "register";
  $("#checkUsername").hidden = mode !== "register";
  $("#localPassword").autocomplete = mode === "register" ? "new-password" : "current-password";
  $("#submitLocalAuth").textContent = mode === "register" ? "Sign up" : "Log in";
  $("#authStatus").textContent = mode === "google"
    ? (state.googleClientId || window.AndroidAuth ? "Select a Google account." : "Google Sign-In is not configured.")
    : mode === "register"
      ? "Check your ID, then sign up."
      : "Enter your ID and password.";
}

function openAuthPanel() {
  $("#authPanel").hidden = false;
  $("#authNickname").value = "";
  $("#localUsername").value = "";
  $("#localNickname").value = "";
  $("#localPassword").value = "";
  $("#localPasswordConfirm").value = "";
  state.googleCredential = "";
  setAuthMode(state.authMode || "google");
}

function normalizeLocalUsername() {
  const username = $("#localUsername").value.trim().toLowerCase();
  $("#localUsername").value = username;
  return username;
}

function validLocalUsername(username) {
  return /^[a-z0-9_.-]{3,24}$/.test(username);
}

async function checkLocalUsername() {
  const username = normalizeLocalUsername();
  if (!validLocalUsername(username)) {
    state.usernameChecked = "";
    $("#authStatus").textContent = "ID must be 3-24 chars: a-z, 0-9, _, ., -";
    return false;
  }
  try {
    const result = await api(`/api/auth/username?username=${encodeURIComponent(username)}`);
    if (result.available) {
      state.usernameChecked = username;
      $("#authStatus").textContent = "This ID is available.";
      return true;
    }
    state.usernameChecked = "";
    $("#authStatus").textContent = "This ID is already taken.";
    return false;
  } catch (error) {
    state.usernameChecked = "";
    $("#authStatus").textContent = "Could not check this ID.";
    return false;
  }
}

async function submitLocalAuth() {
  const username = normalizeLocalUsername();
  const password = $("#localPassword").value;
  if (!validLocalUsername(username)) return showToast("ID must be 3-24 chars.");
  if (password.length < 6) return showToast("Password must be at least 6 chars.");
  const body = { username, password };
  let endpoint = "/api/auth/login";
  if (state.authMode === "register") {
    const nickname = $("#localNickname").value.trim();
    const passwordConfirm = $("#localPasswordConfirm").value;
    if (state.usernameChecked !== username && !(await checkLocalUsername())) return;
    if (nickname.length < 2) return showToast("Nickname must be at least 2 chars.");
    if (password !== passwordConfirm) return showToast("Passwords do not match.");
    endpoint = "/api/auth/register";
    body.nickname = nickname;
    body.passwordConfirm = passwordConfirm;
  }
  try {
    const result = await api(endpoint, { method: "POST", body: JSON.stringify(body) });
    setAccount(result.token, result.account);
    showToast(state.authMode === "register" ? "Account created." : "Signed in.");
  } catch (error) {
    const messages = {
      "username-taken": "This ID is already taken.",
      "nickname-taken": "That nickname is already in use.",
      "invalid-login": "ID or password is wrong.",
      "password-mismatch": "Passwords do not match.",
      "weak-password": "Password must be at least 6 chars.",
      "invalid-username": "ID must be 3-24 chars."
    };
    showToast(messages[error.body?.error] || "Account action failed.");
  }
}

function renderGoogleButton() {
  if (window.AndroidAuth) {
    $("#androidGoogleSignIn").hidden = state.authMode !== "google";
    $("#googleSignInButton").hidden = true;
    return;
  }
  if (!state.googleClientId || !globalThis.google?.accounts?.id) return;
  $("#androidGoogleSignIn").hidden = true;
  $("#googleSignInButton").hidden = state.authMode !== "google";
  google.accounts.id.initialize({
    client_id: state.googleClientId,
    callback: async response => {
      state.googleCredential = response.credential;
      $("#authStatus").textContent = "Google 계정을 확인하고 있습니다.";
      try {
        const result = await api("/api/auth/google", {
          method: "POST",
          body: JSON.stringify({ credential: state.googleCredential })
        });
        setAccount(result.token, result.account);
        showToast("로그인되었습니다.");
      } catch (error) {
        if (error.body?.error === "nickname-required") {
          $("#authFields").hidden = false;
          $("#authStatus").textContent = "처음 로그인입니다. 사용할 닉네임을 설정하세요.";
          $("#authNickname").focus();
          return;
        }
        showToast(error.body?.error || "Google 로그인에 실패했습니다.");
      }
    }
  });
  google.accounts.id.renderButton($("#googleSignInButton"), { theme: "outline", size: "large", width: 330 });
}

window.handleAndroidGoogleCredential = async credential => {
  state.googleCredential = credential;
  $("#authStatus").textContent = state.language === "en" ? "Checking your Google account." : "Google 계정을 확인하고 있습니다.";
  try {
    const result = await api("/api/auth/google", {
      method: "POST",
      body: JSON.stringify({ credential })
    });
    setAccount(result.token, result.account);
    showToast(state.language === "en" ? "Signed in." : "로그인되었습니다.");
  } catch (error) {
    if (error.body?.error === "nickname-required") {
      $("#authFields").hidden = false;
      $("#authStatus").textContent = state.language === "en"
        ? "First sign-in. Choose a nickname to use."
        : "처음 로그인입니다. 사용할 닉네임을 설정하세요.";
      $("#authNickname").focus();
      return;
    }
    const serverFailed = !error.body && (!error.status || error.status >= 500);
    showToast(serverFailed
      ? (state.language === "en" ? `Server connection failed: ${state.serverUrl}` : `서버 연결 실패: ${state.serverUrl}`)
      : (error.body?.error || (state.language === "en" ? "Google sign-in failed." : "Google 로그인에 실패했습니다.")));
  }
};

window.handleAndroidGoogleError = statusCode => {
  const labels = {
    7: "NETWORK_ERROR",
    10: "DEVELOPER_ERROR",
    12500: "SIGN_IN_FAILED",
    12501: "SIGN_IN_CANCELLED",
    12502: "SIGN_IN_CURRENTLY_IN_PROGRESS"
  };
  const detail = labels[statusCode] || `ERROR_${statusCode}`;
  showToast(state.language === "en" ? `Google sign-in failed: ${detail}` : `Google 로그인 실패: ${detail}`);
};

window.handleAndroidGoogleException = detail => {
  showToast(state.language === "en" ? `Could not open Google sign-in: ${detail}` : `Google 로그인 열기 실패: ${detail}`);
};

async function initializeAuth() {
  if (window.AndroidAuth) renderGoogleButton();
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
  } catch (error) {
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
  state.chats[friend] ||= [];
  state.chats[friend].push(taggedChatMessage(item.message, false, item.createdAt));
  if (!silent && state.activeFriend !== friend) {
    state.unreadDirect[friend] = Number(state.unreadDirect[friend] || 0) + 1;
    saveUnread();
  }
  saveChats();
  renderFriends();
  if (state.activeFriend === friend) renderChat();
  if (!silent) {
    navigator.vibrate?.([state.unit, state.unit, state.unit]);
    const message = item.message || {};
    showNativeNotification(
      state.language === "en" ? `New message from ${item.fromNickname || "a friend"}` : `${item.fromNickname || "친구"}의 새 메시지`,
      message.hidden ? "Morse Only" : (message.type === "ascii" ? "ASCII Art" : String(message.text || message).slice(0, 100))
    );
  }
}

function showNativeNotification(title, body) {
  try {
    globalThis.AndroidNotifications?.show(String(title || "morsiq"), String(body || ""));
  } catch {}
}

function syncDirectInbox() {
  api(`/api/direct/inbox?user=${encodeURIComponent(state.userId)}`)
    .then(({ messages }) => messages.forEach(item => receiveDirectMessage(item, true)))
    .catch(() => {});
}

function taggedChatMessage(message, mine, createdAt = Date.now()) {
  return typeof message === "object" ? { ...message, mine, createdAt: message.createdAt || createdAt } : { text: message, mine, createdAt };
}

function textToMorse(text) {
  return morseCharacters(text).map(char => char === " " ? "/" : MORSE[char]).filter(Boolean).join(" ");
}

function unsupportedChars(text) {
  return [...new Set(graphemes(text.toUpperCase()).filter(value =>
    !isEmojiGrapheme(value) && [...value].some(char => char !== " " && char !== "\n" && !MORSE[char])
  ))];
}

function vibrationPattern(text) {
  const units = [];
  const chars = morseCharacters(text);
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

function playMorseAudio(pattern, soundId) {
  if (soundId === "sound_off" || !window.AudioContext && !window.webkitAudioContext) return;
  soundId ||= "sound_basic";
  const AudioEngine = window.AudioContext || window.webkitAudioContext;
  const context = playMorseAudio.context ||= new AudioEngine();
  context.resume?.();
  let elapsed = 0;
  pattern.forEach((duration, index) => {
    if (index % 2 === 0) {
      const start = context.currentTime + elapsed / 1000;
      const end = start + duration / 1000;
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = soundId === "sound_chime" ? "triangle" : soundId === "sound_click" ? "square" : "sine";
      const startFrequency = soundId === "sound_basic" ? 700 : soundId === "sound_drop" ? 960 : soundId === "sound_chime" ? 1100 : soundId === "sound_click" ? 180 : 680;
      const endFrequency = soundId === "sound_drop" ? 310 : soundId === "sound_chime" ? 720 : startFrequency;
      oscillator.frequency.setValueAtTime(startFrequency, start);
      if (endFrequency !== startFrequency) oscillator.frequency.exponentialRampToValueAtTime(endFrequency, end);
      gain.gain.setValueAtTime(.001, start);
      gain.gain.linearRampToValueAtTime(soundId === "sound_click" ? .08 : .16, start + .006);
      gain.gain.setValueAtTime(soundId === "sound_click" ? .08 : .16, Math.max(start + .006, end - .012));
      gain.gain.linearRampToValueAtTime(.001, end);
      oscillator.connect(gain).connect(context.destination);
      oscillator.start(start);
      oscillator.stop(end);
    }
    elapsed += duration;
  });
}

function playMorse(text, onComplete, playerLabel = text, soundId = "") {
  stopMorse(false);
  const pattern = vibrationPattern(text);
  if (!pattern.length) return;
  const duration = pattern.reduce((sum, value) => sum + value, 0);
  playMorseAudio(pattern, soundId);
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

function equippedSound() {
  return state.account?.equipped?.morseSound || state.shopEquipped?.morseSound || "sound_basic";
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
  applyTheme($("#randomSignalWorld"), state.account?.equipped?.randomTheme, "theme-");
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
          ${message.createdAt ? `<time>${new Date(message.createdAt).toLocaleString()}</time>` : ""}
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
    : `${state.reverseChatSwipe ? "오른쪽" : "왼쪽"}: 확정 · ${state.reverseChatSwipe ? "왼쪽" : "오른쪽"}: 띄어쓰기 · 위: 대문자 · 아래: 엔터`;
  document.querySelectorAll("[data-random-limit]").forEach(button =>
    button.classList.toggle("active", button.dataset.randomLimit === state.randomHiddenLimit)
  );
  $("#randomHiddenLimitHint").textContent = `${state.language === "en" ? "Swipe right: hidden signal" : "오른쪽 밀기: 숨김 신호"} · ${hiddenLimitLabel(state.randomHiddenLimit)}`;
}

function resetRandomChatInput() {
  clearTimeout(state.randomChatLetterTimer);
  clearTimeout(state.randomChatSpaceTimer);
  state.randomChatText = "";
  state.randomChatSignal = "";
  renderRandomChatComposer();
}

function autocompleteText(signal) {
  return state.autocompletes.find(item => item.code === signal)?.text || "";
}

function decodedInput(signal, uppercase = false) {
  const autocomplete = autocompleteText(signal);
  if (autocomplete) return autocomplete;
  const decoded = REVERSE_MORSE[signal];
  if (!decoded || !INPUT_CHARACTERS.includes(decoded)) return "";
  return LETTERS.includes(decoded) && !uppercase ? decoded.toLowerCase() : decoded;
}

function commitRandomChatLetter(uppercase = false) {
  clearTimeout(state.randomChatLetterTimer);
  state.randomChatLetterTimer = null;
  if (!state.randomChatSignal) return false;
  const decoded = decodedInput(state.randomChatSignal, uppercase);
  if (!decoded) {
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

function commitRandomChatNewline() {
  commitRandomChatLetter();
  if (state.randomChatText && !state.randomChatText.endsWith("\n")) state.randomChatText += "\n";
  renderRandomChatComposer();
}

function addRandomChatSignal(mark) {
  clearTimeout(state.randomChatLetterTimer);
  clearTimeout(state.randomChatSpaceTimer);
  if (state.randomChatSignal.length >= 10) return;
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
  }).then(result => {
    if (result.status === "connected") markRandomConnected();
    else pollRandomStatus();
  }).catch(error => {
    state.randomSignalState = "idle";
    renderRandomSignal();
    showApiFailure(error);
  });
}

function markRandomConnected(partner = "RANDOM SIGNAL") {
  const wasConnected = state.randomSignalState === "connected";
  clearTimeout(state.randomSignalTimer);
  state.randomSignalState = "connected";
  state.randomPartner = partner;
  state.randomMessages = [];
  resetRandomChatInput();
  renderRandomSignal();
  if (!wasConnected) {
    if (state.world !== "randomSignal") {
      state.unreadRandom += 1;
      saveUnread();
    }
    showNativeNotification(
      state.language === "en" ? "Random Signal connected" : "랜덤 시그널 연결",
      state.language === "en" ? "A new signal has connected." : "새로운 시그널과 연결되었습니다."
    );
  }
  showToast(state.language === "en" ? "Signal connected." : "시그널이 연결되었습니다.");
}

function pollRandomStatus() {
  clearTimeout(state.randomSignalTimer);
  if (state.randomSignalState !== "searching") return;
  state.randomSignalTimer = setTimeout(() => {
    api("/api/random/status").then(result => {
      if (result.status === "connected") markRandomConnected();
      else pollRandomStatus();
    }).catch(() => pollRandomStatus());
  }, 1200);
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
  showPostRandomSignalAd();
}

function showPostRandomSignalAd() {
  window.AndroidAds?.showRandomSignalInterstitial?.();
}

function sendRandomChat(text, hidden = false) {
  const cleanText = text.trim();
  if (!cleanText || state.randomSignalState !== "connected") return;
  const outgoing = hidden
    ? { mine: true, text: cleanText, hidden: true, limit: state.randomHiddenLimit, views: 0, senderSound: equippedSound(), createdAt: Date.now() }
    : { mine: true, text: cleanText, senderSound: equippedSound(), createdAt: Date.now() };
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
  const countKey = `morse-space-sent-count-${todayKey()}`;
  const sentCount = Number(localStorage.getItem(countKey) || 0);
  const limitReached = sentCount >= 30;
  $("#spaceSendStatus").textContent = state.language === "en" ? `Sent today: ${sentCount} / 30` : `오늘 발신: ${sentCount} / 30`;
  $("#spaceSendInput").value = state.spaceSendText;
  $("#spaceSendInput").disabled = limitReached;
  $("#spaceSendKeyer").disabled = limitReached;
  $("#submitSpaceSignal").disabled = limitReached;
  $("#spaceSendSignal").textContent = state.spaceSendSignal
    ? `현재 글자: ${prettyMorse(state.spaceSendSignal)}`
    : "현재 글자: 비어 있음";
  $("#spaceSendKeyer").querySelector("small").textContent = state.chatKeyerMode === "auto"
    ? "3단위 휴식: 글자 확정 · 7단위 휴식: 띄어쓰기"
    : `${state.reverseChatSwipe ? "오른쪽" : "왼쪽"}: 확정 · ${state.reverseChatSwipe ? "왼쪽" : "오른쪽"}: 띄어쓰기 · 위: 대문자 · 아래: 엔터`;
}

function commitSpaceSendLetter(uppercase = false) {
  clearTimeout(state.spaceSendLetterTimer);
  state.spaceSendLetterTimer = null;
  if (!state.spaceSendSignal) return false;
  const decoded = decodedInput(state.spaceSendSignal, uppercase);
  if (!decoded) {
    showToast("해당 모스 조합의 알파벳이 없습니다.");
    state.spaceSendSignal = "";
    renderSpace();
    return false;
  }
  if (state.spaceSendText.length >= 300) return false;
  state.spaceSendText += decoded;
  state.spaceSendSignal = "";
  renderSpace();
  return true;
}

function commitSpaceSendSpace() {
  commitSpaceSendLetter();
  if (state.spaceSendText && !state.spaceSendText.endsWith(" ")) state.spaceSendText += " ";
  renderSpace();
}

function commitSpaceSendNewline() {
  commitSpaceSendSpace();
}

function addSpaceSendSignal(mark) {
  clearTimeout(state.spaceSendLetterTimer);
  clearTimeout(state.spaceSendSpaceTimer);
  if (state.spaceSendSignal.length >= 10) return;
  pulseSignal(mark);
  state.spaceSendSignal += mark;
  renderSpace();
  if (state.chatKeyerMode === "auto") {
    state.spaceSendLetterTimer = setTimeout(commitSpaceSendLetter, state.unit * 3);
    state.spaceSendSpaceTimer = setTimeout(commitSpaceSendSpace, state.unit * 7);
  }
}

function playSpaceTransmitAnimation() {
  const animation = $("#spaceTransmitAnimation");
  animation.classList.remove("transmitting");
  void animation.offsetWidth;
  animation.classList.add("transmitting");
  setTimeout(() => animation.classList.remove("transmitting"), 2100);
}

function clearSpaceDecode() {
  state.spaceDecodeTimers.forEach(clearTimeout);
  state.spaceDecodeTimers = [];
  $("#spaceReceivedSignal").classList.remove("decoding");
}

function morseCharacterDuration(char) {
  const code = MORSE[char.toUpperCase()];
  if (!code) return 0;
  return [...code].reduce((duration, mark, index) =>
    duration + state.unit * (mark === "." ? 1 : 3) + (index < code.length - 1 ? state.unit : 0), 0
  );
}

function decodeSpaceSignal() {
  if (!state.spaceReceivedText) return;
  if (state.spaceReceivedSignal?.type === "ascii") {
    $("#spaceReceivedSignal strong").innerHTML = `<pre data-no-i18n>${escapeHtml(state.spaceReceivedText)}</pre>`;
    $("#spaceDecodeStatus").textContent = state.language === "en" ? "ASCII art signal" : "ASCII 아트 시그널";
    return;
  }
  clearSpaceDecode();
  stopMorse(false);
  const output = $("#spaceReceivedSignal strong");
  const status = $("#spaceDecodeStatus");
  const article = $("#spaceReceivedSignal");
  output.textContent = "";
  status.textContent = "모스 진동에 맞춰 해석 중";
  article.classList.add("decoding");

  let elapsed = 0;
  graphemes(state.spaceReceivedText).forEach(value => {
    if (isEmojiGrapheme(value)) {
      state.spaceDecodeTimers.push(setTimeout(() => { output.textContent += value; }, elapsed));
      return;
    }
    [...value].forEach(char => {
      if (char === " ") {
        elapsed += state.unit * 4;
        state.spaceDecodeTimers.push(setTimeout(() => { output.textContent += " "; }, elapsed));
        return;
      }
      const duration = morseCharacterDuration(char);
      if (!duration) {
        state.spaceDecodeTimers.push(setTimeout(() => { output.textContent += char; }, elapsed));
        return;
      }
      elapsed += duration;
      state.spaceDecodeTimers.push(setTimeout(() => { output.textContent += char; }, elapsed));
      elapsed += state.unit * 3;
    });
  });

  state.spaceDecodeTimers.push(setTimeout(() => {
    article.classList.remove("decoding");
    status.textContent = "해석 완료";
  }, elapsed + 100));
  playMorse(state.spaceReceivedMorse, null, "");
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

function unreadLabel(count) {
  return count > 9 ? "9+" : String(count || "");
}

function unreadBubble(count) {
  return count ? `<span class="unread-badge">${unreadLabel(count)}</span>` : "";
}

function saveUnread() {
  localStorage.setItem("morse-unread-direct", JSON.stringify(state.unreadDirect));
  localStorage.setItem("morse-unread-groups", JSON.stringify(state.unreadGroups));
  localStorage.setItem("morse-unread-random", state.unreadRandom);
  localStorage.setItem("morse-unread-daily", state.unreadDaily);
  updateWorldUnreadBadges();
}

function updateWorldUnreadBadges() {
  const direct = Object.values(state.unreadDirect).reduce((sum, value) => sum + Number(value || 0), 0);
  const groups = Object.values(state.unreadGroups).reduce((sum, value) => sum + Number(value || 0), 0);
  const values = { friends: direct + groups, randomSignal: state.unreadRandom, dailyGroup: state.unreadDaily };
  Object.entries(values).forEach(([world, count]) => {
    const tab = document.querySelector(`.world-tab[data-world="${world}"]`);
    if (tab) tab.dataset.unread = unreadLabel(count);
  });
}

function renderFriends() {
  const sortedFriends = [...state.friends].sort((a, b) =>
    Number(state.chats[b]?.at(-1)?.createdAt || 0) - Number(state.chats[a]?.at(-1)?.createdAt || 0)
  );
  $("#friendList").innerHTML = sortedFriends.length
    ? sortedFriends.map(friend => `
      <article class="friend-card" data-friend-id="${escapeHtml(friend)}">
        <button type="button" class="friend-profile-button" data-profile-friend="${escapeHtml(friend)}" aria-label="친구 프로필 보기">
          ${profileAvatarHtml(state.profileCache[friend], friend)}
        </button>
        <button type="button" class="friend-conversation-button" data-open-friend-id="${escapeHtml(friend)}">
        <div class="friend-info">
          <strong data-no-i18n>${escapeHtml(state.profileCache[friend]?.nickname || friend)}</strong>
          <small>${state.chats[friend]?.length ? chatPreview(state.chats[friend][state.chats[friend].length - 1]) : "신호 받을 준비 완료"}</small>
        </div>
        </button>
        ${unreadBubble(Number(state.unreadDirect[friend] || 0))}
      </article>`).join("")
    : '<article class="record-item"><strong>아직 친구가 없습니다.</strong><span>이름을 입력해 친구를 추가하세요.</span></article>';
}

function renderGroups() {
  const sortedGroups = [...state.groups].sort((a, b) => Number(b.lastMessageAt || 0) - Number(a.lastMessageAt || 0));
  $("#groupList").innerHTML = sortedGroups.length
    ? sortedGroups.map(group => `
      <button type="button" class="friend-card" data-open-group="${escapeHtml(group.id)}">
        ${group.profileAscii ? `<span class="friend-avatar"><span class="ascii-avatar" data-no-i18n>${escapeHtml(group.profileAscii)}</span></span>` : `<span class="friend-avatar">#</span>`}
        <span class="friend-info">
          <strong data-no-i18n>${escapeHtml(group.name)}</strong>
          <small>${group.members.length}명 참여 중</small>
        </span>
        ${unreadBubble(Number(state.unreadGroups[group.id] || 0))}
      </button>
    `).join("")
    : '<article class="record-item"><strong>아직 그룹챗이 없습니다.</strong><span>그룹챗 만들기로 친구들과 시작하세요.</span></article>';
}

function loadGroups() {
  if (!state.authToken) return;
  api("/api/groups").then(({ groups }) => {
    state.groups = groups;
    renderGroups();
  }).catch(() => {});
}

function groupMemberName(group, signalId, fallback = "") {
  return group?.members?.find(member => member.signalId === signalId)?.nickname || fallback || signalId;
}

function renderGroupMessageList(target, messages, group) {
  target.innerHTML = messages.length ? messages.map((message, index) => {
    if (message.id && message.hidden) message.views = Number(state.groupHiddenViews[message.id] || 0);
    const mine = message.mine || message.from === state.userId;
    const hidden = Boolean(message.hidden);
    const ascii = message.type === "ascii";
    const exhausted = hiddenSignalExhausted(message);
    return `<div class="chat-message-row${mine ? " mine" : ""}">
      <div class="chat-bubble${hidden ? " hidden-signal" : ""}${exhausted ? " exhausted" : ""}${ascii ? " ascii-message" : ""}" data-group-message="${index}">
        <button type="button" class="group-author-button" data-group-profile="${escapeHtml(message.from)}" data-daily-author="${group?.type === "daily" ? "true" : "false"}">${escapeHtml(groupMemberName(group, message.from, message.fromNickname))}</button>
        ${hidden ? "" : ascii ? `<pre data-no-i18n>${escapeHtml(message.text)}</pre>` : `<span data-no-i18n>${escapeHtml(message.text)}</span>`}
      </div>
    </div>`;
  }).join("") : '<p class="chat-empty">아직 메시지가 없습니다.</p>';
  target.scrollTop = target.scrollHeight;
}

function renderGroupMessages() {
  if (!state.activeGroup) return;
  applyTheme($("#groupRoom"), state.activeGroup.theme, "theme-");
  $("#groupRoomName").textContent = state.activeGroup.name;
  $("#groupRoomMembers").textContent = `${state.activeGroup.members.length}명 참여 중`;
  $("#groupRoomAvatar").innerHTML = state.activeGroup.profileAscii
    ? `<span class="ascii-avatar" data-no-i18n>${escapeHtml(state.activeGroup.profileAscii)}</span>`
    : escapeHtml(state.activeGroup.name).charAt(0).toUpperCase();
  renderGroupMessageList($("#groupMessages"), state.groupMessages, state.activeGroup);
  renderGroupComposer(false);
}

function loadGroupHistory(groupId) {
  api(`/api/groups/history?groupId=${encodeURIComponent(groupId)}`).then(({ group, messages }) => {
    state.activeGroup = group;
    state.groupMessages = messages;
    renderGroupMessages();
  }).catch(() => closeGroupChat());
}

function openGroupChat(groupId) {
  const group = state.groups.find(item => item.id === groupId);
  if (!group) return;
  state.activeGroup = group;
  state.unreadGroups[groupId] = 0;
  saveUnread();
  state.groupMessages = [];
  document.body.classList.add("chat-open");
  $("#conversationList").hidden = true;
  window.AndroidAds?.hideFriendNativeAd?.();
  $("#chatRoom").hidden = true;
  $("#groupRoom").hidden = false;
  renderGroupMessages();
  loadGroupHistory(groupId);
}

function closeGroupChat() {
  document.body.classList.remove("chat-open");
  state.activeGroup = null;
  state.groupMessages = [];
  $("#groupRoom").hidden = true;
  $("#conversationList").hidden = false;
  requestAnimationFrame(updateFriendNativeAd);
  loadGroups();
}

function renderGroupFriendChoices(target, addMode = false) {
  const current = new Set(state.activeGroup?.members?.map(member => member.signalId) || []);
  const choices = state.friends.filter(friend => !addMode || !current.has(friend));
  target.innerHTML = choices.length ? choices.map(friend => {
    const nickname = state.profileCache[friend]?.nickname || friend;
    return `<label class="group-friend-choice">
      ${addMode ? "" : `<input type="checkbox" value="${escapeHtml(friend)}">`}
      <strong data-no-i18n>${escapeHtml(nickname)}</strong>
      ${addMode ? `<button type="button" data-add-group-friend="${escapeHtml(friend)}">추가</button>` : ""}
    </label>`;
  }).join("") : '<p class="autocomplete-note">추가할 수 있는 친구가 없습니다.</p>';
}

function renderDailyGroup() {
  if (!state.dailyGroup) return;
  renderDailyGroupToggle();
  $("#dailyGroupForm").hidden = false;
  $("#dailyGroupStatus").textContent = `${state.dailyGroup.members.length}/10명 · ${state.account?.dailyGroupEnabled === false ? "내일 OFF" : "내일 ON"}`;
  renderGroupMessageList($("#dailyGroupMessages"), state.dailyGroupMessages, state.dailyGroup);
  renderGroupComposer(true);
}

function renderDailyGroupToggle() {
  const enabled = state.account?.dailyGroupEnabled !== false;
  $("#toggleDailyGroupJoin").textContent = enabled ? "ON" : "OFF";
  $("#toggleDailyGroupJoin").classList.toggle("off", !enabled);
}

function loadDailyGroup() {
  if (!state.authToken) return;
  renderDailyGroupToggle();
  api("/api/daily-group").then(({ disabled, left, group, messages }) => {
    if (disabled) {
      state.dailyGroup = null;
      state.dailyGroupMessages = [];
      renderDailyGroupToggle();
      $("#dailyGroupStatus").textContent = state.language === "en" ? "Daily Group Chat is OFF." : "데일리 그룹챗 참여가 꺼져 있습니다.";
      $("#dailyGroupMessages").innerHTML = `<p class="chat-empty">${state.language === "en" ? "Turn it ON to join at midnight." : "ON으로 바꾸면 00시 이후 설정값에 따라 참여합니다."}</p>`;
      $("#dailyGroupForm").hidden = true;
      return;
    }
    if (left) {
      state.dailyGroup = null;
      state.dailyGroupMessages = [];
      $("#dailyGroupStatus").textContent = state.language === "en" ? "You left today's group chat." : "오늘의 데일리 그룹챗에서 나갔습니다.";
      $("#dailyGroupMessages").innerHTML = `<p class="chat-empty">${state.language === "en" ? "You can join a new Daily Group Chat tomorrow." : "내일 새로운 데일리 그룹챗에 참여할 수 있습니다."}</p>`;
      $("#dailyGroupForm").hidden = true;
      return;
    }
    state.dailyGroup = group;
    state.dailyGroupMessages = messages;
    renderDailyGroup();
  }).catch(error => showApiFailure(error));
}

function toggleDailyGroupJoin() {
  const enabled = state.account?.dailyGroupEnabled === false;
  api("/api/daily-group/settings", { method: "POST", body: JSON.stringify({ enabled }) }).then(({ account }) => {
    applyAccountUpdate(account);
    loadDailyGroup();
    showToast(enabled ? "Daily Group Chat ON." : "Daily Group Chat OFF.");
  }).catch(error => showApiFailure(error));
}

function sendGroupMessage(group, text, daily = false, options = {}) {
  const cleanText = text.trim();
  if (!group || !cleanText) return;
  api("/api/groups/send", {
    method: "POST",
    body: JSON.stringify({ groupId: group.id, text: cleanText, ...options })
  }).then(message => {
    const list = daily ? state.dailyGroupMessages : state.groupMessages;
    if (!list.some(item => item.id === message.id)) list.push(message);
    daily ? renderDailyGroup() : renderGroupMessages();
  }).catch(error => showApiFailure(error));
}

function groupComposerKeys(daily) {
  return daily
    ? { signal: "dailyGroupSignal", text: "dailyGroupText", letterTimer: "dailyGroupLetterTimer", spaceTimer: "dailyGroupSpaceTimer", input: "#dailyGroupInput", status: "#dailyGroupSignal", keyer: "#dailyGroupKeyer" }
    : { signal: "groupSignal", text: "groupText", letterTimer: "groupLetterTimer", spaceTimer: "groupSpaceTimer", input: "#groupMessageInput", status: "#groupMessageSignal", keyer: "#groupMessageKeyer" };
}

function renderGroupComposer(daily) {
  const keys = groupComposerKeys(daily);
  $(keys.input).value = state[keys.text];
  const hint = $(daily ? "#dailyGroupHiddenLimitHint" : "#groupHiddenLimitHint");
  if (hint) hint.textContent = `${state.language === "en" ? "Swipe right · Morse Only" : "오른쪽 밀기 · 숨김 신호"} · ${hiddenLimitLabel()}`;
  $(keys.status).textContent = state[keys.signal] ? `현재 글자: ${prettyMorse(state[keys.signal])}` : "현재 글자: 비어 있음";
  $(keys.keyer).querySelector("small").textContent = state.chatKeyerMode === "auto"
    ? "3단위 휴식: 글자 확정 · 7단위 휴식: 띄어쓰기"
    : `${state.reverseChatSwipe ? "오른쪽" : "왼쪽"}: 확정 · ${state.reverseChatSwipe ? "왼쪽" : "오른쪽"}: 띄어쓰기 · 위: 대문자 · 아래: 엔터`;
}

function commitGroupLetter(daily, uppercase = false) {
  const keys = groupComposerKeys(daily);
  clearTimeout(state[keys.letterTimer]);
  if (!state[keys.signal]) return false;
  const decoded = decodedInput(state[keys.signal], uppercase);
  state[keys.signal] = "";
  if (!decoded) {
    renderGroupComposer(daily);
    return false;
  }
  state[keys.text] += decoded;
  renderGroupComposer(daily);
  return true;
}

function commitGroupSpace(daily) {
  const keys = groupComposerKeys(daily);
  commitGroupLetter(daily);
  if (state[keys.text] && !state[keys.text].endsWith(" ")) state[keys.text] += " ";
  renderGroupComposer(daily);
}

function commitGroupNewline(daily) {
  const keys = groupComposerKeys(daily);
  commitGroupLetter(daily);
  if (state[keys.text] && !state[keys.text].endsWith("\n")) state[keys.text] += "\n";
  renderGroupComposer(daily);
}

function appendGroupMorseMark(daily, mark) {
  const keys = groupComposerKeys(daily);
  clearTimeout(state[keys.letterTimer]);
  clearTimeout(state[keys.spaceTimer]);
  if (state[keys.signal].length >= 10) return;
  pulseSignal(mark);
  state[keys.signal] += mark;
  renderGroupComposer(daily);
  if (state.chatKeyerMode === "auto") {
    state[keys.letterTimer] = setTimeout(() => commitGroupLetter(daily), state.unit * 3);
    state[keys.spaceTimer] = setTimeout(() => commitGroupSpace(daily), state.unit * 7);
  }
}

function clearGroupComposerCharacter(daily) {
  const keys = groupComposerKeys(daily);
  if (state[keys.signal]) state[keys.signal] = state[keys.signal].slice(0, -1);
  else state[keys.text] = graphemes(state[keys.text]).slice(0, -1).join("");
  renderGroupComposer(daily);
}

function bindGroupKeyer(selector, daily) {
  const keyer = $(selector);
  keyer.addEventListener("pointerdown", event => {
    const keys = groupComposerKeys(daily);
    clearTimeout(state[keys.letterTimer]);
    clearTimeout(state[keys.spaceTimer]);
    state.groupKeyerStartedAt = performance.now();
    state.groupKeyerStartX = event.clientX;
    state.groupKeyerStartY = event.clientY;
    keyer.classList.add("pressed");
    keyer.setPointerCapture?.(event.pointerId);
  });
  keyer.addEventListener("pointerup", event => {
    keyer.classList.remove("pressed");
    const deltaX = event.clientX - state.groupKeyerStartX;
    const deltaY = event.clientY - state.groupKeyerStartY;
    if (state.chatKeyerMode === "auto"
      && handleAutoVerticalSwipe(deltaX, deltaY, uppercase => commitGroupLetter(daily, uppercase), () => commitGroupNewline(daily))) return;
    if (state.chatKeyerMode === "manual"
      && handleManualComposerSwipe(deltaX, deltaY, uppercase => commitGroupLetter(daily, uppercase), () => commitGroupSpace(daily), () => commitGroupNewline(daily))) return;
    appendGroupMorseMark(daily, performance.now() - state.groupKeyerStartedAt < state.unit * 2 ? "." : "-");
  });
  keyer.addEventListener("pointercancel", () => keyer.classList.remove("pressed"));
}

function renderFriendRequests() {
  $("#friendRequests").innerHTML = state.friendRequests.map(request => `
    <article class="friend-request">
      <strong data-no-i18n>${escapeHtml(request.fromNickname || request.from)}</strong>
      <button type="button" data-friend-request="${escapeHtml(request.id)}" data-friend-status="accepted">${state.language === "en" ? "Accept" : "수락"}</button>
      <button type="button" data-friend-request="${escapeHtml(request.id)}" data-friend-status="rejected">${state.language === "en" ? "Reject" : "거절"}</button>
    </article>
  `).join("");
  $("#sentFriendRequests").innerHTML = state.sentFriendRequests.map(request => `
    <article class="friend-request sent">
      <strong data-no-i18n>${escapeHtml(request.toNickname || request.to)}</strong>
      <span class="friend-request-status">${state.language === "en" ? "Waiting" : "수락 대기 중"}</span>
    </article>
  `).join("");
  $("#receivedRequestCount").textContent = state.friendRequests.length;
  $("#sentRequestCount").textContent = state.sentFriendRequests.length;
}

function openFriendRequestPanel(type) {
  const received = type === "received";
  $("#friendRequestPanelTitle").textContent = received
    ? (state.language === "en" ? "Received requests" : "받은 요청")
    : (state.language === "en" ? "Sent requests" : "보낸 요청");
  $("#friendRequests").hidden = !received;
  $("#sentFriendRequests").hidden = received;
  $("#friendRequestPanel").hidden = false;
}

function loadFriendRequests() {
  if (!state.authToken) return;
  api("/api/friends/requests").then(({ incoming = [], outgoing = [] }) => {
    state.friendRequests = incoming;
    state.sentFriendRequests = outgoing;
    renderFriendRequests();
  }).catch(() => {});
}

function loadFriends() {
  if (!state.authToken) return;
  api("/api/friends").then(({ friends }) => {
    state.friends = friends;
    localStorage.setItem("morse-friends", JSON.stringify(state.friends));
    loadFriendProfiles();
  }).catch(() => {});
}

function removeLocalFriend(friend) {
  state.friends = state.friends.filter(item => item !== friend);
  localStorage.setItem("morse-friends", JSON.stringify(state.friends));
  if (state.activeFriend === friend) closeChat();
  if (state.viewingProfileSignalId === friend) $("#friendProfilePanel").hidden = true;
  renderFriends();
}

function profileVisualHtml(profile, fallback = "?") {
  return profile?.profileAscii
    ? `<pre data-no-i18n>${escapeHtml(profile.profileAscii)}</pre>`
    : `<span class="profile-fallback">${escapeHtml(profile?.nickname || fallback).charAt(0).toUpperCase()}</span>`;
}

function profileCosmeticClasses(profile) {
  const equipped = profile?.equipped || {};
  const specials = (profile?.specials || []).filter(value => value !== "collector_crown" || equipped.collectorCrown !== false);
  return [equipped.profileBorder, equipped.profileBackground, ...specials].filter(Boolean).map(value => `cosmetic-${value}`).join(" ");
}

function applyProfileCosmetics(target, profile) {
  target.className = `${target.className.replace(/\bcosmetic-\S+/g, "").trim()} ${profileCosmeticClasses(profile)}`.trim();
}

function profileAvatarHtml(profile, fallback = "?") {
  return `<span class="friend-avatar ${profileCosmeticClasses(profile)}">${profile?.profileAscii
    ? `<span class="ascii-avatar" data-no-i18n>${escapeHtml(profile.profileAscii)}</span>`
    : escapeHtml(profile?.nickname || fallback).charAt(0).toUpperCase()}</span>`;
}

async function loadFriendProfiles() {
  if (!state.authToken) return;
  await Promise.all(state.friends.map(async signalId => {
    try {
      const { profile } = await api(`/api/profile?signalId=${encodeURIComponent(signalId)}`);
      state.profileCache[signalId] = profile;
    } catch {}
  }));
  renderFriends();
  if (state.activeFriend) renderChat();
}

function renderMyProfile() {
  if (!state.account) return;
  const profile = { ...state.account, profileAscii: state.profileDraftAscii ?? state.account.profileAscii ?? "" };
  $("#myProfileVisual").innerHTML = profileVisualHtml(profile, state.account.signalId);
  applyProfileCosmetics($("#myProfileVisual"), profile);
  $("#myProfileNickname").textContent = state.account.nickname;
  $("#myProfileSignalId").textContent = state.account.signalId;
  $("#myProfileBadges").innerHTML = [
    `<span>${state.language === "en" ? `${state.account.loginStreak || 0} day streak` : `${state.account.loginStreak || 0}일 연속 출석`}</span>`,
    ...(state.account.badges || []).map(badge => `<span>${badge === "shop_master" ? (state.language === "en" ? "Shop Master" : "상점 컬렉터") : escapeHtml(badge)}</span>`)
  ].join("");
  $("#myProfileDescription").value = state.account.description || "";
  $("#removeProfilePhoto").disabled = !profile.profileAscii;
}

async function openFriendProfile(signalId) {
  try {
    const { profile } = await api(`/api/profile?signalId=${encodeURIComponent(signalId)}`);
    state.profileCache[signalId] = profile;
    state.viewingProfileSignalId = signalId;
    $("#friendProfileVisual").innerHTML = profileVisualHtml(profile, signalId);
    applyProfileCosmetics($("#friendProfileVisual"), profile);
    $("#friendProfileNickname").textContent = profile.nickname;
    $("#friendProfileSignalId").textContent = profile.signalId;
    $("#friendProfileBadges").innerHTML = [
      `<span>${state.language === "en" ? `${profile.loginStreak || 0} day streak` : `${profile.loginStreak || 0}일 연속 출석`}</span>`,
      ...(profile.badges || []).map(badge => `<span>${badge === "shop_master" ? (state.language === "en" ? "Shop Master" : "상점 컬렉터") : escapeHtml(badge)}</span>`)
    ].join("");
    $("#friendProfileDescription").textContent = profile.description || "아직 자기소개가 없습니다.";
    $("#chatFromProfile").hidden = !state.friends.includes(signalId);
    $("#removeFriend").hidden = !state.friends.includes(signalId);
    $("#friendProfilePanel").hidden = false;
    renderFriends();
    if (state.activeFriend === signalId) renderChat();
  } catch (error) {
    showApiFailure(error, "프로필을 불러오지 못했습니다.");
  }
}

function saveChats() {
  localStorage.setItem("morse-chats", JSON.stringify(state.chats));
}

function chatMessageText(message) {
  if (typeof message === "object" && message.type === "system") {
    const actor = message.actorNickname || message.actor || "";
    if (state.language === "en") return `${actor} ${message.secretAction === "started" ? "started" : "ended"} Secret Communication.`;
    return `${actor}가 시크릿 대화를 ${message.secretAction === "started" ? "시작하였습니다" : "종료하였습니다"}.`;
  }
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
  applyTheme($("#chatRoom"), state.account?.equipped?.chatTheme, "theme-");
  const messages = state.chats[friend] || [];
  const profile = state.profileCache[friend];
  $("#chatFriendName").textContent = profile?.nickname || friend;
  $("#chatAvatar").innerHTML = profile?.profileAscii
    ? `<span class="ascii-avatar" data-no-i18n>${escapeHtml(profile.profileAscii)}</span>`
    : escapeHtml(profile?.nickname || friend).charAt(0).toUpperCase();
  applyProfileCosmetics($("#chatAvatar"), profile);
  $("#openSecretComm").classList.toggle("invited", state.pendingSecretPartner === friend);
  $("#chatMessages").innerHTML = messages.length
    ? messages.map((message, index) => {
      const text = chatMessageText(message);
      const hidden = typeof message === "object" && message.hidden;
      const ascii = typeof message === "object" && message.type === "ascii";
      const system = typeof message === "object" && message.type === "system";
      const exhausted = hiddenSignalExhausted(message);
      return `
      <div class="chat-message-row${message.mine ? " mine" : ""}${system ? " system" : ""}">
        <button type="button" class="chat-bubble${hidden ? " hidden-signal" : ""}${exhausted ? " exhausted" : ""}${ascii ? " ascii-message" : ""}${system ? " system-message" : ""}" data-chat-message="${index}">
          ${hidden ? "" : (ascii ? `<pre data-no-i18n>${escapeHtml(text)}</pre>` : `<span data-no-i18n>${escapeHtml(text)}</span>`)}
          ${hidden || ascii || system ? "" : `<small>${textToMorse(text).replaceAll(".", "·").replaceAll("-", "—")}</small>`}
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
    : `${state.reverseChatSwipe ? "오른쪽" : "왼쪽"}: 확정 · ${state.reverseChatSwipe ? "왼쪽" : "오른쪽"}: 띄어쓰기 · 위: 대문자 · 아래: 엔터`;
}

function renderSettings() {
  document.querySelectorAll("[data-chat-keyer-mode]").forEach(button =>
    button.classList.toggle("active", button.dataset.chatKeyerMode === state.chatKeyerMode)
  );
  document.querySelectorAll(".keyer-mode-button").forEach(button =>
    button.classList.toggle("active", button.dataset.keyerMode === state.chatKeyerMode)
  );
  $("#reverseChatSwipe").checked = state.reverseChatSwipe;
  $("#swipeReverseSetting").classList.toggle("disabled", state.chatKeyerMode !== "manual");
  $("#swipeDirectionHint").textContent = state.reverseChatSwipe
    ? "오른쪽: 글자 확정 · 왼쪽: 띄어쓰기 · 위: 대문자 · 아래: 엔터"
    : "왼쪽: 글자 확정 · 오른쪽: 띄어쓰기 · 위: 대문자 · 아래: 엔터";
  document.querySelectorAll("[data-language]").forEach(button =>
    button.classList.toggle("active", button.dataset.language === state.language)
  );
  $("#settingsSpeed").value = state.unit;
  $("#settingsSpeedLabel").textContent = `${speedName(state.unit)} · ${state.unit}ms`;
  $("#accountStatus").textContent = state.account ? `${state.account.nickname} · ${state.account.signalId}` : "로그인하지 않음";
  $("#openAuthSettings").hidden = Boolean(state.account);
  $("#logoutAccount").hidden = !state.account;
  $("#nicknameSettings").hidden = !state.account;
  if (state.account) $("#settingsNickname").value = state.account.nickname;
  renderAutocompletes();
}

function renderAutocompletes() {
  $("#autocompleteList").innerHTML = state.autocompletes.length
    ? state.autocompletes.map((item, index) => `
      <div class="autocomplete-item">
        <code data-no-i18n>${escapeHtml(prettyMorse(item.code))}</code>
        <span data-no-i18n>${escapeHtml(item.text)}</span>
        <button type="button" data-delete-autocomplete="${index}" aria-label="자동완성 삭제">×</button>
      </div>`).join("")
    : `<p class="autocomplete-note">${state.language === "en" ? "No autocomplete entries yet." : "아직 등록된 자동완성이 없습니다."}</p>`;
}

function renderAutocompleteCode() {
  const code = normalizeAutocompleteCode($("#autocompleteCode").value);
  $("#autocompleteCode").value = code.replaceAll("-", "\u2014");
}

function addAutocompleteMark(mark) {
  const input = $("#autocompleteCode");
  const code = normalizeAutocompleteCode(input.value);
  if (code.length >= 10) {
    showToast(state.language === "en" ? "Autocomplete codes can contain up to 10 marks." : "자동완성 코드는 최대 10개까지 입력할 수 있습니다.");
    return;
  }
  pulseSignal(mark);
  input.value = code + mark;
  renderAutocompleteCode();
}

function normalizeAutocompleteCode(value) {
  return value
    .replace(/[\u00b7\u2022]/g, ".")
    .replace(/[\u2013\u2014\u2212]/g, "-")
    .replace(/\s/g, "")
    .replace(/[^.-]/g, "");
  return value.replaceAll("·", ".").replaceAll("−", "-").replace(/\s/g, "");
}

function saveAutocompletes() {
  localStorage.setItem("morse-autocompletes", JSON.stringify(state.autocompletes));
  renderAutocompletes();
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
  if (state.diaryUnlocked) renderDiary();
  renderGame();
}

function applyLanguage(language) {
  state.language = language;
  localStorage.setItem("morse-language", language);
  document.documentElement.lang = language;
  translateElement(document.body, language);
  document.title = "morsiq";
  if (!$("#shopWorld").hidden) renderShop();
  if (state.authToken) {
    api("/api/push/language", { method: "POST", body: JSON.stringify({ language }) }).catch(() => {});
  }
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

function commitChatLetter(uppercase = false) {
  clearTimeout(state.chatLetterTimer);
  state.chatLetterTimer = null;
  if (!state.chatSignal) return false;
  const decoded = decodedInput(state.chatSignal, uppercase);
  if (!decoded) {
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
  if (state.chatSignal.length >= 10) return;
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

function commitChatNewline() {
  commitChatLetter();
  if (state.chatMorseText && !state.chatMorseText.endsWith("\n")) state.chatMorseText += "\n";
  renderChatComposer();
}

function handleManualComposerSwipe(deltaX, deltaY, commitLetter, commitSpace, commitNewline) {
  if (Math.max(Math.abs(deltaX), Math.abs(deltaY)) < 45) return false;
  if (Math.abs(deltaY) > Math.abs(deltaX) * 1.25) {
    if (deltaY < 0) commitLetter(true);
    else commitNewline();
    return true;
  }
  if (Math.abs(deltaX) > Math.abs(deltaY) * 1.25) {
    const right = deltaX > 0;
    const confirmsLetter = state.reverseChatSwipe ? right : !right;
    if (confirmsLetter) commitLetter(false);
    else commitSpace();
    return true;
  }
  return false;
}

function handleAutoVerticalSwipe(deltaX, deltaY, commitLetter, commitNewline) {
  if (Math.abs(deltaY) < 45 || Math.abs(deltaY) <= Math.abs(deltaX) * 1.25) return false;
  if (deltaY < 0) commitLetter(true);
  else commitNewline();
  return true;
}

function sendChatMessage(message, hidden = false) {
  if (!message || !state.activeFriend) return;
  if (!state.friends.includes(state.activeFriend)) {
    showToast(state.language === "en" ? "You must be friends to send messages." : "다시 친구가 되어야 메시지를 보낼 수 있습니다.");
    return;
  }
  const outgoing = hidden
    ? { text: message, hidden: true, limit: state.hiddenViewLimit, views: 0, senderSound: equippedSound() }
    : typeof message === "object" ? { ...message, senderSound: equippedSound() } : { text: message, senderSound: equippedSound() };
  const localMessage = taggedChatMessage(outgoing, true);
  const wireMessage = { ...localMessage };
  delete wireMessage.mine;
  state.chats[state.activeFriend].push(localMessage);
  saveChats();
  renderChat();
  api("/api/direct/send", {
    method: "POST",
    body: JSON.stringify({ from: state.userId, to: state.activeFriend, message: wireMessage })
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
  const cornerSamples = [];
  const cornerSize = Math.max(2, Math.round(Math.min(width, height) * .12));
  for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
    if ((x < cornerSize || x >= width - cornerSize) && (y < cornerSize || y >= height - cornerSize)) {
      cornerSamples.push(normalizedValues[y * width + x]);
    }
  }
  cornerSamples.sort((a, b) => a - b);
  const background = cornerSamples[Math.floor(cornerSamples.length / 2)] ?? 1;
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
      const backgroundDistance = Math.abs(normalized - background);
      if (backgroundDistance < .075 && edge < .12) {
        line += " ";
        continue;
      }
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
    lines.push(line.replace(/\s+$/g, ""));
  }
  while (lines.length && !lines[0].trim()) lines.shift();
  while (lines.length && !lines[lines.length - 1].trim()) lines.pop();
  return lines.join("\n");
}

function deleteChatInputCharacter() {
  clearTimeout(state.chatLetterTimer);
  clearTimeout(state.chatSpaceTimer);
  if (state.chatSignal) state.chatSignal = state.chatSignal.slice(0, -1);
  else state.chatMorseText = graphemes(state.chatMorseText).slice(0, -1).join("");
  renderChatComposer();
}

function openChat(friend) {
  state.activeFriend = friend;
  state.unreadDirect[friend] = 0;
  saveUnread();
  document.body.classList.add("chat-open");
  $("#hiddenViewPicker").hidden = true;
  resetChatMorse();
  state.chats[friend] ||= [];
  $("#conversationList").hidden = true;
  window.AndroidAds?.hideFriendNativeAd?.();
  $("#chatRoom").hidden = false;
  renderChat();
  renderChatComposer();
  api(`/api/direct/history?user=${encodeURIComponent(state.userId)}&friend=${encodeURIComponent(friend)}`)
    .then(({ messages }) => {
      state.chats[friend] = messages.map(item => taggedChatMessage(item.message, item.from === state.userId, item.createdAt));
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
  requestAnimationFrame(updateFriendNativeAd);
  renderFriends();
}

async function diaryPasswordHash(value) {
  const bytes = new TextEncoder().encode(`MORSE-CHAT-DIARY:${value}`);
  if (globalThis.crypto?.subtle) {
    const digest = await crypto.subtle.digest("SHA-256", bytes);
    return [...new Uint8Array(digest)].map(byte => byte.toString(16).padStart(2, "0")).join("");
  }
  return btoa(unescape(encodeURIComponent(value)));
}

async function openSecretDiary() {
  state.diaryUnlocked = false;
  state.diaryPasswordHash = "";
  $("#diaryDesk").hidden = true;
  $("#diaryLock").hidden = false;
  $("#diaryPassword").value = "";
  $("#diaryPasswordConfirm").value = "";
  if (!state.authToken) {
    openAuthPanel();
    return;
  }
  try {
    state.diaryHasServerPassword = (await api("/api/diary/status")).hasPassword;
  } catch (error) {
    showApiFailure(error);
    return;
  }
  $("#diaryPasswordConfirm").hidden = state.diaryHasServerPassword;
  $("#diaryLockTitle").textContent = state.diaryHasServerPassword ? "비밀번호 입력" : "비밀번호 설정";
  $("#diaryLockHint").textContent = state.diaryHasServerPassword
    ? "비밀일기를 열려면 비밀번호를 입력하세요."
    : "처음 사용할 비밀번호를 설정하세요. 잊으면 일기를 열 수 없습니다.";
  $("#unlockDiary").textContent = state.diaryHasServerPassword ? "비밀일기 열기" : "비밀번호 설정";
}

function lockSecretDiary() {
  state.diaryUnlocked = false;
  state.diarySignal = "";
  state.diaryText = "";
  state.diaryPasswordHash = "";
  clearTimeout(state.diaryLetterTimer);
  clearTimeout(state.diarySpaceTimer);
  if ($("#diaryDesk")) $("#diaryDesk").hidden = true;
  if ($("#diaryLock")) $("#diaryLock").hidden = false;
}

function renderDiaryLegacy() {
  $("#diaryText").value = state.diaryText;
  $("#diarySignal").textContent = state.diarySignal ? `현재 글자: ${prettyMorse(state.diarySignal)}` : "현재 글자: 비어 있음";
  $("#diaryEntries").innerHTML = state.diaryEntries.length
    ? state.diaryEntries.map((entry, index) => entry.vibrationOnly
      ? `<button type="button" class="diary-note vibration-only" data-diary-play="${index}"><time>${new Date(entry.createdAt).toLocaleString()}</time><strong>진동 전용 일기</strong><small>탭해서 모스 진동으로 듣기 · 무제한</small></button>`
      : `<article class="diary-note"><time>${new Date(entry.createdAt).toLocaleString()}</time><p data-no-i18n>${escapeHtml(entry.text)}</p><button type="button" data-delete-diary="${index}" aria-label="일기 삭제">×</button></article>`
    ).join("")
    : '<p class="chat-empty">아직 작성한 일기가 없습니다.</p>';
  $("#diaryEntries").scrollTop = $("#diaryEntries").scrollHeight;
}

function diaryEntriesForDate(date = state.diarySelectedDate) {
  return state.diaryEntries.filter(entry => (entry.date || new Date(entry.createdAt).toLocaleDateString("en-CA")) === date);
}

function selectDiaryDate(date) {
  state.diarySelectedDate = date;
  state.diaryText = "";
  state.diarySignal = "";
  state.diaryDraftSegments = [];
  state.diaryDirty = false;
  renderDiary();
}

function renderDiaryCalendar() {
  const [year, month] = state.diaryCalendarMonth.split("-").map(Number);
  const first = new Date(year, month - 1, 1);
  const days = new Date(year, month, 0).getDate();
  $("#diaryCalendarTitle").textContent = `${year}.${String(month).padStart(2, "0")}`;
  const recorded = new Set(state.diaryEntries.map(entry => entry.date || new Date(entry.createdAt).toLocaleDateString("en-CA")));
  const cells = Array(first.getDay()).fill('<span class="diary-calendar-blank"></span>');
  for (let day = 1; day <= days; day += 1) {
    const date = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    cells.push(`<button type="button" data-diary-date="${date}" class="${date === state.diarySelectedDate ? "selected" : ""} ${recorded.has(date) ? "recorded" : ""}">${day}</button>`);
  }
  $("#diaryCalendar").innerHTML = cells.join("");
  $("#diarySelectedDate").textContent = state.diarySelectedDate;
}

function renderDiary() {
  $("#diaryText").value = state.diaryText;
  $("#diarySignal").textContent = state.diarySignal ? `현재 글자: ${prettyMorse(state.diarySignal)}` : "현재 글자: 비어 있음";
  renderDiaryCalendar();
  $("#diaryDraftSegments").innerHTML = state.diaryDraftSegments.length ? state.diaryDraftSegments.map((segment, index) =>
    `<button type="button" data-remove-diary-segment="${index}" class="${segment.type === "vibration" ? "vibration-only" : ""}"><strong>${segment.type === "vibration" ? "진동 전용" : "문자"}</strong><br>${escapeHtml(segment.text)}</button>`
  ).join("") : '<small>보내기 또는 진동 전용을 눌러 일기 조각을 추가하세요.</small>';
  const entries = diaryEntriesForDate();
  if (!entries.length) {
    $("#diaryEntries").innerHTML = '<p class="chat-empty">선택한 날짜에 저장된 일기가 없습니다.</p>';
    return;
  }
  $("#diaryEntries").innerHTML = entries.map(entry => renderDiaryEntryCard(entry, state.diaryEntries.indexOf(entry))).join("");
}

function renderDiaryEntryCard(entry, index) {
  const segments = entry.segments?.length ? entry.segments : [{ type: entry.vibrationOnly ? "vibration" : "text", text: entry.text }];
  return `<article class="diary-note"><time>${entry.date || new Date(entry.createdAt).toLocaleDateString()} · ${new Date(entry.createdAt).toLocaleTimeString()}</time><div class="diary-segment-list">${segments.map(segment => segment.type === "vibration"
    ? `<button type="button" class="diary-segment-vibration" data-diary-segment-play="${index}" data-segment-text="${escapeHtml(segment.text)}">진동 전용 · 탭해서 듣기</button>`
    : `<p data-no-i18n>${escapeHtml(segment.text)}</p>`).join("")}</div><button type="button" data-delete-diary="${index}" aria-label="일기 삭제">×</button></article>`;
}

function renderDiaryList() {
  $("#diaryAllEntries").innerHTML = state.diaryEntries.length
    ? [...state.diaryEntries].sort((a, b) => b.createdAt - a.createdAt).map(entry => renderDiaryEntryCard(entry, state.diaryEntries.indexOf(entry))).join("")
    : '<p class="chat-empty">저장된 일기가 없습니다.</p>';
}

function commitDiaryLetter(uppercase = false) {
  clearTimeout(state.diaryLetterTimer);
  if (!state.diarySignal) return false;
  const decoded = decodedInput(state.diarySignal, uppercase);
  state.diarySignal = "";
  if (!decoded) return false;
  state.diaryText += decoded;
  state.diaryDirty = true;
  renderDiary();
  return true;
}

function commitDiarySpace() {
  commitDiaryLetter();
  if (state.diaryText && !state.diaryText.endsWith(" ")) state.diaryText += " ";
  state.diaryDirty = true;
  renderDiary();
}

function commitDiaryNewline() {
  commitDiaryLetter();
  if (state.diaryText && !state.diaryText.endsWith("\n")) state.diaryText += "\n";
  state.diaryDirty = true;
  renderDiary();
}

function addDiarySignal(mark) {
  clearTimeout(state.diaryLetterTimer);
  clearTimeout(state.diarySpaceTimer);
  if (state.diarySignal.length >= 10) return;
  pulseSignal(mark);
  state.diarySignal += mark;
  renderDiary();
  if (state.chatKeyerMode === "auto") {
    state.diaryLetterTimer = setTimeout(commitDiaryLetter, state.unit * 3);
    state.diarySpaceTimer = setTimeout(commitDiarySpace, state.unit * 7);
  }
}

function appendDiarySegment(type) {
  commitDiaryLetter();
  const text = state.diaryText.trim();
  if (!text) return;
  if (type === "vibration" && !/^[A-Za-z0-9 ]+$/.test(text)) {
    showToast("진동 전용에는 영어와 숫자만 사용할 수 있습니다.");
    return;
  }
  state.diaryDraftSegments.push({ type, text });
  state.diaryText = "";
  state.diarySignal = "";
  state.diaryDirty = true;
  renderDiary();
}

async function storeDiaryEntry() {
  commitDiaryLetter();
  if (state.diaryText.trim()) appendDiarySegment("text");
  if (!state.diaryDraftSegments.length) return;
  try {
    const { entries } = await api("/api/diary/entries", {
      method: "POST",
      body: JSON.stringify({ passwordHash: state.diaryPasswordHash, segments: state.diaryDraftSegments, date: state.diarySelectedDate })
    });
    entries.forEach(entry => {
      const index = state.diaryEntries.findIndex(item => item.id === entry.id);
      if (index >= 0) state.diaryEntries[index] = entry;
      else state.diaryEntries.push(entry);
    });
    state.diarySignal = "";
    state.diaryText = "";
    state.diaryDraftSegments = [];
    state.diaryDirty = false;
    renderDiary();
  } catch (error) {
    showApiFailure(error, "일기를 서버에 저장하지 못했습니다.");
  }
}

function gameTimeLabel(timeMs) {
  return `${(Number(timeMs || 0) / 1000).toFixed(2)}초`;
}

function renderGameRanking(target, ranking) {
  target.innerHTML = ranking.length ? ranking.map(item => `
    <div class="ranking-row${item.mine ? " mine" : ""}">
      <span>${item.rank}</span><strong data-no-i18n>${escapeHtml(item.nickname)}</strong><span>${gameTimeLabel(item.timeMs)}</span>
    </div>`).join("") : '<p class="chat-empty">아직 등록된 기록이 없습니다.</p>';
}

function loadGameRanking(limit = 10) {
  if (!state.authToken) return;
  return api(`/api/game/ranking?limit=${limit}`).then(({ ranking, mine }) => {
    state.gameRanking = ranking;
    state.gameMyRank = mine;
    $("#gameMyRank").textContent = mine ? `${mine.rank}등 · ${gameTimeLabel(mine.timeMs)}` : "기록 없음";
    if (limit === 10) renderGameRanking($("#gameRankingPreview"), ranking);
    else {
      renderGameRanking($("#gameRankingFull"), ranking);
      $("#fullRankingMine").textContent = mine ? `내 순위: ${mine.rank}등 · ${gameTimeLabel(mine.timeMs)}` : "아직 내 기록이 없습니다.";
    }
  }).catch(error => showApiFailure(error, "랭킹을 불러오지 못했습니다."));
}

function renderGame() {
  $("#gameProgress").textContent = state.gameRunning ? `${state.gameIndex + 1} / 10` : "0 / 10";
  $("#gameWordNumber").textContent = state.gameRunning ? `${state.gameIndex + 1}번째 단어` : "시작 준비";
  $("#gameTargetWord").textContent = state.gameWords[state.gameIndex] || "READY";
  $("#gameInput").value = state.gameText;
  $("#gameSignal").textContent = state.gameSignal ? `현재 글자: ${prettyMorse(state.gameSignal)}` : "현재 글자: 비어 있음";
  $("#gameKeyer").querySelector("small").textContent = state.chatKeyerMode === "auto"
    ? "3단위 휴식: 글자 확정"
    : `${state.reverseChatSwipe ? "오른쪽" : "왼쪽"}: 글자 확정 · 위: 대문자`;
  $("#startGame").textContent = state.gameRunning ? "게임 포기" : "게임 시작";
}

function updateGameTimer() {
  if (state.gameRunning) $("#gameTimer").textContent = gameTimeLabel(performance.now() - state.gameStartedAt);
}

function startSpeedGame() {
  if (state.gameRunning) {
    state.gameRunning = false;
    clearInterval(state.gameTimerInterval);
    $("#gameFeedback").textContent = "게임을 종료했습니다.";
    return renderGame();
  }
  state.gameWords = [...GAME_WORD_POOL].sort(() => Math.random() - .5).slice(0, 10);
  state.gameIndex = 0;
  state.gameText = "";
  state.gameSignal = "";
  state.gameRunning = true;
  state.gameStartedAt = performance.now();
  clearInterval(state.gameTimerInterval);
  state.gameTimerInterval = setInterval(updateGameTimer, 30);
  $("#gameFeedback").textContent = "첫 단어를 입력하세요.";
  renderGame();
}

async function finishSpeedGame() {
  const timeMs = Math.round(performance.now() - state.gameStartedAt);
  state.gameRunning = false;
  clearInterval(state.gameTimerInterval);
  $("#gameTimer").textContent = gameTimeLabel(timeMs);
  $("#gameFeedback").textContent = `완주 기록: ${gameTimeLabel(timeMs)}`;
  renderGame();
  try {
    const result = await api("/api/game/score", { method: "POST", body: JSON.stringify({ timeMs }) });
    $("#gameFeedback").textContent += result.improved ? " · 최고 기록 갱신!" : " · 기존 최고 기록 유지";
    loadGameRanking(10);
  } catch (error) { showApiFailure(error, "게임 기록을 저장하지 못했습니다."); }
}

function checkGameWord() {
  if (!state.gameRunning || state.gameText.toUpperCase() !== state.gameWords[state.gameIndex]) return;
  state.gameIndex += 1;
  state.gameText = "";
  state.gameSignal = "";
  if (state.gameIndex >= 10) return finishSpeedGame();
  $("#gameFeedback").textContent = "정답! 다음 단어";
  renderGame();
}

function commitGameLetter(uppercase = true) {
  clearTimeout(state.gameLetterTimer);
  if (!state.gameSignal || !state.gameRunning) return false;
  const decoded = decodedInput(state.gameSignal, uppercase);
  state.gameSignal = "";
  if (!decoded) return false;
  state.gameText += decoded.toUpperCase();
  renderGame();
  checkGameWord();
  return true;
}

function addGameSignal(mark) {
  if (!state.gameRunning || state.gameSignal.length >= 10) return;
  clearTimeout(state.gameLetterTimer);
  pulseSignal(mark);
  state.gameSignal += mark;
  renderGame();
  if (state.chatKeyerMode === "auto") state.gameLetterTimer = setTimeout(commitGameLetter, state.unit * 3);
}

function applyTheme(target, themeId, prefix) {
  [...target.classList].filter(name => name.startsWith(prefix)).forEach(name => target.classList.remove(name));
  if (themeId) target.classList.add(`${prefix}${themeId}`);
}

function shopItem(itemId) {
  return SHOP_ITEMS.find(item => item.id === itemId);
}

function shopCategoryLabels() {
  return state.language !== "en"
    ? { randomTheme: "랜덤 시그널", chatTheme: "대화창 테마", morseSound: "모스부호 소리", profile: "프로필 꾸미기" }
    : { randomTheme: "Random Signal", chatTheme: "Chat Theme", morseSound: "Morse Sound", profile: "Profile Style" };
}

function shopPreviewVisual(item) {
  if (item.category === "morseSound") return `<button type="button" class="shop-sound-preview" data-preview-sound="${item.id}"><span>${item.icon}</span><small>${state.language === "en" ? "Tap to preview sound" : "눌러서 소리 미리 듣기"}</small></button>`;
  if (item.category === "profile") return `<div class="shop-profile-preview cosmetic-${item.id}"><span>M</span><i></i><b></b></div>`;
  return `<div class="shop-theme-preview theme-${item.id}"><header><i></i><b></b></header><main><i></i><i></i><i></i></main><footer></footer></div>`;
}

function openShopPreview(categoryId) {
  const category = SHOP_CATEGORIES.find(item => item.id === categoryId);
  const labels = shopCategoryLabels();
  $("#shopPreviewTitle").textContent = labels[categoryId] || category?.name || "";
  $("#shopPreviewDescription").textContent = state.language === "en" ? "These items can appear from this random draw. Tap an owned item to equip it." : "이 랜덤 뽑기에서 나올 수 있는 아이템입니다. 보유한 아이템을 누르면 장착됩니다.";
  $("#shopPreviewItems").innerHTML = SHOP_ITEMS.filter(item => item.category === categoryId).map(item => `
    <article class="shop-preview-item ${state.shopInventory.includes(item.id) ? "owned" : ""}" data-shop-preview-item="${item.id}">
      ${shopPreviewVisual(item)}
      <strong>${item.name}</strong>
      <small>${state.shopInventory.includes(item.id) ? (state.language === "en" ? "Owned · tap to equip" : "보유 중 · 눌러서 장착") : (state.language === "en" ? "Not owned" : "미보유")}</small>
    </article>`).join("");
  $("#shopPreviewPanel").hidden = false;
}

function openOwnedItemPreview(itemId) {
  const item = shopItem(itemId);
  if (!item) return;
  $("#shopPreviewTitle").textContent = item.name;
  $("#shopPreviewDescription").textContent = state.language === "en" ? "Preview of an item you own. Tap to equip or unequip." : "보유 중인 아이템입니다. 누르면 장착하거나 해제합니다.";
  const equipped = state.shopEquipped?.[item.slot] === item.id;
  $("#shopPreviewItems").innerHTML = `<article class="shop-preview-item owned single-item" data-shop-preview-item="${item.id}">${shopPreviewVisual(item)}<strong>${item.name}</strong><small>${equipped ? (state.language === "en" ? "Equipped · tap to unequip" : "장착 중 · 눌러서 해제") : (state.language === "en" ? "Owned · tap to equip" : "보유 중 · 눌러서 장착")}</small></article>`;
  $("#shopPreviewPanel").hidden = false;
}

function equipShopItem(itemId) {
  return api("/api/shop/equip", { method: "POST", body: JSON.stringify({ itemId }) }).then(result => {
    state.shopInventory = result.inventory || [];
    state.shopEquipped = result.equipped || {};
    applyAccountUpdate(result.account);
    renderShop();
    showToast(state.language === "en" ? "Item equipped." : "아이템을 장착했습니다.");
    return result;
  });
}

function unequipShopSlot(slot) {
  return api("/api/shop/unequip", { method: "POST", body: JSON.stringify({ slot }) }).then(result => {
    state.shopInventory = result.inventory || [];
    state.shopEquipped = result.equipped || {};
    applyAccountUpdate(result.account);
    renderShop();
    showToast(state.language === "en" ? "Item unequipped." : "아이템 장착을 해제했습니다.");
    return result;
  });
}

function setCollectorCrown(enabled) {
  return api("/api/shop/collector-crown", { method: "POST", body: JSON.stringify({ enabled }) }).then(result => {
    state.shopInventory = result.inventory || [];
    state.shopEquipped = result.equipped || {};
    applyAccountUpdate(result.account);
    renderShop();
    showToast(enabled ? "Golden crown border enabled." : "Golden crown border disabled.");
    return result;
  });
}

function renderShop() {
  const ko = state.language !== "en";
  const categoryNames = ko
    ? { randomTheme: "랜덤 시그널 꾸미기", chatTheme: "대화창 테마", morseSound: "모스부호 소리", profile: "프로필 꾸미기" }
    : Object.fromEntries(SHOP_CATEGORIES.map(category => [category.id, category.name]));
  const categoryDescriptions = ko
    ? { randomTheme: "랜덤 시그널 대화창을 꾸밉니다.", chatTheme: "개인 대화와 방장 그룹챗에 적용합니다.", morseSound: "메시지를 재생할 때 발신자의 소리가 납니다.", profile: "프로필 테두리와 배경을 꾸밉니다." }
    : Object.fromEntries(SHOP_CATEGORIES.map(category => [category.id, category.description]));
  $(".shop-hero h2").textContent = ko ? "상점" : "Shop";
  $(".shop-hero p:last-child").textContent = ko ? "종류를 고르고 꾸미기 아이템을 무작위로 뽑아보세요." : "Choose a category and draw one decoration at random.";
  $(".shop-inventory-card .section-heading strong").textContent = ko ? "보유 아이템" : "Inventory";
  $(".shop-inventory-card .section-heading small").textContent = ko ? "장착을 눌러 아이템을 적용합니다." : "Tap Equip to use an item.";
  $("#shopCoinBalance").textContent = Number(state.shopCoins || 0).toLocaleString();
  $("#buyCoins100 strong").textContent = ko ? "재화 100개" : "100 coins";
  $("#shopDrawCategories").innerHTML = SHOP_CATEGORIES.map(category => `
    <article class="shop-category-card" data-shop-preview="${category.id}">
      <span>${category.name.slice(0, 3).toUpperCase()}</span>
      <strong>${categoryNames[category.id]}</strong>
      <small>${categoryDescriptions[category.id]}</small>
      ${(() => {
        const allOwned = SHOP_ITEMS.filter(item => item.category === category.id && !item.free).every(item => state.shopInventory.includes(item.id));
        const insufficient = state.shopCoins < state.shopDrawCost;
        const label = allOwned
          ? (ko ? "모두 보유 중" : "All owned")
          : insufficient
            ? (ko ? `재화 ${state.shopDrawCost}개 필요` : `Need ${state.shopDrawCost} coins`)
            : (ko ? `랜덤 뽑기 · ${state.shopDrawCost}` : `Random Draw · ${state.shopDrawCost}`);
        return `<button type="button" data-shop-draw="${category.id}" ${allOwned || insufficient ? "disabled" : ""}>${label}</button>`;
      })()}
    </article>`).join("");
  const result = state.shopLastDraw;
  $("#shopResult").hidden = !result;
  if (result) {
    $("#shopResult").innerHTML = `<span>${result.item.icon}</span><div><small>${result.duplicate ? (ko ? "이미 보유한 아이템" : "Duplicate item") : (ko ? "새 아이템" : "New item")}</small><strong>${result.item.name}</strong></div>`;
  }
  const owned = state.shopInventory.map(shopItem).filter(Boolean);
  $("#shopInventoryTabs").innerHTML = SHOP_CATEGORIES.map(category =>
    `<button type="button" data-shop-inventory-category="${category.id}" class="${state.shopInventoryCategory === category.id ? "active" : ""}">${categoryNames[category.id]}</button>`
  ).join("");
  const categoryOwned = state.shopInventoryCategory === "morseSound"
    ? [shopItem("sound_basic"), ...owned.filter(item => item.category === "morseSound")]
    : owned.filter(item => item.category === state.shopInventoryCategory);
  $("#shopInventory").innerHTML = categoryOwned.length ? categoryOwned.map(item => {
    const equipped = item.id === "sound_basic"
      ? !state.shopEquipped?.morseSound || state.shopEquipped?.morseSound === "sound_basic"
      : state.shopEquipped?.[item.slot] === item.id;
    return `<article class="shop-inventory-item"><span>${item.icon}</span><div><strong>${item.name}</strong><small>${item.free ? "Default" : (categoryNames[item.category] || item.category)}</small></div><button type="button" ${equipped ? `data-shop-unequip="${item.slot}"` : `data-shop-equip="${item.id}"`}>${equipped ? (ko ? "끄기" : "Turn off") : (ko ? "장착" : "Equip")}</button></article>`;
  }).join("") : `<p class="shop-empty">${ko ? "아직 아이템이 없습니다. 랜덤 뽑기를 해보세요." : "No items yet. Try a random draw."}</p>`;
  if (state.shopInventoryCategory === "morseSound" && state.shopEquipped?.morseSound === "sound_off") {
    $("#shopInventory").insertAdjacentHTML("afterbegin", `<article class="collector-reward"><strong>${ko ? "모스부호 소리 꺼짐" : "Morse sound is off"}</strong><span>${ko ? "Basic을 장착하면 기본 삐 소리로 돌아갑니다." : "Equip Basic to restore the default beep."}</span></article>`);
  }
  if (state.shopInventoryCategory === "profile" && categoryOwned.length) renderProfileInventorySections(categoryOwned, ko);
  if (state.shopInventoryCategory !== "profile") {
    [...$("#shopInventory").querySelectorAll(".shop-inventory-item")].forEach((element, index) => {
      const item = categoryOwned[index];
      if (item && item.category !== "morseSound") {
        element.firstElementChild?.remove();
        element.insertAdjacentHTML("afterbegin", `<div class="shop-mini-preview">${shopPreviewVisual(item)}</div>`);
        element.dataset.ownedPreview = item.id;
      }
    });
  }
  if ((state.account?.specials || []).includes("collector_badge")) {
    const crownOn = state.shopEquipped?.collectorCrown !== false;
    $("#shopInventory").insertAdjacentHTML("beforeend", `<article class="collector-reward"><strong>${ko ? "컬렉션 완성 보상" : "Collection Complete Reward"}</strong><span>${ko ? "상점 컬렉터 배지 · 황금 왕관 프로필 효과" : "Shop Master badge · Golden Crown profile effect"}</span><button type="button" data-collector-crown="${crownOn ? "off" : "on"}">${crownOn ? (ko ? "왕관 테두리 끄기" : "Disable crown border") : (ko ? "왕관 테두리 켜기" : "Enable crown border")}</button></article>`);
  }
}

function renderProfileInventorySections(items, ko) {
  const renderItems = list => list.map(item => {
    const equipped = state.shopEquipped?.[item.slot] === item.id;
    return `<article class="shop-inventory-item" data-owned-preview="${item.id}"><span>${item.icon}</span><div><strong>${item.name}</strong><small>${item.slot === "profileBorder" ? (ko ? "테두리" : "Border") : (ko ? "배경" : "Background")}</small></div><button type="button" ${equipped ? `data-shop-unequip="${item.slot}"` : `data-shop-equip="${item.id}"`}>${equipped ? (ko ? "장착 해제" : "Unequip") : (ko ? "장착" : "Equip")}</button></article>`;
  }).join("");
  const borders = items.filter(item => item.slot === "profileBorder");
  const backgrounds = items.filter(item => item.slot === "profileBackground");
  $("#shopInventory").innerHTML = `
    <section class="shop-profile-slot"><div class="shop-profile-slot-heading"><strong>${ko ? "프로필 테두리" : "Profile Borders"}</strong><small>${ko ? "배경과 함께 장착할 수 있습니다." : "Can be equipped with a background."}</small></div>${borders.length ? renderItems(borders) : `<p class="shop-empty">${ko ? "보유한 테두리가 없습니다." : "No borders owned."}</p>`}</section>
    <section class="shop-profile-slot"><div class="shop-profile-slot-heading"><strong>${ko ? "프로필 배경" : "Profile Backgrounds"}</strong><small>${ko ? "테두리와 함께 장착할 수 있습니다." : "Can be equipped with a border."}</small></div>${backgrounds.length ? renderItems(backgrounds) : `<p class="shop-empty">${ko ? "보유한 배경이 없습니다." : "No backgrounds owned."}</p>`}</section>`;
}

function loadShop() {
  if (!state.authToken) return;
  api("/api/shop").then(({ inventory, equipped, coins, drawCost, account }) => {
    state.shopInventory = inventory || [];
    state.shopEquipped = equipped || {};
    state.shopCoins = Number(coins || 0);
    state.shopDrawCost = Number(drawCost || 50);
    if (account) applyAccountUpdate(account);
    renderShop();
    if (!$("#groupManagePanel").hidden) renderGroupThemeChoices();
  }).catch(error => showApiFailure(error));
}

function renderGroupThemeChoices() {
  if (!state.activeGroup) return;
  const owner = state.activeGroup.owner === state.userId;
  $("#groupThemeSection").hidden = !owner;
  if (!owner) return;
  const themes = state.shopInventory.map(shopItem).filter(item => item?.slot === "chatTheme");
  $("#groupThemeChoices").innerHTML = themes.length ? themes.map(item =>
    `<button type="button" data-group-theme="${item.id}" class="${state.activeGroup.theme === item.id ? "active" : ""}">${item.name}</button>`
  ).join("") : '<small>Draw a Chat Theme in the Shop first.</small>';
}

function switchWorld(world) {
  if (!["friends", "hall", "space", "randomSignal", "dailyGroup", "games", "secretDiary", "shop", "profile"].includes(world)) world = "hall";
  if (state.world === "secretDiary" && world !== "secretDiary") lockSecretDiary();
  if (world !== "space") clearSpaceDecode();
  if (world !== "hall" && !state.account) {
    openAuthPanel();
    world = "hall";
  }
  state.world = world;
  if (world === "randomSignal") state.unreadRandom = 0;
  if (world === "dailyGroup") state.unreadDaily = 0;
  saveUnread();
  localStorage.setItem("morse-world", world);
  $("#friendsWorld").hidden = world !== "friends";
  $("#trainingHall").hidden = world !== "hall";
  $("#spaceWorld").hidden = world !== "space";
  $("#randomSignalWorld").hidden = world !== "randomSignal";
  $("#dailyGroupWorld").hidden = world !== "dailyGroup";
  $("#gamesWorld").hidden = world !== "games";
  $("#secretDiaryWorld").hidden = world !== "secretDiary";
  $("#shopWorld").hidden = world !== "shop";
  $("#profileWorld").hidden = world !== "profile";
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
  if (world === "friends") {
    loadFriends();
    loadFriendRequests();
    loadGroups();
    requestAnimationFrame(updateFriendNativeAd);
  } else {
    window.AndroidAds?.hideFriendNativeAd?.();
  }
  if (world === "dailyGroup") loadDailyGroup();
  if (world === "games") {
    renderGame();
    loadGameRanking(10);
  }
  if (world === "secretDiary") openSecretDiary();
  if (world === "shop") loadShop();
  if (world === "profile") renderMyProfile();
}

function updateFriendNativeAd() {
  const slot = $("#friendNativeAdSlot");
  const overlayOpen = document.querySelector(".profile-overlay:not([hidden]), .auth-overlay:not([hidden])");
  const visible = state.world === "friends" && !$("#conversationList").hidden && !slot.hidden && !overlayOpen;
  if (!visible) {
    window.AndroidAds?.hideFriendNativeAd?.();
    return;
  }
  const rect = slot.getBoundingClientRect();
  if (rect.bottom <= 0 || rect.top >= innerHeight || rect.width <= 0 || rect.height <= 0) {
    window.AndroidAds?.hideFriendNativeAd?.();
    return;
  }
  window.AndroidAds?.showFriendNativeAd?.(rect.left, rect.top, rect.width, rect.height);
}

window.handleAndroidAdStatus = (placement, status) => {
  if (placement !== "native") return;
  const slot = $("#friendNativeAdSlot");
  if (!slot) return;
  const statusText = slot.querySelector("small");
  if (status === "loaded") {
    slot.classList.add("ad-loaded");
    if (statusText) statusText.textContent = state.language === "en" ? "Advertisement" : "광고";
    requestAnimationFrame(updateFriendNativeAd);
    return;
  }
  slot.classList.remove("ad-loaded");
  const code = status.replace("error-", "");
  const noFill = code === "3";
  if (statusText) statusText.textContent = state.language === "en"
    ? (noFill ? "Ad is preparing. Retrying automatically." : `Ad load failed (${code}). Retrying.`)
    : (noFill ? "광고 준비 중입니다. 자동으로 다시 시도합니다." : `광고 로드 실패 (${code}) · 다시 시도 중`);
};

window.addEventListener("resize", () => requestAnimationFrame(updateFriendNativeAd));
document.addEventListener("scroll", () => requestAnimationFrame(updateFriendNativeAd), true);
new MutationObserver(() => requestAnimationFrame(updateFriendNativeAd)).observe(document.body, {
  subtree: true,
  attributes: true,
  attributeFilter: ["hidden"]
});

function armBackExit() {
  state.backExitArmed = true;
  clearTimeout(state.backExitTimer);
  state.backExitTimer = setTimeout(() => {
    state.backExitArmed = false;
  }, 2000);
  showToast(state.language === "en" ? "Press back again to exit." : "한 번 더 누르면 앱이 종료됩니다.");
}

function closeOpenOverlay() {
  if (!$("#settingsPanel").hidden) {
    $("#settingsPanel").hidden = true;
    return true;
  }
  if (!$("#friendRequestPanel").hidden) {
    $("#friendRequestPanel").hidden = true;
    return true;
  }
  if (!$("#createGroupPanel").hidden) {
    $("#createGroupPanel").hidden = true;
    return true;
  }
  if (!$("#addFriendPanel").hidden) {
    $("#addFriendPanel").hidden = true;
    return true;
  }
  if (!$("#groupManagePanel").hidden) {
    $("#groupManagePanel").hidden = true;
    return true;
  }
  if (!$("#friendProfilePanel").hidden) {
    $("#friendProfilePanel").hidden = true;
    return true;
  }
  if (!$("#asciiPreview").hidden) {
    $("#asciiPreview").hidden = true;
    return true;
  }
  if (!$("#authPanel").hidden) {
    $("#authPanel").hidden = true;
    return true;
  }
  return false;
}

function installBackNavigation() {
  history.replaceState({ morseChatBase: true }, "");
  history.pushState({ morseChatGuard: true }, "");
  window.addEventListener("popstate", () => {
    if (closeOpenOverlay()) {
      history.pushState({ morseChatGuard: true }, "");
      return;
    }
    if (state.activeGroup) {
      closeGroupChat();
      history.pushState({ morseChatGuard: true }, "");
      return;
    }
    if (state.activeFriend) {
      closeChat();
      history.pushState({ morseChatGuard: true }, "");
      return;
    }
    if (state.world !== "friends") {
      state.backExitArmed = false;
      clearTimeout(state.backExitTimer);
      switchWorld("friends");
      history.pushState({ morseChatGuard: true }, "");
      return;
    }
    if (!state.backExitArmed) {
      armBackExit();
      history.pushState({ morseChatGuard: true }, "");
      return;
    }
    state.backExitArmed = false;
    clearTimeout(state.backExitTimer);
    history.back();
  });
}

function showToast(message) {
  $("#toast").textContent = message;
  $("#toast").classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => $("#toast").classList.remove("show"), 2200);
}

function showNicknameStatus(message, error = false) {
  const status = $("#nicknameChangeStatus");
  status.textContent = message;
  status.classList.toggle("error", error);
  status.hidden = false;
}

function sendSecretSignal(action) {
  if (!state.secretPartner || !state.secretSessionId || !state.authToken) return;
  const partner = state.secretPartner;
  return api("/api/direct/secret", {
    method: "POST",
    body: JSON.stringify({ to: partner, action, sessionId: state.secretSessionId, unit: state.unit })
  }).then(({ systemItem }) => {
    if (!systemItem) return;
    state.chats[partner] ||= [];
    state.chats[partner].push(taggedChatMessage(systemItem.message, true));
    saveChats();
    if (state.activeFriend === partner) renderChat();
  }).catch(() => {});
}

function startSecretVibration() {
  if (window.AndroidVibration) window.AndroidVibration.vibrate("60000");
  else navigator.vibrate?.(60000);
}

function stopSecretVibration() {
  if (window.AndroidVibration) window.AndroidVibration.vibrate("0");
  else navigator.vibrate?.(0);
}

function enterSecretComm(partner, notify = true, sessionId = "") {
  if (!partner) return;
  state.secretActive = true;
  state.secretPartner = partner;
  state.secretSessionId = sessionId || globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random()}`;
  state.secretExitArmed = false;
  state.secretPointerDown = false;
  clearTimeout(state.secretExitTimer);
  $("#exitSecretComm").classList.remove("armed");
  $("#secretComm").hidden = false;
  if (notify) sendSecretSignal("enter");
}

function closeSecretComm(notify = true) {
  if (!state.secretActive) return;
  const partner = state.secretPartner;
  if (state.secretPointerDown) sendSecretSignal("up");
  if (notify) sendSecretSignal("exit");
  stopSecretVibration();
  clearTimeout(state.secretExitTimer);
  state.secretActive = false;
  state.secretPartner = "";
  state.secretSessionId = "";
  state.secretExitArmed = false;
  state.secretPointerDown = false;
  $("#exitSecretComm").classList.remove("armed");
  $("#secretComm").hidden = true;
  state.pendingSecretPartner = "";
  state.pendingSecretSessionId = "";
  switchWorld("friends");
  if (partner && state.friends.includes(partner)) openChat(partner);
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
    if (state.writerSignal.length >= 10) return;
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
  const decoded = decodedInput(state.writerSignal, true);
  if (!decoded) {
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

$("#friendForm").addEventListener("submit", async event => {
  event.preventDefault();
  const input = $("#friendInput");
  const nickname = input.value.trim();
  if (!nickname) return;
  try {
    await api("/api/friends/request", {
      method: "POST",
      body: JSON.stringify({ nickname })
    });
    input.value = "";
    $("#addFriendPanel").hidden = true;
    showToast(state.language === "en" ? "Friend request sent." : "친구 요청을 보냈습니다.");
    loadFriendRequests();
    return;
    const { profile } = await api(`/api/profile?nickname=${encodeURIComponent(nickname)}`);
    if (profile.signalId === state.userId) {
      showToast(state.language === "en" ? "You cannot add yourself." : "자기 자신은 친구로 추가할 수 없습니다.");
      return;
    }
    if (state.friends.includes(profile.signalId)) {
      showToast(state.language === "en" ? "Already added as a friend." : "이미 추가된 친구입니다.");
      return;
    }
    state.friends.push(profile.signalId);
    state.profileCache[profile.signalId] = profile;
    localStorage.setItem("morse-friends", JSON.stringify(state.friends));
    input.value = "";
    renderFriends();
    showToast(state.language === "en" ? `${profile.nickname} added.` : `${profile.nickname}님을 친구로 추가했습니다.`);
  } catch (error) {
    if (error.status === 404) showToast(state.language === "en" ? "Nickname not found." : "없는 닉네임입니다.");
    else showApiFailure(error, state.language === "en" ? "Failed to add friend." : "친구를 추가하지 못했습니다.");
  }
});
$("#openAddFriend").addEventListener("click", () => {
  $("#friendInput").value = "";
  $("#addFriendPanel").hidden = false;
  $("#friendInput").focus();
});
$("#closeAddFriend").addEventListener("click", () => $("#addFriendPanel").hidden = true);
$("#friendRequests").addEventListener("click", async event => {
  const button = event.target.closest("[data-friend-request]");
  if (!button) return;
  const request = state.friendRequests.find(item => item.id === button.dataset.friendRequest);
  if (!request) return;
  try {
    await api("/api/friends/respond", {
      method: "POST",
      body: JSON.stringify({ id: request.id, status: button.dataset.friendStatus })
    });
    if (button.dataset.friendStatus === "accepted" && !state.friends.includes(request.from)) {
      state.friends.push(request.from);
      localStorage.setItem("morse-friends", JSON.stringify(state.friends));
      loadFriendProfiles();
    }
    state.friendRequests = state.friendRequests.filter(item => item.id !== request.id);
    renderFriendRequests();
    renderFriends();
  } catch (error) {
    showApiFailure(error, state.language === "en" ? "Failed to respond." : "친구 요청 처리에 실패했습니다.");
  }
});
$("#openReceivedRequests").addEventListener("click", () => openFriendRequestPanel("received"));
$("#openSentRequests").addEventListener("click", () => openFriendRequestPanel("sent"));
$("#closeFriendRequests").addEventListener("click", () => $("#friendRequestPanel").hidden = true);
$("#friendList").addEventListener("click", event => {
  const profile = event.target.closest("[data-profile-friend]");
  if (profile) return openFriendProfile(profile.dataset.profileFriend);
  const conversation = event.target.closest("[data-open-friend-id]");
  const card = event.target.closest("[data-friend-id]");
  if (conversation) openChat(conversation.dataset.openFriendId);
  else if (card) openChat(card.dataset.friendId);
});
$("#groupList").addEventListener("click", event => {
  const button = event.target.closest("[data-open-group]");
  if (button) openGroupChat(button.dataset.openGroup);
});
$("#openCreateGroup").addEventListener("click", () => {
  $("#groupNameInput").value = "";
  renderGroupFriendChoices($("#groupFriendChoices"));
  $("#createGroupPanel").hidden = false;
});
$("#closeCreateGroup").addEventListener("click", () => $("#createGroupPanel").hidden = true);
$("#createGroupForm").addEventListener("submit", event => {
  event.preventDefault();
  const name = $("#groupNameInput").value.trim();
  const members = [...$("#groupFriendChoices").querySelectorAll("input:checked")].map(input => input.value);
  if (!name) return showToast("그룹 이름을 입력하세요.");
  api("/api/groups/create", { method: "POST", body: JSON.stringify({ name, members }) }).then(({ group }) => {
    $("#createGroupPanel").hidden = true;
    state.groups.unshift(group);
    renderGroups();
    openGroupChat(group.id);
  }).catch(error => showApiFailure(error, "그룹챗을 만들지 못했습니다."));
});
$("#closeGroupChat").addEventListener("click", closeGroupChat);
function bindUnifiedGroupSend({ daily, form, button, picker, limitAttribute, hint }) {
  let startX = 0;
  let swiped = false;
  let longPressed = false;
  let holdTimer = null;
  const send = hidden => {
    commitGroupLetter(daily);
    const text = (daily ? state.dailyGroupText : state.groupText).trim();
    const group = daily ? state.dailyGroup : state.activeGroup;
    if (!text || !group) return;
    sendGroupMessage(group, text, daily, hidden ? { hidden: true, limit: state.hiddenViewLimit } : {});
    if (daily) {
      state.dailyGroupText = "";
      state.dailyGroupSignal = "";
    } else {
      state.groupText = "";
      state.groupSignal = "";
    }
    renderGroupComposer(daily);
  };
  $(form).addEventListener("submit", event => {
    event.preventDefault();
    if (swiped || longPressed) {
      swiped = false;
      longPressed = false;
      return;
    }
    send(false);
  });
  $(button).addEventListener("pointerdown", event => {
    startX = event.clientX;
    swiped = false;
    longPressed = false;
    clearTimeout(holdTimer);
    holdTimer = setTimeout(() => {
      longPressed = true;
      $(button).classList.remove("swiping");
      $(picker).hidden = false;
    }, 550);
    $(button).classList.add("swiping");
    $(button).setPointerCapture?.(event.pointerId);
  });
  $(button).addEventListener("pointerup", event => {
    clearTimeout(holdTimer);
    $(button).classList.remove("swiping");
    if (longPressed || event.clientX - startX < 70) return;
    swiped = true;
    send(true);
  });
  $(button).addEventListener("pointercancel", () => {
    clearTimeout(holdTimer);
    $(button).classList.remove("swiping");
  });
  $(picker).addEventListener("click", event => {
    const option = event.target.closest(`[${limitAttribute}]`);
    if (!option) return;
    state.hiddenViewLimit = option.getAttribute(limitAttribute);
    localStorage.setItem("morse-hidden-view-limit", state.hiddenViewLimit);
    $(picker).hidden = true;
    $(hint).textContent = `${state.language === "en" ? "Swipe right · Morse Only" : "오른쪽 밀기 · 숨김 신호"} · ${hiddenLimitLabel()}`;
  });
}
bindUnifiedGroupSend({ daily: false, form: "#groupMessageForm", button: "#sendGroupMessage", picker: "#groupHiddenViewPicker", limitAttribute: "data-group-hidden-limit", hint: "#groupHiddenLimitHint" });
bindUnifiedGroupSend({ daily: true, form: "#dailyGroupForm", button: "#sendDailyGroupMessage", picker: "#dailyGroupHiddenViewPicker", limitAttribute: "data-daily-hidden-limit", hint: "#dailyGroupHiddenLimitHint" });
$("#groupMessagePhotoInput").addEventListener("change", event => {
  const file = event.target.files?.[0];
  event.target.value = "";
  if (!file || !state.activeGroup) return;
  state.asciiTarget = "group-message";
  prepareAsciiPhoto(file);
});
$("#openGroupManage").addEventListener("click", () => {
  if (!state.activeGroup) return;
  const owner = state.activeGroup.owner === state.userId;
  $("#groupManageName").textContent = state.activeGroup.name;
  $("#groupManageVisual").innerHTML = state.activeGroup.profileAscii
    ? `<pre data-no-i18n>${escapeHtml(state.activeGroup.profileAscii)}</pre>`
    : `<strong>${escapeHtml(state.activeGroup.name).charAt(0)}</strong>`;
  $("#groupPhotoLabel").hidden = !owner;
  $("#groupManageMembers").innerHTML = state.activeGroup.members.map(member => `
    <article class="group-member-card">
      <button type="button" class="friend-profile-button" data-member-profile="${escapeHtml(member.signalId)}">${profileAvatarHtml(member, member.nickname)}</button>
      <strong data-no-i18n>${escapeHtml(member.nickname)}</strong>
      ${member.owner ? "<small>(방장)</small>" : ""}
      ${owner && !member.owner ? `<button type="button" class="kick-member" data-kick-member="${escapeHtml(member.signalId)}">강퇴</button>` : ""}
    </article>`).join("");
  renderGroupFriendChoices($("#groupAddFriendChoices"), true);
  renderGroupThemeChoices();
  $("#groupManagePanel").hidden = false;
});
$("#openGroupManageAvatar").addEventListener("click", () => $("#openGroupManage").click());
$("#closeGroupManage").addEventListener("click", () => $("#groupManagePanel").hidden = true);
$("#groupAddFriendChoices").addEventListener("click", event => {
  const button = event.target.closest("[data-add-group-friend]");
  if (!button || !state.activeGroup) return;
  api("/api/groups/add", {
    method: "POST",
    body: JSON.stringify({ groupId: state.activeGroup.id, friend: button.dataset.addGroupFriend })
  }).then(({ group }) => {
    state.activeGroup = group;
    $("#groupManagePanel").hidden = true;
    renderGroupMessages();
    loadGroups();
  }).catch(error => showApiFailure(error, "친구를 그룹에 추가하지 못했습니다."));
});
$("#leaveGroup").addEventListener("click", () => {
  if (!state.activeGroup || !confirm("이 그룹챗에서 나갈까요?")) return;
  api("/api/groups/leave", { method: "POST", body: JSON.stringify({ groupId: state.activeGroup.id }) }).then(() => {
    $("#groupManagePanel").hidden = true;
    closeGroupChat();
  }).catch(error => showApiFailure(error, "그룹챗에서 나가지 못했습니다."));
});
$("#groupManageMembers").addEventListener("click", event => {
  const profile = event.target.closest("[data-member-profile]");
  if (profile) return openFriendProfile(profile.dataset.memberProfile);
  const kick = event.target.closest("[data-kick-member]");
  if (!kick || !state.activeGroup || !confirm("이 멤버를 강퇴할까요?")) return;
  api("/api/groups/kick", {
    method: "POST",
    body: JSON.stringify({ groupId: state.activeGroup.id, member: kick.dataset.kickMember })
  }).then(({ group }) => {
    state.activeGroup = group;
    $("#openGroupManage").click();
    renderGroupMessages();
  }).catch(error => showApiFailure(error, "멤버를 강퇴하지 못했습니다."));
});
$("#groupPhotoInput").addEventListener("change", event => {
  const file = event.target.files?.[0];
  event.target.value = "";
  if (!file) return;
  state.asciiTarget = "group-profile";
  prepareAsciiPhoto(file);
});
$("#groupMessages").addEventListener("click", event => {
  const profile = event.target.closest("[data-group-profile]");
  if (profile) openFriendProfile(profile.dataset.groupProfile);
  const bubble = event.target.closest("[data-group-message]");
  if (bubble && !profile) {
    const message = state.groupMessages[Number(bubble.dataset.groupMessage)];
    if (message?.hidden) {
      if (hiddenSignalExhausted(message)) return showToast("이 진동 전용 메시지는 재생 횟수를 모두 사용했습니다.");
      message.views = Number(message.views || 0) + 1;
      if (message.id) {
        state.groupHiddenViews[message.id] = message.views;
        localStorage.setItem("morse-group-hidden-views", JSON.stringify(state.groupHiddenViews));
      }
      renderGroupMessages();
    }
    playMorse(message?.text || "", null, message?.text || "", message?.senderSound || "");
  }
});
$("#dailyGroupMessages").addEventListener("click", event => {
  const author = event.target.closest("[data-group-profile]");
  if (author) {
    if (author.dataset.groupProfile === state.dailyGroup?.members?.find(member => member.nickname === "나")?.signalId) return;
    if (!confirm("이 익명 멤버를 차단할까요?")) return;
    api("/api/daily-group/block", {
      method: "POST",
      body: JSON.stringify({ groupId: state.dailyGroup.id, anonymousId: author.dataset.groupProfile })
    }).then(loadDailyGroup).catch(error => showApiFailure(error, "멤버를 차단하지 못했습니다."));
    return;
  }
  const bubble = event.target.closest("[data-group-message]");
  if (bubble) {
    const message = state.dailyGroupMessages[Number(bubble.dataset.groupMessage)];
    if (message?.hidden) {
      if (hiddenSignalExhausted(message)) return showToast("이 진동 전용 메시지는 재생 횟수를 모두 사용했습니다.");
      message.views = Number(message.views || 0) + 1;
      if (message.id) {
        state.groupHiddenViews[message.id] = message.views;
        localStorage.setItem("morse-group-hidden-views", JSON.stringify(state.groupHiddenViews));
      }
      renderDailyGroup();
    }
    playMorse(message?.text || "", null, message?.text || "", message?.senderSound || "");
  }
});
$("#toggleDailyGroupJoin").addEventListener("click", toggleDailyGroupJoin);
$("#leaveDailyGroup").addEventListener("click", () => {
  if (!state.dailyGroup || !confirm("오늘의 데일리 그룹챗에서 나갈까요?")) return;
  api("/api/groups/leave", { method: "POST", body: JSON.stringify({ groupId: state.dailyGroup.id }) }).then(() => {
    state.dailyGroup = null;
    state.dailyGroupMessages = [];
    $("#dailyGroupStatus").textContent = state.language === "en" ? "You left today's group chat." : "오늘의 데일리 그룹챗에서 나갔습니다.";
    $("#dailyGroupForm").hidden = true;
    $("#dailyGroupMessages").innerHTML = '<p class="chat-empty">오늘의 그룹챗에서 나갔습니다.</p>';
  }).catch(error => showApiFailure(error, "그룹챗에서 나가지 못했습니다."));
});
bindGroupKeyer("#groupMessageKeyer", false);
bindGroupKeyer("#dailyGroupKeyer", true);
$("#groupMessageInput").addEventListener("input", event => {
  state.groupSignal = "";
  state.groupText = event.target.value;
  renderGroupComposer(false);
});
$("#dailyGroupInput").addEventListener("input", event => {
  state.dailyGroupSignal = "";
  state.dailyGroupText = event.target.value;
  renderGroupComposer(true);
  renderGame();
});
function bindGroupDelete(button, daily) {
  let held = false;
  let timer = null;
  let interval = null;
  $(button).addEventListener("pointerdown", event => {
    held = false;
    $(button).setPointerCapture?.(event.pointerId);
    timer = setTimeout(() => {
      held = true;
      clearGroupComposerCharacter(daily);
      interval = setInterval(() => clearGroupComposerCharacter(daily), 110);
    }, 420);
  });
  $(button).addEventListener("pointerup", () => {
    clearTimeout(timer);
    clearInterval(interval);
    if (!held) clearGroupComposerCharacter(daily);
  });
  $(button).addEventListener("pointercancel", () => {
    clearTimeout(timer);
    clearInterval(interval);
  });
}
bindGroupDelete("#clearGroupMessage", false);
bindGroupDelete("#clearDailyGroupMessage", true);
$("#dailyGroupPhotoInput").addEventListener("change", event => {
  const file = event.target.files?.[0];
  event.target.value = "";
  if (!file || !state.dailyGroup) return;
  state.asciiTarget = "daily-group-message";
  prepareAsciiPhoto(file);
});
$("#unlockDiary").addEventListener("click", async () => {
  const password = $("#diaryPassword").value;
  if (password.length < 4) return showToast("비밀번호를 4자 이상 입력하세요.");
  const hash = await diaryPasswordHash(password);
  try {
    if (!state.diaryHasServerPassword) {
      if (password !== $("#diaryPasswordConfirm").value) return showToast("비밀번호 확인이 일치하지 않습니다.");
      await api("/api/diary/setup", { method: "POST", body: JSON.stringify({ passwordHash: hash }) });
      state.diaryHasServerPassword = true;
    }
    const { entries } = await api("/api/diary/unlock", { method: "POST", body: JSON.stringify({ passwordHash: hash }) });
    state.diaryPasswordHash = hash;
    state.diaryEntries = entries;
    const localEntries = JSON.parse(localStorage.getItem("morse-secret-diary-entries") || "[]");
    if (localEntries.length) {
      const migrated = await api("/api/diary/entries", {
        method: "POST",
        body: JSON.stringify({ passwordHash: hash, entries: localEntries })
      });
      state.diaryEntries.push(...migrated.entries);
      localStorage.removeItem("morse-secret-diary-entries");
      localStorage.removeItem("morse-secret-diary-password");
    }
  } catch (error) {
    if (error.status === 403) return showToast("비밀번호가 맞지 않습니다.");
    return showApiFailure(error, "비밀일기를 열지 못했습니다.");
  }
  state.diaryUnlocked = true;
  $("#diaryLock").hidden = true;
  $("#diaryDesk").hidden = false;
  selectDiaryDate(state.diarySelectedDate);
  renderDiary();
});
["diaryPassword", "diaryPasswordConfirm"].forEach(id => $(`#${id}`).addEventListener("keydown", event => {
  if (event.key === "Enter") $("#unlockDiary").click();
}));
$("#lockDiary").addEventListener("click", openSecretDiary);
$("#diaryText").addEventListener("input", event => {
  clearTimeout(state.diaryLetterTimer);
  clearTimeout(state.diarySpaceTimer);
  state.diarySignal = "";
  state.diaryText = event.target.value;
  state.diaryDirty = true;
  $("#diarySignal").textContent = "현재 글자: 비어 있음";
});
$("#diaryKeyer").addEventListener("pointerdown", event => {
  clearTimeout(state.diaryLetterTimer);
  clearTimeout(state.diarySpaceTimer);
  state.keyerPressStart = performance.now();
  state.diaryKeyerStartX = event.clientX;
  state.diaryKeyerStartY = event.clientY;
  $("#diaryKeyer").classList.add("pressed");
  $("#diaryKeyer").setPointerCapture?.(event.pointerId);
});
$("#diaryCalendar").addEventListener("click", event => {
  const button = event.target.closest("[data-diary-date]");
  if (!button) return;
  if (state.diaryDirty && !confirm("저장하지 않은 내용이 있습니다. 다른 날짜로 이동할까요?")) return;
  selectDiaryDate(button.dataset.diaryDate);
});
function moveDiaryMonth(direction) {
  const [year, month] = state.diaryCalendarMonth.split("-").map(Number);
  const next = new Date(year, month - 1 + direction, 1);
  state.diaryCalendarMonth = `${next.getFullYear()}-${String(next.getMonth() + 1).padStart(2, "0")}`;
  renderDiaryCalendar();
}
$("#diaryPrevMonth").addEventListener("click", () => moveDiaryMonth(-1));
$("#diaryNextMonth").addEventListener("click", () => moveDiaryMonth(1));
$("#diaryCalendarTitle").addEventListener("click", () => {
  const currentYear = Number(state.diaryCalendarMonth.slice(0, 4));
  $("#diaryYearPicker").innerHTML = Array.from({ length: 21 }, (_, index) => currentYear - 10 + index)
    .map(year => `<button type="button" data-diary-year="${year}">${year}</button>`).join("");
  $("#diaryYearPicker").hidden = !$("#diaryYearPicker").hidden;
});
$("#diaryYearPicker").addEventListener("click", event => {
  const button = event.target.closest("[data-diary-year]");
  if (!button) return;
  state.diaryCalendarMonth = `${button.dataset.diaryYear}-${state.diaryCalendarMonth.slice(5)}`;
  $("#diaryYearPicker").hidden = true;
  renderDiaryCalendar();
});
$("#appendDiaryText").addEventListener("click", () => appendDiarySegment("text"));
$("#appendDiaryVibration").addEventListener("click", () => appendDiarySegment("vibration"));
$("#diaryDraftSegments").addEventListener("click", event => {
  const button = event.target.closest("[data-remove-diary-segment]");
  if (!button) return;
  state.diaryDraftSegments.splice(Number(button.dataset.removeDiarySegment), 1);
  renderDiary();
});
$("#openDiaryList").addEventListener("click", () => {
  renderDiaryList();
  $("#diaryListPanel").hidden = false;
});
$("#closeDiaryList").addEventListener("click", () => $("#diaryListPanel").hidden = true);
$("#diaryKeyer").addEventListener("pointerup", event => {
  $("#diaryKeyer").classList.remove("pressed");
  const deltaX = event.clientX - state.diaryKeyerStartX;
  const deltaY = event.clientY - state.diaryKeyerStartY;
  if (state.chatKeyerMode === "auto" && handleAutoVerticalSwipe(deltaX, deltaY, commitDiaryLetter, commitDiaryNewline)) return;
  if (state.chatKeyerMode === "manual" && handleManualComposerSwipe(deltaX, deltaY, commitDiaryLetter, commitDiarySpace, commitDiaryNewline)) return;
  addDiarySignal(performance.now() - state.keyerPressStart < state.unit * 2 ? "." : "-");
});
$("#diaryKeyer").addEventListener("pointercancel", () => $("#diaryKeyer").classList.remove("pressed"));
$("#clearDiaryText").addEventListener("click", () => {
  if (state.diarySignal) state.diarySignal = state.diarySignal.slice(0, -1);
  else state.diaryText = graphemes(state.diaryText).slice(0, -1).join("");
  renderDiary();
});
$("#saveDiaryEntry").addEventListener("click", () => {
  storeDiaryEntry();
});
$("#submitSuggestion").addEventListener("click", async () => {
  const text = $("#suggestionText").value.trim();
  if (!state.authToken) return openAuthPanel();
  if (text.length < 2) return showToast(state.language === "en" ? "Please enter your suggestion." : "건의 내용을 입력해 주세요.");
  const button = $("#submitSuggestion");
  button.disabled = true;
  try {
    await api("/api/suggestions", { method: "POST", body: JSON.stringify({ text }) });
    $("#suggestionText").value = "";
    $("#suggestionStatus").textContent = state.language === "en" ? "Suggestion sent. Thank you." : "건의사항을 보냈습니다. 감사합니다.";
    $("#suggestionStatus").hidden = false;
  } catch (error) {
    showApiFailure(error, state.language === "en" ? "Could not send the suggestion." : "건의사항을 보내지 못했습니다.");
  } finally {
    button.disabled = false;
  }
});
$("#diaryEntries").addEventListener("click", event => {
  const segment = event.target.closest("[data-diary-segment-play]");
  if (segment) return playMorse(segment.dataset.segmentText || "", null, "");
  const play = event.target.closest("[data-diary-play]");
  if (play) return playMorse(state.diaryEntries[Number(play.dataset.diaryPlay)]?.text || "", null, "");
  const remove = event.target.closest("[data-delete-diary]");
  if (!remove || !confirm("이 일기를 삭제할까요?")) return;
  const index = Number(remove.dataset.deleteDiary);
  const entry = state.diaryEntries[index];
  api("/api/diary/entries", {
    method: "DELETE",
    body: JSON.stringify({ passwordHash: state.diaryPasswordHash, id: entry.id })
  }).then(() => {
    state.diaryEntries.splice(index, 1);
    renderDiary();
  }).catch(error => showApiFailure(error, "일기를 삭제하지 못했습니다."));
});
$("#diaryAllEntries").addEventListener("click", event => {
  const segment = event.target.closest("[data-diary-segment-play]");
  if (segment) return playMorse(segment.dataset.segmentText || "", null, "");
  const remove = event.target.closest("[data-delete-diary]");
  if (!remove || !confirm("이 일기를 삭제할까요?")) return;
  const index = Number(remove.dataset.deleteDiary);
  const entry = state.diaryEntries[index];
  api("/api/diary/entries", {
    method: "DELETE",
    body: JSON.stringify({ passwordHash: state.diaryPasswordHash, id: entry.id })
  }).then(() => {
    state.diaryEntries.splice(index, 1);
    renderDiary();
    renderDiaryList();
  }).catch(error => showApiFailure(error));
});
$("#startGame").addEventListener("click", startSpeedGame);
$("#refreshGameRanking").addEventListener("click", () => loadGameRanking(10));
$("#openFullRanking").addEventListener("click", () => {
  $("#gameRankingPanel").hidden = false;
  loadGameRanking(100);
});
$("#closeGameRanking").addEventListener("click", () => $("#gameRankingPanel").hidden = true);
$("#gameInput").addEventListener("input", event => {
  if (!state.gameRunning) return event.target.value = "";
  state.gameSignal = "";
  state.gameText = event.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "");
  renderGame();
  checkGameWord();
});
$("#clearGameInput").addEventListener("click", () => {
  if (state.gameSignal) state.gameSignal = state.gameSignal.slice(0, -1);
  else state.gameText = state.gameText.slice(0, -1);
  renderGame();
});
$("#gameKeyer").addEventListener("pointerdown", event => {
  if (!state.gameRunning) return;
  clearTimeout(state.gameLetterTimer);
  state.keyerPressStart = performance.now();
  state.gameKeyerStartX = event.clientX;
  state.gameKeyerStartY = event.clientY;
  $("#gameKeyer").classList.add("pressed");
  $("#gameKeyer").setPointerCapture?.(event.pointerId);
});
$("#gameKeyer").addEventListener("pointerup", event => {
  $("#gameKeyer").classList.remove("pressed");
  if (!state.gameRunning) return;
  const deltaX = event.clientX - state.gameKeyerStartX;
  const deltaY = event.clientY - state.gameKeyerStartY;
  if (state.chatKeyerMode === "auto" && handleAutoVerticalSwipe(deltaX, deltaY, commitGameLetter, () => {})) return;
  if (state.chatKeyerMode === "manual" && handleManualComposerSwipe(deltaX, deltaY, commitGameLetter, () => {}, () => {})) return;
  addGameSignal(performance.now() - state.keyerPressStart < state.unit * 2 ? "." : "-");
});
$("#gameKeyer").addEventListener("pointercancel", () => $("#gameKeyer").classList.remove("pressed"));
$("#closeChat").addEventListener("click", closeChat);
$("#openChatProfile").addEventListener("click", () => state.activeFriend && openFriendProfile(state.activeFriend));
$("#openChatProfileInfo").addEventListener("click", () => state.activeFriend && openFriendProfile(state.activeFriend));
$("#openSecretComm").addEventListener("click", () => {
  if (!state.activeFriend) return;
  const invited = state.pendingSecretPartner === state.activeFriend && state.pendingSecretSessionId;
  enterSecretComm(state.activeFriend, !invited, invited ? state.pendingSecretSessionId : "");
});
$("#secretCommSurface").addEventListener("pointerdown", event => {
  if (!state.secretActive || state.secretPointerDown) return;
  state.secretPointerDown = true;
  $("#secretCommSurface").classList.add("pressed");
  $("#secretCommSurface").setPointerCapture?.(event.pointerId);
  sendSecretSignal("down");
});
function releaseSecretCommSignal() {
  if (!state.secretPointerDown) return;
  state.secretPointerDown = false;
  $("#secretCommSurface").classList.remove("pressed");
  sendSecretSignal("up");
}
$("#secretCommSurface").addEventListener("pointerup", releaseSecretCommSignal);
$("#secretCommSurface").addEventListener("pointercancel", releaseSecretCommSignal);
$("#secretCommSurface").addEventListener("lostpointercapture", releaseSecretCommSignal);
$("#exitSecretComm").addEventListener("click", () => {
  if (state.secretExitArmed) {
    closeSecretComm();
    return;
  }
  state.secretExitArmed = true;
  $("#exitSecretComm").classList.add("armed");
  clearTimeout(state.secretExitTimer);
  state.secretExitTimer = setTimeout(() => {
    state.secretExitArmed = false;
    $("#exitSecretComm").classList.remove("armed");
  }, 3000);
});
document.addEventListener("visibilitychange", () => {
  if (document.hidden && state.secretActive) releaseSecretCommSignal();
});
$("#closeFriendProfile").addEventListener("click", () => $("#friendProfilePanel").hidden = true);
$("#chatFromProfile").addEventListener("click", () => {
  const signalId = state.viewingProfileSignalId;
  $("#friendProfilePanel").hidden = true;
  if (!signalId) return;
  if (!state.friends.includes(signalId)) return;
  switchWorld("friends");
  openChat(signalId);
});
$("#removeFriend").addEventListener("click", async () => {
  const friend = state.viewingProfileSignalId;
  if (!friend || !state.friends.includes(friend)) return;
  if (!confirm(state.language === "en" ? "Remove this friend?" : "이 친구와 친구 관계를 끊을까요?")) return;
  try {
    await api("/api/friends/remove", {
      method: "POST",
      body: JSON.stringify({ friend })
    });
    removeLocalFriend(friend);
    showToast(state.language === "en" ? "Friend removed." : "친구 관계를 끊었습니다.");
  } catch (error) {
    showApiFailure(error, state.language === "en" ? "Failed to remove friend." : "친구 관계를 끊지 못했습니다.");
  }
});

function cancelChatMessageHold() {
  clearTimeout(state.chatMessageHoldTimer);
  state.chatMessageHoldTimer = null;
  state.chatMessageHoldIndex = -1;
}

function deleteChatMessage(index) {
  if (!state.activeFriend || index < 0 || index >= (state.chats[state.activeFriend]?.length || 0)) return;
  const prompt = state.language === "en" ? "Delete this message?" : "이 메시지를 삭제할까요?";
  if (!confirm(prompt)) return;
  state.chats[state.activeFriend].splice(index, 1);
  saveChats();
  renderChat();
  renderFriends();
  showToast("메시지를 삭제했습니다.");
}

$("#chatMessages").addEventListener("pointerdown", event => {
  const bubble = event.target.closest("[data-chat-message]");
  if (!bubble || !state.activeFriend) return;
  cancelChatMessageHold();
  state.chatMessageLongPressed = false;
  state.chatMessageHoldIndex = Number(bubble.dataset.chatMessage);
  state.chatMessageHoldX = event.clientX;
  state.chatMessageHoldY = event.clientY;
  state.chatMessageHoldTimer = setTimeout(() => {
    const index = state.chatMessageHoldIndex;
    state.chatMessageLongPressed = true;
    cancelChatMessageHold();
    navigator.vibrate?.(35);
    deleteChatMessage(index);
  }, 650);
});

$("#chatMessages").addEventListener("pointermove", event => {
  if (!state.chatMessageHoldTimer) return;
  if (Math.hypot(event.clientX - state.chatMessageHoldX, event.clientY - state.chatMessageHoldY) > 12) {
    cancelChatMessageHold();
  }
});

["pointerup", "pointercancel", "pointerleave"].forEach(type =>
  $("#chatMessages").addEventListener(type, cancelChatMessageHold)
);

$("#chatMessages").addEventListener("contextmenu", event => {
  if (event.target.closest("[data-chat-message]")) event.preventDefault();
});

$("#chatMessages").addEventListener("click", event => {
  if (state.chatMessageLongPressed) {
    state.chatMessageLongPressed = false;
    return;
  }
  const bubble = event.target.closest("[data-chat-message]");
  if (!bubble || !state.activeFriend) return;
  const message = state.chats[state.activeFriend][Number(bubble.dataset.chatMessage)];
  if (typeof message === "object" && message.type === "system") return;
  const hidden = typeof message === "object" && message.hidden;
  if (hidden) {
    if (hiddenSignalExhausted(message)) {
      showToast(state.language === "en" ? "This hidden signal has no plays remaining." : "? ?? ??? ?? ??? ?? ??????.");
      return;
    }
    message.views = Number(message.views || 0) + 1;
    saveChats();
    renderChat();
  }
  const text = chatMessageText(message);
  if (text && vibrationPattern(text).length) playMorse(text, null, hidden ? "" : text, message?.senderSound || "");
});
$("#chatMorseText").addEventListener("input", event => {
  clearTimeout(state.chatLetterTimer);
  clearTimeout(state.chatSpaceTimer);
  state.chatSignal = "";
  const raw = event.target.value;
  state.chatMorseText = chatInputText(raw);
  event.target.value = state.chatMorseText;
  $("#chatMorseSignal").textContent = "현재 글자: 비어 있음";
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
    const outgoing = { mine: true, type: "ascii", text: state.asciiDraft, senderSound: equippedSound() };
    state.randomMessages.push(outgoing);
    renderRandomSignal();
    api("/api/random/send", {
      method: "POST",
      body: JSON.stringify({ userId: state.userId, message: { ...outgoing, mine: false } })
    }).catch(() => showToast("서버 연결에 실패했습니다."));
  } else if (state.asciiTarget === "group-message" && state.activeGroup) {
    sendGroupMessage(state.activeGroup, state.asciiDraft, false, { type: "ascii" });
  } else if (state.asciiTarget === "daily-group-message" && state.dailyGroup) {
    sendGroupMessage(state.dailyGroup, state.asciiDraft, true, { type: "ascii" });
  } else if (state.asciiTarget === "space") {
    api("/api/space/send", {
      method: "POST",
      body: JSON.stringify({ text: state.asciiDraft, type: "ascii", day: todayKey() })
    }).then(() => {
      const countKey = `morse-space-sent-count-${todayKey()}`;
      localStorage.setItem(countKey, Number(localStorage.getItem(countKey) || 0) + 1);
      playSpaceTransmitAnimation();
      renderSpace();
    }).catch(error => {
      if (error.status === 409) showToast(state.language === "en" ? "You reached today's 30 signal limit." : "오늘의 시그널 발신 30회를 모두 사용했습니다.");
      else showApiFailure(error);
    });
  } else if (state.asciiTarget === "group-profile" && state.activeGroup) {
    api("/api/groups/profile", {
      method: "PATCH",
      body: JSON.stringify({ groupId: state.activeGroup.id, profileAscii: state.asciiDraft })
    }).then(({ group }) => {
      state.activeGroup = group;
      $("#openGroupManage").click();
      renderGroupMessages();
      loadGroups();
    }).catch(error => showApiFailure(error, "그룹 사진을 저장하지 못했습니다."));
  } else return;
  state.asciiDraft = "";
  $("#asciiPreview").hidden = true;
  showToast("사진을 ASCII 아트로 보냈습니다.");
});
$("#openSettings").addEventListener("click", () => {
  $("#authPanel").hidden = true;
  $("#friendProfilePanel").hidden = true;
  $("#asciiPreview").hidden = true;
  renderSettings();
  $("#nicknameChangeStatus").hidden = true;
  $("#settingsPanel").hidden = false;
});
$("#closeSettings").addEventListener("click", () => $("#settingsPanel").hidden = true);
$("#androidGoogleSignIn").addEventListener("click", () => window.AndroidAuth?.signIn());
$("#authModeGoogle").addEventListener("click", () => {
  setAuthMode("google");
  renderGoogleButton();
});
$("#authModeLogin").addEventListener("click", () => setAuthMode("login"));
$("#authModeRegister").addEventListener("click", () => setAuthMode("register"));
$("#localUsername").addEventListener("input", () => {
  if (state.usernameChecked && state.usernameChecked !== $("#localUsername").value.trim().toLowerCase()) state.usernameChecked = "";
});
$("#checkUsername").addEventListener("click", checkLocalUsername);
$("#submitLocalAuth").addEventListener("click", submitLocalAuth);
$("#openAuthSettings").addEventListener("click", openAuthPanel);
$("#logoutAccount").addEventListener("click", logoutAccount);
$("#saveNickname").addEventListener("click", async () => {
  const nickname = $("#settingsNickname").value.trim();
  if (nickname.length < 2) return showToast("닉네임은 2자 이상 입력하세요.");
  try {
    const { account } = await api("/api/profile/me", {
      method: "PATCH",
      body: JSON.stringify({ nickname })
    });
    applyAccountUpdate(account);
    showNicknameStatus(state.language === "en" ? "Nickname changed." : "닉네임을 변경했습니다.");
    showToast("닉네임을 변경했습니다.");
  } catch (error) {
    if (error.status === 409) {
      showNicknameStatus(state.language === "en" ? "That nickname is already in use." : "이미 사용 중인 닉네임입니다.", true);
      showToast("이미 사용 중인 닉네임입니다.");
    } else {
      showNicknameStatus(state.language === "en" ? "Failed to change nickname." : "닉네임을 변경하지 못했습니다.", true);
      showApiFailure(error, "닉네임을 변경하지 못했습니다.");
    }
  }
});
$("#profilePhotoInput").addEventListener("change", event => {
  const file = event.target.files?.[0];
  event.target.value = "";
  if (!file) return;
  if (!file.type.startsWith("image/")) return showToast("사진 파일만 선택할 수 있습니다.");
  const image = new Image();
  const objectUrl = URL.createObjectURL(file);
  image.onload = () => {
    const description = $("#myProfileDescription").value;
    state.profileDraftAscii = imageToAscii(image);
    URL.revokeObjectURL(objectUrl);
    renderMyProfile();
    $("#myProfileDescription").value = description;
  };
  image.onerror = () => {
    URL.revokeObjectURL(objectUrl);
    showToast("사진을 읽을 수 없습니다.");
  };
  image.src = objectUrl;
});
$("#removeProfilePhoto").addEventListener("click", () => {
  const description = $("#myProfileDescription").value;
  state.profileDraftAscii = "";
  renderMyProfile();
  $("#myProfileDescription").value = description;
});
$("#saveMyProfile").addEventListener("click", async () => {
  if (!state.account) return openAuthPanel();
  try {
    const { account } = await api("/api/profile/me", {
      method: "PATCH",
      body: JSON.stringify({
        description: $("#myProfileDescription").value,
        profileAscii: state.profileDraftAscii
      })
    });
    applyAccountUpdate(account);
    showToast("프로필을 저장했습니다.");
  } catch (error) {
    showApiFailure(error, "프로필을 저장하지 못했습니다.");
  }
});
$("#closeAuthPanel").addEventListener("click", () => {
  $("#authPanel").hidden = true;
  switchWorld("hall");
});
$("#submitAuth").addEventListener("click", async () => {
  const nickname = $("#authNickname").value.trim();
  if (!state.googleCredential) return showToast("Google 계정을 먼저 선택하세요.");
  if (nickname.length < 2) return showToast("닉네임은 2자 이상 입력하세요.");
  try {
    const result = await api("/api/auth/google", {
      method: "POST",
      body: JSON.stringify({ credential: state.googleCredential, nickname })
    });
    setAccount(result.token, result.account);
    showToast("닉네임이 설정되었습니다.");
  } catch (error) {
    showToast(error.body?.error || "닉네임 설정에 실패했습니다.");
  }
});
$("#toggleAutocompleteSettings").addEventListener("click", () => {
  $("#autocompleteSettingsPanel").hidden = !$("#autocompleteSettingsPanel").hidden;
  renderAutocompletes();
  renderAutocompleteCode();
});
$("#autocompleteCode").addEventListener("input", renderAutocompleteCode);
$("#autocompleteKeyer").addEventListener("pointerdown", event => {
  state.autocompleteKeyerPressStart = performance.now();
  $("#autocompleteKeyer").classList.add("pressed");
  $("#autocompleteKeyer").setPointerCapture?.(event.pointerId);
});
$("#autocompleteKeyer").addEventListener("pointerup", () => {
  $("#autocompleteKeyer").classList.remove("pressed");
  const held = performance.now() - state.autocompleteKeyerPressStart;
  addAutocompleteMark(held < state.unit * 2 ? "." : "-");
});
$("#autocompleteKeyer").addEventListener("pointercancel", () => $("#autocompleteKeyer").classList.remove("pressed"));
$("#autocompleteBackspace").addEventListener("click", () => {
  const input = $("#autocompleteCode");
  input.value = normalizeAutocompleteCode(input.value).slice(0, -1);
  renderAutocompleteCode();
});
$("#autocompleteClear").addEventListener("click", () => {
  $("#autocompleteCode").value = "";
  renderAutocompleteCode();
});
$("#autocompleteForm").addEventListener("submit", event => {
  event.preventDefault();
  const codeInput = $("#autocompleteCode");
  const textInput = $("#autocompleteText");
  const code = normalizeAutocompleteCode(codeInput.value);
  const text = textInput.value.trim();
  if (!code || !/^[.-]+$/.test(code)) {
    showToast(state.language === "en" ? "Use dots and dashes only." : "점과 선으로만 모스부호를 입력하세요.");
    return;
  }
  if (!text) {
    showToast(state.language === "en" ? "Enter a word or sentence." : "자동완성할 단어 또는 문장을 입력하세요.");
    return;
  }
  if (Object.values(MORSE).includes(code)) {
    showToast(state.language === "en" ? "This code overlaps with standard Morse." : "기존 모스부호와 겹치는 코드입니다.");
    return;
  }
  if (state.autocompletes.some(item => item.code === code)) {
    showToast(state.language === "en" ? "This autocomplete code already exists." : "이미 등록된 자동완성 코드입니다.");
    return;
  }
  state.autocompletes.push({ code, text });
  codeInput.value = "";
  textInput.value = "";
  renderAutocompleteCode();
  saveAutocompletes();
  showToast(state.language === "en" ? "Autocomplete added." : "자동완성을 추가했습니다.");
});
$("#autocompleteList").addEventListener("click", event => {
  const button = event.target.closest("[data-delete-autocomplete]");
  if (!button) return;
  state.autocompletes.splice(Number(button.dataset.deleteAutocomplete), 1);
  saveAutocompletes();
  showToast(state.language === "en" ? "Autocomplete deleted." : "자동완성을 삭제했습니다.");
});
document.querySelectorAll("[data-chat-keyer-mode]").forEach(button => button.addEventListener("click", () => {
  state.chatKeyerMode = button.dataset.chatKeyerMode;
  state.quizKeyerMode = state.chatKeyerMode;
  state.writerKeyerMode = state.chatKeyerMode;
  localStorage.setItem("morse-chat-keyer-mode", state.chatKeyerMode);
  localStorage.removeItem("morse-quiz-keyer-mode");
  localStorage.removeItem("morse-writer-keyer-mode");
  clearTimeout(state.chatLetterTimer);
  clearTimeout(state.chatSpaceTimer);
  clearKeyerTimers("quiz");
  clearKeyerTimers("writer");
  renderSettings();
  renderChatComposer();
  renderGroupComposer(false);
  renderGroupComposer(true);
  renderQuiz();
  renderWriter();
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
  renderGroupComposer(false);
  renderGroupComposer(true);
  if (state.randomSignalState === "connected") renderRandomChatComposer();
});
$("#settingsSpeed").addEventListener("input", event => {
  state.unit = Number(event.target.value);
  localStorage.setItem("morse-speed", state.unit);
  renderSpeed();
  renderSettings();
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
  if (state.chatKeyerMode === "auto"
    && handleAutoVerticalSwipe(deltaX, deltaY, commitChatLetter, commitChatNewline)) return;
  if (state.chatKeyerMode === "manual"
    && handleManualComposerSwipe(deltaX, deltaY, commitChatLetter, commitChatSpace, commitChatNewline)) return;
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
  showPostRandomSignalAd();
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
  if (vibrationPattern(message.text).length) playMorse(message.text, null, message.hidden ? "" : message.text, message.senderSound || "");
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
  else state.randomChatText = graphemes(state.randomChatText).slice(0, -1).join("");
  renderRandomChatComposer();
});
$("#sendRandomChat").addEventListener("click", () => {
  if (state.randomSendSwiped || state.randomSendLongPressed) {
    state.randomSendSwiped = false;
    state.randomSendLongPressed = false;
    return;
  }
  commitRandomChatLetter();
  sendRandomChat(state.randomChatText);
});
$("#sendRandomChat").addEventListener("pointerdown", event => {
  state.randomSendStartX = event.clientX;
  state.randomSendSwiped = false;
  state.randomSendLongPressed = false;
  clearTimeout(state.randomSendHoldTimer);
  state.randomSendHoldTimer = setTimeout(() => {
    state.randomSendLongPressed = true;
    $("#sendRandomChat").classList.remove("swiping");
    $("#randomHiddenPicker").hidden = false;
  }, 550);
  $("#sendRandomChat").classList.add("swiping");
  $("#sendRandomChat").setPointerCapture?.(event.pointerId);
});
$("#sendRandomChat").addEventListener("pointerup", event => {
  clearTimeout(state.randomSendHoldTimer);
  $("#sendRandomChat").classList.remove("swiping");
  if (state.randomSendLongPressed) return;
  if (event.clientX - state.randomSendStartX < 70) return;
  state.randomSendSwiped = true;
  commitRandomChatLetter();
  sendRandomChat(state.randomChatText, true);
});
$("#sendRandomChat").addEventListener("pointercancel", () => {
  clearTimeout(state.randomSendHoldTimer);
  $("#sendRandomChat").classList.remove("swiping");
});
$("#randomHiddenPicker").addEventListener("click", event => {
  const button = event.target.closest("[data-random-limit]");
  if (!button) return;
  state.randomHiddenLimit = button.dataset.randomLimit;
  localStorage.setItem("morse-random-hidden-limit", state.randomHiddenLimit);
  $("#randomHiddenPicker").hidden = true;
  state.randomSendLongPressed = false;
  renderRandomChatComposer();
  showToast(`숨김 신호를 ${hiddenLimitLabel(state.randomHiddenLimit)} 재생할 수 있습니다.`);
});
$("#randomPhotoInput").addEventListener("change", event => {
  const file = event.target.files?.[0];
  event.target.value = "";
  if (!file) return;
  state.asciiTarget = "random";
  prepareAsciiPhoto(file);
});
$("#spacePhotoInput").addEventListener("change", event => {
  const file = event.target.files?.[0];
  event.target.value = "";
  if (!file) return;
  state.asciiTarget = "space";
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
  if (state.chatKeyerMode === "auto"
    && handleAutoVerticalSwipe(deltaX, deltaY, commitRandomChatLetter, commitRandomChatNewline)) return;
  if (state.chatKeyerMode === "manual"
    && handleManualComposerSwipe(deltaX, deltaY, commitRandomChatLetter, commitRandomChatSpace, commitRandomChatNewline)) return;
  const held = performance.now() - state.keyerPressStart;
  addRandomChatSignal(held < state.unit * 2 ? "." : "-");
});
$("#randomChatKeyer").addEventListener("pointercancel", () => $("#randomChatKeyer").classList.remove("pressed"));
document.querySelectorAll("[data-space-view]").forEach(button => button.addEventListener("click", () => {
  document.querySelectorAll("[data-space-view]").forEach(item => item.classList.toggle("active", item === button));
  $("#spaceTransmit").hidden = button.dataset.spaceView !== "transmit";
  $("#spaceReceive").hidden = button.dataset.spaceView !== "receive";
}));
$("#spaceSendInput").addEventListener("input", event => {
  clearTimeout(state.spaceSendLetterTimer);
  clearTimeout(state.spaceSendSpaceTimer);
  state.spaceSendSignal = "";
  const filtered = event.target.value.replace(SPACE_SIGNAL_FILTER_RE, "").replace(/ {2,}/g, " ");
  state.spaceSendText = filtered;
  if (event.target.value !== filtered) {
    showToast("Space Signals allow letters, numbers, and Morse symbols.");
  }
  renderSpace();
});
$("#spaceSendKeyer").addEventListener("pointerdown", event => {
  clearTimeout(state.spaceSendLetterTimer);
  clearTimeout(state.spaceSendSpaceTimer);
  state.keyerPressStart = performance.now();
  state.spaceSendKeyerStartX = event.clientX;
  state.spaceSendKeyerStartY = event.clientY;
  $("#spaceSendKeyer").classList.add("pressed");
  $("#spaceSendKeyer").setPointerCapture?.(event.pointerId);
});
$("#spaceSendKeyer").addEventListener("pointerup", event => {
  $("#spaceSendKeyer").classList.remove("pressed");
  const deltaX = event.clientX - state.spaceSendKeyerStartX;
  const deltaY = event.clientY - state.spaceSendKeyerStartY;
  if (state.chatKeyerMode === "auto"
    && handleAutoVerticalSwipe(deltaX, deltaY, commitSpaceSendLetter, commitSpaceSendNewline)) return;
  if (state.chatKeyerMode === "manual"
    && handleManualComposerSwipe(deltaX, deltaY, commitSpaceSendLetter, commitSpaceSendSpace, commitSpaceSendNewline)) return;
  const held = performance.now() - state.keyerPressStart;
  addSpaceSendSignal(held < state.unit * 2 ? "." : "-");
});
$("#spaceSendKeyer").addEventListener("pointercancel", () => $("#spaceSendKeyer").classList.remove("pressed"));
$("#spaceSendForm").addEventListener("submit", event => {
  event.preventDefault();
  commitSpaceSendLetter();
  const text = state.spaceSendText.trim();
  if (!text) return;
  if (!SPACE_SIGNAL_ALLOWED_RE.test(text)) {
    showToast("Space Signals allow letters, numbers, and Morse symbols.");
    return;
  }
  api("/api/space/send", {
    method: "POST",
    body: JSON.stringify({ sender: state.userId, text, day: todayKey() })
  }).then(() => {
    const countKey = `morse-space-sent-count-${todayKey()}`;
    localStorage.setItem(countKey, Number(localStorage.getItem(countKey) || 0) + 1);
    state.spaceSendText = "";
    state.spaceSendSignal = "";
    playSpaceTransmitAnimation();
    renderSpace();
    showToast("우주로 시그널을 발신했습니다.");
  }).catch(error => {
    if (error.status === 409) showToast(state.language === "en" ? "You reached today's 30 signal limit." : "오늘의 시그널 발신 30회를 모두 사용했습니다.");
    else showApiFailure(error);
  });
});
$("#receiveSpaceSignal").addEventListener("click", () => {
  if (state.spaceReceiving) return;
  state.spaceReceiving = true;
  clearSpaceDecode();
  $("#spaceRadar").classList.add("scanning");
  $("#spaceReceiveStatus").textContent = "레이더가 시그널을 추적하고 있습니다.";
  $("#receiveSpaceSignal").disabled = true;
  setTimeout(() => {
    if (!state.spaceReceiving) return;
    state.spaceReceiving = false;
    $("#spaceRadar").classList.remove("scanning");
    $("#receiveSpaceSignal").disabled = false;
    $("#spaceReceiveStatus").textContent = "레이더가 우주 시그널을 탐색하고 있습니다.";
  }, 10000);
  api(`/api/space/random?received=${encodeURIComponent([...state.receivedSpaceIds].join(","))}`).then(signal => {
    state.receivedSpaceIds.add(signal.id);
    localStorage.setItem("morse-received-space-ids", JSON.stringify([...state.receivedSpaceIds].slice(-1000)));
    state.spaceReceivedSignal = signal;
    state.spaceReceivedText = signal.text;
    state.spaceReceivedMorse = signal.type === "ascii" ? "" : signal.text;
    $("#spaceReceivedSignal").hidden = false;
    $("#spaceSignalDate").textContent = new Date(signal.createdAt).toLocaleString();
    $("#spaceReceiveStatus").textContent = "우주 시그널을 수신했습니다.";
    if (signal.type === "ascii") {
      clearSpaceDecode();
      $("#spaceReceivedSignal strong").innerHTML = `<pre data-no-i18n>${escapeHtml(signal.text)}</pre>`;
      $("#spaceDecodeStatus").textContent = state.language === "en" ? "ASCII art signal" : "ASCII 아트 시그널";
    } else {
      decodeSpaceSignal();
    }
    state.spaceReceiving = false;
    $("#spaceRadar").classList.remove("scanning");
    $("#receiveSpaceSignal").disabled = false;
  }).catch(error => {
    state.spaceReceiving = false;
    $("#spaceRadar").classList.remove("scanning");
    $("#receiveSpaceSignal").disabled = false;
    $("#spaceReceiveStatus").textContent = "레이더가 우주 시그널을 탐색하고 있습니다.";
    if (error.status === 404) showToast("수신할 우주 시그널이 아직 없습니다.");
    else showApiFailure(error);
  });
});
$("#redecodeSpaceSignal").addEventListener("click", decodeSpaceSignal);
$("#reportSpaceSignal").addEventListener("click", () => {
  const signal = state.spaceReceivedSignal;
  if (!signal) return;
  api("/api/space/report", {
    method: "POST",
    body: JSON.stringify({ signalId: signal.id, sender: signal.sender })
  }).then(() => showToast(state.language === "en" ? "Signal reported." : "우주 신호를 신고했습니다."))
    .catch(error => showApiFailure(error, state.language === "en" ? "Report failed." : "신고하지 못했습니다."));
});
$("#blockSpaceSender").addEventListener("click", () => {
  const signal = state.spaceReceivedSignal;
  if (!signal) return;
  api("/api/space/block", {
    method: "POST",
    body: JSON.stringify({ sender: signal.sender })
  }).then(() => {
    state.spaceReceivedSignal = null;
    $("#spaceReceivedSignal").hidden = true;
    showToast(state.language === "en" ? "Sender blocked." : "발신자를 차단했습니다.");
  }).catch(error => showApiFailure(error, state.language === "en" ? "Block failed." : "차단하지 못했습니다."));
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
$("#shopWorld").addEventListener("click", event => {
  const crown = event.target.closest("[data-collector-crown]");
  if (crown) {
    setCollectorCrown(crown.dataset.collectorCrown === "on").catch(error => showApiFailure(error));
    return;
  }
  const draw = event.target.closest("[data-shop-draw]");
  if (draw) {
    draw.disabled = true;
    api("/api/shop/draw", { method: "POST", body: JSON.stringify({ category: draw.dataset.shopDraw }) }).then(result => {
      state.shopInventory = result.inventory || [];
      state.shopEquipped = result.equipped || {};
      state.shopCoins = Number(result.coins || 0);
      state.shopLastDraw = { item: shopItem(result.item.id), duplicate: result.duplicate };
      if (result.account) applyAccountUpdate(result.account);
      renderShop();
    }).catch(error => {
      if (error.status === 409 && error.body?.error === "all-items-owned") {
        showToast(state.language === "en" ? "You already own every item in this category." : "이 종류의 아이템을 모두 가지고 있습니다.");
      } else if (error.status === 402) {
        showToast(state.language === "en" ? "You need 50 coins to draw." : "뽑기에는 재화 50개가 필요합니다.");
      } else showApiFailure(error);
      loadShop();
    }).finally(() => draw.disabled = false);
    return;
  }
  const inventoryCategory = event.target.closest("[data-shop-inventory-category]");
  if (inventoryCategory) {
    state.shopInventoryCategory = inventoryCategory.dataset.shopInventoryCategory;
    renderShop();
    return;
  }
  const categoryPreview = event.target.closest("[data-shop-preview]");
  if (categoryPreview && !event.target.closest("[data-shop-draw]")) {
    openShopPreview(categoryPreview.dataset.shopPreview);
    return;
  }
  const ownedPreview = event.target.closest("[data-owned-preview]");
  if (ownedPreview && !event.target.closest("[data-shop-equip], [data-shop-unequip]")) {
    openOwnedItemPreview(ownedPreview.dataset.ownedPreview);
    return;
  }
  const genericOwnedPreview = event.target.closest(".shop-inventory-item");
  if (genericOwnedPreview && !event.target.closest("[data-shop-equip], [data-shop-unequip]")) {
    const name = genericOwnedPreview.querySelector("strong")?.textContent;
    const item = SHOP_ITEMS.find(candidate => candidate.name === name);
    if (item) openOwnedItemPreview(item.id);
    return;
  }
  const unequip = event.target.closest("[data-shop-unequip]");
  if (unequip) {
    unequipShopSlot(unequip.dataset.shopUnequip).catch(error => showApiFailure(error));
    return;
  }
  const equip = event.target.closest("[data-shop-equip]");
  if (!equip) return;
  equipShopItem(equip.dataset.shopEquip).catch(error => showApiFailure(error));
});
$("#buyCoins100").addEventListener("click", () => {
  if (window.AndroidBilling?.purchaseCoins100) {
    window.AndroidBilling.purchaseCoins100();
  } else {
    showToast(state.language === "en" ? "Coin purchases are available in the Android app." : "재화 구매는 Android 앱에서 이용할 수 있습니다.");
  }
});
window.handleAndroidPurchase = async (productId, purchaseToken) => {
  try {
    const result = await api("/api/shop/google-play/verify", {
      method: "POST",
      body: JSON.stringify({ productId, purchaseToken })
    });
    state.shopCoins = Number(result.coins || 0);
    window.AndroidBilling?.consume?.(purchaseToken);
    renderShop();
    showToast(state.language === "en" ? "100 coins added." : "재화 100개가 지급되었습니다.");
  } catch (error) {
    if (error.body?.error === "purchase-already-used") {
      showToast(state.language === "en" ? "This purchase was already credited." : "이미 지급된 구매입니다.");
    } else {
      showToast(state.language === "en" ? "Could not verify the purchase." : "구매 확인에 실패했습니다.");
    }
  }
};
window.handleAndroidBillingError = message => {
  if (message === "cancelled") return;
  showToast(state.language === "en" ? `Purchase failed: ${message}` : `결제에 실패했습니다: ${message}`);
};
$("#closeShopPreview").addEventListener("click", () => $("#shopPreviewPanel").hidden = true);
$("#shopPreviewItems").addEventListener("click", event => {
  const sound = event.target.closest("[data-preview-sound]");
  if (sound) playMorse("TEST", null, "TEST", sound.dataset.previewSound);
  const preview = event.target.closest("[data-shop-preview-item]");
  if (!preview || !state.shopInventory.includes(preview.dataset.shopPreviewItem)) return;
  const item = shopItem(preview.dataset.shopPreviewItem);
  if (!item) return;
  const action = state.shopEquipped?.[item.slot] === item.id
    ? unequipShopSlot(item.slot)
    : equipShopItem(item.id);
  action.then(() => openOwnedItemPreview(item.id)).catch(error => showApiFailure(error));
});
$("#groupThemeChoices").addEventListener("click", event => {
  const button = event.target.closest("[data-group-theme]");
  if (!button || !state.activeGroup) return;
  api("/api/groups/theme", { method: "PATCH", body: JSON.stringify({ groupId: state.activeGroup.id, itemId: button.dataset.groupTheme }) }).then(({ group }) => {
    state.activeGroup = group;
    renderGroupMessages();
    renderGroupThemeChoices();
    loadGroups();
  }).catch(error => showApiFailure(error));
});
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
  const mode = button.dataset.keyerMode;
  state.chatKeyerMode = mode;
  state.quizKeyerMode = mode;
  state.writerKeyerMode = mode;
  localStorage.setItem("morse-chat-keyer-mode", mode);
  localStorage.removeItem("morse-quiz-keyer-mode");
  localStorage.removeItem("morse-writer-keyer-mode");
  clearKeyerTimers("quiz");
  clearKeyerTimers("writer");
  renderSettings();
  renderChatComposer();
  renderQuiz();
  renderWriter();
  document.querySelectorAll(".keyer-mode-button").forEach(item =>
    item.classList.toggle("active", item.dataset.keyerMode === mode)
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
renderGroups();
renderFriendRequests();
updateWorldUnreadBadges();
nextTrainingItem(false);
renderQuiz();
renderQuizRecords();
renderWriter();
renderSettings();
renderGame();
$("#morseReference").innerHTML = REFERENCE_ITEMS.map(letter => `
  <button type="button" data-reference-letter="${letter}"><strong>${letter}</strong><span>${prettyMorse(textToMorse(letter))}</span></button>
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
installBackNavigation();
initializeAuth();
window.addEventListener("hashchange", () => {
  const world = notificationWorldFromHash();
  if (world) switchWorld(world);
});

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
