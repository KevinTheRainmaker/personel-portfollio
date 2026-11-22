# Publication 표시와 최신순 정렬 (2026-11-18)

- [x] Featured 우선, 그룹별 최신순 정렬과 일반 논문 미디어 숨김 구현
- [x] 날짜가 있는 다른 목록도 최신순 정렬하고 기존 데이터 보존
- [x] 회귀 테스트·빌드·실제 렌더링 검증 후 배포 확인

계획 검토: 현재 원격 main c353e28을 기준으로 작업한다. 정렬은 공통 profile 표시 계층에서 수행하고 원본 프로필 데이터와 미디어 파일은 보존한다. 기간은 종료일 기준, 현재 활동은 우선, 날짜 미지정은 해당 그룹 아래에 둔다. 날짜가 없는 스킬 목록은 기존 순서를 보존한다.

검토: Publication 테스트 7개, 챗봇 회귀 11개와 Next 프로덕션 빌드 성공. 보안 검토에서 조치 필요 사항 없음. 실제 브라우저 1440×1000/390×844에서 7개 논문 유지, Featured 4개 우선, 일반 논문 3개 미디어 0개와 빈 열 없음, 가로 넘침 없음 확인. 최초 테스트의 모듈 mock 선언을 수정한 뒤 재통과했다. 운영 배포는 후속 확인한다.

배포 검증: 96c4048 Vercel 상태 success 확인. https://portfolio.kangbeen.my/papers 실서비스 재접속 후 Featured 4개가 먼저, 일반 3개가 뒤에 표시되고 일반 논문 미디어 0개, 390px 가로 넘침 없음 확인. 날짜 미지정 논문은 해당 Featured 그룹의 마지막에 표시한다.

## MagToTheFuture 발표 월 정정

- [x] 사용자 확인에 따라 원본 데이터와 CV 문서의 날짜를 October 2026으로 수정
- [x] 기존 테스트 및 Featured 최상단 정렬 확인 후 운영 배포 검증

검토: 기존 Publication 7개·챗봇 11개 테스트 PASS. 895514c의 Vercel 배포 success 및 운영 /papers에서 첫 논문 MagToTheFuture, October 2026, Featured 표시를 직접 확인했다.

## Research·CV PC 여백 재구성 (2026-11-18)

- [x] Publications와 같은 최대 폭 1440px 및 반응형 바깥 여백 적용
- [x] Research의 상위 연구 관심과 두 세부 관심, 소속·배경의 의미 있는 열 구성
- [x] CV 주요 이력/보조 정보 2열 및 모바일 단일 열 구성
- [x] 기존 내용·정렬·앵커 보존, PC/모바일 실제 화면·테스트·빌드 검증 및 운영 배포

설계: 기존 배경 #f8f7f5, 표면 #ffffff, 제목 #111111, 본문 #5a5a5a, 강조 #6366f1, 경계 #e5e3df 및 현재 sans/mono 글꼴을 유지한다. 최대 폭 1440px, PC 내부 여백 32–48px, 내용 간격 24–48px. 제목·문단 왼쪽 정렬, 본문은 16px 이상과 65–80ch 이내를 목표로 한다.

Research: [제목 | 연구 관점] → [Human–AI Interaction: 제목/태그 | 설명] → [Human Augmentation | Human Agency] → [Current Position | Background]. 세 관심 분야를 무조건 같은 카드 세 개로 나열하기보다 포괄 주제와 세부 주제의 흐름에 맞춰 배치한다.
CV: [헤더] → [Education/Experience/Projects | Skills/Awards/Other]. 모바일·인쇄는 단일 열. 원문, 기간, 링크, 정렬 기준을 바꾸지 않는다.
계획 검토: 원래의 좁은 max-w-3xl에 폭만 늘리면 줄 길이가 과해지므로, PC 공간은 본문 확대가 아닌 열 구성에 사용한다. 공통 사이드바와 챗봇 동작은 유지한다.

검토: 기존 테스트 18개 및 프로덕션 빌드/타입 검사 PASS. 보안 검토 차단 사항 없음. 1920/1440/1280/1024/390px 두 페이지 총10조건에서 가로 넘침·텍스트 박스 잘림 없음. 운영 CV와 로컬 CV의 여섯 섹션 텍스트가 동일함을 DOM 비교로 확인했다. 1440px 기준 내용 폭 768→1054px, Research 높이 1981→1423px, CV 5241→3845px로 줄었다. PC 상단/하단 스크린샷 시각 검토 완료. 운영 배포는 후속 확인한다.

배포: 3889406의 Vercel success 확인. 실제 /research와 /cv에서 1440px 내용 폭1054px 및 PC 다중 열, 가로 넘침 없음 확인. Research 연구분야/배경/링크도 운영 이전본과 새 로컬 DOM 비교에서 동일했다.

## 정식 학술 CV와 출판 실적 (2026-11-18)

- [x] CV를 단일 열 문서로 구성하고 이름·소속·연락처 및 표준 이력 섹션 정리
- [x] 명시적 출판 상태를 데이터에 기록하고 CV에는 published만 최신순 서지 목록으로 표시
- [x] 인쇄 시 챗봇/탐색 UI 제외, 문서 전체 흐름 유지
- [x] 미출판 배제·기존 내용·반응형·인쇄 검증 및 배포

계획 검토: CV는 Featured 여부와 무관하게 출판된 논문의 시간순 기록을 제공한다. 원본 미출판 논문은 삭제하지 않는다. 기존 데이터상 Under Review 1건과 출판 기록 6건을 명시적 상태로 구분한다. Unknown/accepted/preprint를 published로 추정하지 않는다. 사용자 확정: CV와 Papers 모두 published만 표시한다. 홈 논문 목록도 같은 표시 대상을 사용한다. Education의 Autonomous Computing System Lab 및 Biomedical Informatics & Intelligence Lab 인턴 기록을 원본과 CV 문서에서 제거한다. Research는 이번 변경 범위가 아니다.

