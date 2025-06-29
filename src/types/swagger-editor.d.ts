type SwaggerEditorBundlePrameter = {
  dom_id: string; // 필수: Swagger UI를 렌더링할 DOM 요소의 ID
  layout?: "BaseLayout" | "StandaloneLayout"; // 사용할 레이아웃 컴포넌트, 기본값 'StandaloneLayout'
  deepLinking?: boolean; // 태그/연산에 딥 링크 활성화
  docExpansion?: "list" | "full" | "none"; // 태그/연산 확장 기본 설정
  filter?: boolean | string; // 태그 기반 연산 필터링
  showCommonExtensions?: boolean; // 매개변수 확장 필드 표시
  spec?: object; // 직접 전달할 OpenAPI 스펙 객체
  url?: string; // 불러올 OpenAPI 스펙 URL
  urls?: {
    url: string;
    name: string;
  }[];
  "urls.primaryName"?: string;
  syntaxHighlight?: {
    activated?: boolean;
    theme?: string;
  };
  requestInterceptor?: (req: object) => object; // 요청 인터셉터 함수
  responseInterceptor?: (res: object) => object; // 응답 인터셉터 함수
  supportedSubmitMethods?: string[]; // "Try it out" 지원 HTTP 메소드 목록
  withCredentials?: boolean; // CORS 요청 시 credentials 전송
  persistAuthorization?: boolean; // 인증 정보 유지
  presets?: array; // 필수 프리셋 배열 (예: [SwaggerEditorStandalonePreset])
  plugins?: array; // 커스텀 플러그인 배열
  queryConfigEnabled?: boolean; // URL 쿼리 파라미터로 설정 덮어쓰기 허용
};

declare module "swagger-editor-dist/swagger-editor-bundle" {
  const SwaggerEditorBundle: (opt: SwaggerEditorBundlePrameter) => object;
  export default SwaggerEditorBundle;
}

declare module "swagger-editor-dist/swagger-editor-standalone-preset" {
  const SwaggerEditorStandalonePreset: object;
  export default SwaggerEditorStandalonePreset;
}

// declare module
