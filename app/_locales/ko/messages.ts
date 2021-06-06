// tslint:disable max-line-length
module.exports = JSON.stringify(
  {
    extensionName: { message: `Forget about this site` },
    extensionDescription: {
      message: `현재 방문 중인 웹 사이트의 쿠키, 로컬 저장소, 방문 기록 및 다운로드 기록을 삭제하는 페이지 작업 버튼입니다.`,
    },
    successNotificationText: { message: `성공적으로 데이터를 삭제함` },
    successNotificationBody: {
      message: `$2 사이트에 대해 $1 항목을 삭제했습니다.`,
    },
    deleteItems: {
      message: `페이지 작업 버튼을 클릭하면,<br>현재 웹 사이트에 대해 다음 항목을 삭제합니다:`,
    },
    cookies: { message: `쿠키` },
    localStorage: { message: `로컬 저장소` },
    history: { message: `방문 기록` },
    downloads: { message: `다운로드 기록` },
    beforeDeleting: { message: `항목 삭제 전:` },
    askConfirmation: { message: `확인 요청` },
    confirmationPrompt: { message: `$1 를 제거 하시겠습니까?` },
    closeTab: { message: `탭 닫기` },
    closeTabHelp: {
      message: `삭제 후에 웹 사이트가 추가 항목을 쓰지 못하도록 함`,
    },
    closeSameDomainTabs: { message: `도메인이 동일한 모든 탭 닫기` },
    afterDeleting: { message: `항목 삭제 후:` },
    showConfirmation: { message: `확인 표시` },
    reloadWebsite: { message: `웹 사이트 새로 고침` },
    lastSaved: { message: `마지막으로 저장됨: $1` },
  },
  null,
  2
);
