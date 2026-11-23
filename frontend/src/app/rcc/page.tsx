import type { Metadata } from "next";
import { siteConfig } from "@/lib/profile";
import styles from "./rcc.module.css";

const url = "https://portfolio.kangbeen.my/rcc";
const description = "Research Command Center: 개인과 연구실의 일정, 후속 업무, 연구 활동을 한 화면에서 확인하는 로컬 대시보드.";
export const metadata: Metadata = {
  title: { absolute: "Research Command Center" }, description,
  alternates: { canonical: url }, robots: { index: false, follow: false },
  openGraph: { title: "Research Command Center", description, url, siteName: "Research Command Center", type: "website", locale: "ko_KR" },
  twitter: { card: "summary", title: "Research Command Center", description },
};

export default function RccPage() {
  return <article lang="ko" className={styles.document}>
    <header>
      <h1>Research Command Center</h1>
      <p className={styles.lead}>오늘의 일정과 처리할 일을, 연구실의 한 화면에.</p>
      <p>Research Command Center(RCC)는 Kangbeen Ko(고강빈)가 운영하는 개인·연구실용 생산성 대시보드입니다. 사용자가 연결한 Google Calendar 일정, Revi가 정리한 후속 업무, Windows의 연구 활동 상태를 Mac의 상시 화면에서 확인합니다.</p>
    </header>
    <section aria-labelledby="features">
      <h2 id="features">어떤 일을 돕나요?</h2>
      <ul>
        <li>선택한 개인·공유 캘린더의 일정과 연구 마감까지 남은 시간을 표시합니다.</li>
        <li>Revi가 정리한 할 일, 회신 대기, 명시된 기한과 준비 상황을 TO-DO Tracker에 반영합니다. 사용자가 완료했다고 확인한 항목을 완료로 처리합니다.</li>
        <li>Windows의 Codex·Git 활동을 최소 상태 정보로 전달합니다. 작업 시작·턴 종료 관측을 실제 업무 완료와 구분합니다.</li>
        <li>인증 후 백그라운드에서 동기화하며, 연결 장애 중에는 마지막 정상 자료를 유지합니다.</li>
      </ul>
    </section>
    <section aria-labelledby="google-access">
      <h2 id="google-access">Google 연결을 사용하는 이유</h2>
      <p><strong>Google Calendar:</strong> 접근 가능한 캘린더 목록과 선택된 일정의 제목·시각·변경 상태를 읽어 대시보드에 표시합니다. 읽기 권한을 기본으로 사용합니다.</p>
      <p><strong>Google Sheets:</strong> 사용자가 지정한 비공개 업무 장부에서 Revi의 판단 결과를 읽습니다. OAuth의 Sheets 읽기 권한은 계정의 스프레드시트에 적용되지만, RCC 구현은 설정된 장부만 요청하며 시트를 수정하지 않습니다.</p>
      <p><strong>선택적 일정 추가:</strong> 별도 동의한 경우에만 RCC가 만든 전용 캘린더에 사용자가 명시적으로 요청한 일정을 추가합니다.</p>
      <p>현재 RCC는 Gmail을 직접 수집하지 않습니다. 메일 문맥 판단은 사용자가 별도로 연결한 Revi가 담당하며 해당 서비스의 개인정보 처리 조건이 적용됩니다.</p>
    </section>
    <section aria-labelledby="local-operation">
      <h2 id="local-operation">개인 데이터는 공개 페이지와 분리됩니다</h2>
      <p>실제 대시보드는 사용자의 Mac에서 실행됩니다. 이 페이지는 서비스 소개이며, 로그인하거나 Google 계정 데이터를 조회하는 화면이 아닙니다. Google·Revi 자료는 Mac의 암호화 저장소에, 인증 토큰과 암호화 키는 macOS Keychain에 저장합니다.</p>
      <p>Google 일정·메일 원문·업무 장부·인증 정보는 코드 배포나 활동 상태 동기화용 GitHub 저장소에 업로드하지 않습니다. 자세한 처리 범위와 삭제 방법은 개인정보처리방침에서 확인할 수 있습니다.</p>
    </section>
    <section aria-labelledby="contact">
      <h2 id="contact">운영 및 문의</h2>
      <p>운영자: Kangbeen Ko(고강빈)<br />연락처: <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a></p>
      <p>본 서비스는 개인 운영 도구이며 Google 또는 소속 기관이 제공하는 공식 서비스가 아닙니다.</p>
      <p className={styles.links}><a href="/rcc/privacy">개인정보처리방침 · Privacy policy</a></p>
    </section>
    <footer><p className={styles.date}>최종 업데이트: 2026년 11월 23일</p></footer>
  </article>;
}
