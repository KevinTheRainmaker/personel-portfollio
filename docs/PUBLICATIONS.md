# 출판 실적과 CV 관리

논문 원본은 `data/profile-data.json`의 `publications`이다. `status`를 명시적으로 관리한다.

- `published`: 출판된 논문. CV, Papers 및 홈 논문 목록에 표시한다.
- `under_review`, `accepted`, `preprint` 또는 상태 누락: 출판 목록에 표시하지 않는다. 날짜나 링크만으로 출판 여부를 추정하지 않는다.

CV는 Featured 여부와 관계없이 출판 시점 최신순의 서지 목록이다. Papers와 홈은 출판 논문 중 Featured 그룹을 먼저 표시하고 각 그룹 안에서 최신순으로 정렬한다. 미출판 원본은 삭제되지 않으며 챗봇 근거 데이터에는 상태와 함께 남는다. 이 표시 정책은 비공개 처리 기능이 아니다.

출판 확정 시 원본의 `status`, `time`, `journal`, `link`를 실제 출판 정보에 맞춰 갱신한다. 날짜는 월을 알고 있다면 `October 2026`처럼 월까지 기록한다. `npm run sync-data`와 배포 전 prebuild가 프런트엔드 데이터를 동기화한다.

Education에는 현재 사용자 지정 학력 두 건만 유지한다. 삭제 요청된 Autonomous Computing System Lab 및 Biomedical Informatics & Intelligence Lab 인턴 기록은 Education 원본과 CV 마크다운에서 제거했다.

CV는 단일 열 문서이며 인쇄 시 사이드바·탐색·챗봇을 숨기고 전체 문서가 흐르도록 한다.
