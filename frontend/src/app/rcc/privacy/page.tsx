import type { Metadata } from "next";
import { siteConfig } from "@/lib/profile";
import styles from "../rcc.module.css";

const url = "https://portfolio.kangbeen.my/rcc/privacy";
const description = "Research Command Center의 Google 데이터 접근, 이용, 저장, 외부 처리 및 삭제에 관한 개인정보처리방침.";
export const metadata: Metadata = {
  title: { absolute: "개인정보처리방침 | Research Command Center" }, description,
  alternates: { canonical: url }, robots: { index: false, follow: false },
  openGraph: { title: "RCC 개인정보처리방침", description, url, siteName: "Research Command Center", type: "website", locale: "ko_KR" },
  twitter: { card: "summary", title: "RCC 개인정보처리방침", description },
};

export default function RccPrivacyPage() {
  return <article lang="ko" className={styles.document}>
    <header>
      <h1>개인정보처리방침</h1>
      <p className={styles.lead}>Research Command Center · Privacy policy</p>
      <p className={styles.date}>시행일 및 최종 업데이트: 2026년 11월 23일</p>
      <p>이 방침은 Kangbeen Ko(고강빈)가 운영하는 Research Command Center(RCC)에 적용됩니다. RCC는 사용자가 승인한 일정·업무·활동 상태를 연구실의 로컬 대시보드에 표시하는 도구입니다.</p>
    </header>
    <section aria-labelledby="data">
      <h2 id="data">접근하는 데이터와 사용 목적</h2>
      <ul>
        <li><strong>Google Calendar:</strong> 읽기 가능한 캘린더 목록, 선택한 개인·공유 일정의 제목, 시작·종료 시각, 종일·취소 여부, 변경 시각, 식별자 및 표시 색상을 사용합니다. 일정 표시와 변경 사항 반영을 위한 것이며, API 응답에서 처리한 일정 설명·참석자·첨부파일을 로컬 일정 데이터로 보관하지 않습니다.</li>
        <li><strong>Google Sheets의 업무 장부:</strong> 지정 장부에서 업무 제목, 상태, 프로젝트, 명시된 기한, 검토 시각, 완료 확인 진술과 짧은 준비 상황 요약을 읽습니다. 이 자료로 할 일·회신 대기·마감을 표시하고 완료 요청을 반영합니다. 메일 원문과 첨부파일을 장부로 전달하는 기능은 제공하지 않습니다.</li>
        <li><strong>Codex·Git 활동:</strong> 허용된 Windows 작업 기록을 로컬에서 읽고 프로젝트 별칭, 이벤트 종류·시각, 최소 상태 요약과 불투명 식별자로 변환합니다. 이 전송에는 원본 대화, 명령 인수와 원본 로그를 포함하지 않습니다.</li>
        <li><strong>인증·운영 정보:</strong> 승인된 기능을 유지하기 위한 OAuth 토큰, 권한 범위, 갱신 시각과 동기화 상태·고정 오류 코드·처리 개수를 사용합니다. 인증 정보나 업무 원문을 진단 출력에 포함하지 않도록 처리합니다.</li>
      </ul>
    </section>
    <section aria-labelledby="permissions">
      <h2 id="permissions">권한과 사용자의 선택</h2>
      <p>Calendar 읽기는 <code>calendar.events.readonly</code>와 <code>calendar.calendarlist.readonly</code>, 업무 장부 읽기는 <code>spreadsheets.readonly</code> 권한을 사용합니다. Sheets 권한 자체는 계정의 모든 스프레드시트를 읽을 수 있는 범위이며, RCC는 사용자가 설정한 장부만 요청합니다.</p>
      <p>별도로 승인한 <code>calendar.app.created</code> 권한은 RCC가 생성한 전용 캘린더에 명시적으로 요청된 일정을 추가할 때 사용합니다. 이때 제목·시각·중복 방지 표식을 Google에 전송합니다. 메일을 규칙으로 분석해 자동 등록하거나 기존 개인·공유 캘린더를 포괄적으로 편집·삭제하는 기능은 제공하지 않습니다.</p>
      <p>사용자는 연결할 계정과 표시할 캘린더를 선택하고, 민감 정보 숨김 또는 제목 표시를 설정할 수 있습니다. 제목·업무 요약을 표시하면 연구실 화면을 볼 수 있는 사람에게 해당 내용이 보일 수 있습니다.</p>
    </section>
    <section aria-labelledby="storage">
      <h2 id="storage">저장과 보안</h2>
      <p>Google 일정 및 Revi 업무 자료는 Mac의 암호화 파일에 저장합니다. OAuth 토큰과 암호화 키는 macOS Keychain에 보관합니다. Windows의 활동 기록 및 전송 큐는 해당 장치에 보관하며, 계정·장치의 접근 권한으로 보호합니다. Google API 통신에는 HTTPS를 사용합니다.</p>
      <p>개인 Google 자료와 토큰을 이 공개 웹사이트나 포트폴리오 챗봇으로 전송하지 않습니다. 로컬 보관과 암호화는 모든 보안 위험이 없음을 보장하지 않으므로 장치의 로그인·접근 권한도 유지해야 합니다.</p>
    </section>
    <section aria-labelledby="sharing">
      <h2 id="sharing">외부 서비스와 데이터 전달</h2>
      <ul>
        <li><strong>Google:</strong> Calendar API에서 일정 자료를 읽고 선택적 일정 추가를 처리합니다. Revi가 기록한 최소 업무 자료는 사용자의 비공개 Google Sheets 장부에도 보관됩니다.</li>
        <li><strong>Revi:</strong> 메일 문맥 판단은 별도 연결한 Revi 서비스에서 이루어집니다. 현재 RCC는 Gmail을 직접 수집하거나 메일 본문을 외부 LLM API에 전송하지 않습니다. Revi의 메일 접근·AI 처리·보존에는 해당 서비스와 연결 계정의 정책이 적용됩니다.</li>
        <li><strong>GitHub:</strong> 비공개 저장소는 코드 배포와 최소 Codex·Git 활동 상태 전송에 사용합니다. Google 일정, 업무 장부, 메일 원문·첨부파일, OAuth 토큰은 이 경로로 업로드하지 않습니다.</li>
        <li><strong>공개 안내 페이지:</strong> 소개와 이 방침은 Vercel에서 제공됩니다. 페이지 요청을 처리하는 과정에서 IP 주소, 브라우저 정보, 요청 URL 등의 접속 정보가 호스팅 제공자에게 전달될 수 있습니다. 이 두 페이지에는 자체 계정 로그인, 광고 추적 또는 챗봇 입력 기능을 두지 않습니다.</li>
      </ul>
      <p>RCC는 Google 사용자 데이터를 판매하거나 광고 타기팅·범용 AI 모델 학습에 사용하지 않습니다. Google 데이터의 이용 및 다른 앱으로의 전달은 <a href="https://developers.google.com/terms/api-services-user-data-policy">Google API Services User Data Policy</a>와 그 Limited Use 요구사항에 따라 대시보드 기능 제공 목적으로 제한합니다.</p>
    </section>
    <section aria-labelledby="retention">
      <h2 id="retention">보관 기간</h2>
      <p>일정은 수집 대상 기간의 스냅샷을 갱신하며, 연결 장애 중에는 마지막 정상 자료를 유지합니다. 업무·완료 이력과 설정은 사용자가 삭제하기 전까지 로컬에 남을 수 있습니다. 이전 버전의 메일 규칙 결과도 암호화된 로컬 보관 자료로 남을 수 있으나 현재 화면 표시와 직접 메일 수집에는 사용하지 않습니다.</p>
      <p>장부의 Google 저장본, GitHub의 최소 활동 이력, 장치 백업은 각각 별도로 보존될 수 있습니다. 저장 한도는 자동 삭제 기한이 아니며 일률적인 자동 삭제 기간을 약속하지 않습니다. 공개 페이지의 접속 기록은 호스팅 제공자의 보관 설정과 정책을 따릅니다.</p>
    </section>
    <section aria-labelledby="deletion">
      <h2 id="deletion">연결 해제와 삭제</h2>
      <p><a href="https://myaccount.google.com/connections">Google 계정의 연결 관리</a>에서 RCC의 접근 권한을 철회할 수 있습니다. 철회하면 새 수집과 토큰 갱신이 중단되지만, 이미 저장된 로컬 자료가 자동 삭제되지는 않습니다.</p>
      <p>Mac의 RCC 관리 명령으로 연결 해제 및 현재 로컬 Google·Revi 자료와 토큰을 삭제할 수 있습니다. <code>setup_google.sh disconnect-all</code>은 관련 Google 승인 철회도 시도하며, <code>setup_google.sh forget-local</code>은 원격 철회 없이 로컬 자료만 정리합니다. 삭제는 운영자의 명시적 선택으로 수행합니다.</p>
      <p>이 명령은 Google Calendar의 원격 일정, Google Sheets의 장부, GitHub의 이력 또는 OS 백업까지 삭제하지 않습니다. 필요한 경우 해당 서비스나 백업에서 소유자가 별도로 관리해야 합니다. 삭제 지원은 아래 연락처로 요청할 수 있으며 인증 토큰·비밀번호·메일 원문을 보내지 마세요.</p>
    </section>
    <section aria-labelledby="changes">
      <h2 id="changes">변경과 문의</h2>
      <p>데이터 처리 방식이 바뀌면 이 페이지의 시행일과 내용을 갱신합니다. 새로운 목적의 Google 데이터 이용이나 추가 권한이 필요하면 이용 전에 안내하고 필요한 동의를 받습니다.</p>
      <p>운영자 및 개인정보 문의: Kangbeen Ko(고강빈)<br /><a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a></p>
    </section>
    <footer><p><a href="/rcc">Research Command Center 소개</a></p></footer>
  </article>;
}