검토: Publication/CV 10개와 챗봇 11개 테스트 PASS, 프로덕션 빌드/타입 검사 PASS. 실제 브라우저 1920/1440/1280/390px × CV/Papers에서 출판 논문 6편만 표시, 미출판 및 삭제한 Education 없음, 가로 넘침/잘림 없음 확인. CV 일곱 섹션은 모두 동일한 좌측 좌표로 단일 열. 인쇄 모드에서는 비문서 UI 숨김, body/main overflow visible, 마지막 섹션 존재 및 전체 높이 수용 확인. PC 스크린샷 시각 확인과 보안 검토 차단 사항 없음. 운영 반영은 후속 확인한다.

운영 인수: 2471647 Vercel success. 실제 /cv에서 cv-document 단일 열(7개 섹션 같은 x좌표), Education 2개, 출판 논문6개, 삭제한 인턴2건 및 심사중 원고 미표시 확인. /papers도 출판6개·심사중 원고 미표시 확인. 두 화면 가로 넘침 없음.

## 활동 기간 정정 (2026-11-18)

- [x] Technical Book Reviewer & Beta Reader를 2022 – 2026으로 수정
- [x] Peach Seoga를 2024–2026으로 수정
- [x] 원본/CV 문서 일치, 기존 회귀 테스트 및 운영 반영 확인

검토: 원본 JSON과 CV 마크다운 세 파일에서 기간 일치 확인. 기존 테스트21개 PASS. 0f1fa6a Vercel success 및 운영 CV에서 Book Reviewer 2022 – 2026, Peach Seoga 2024–2026 표시 확인.

## AffectUI 컴포넌트 적용 (2026-11-22)
- [x] 공식 registry 소스·MIT 제공 여부·의존성 확인 및 설치
- [x] Home/Research/Papers 카드·배지와 실제 Sidebar/모바일 채팅·미디어 조작부에 적용
- [x] 기존 내용/논문 정렬/CV 문서/챗봇 계약 유지 및 PC·모바일·키보드·reduced-motion 검증
- [x] 빌드·회귀·보안 검토 후 커밋/Push 및 운영 배포 확인

설계 검토: 기존 학술 포트폴리오의 targeted evolution. VARIANCE 5 / MOTION 3 / DENSITY 4. 배경 #f8f7f5, 표면 #fff, 강조 #6366f1, 현재 sans/mono, 12px 카드/8px 입력의 기존 인상을 유지한다. 페이지 경로/메타데이터/프로필 내용/featured 우선 및 최신순/출판된 논문만/CV 단일 문서/미디어 재생 선호는 불변이다. 실제 기능에 맞는 공식 Button, IconButton, Badge, Card, TextField를 사용한다. Reaction Bar는 반응 저장 기능이 없는 포트폴리오에 가짜 좋아요/댓글을 만들지 않도록 사용하지 않는다. 내비게이션은 링크이며 탭패널로 바꾸지 않는다. 추가 서버·유료 컴포넌트는 필요 없다.

검증: 공식 UI 설치 뒤 Publications 10/10, Chat 11/11, TypeScript 및 Next 프로덕션 빌드 PASS. 프로덕션 브라우저 19결과 PASS: 1920/1440/768/390px의 4개 페이지 가로 넘침 없음, featured/최신순/미디어 정책, CV 비카드 문서, 키보드 Summary, 데스크톱·모바일 채팅(IMЕ Enter/중복 차단/대화 유지/reset/internal link), reduced-motion 재생·정지. 브라우저 console/page 오류 없음. 실제 LLM 대신 모의 응답만 사용했다. 독립 보안 검토 차단급 없음. 기존 Browserslist 데이터 노후 안내는 빌드를 막지 않는다.

원격 a23aba1의 featured 카드 왼쪽 강조선 제거를 보존한다.

운영 검증: fe7f90e Vercel success. 실제 portfolio.kangbeen.my의 Home/Research/Papers/CV와 모바일 chat open/close/Send 표시 확인. 원격 a23aba1 강조선 제거 유지. RCC 변경 없음.

## 챗봇 공개 웹사이트 컨텍스트 제한 (2026-11-22)
- [x] 페이지와 동일한 published selector + 공개 필드 projection을 컨텍스트·허용 링크에 적용
- [x] 공개 컨텍스트 revision으로 이전 대화의 미표시 정보 재유입 방지
- [x] 제외 논문/초록/미표시 필드·링크/대화 버전·기존 화면 회귀 테스트
- [ ] 빌드·보안 검토·운영 배포 및 실제 응답 확인

계획: 원본 JSON은 보존한다. 공개 Publications/CV와 같은 published 조건을 공유하고, 페이지가 렌더하는 텍스트 필드만 명시적으로 선택한다. 새 필드/섹션을 자동 직렬화하지 않는다. Research의 기존 공개 연구 소개는 유지하되 공개 논문 목록과 구분한다. 컨텍스트 변경 전 대화는 근거로 전달하지 않는다. 사이트 내용/논문 목록/레이아웃은 변경하지 않는다.

검토: chat 20/Papers·CV 10 PASS, build/typecheck PASS. 브라우저 저장·버전전환 및 기존 19개 화면/입력 검증 PASS. 보안 검토의 열린 탭 revision 문제 수정·검증 완료. 운영 배포 확인 대기.
