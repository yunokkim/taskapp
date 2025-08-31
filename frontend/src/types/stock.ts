// 주식 관련 타입 정의

export interface StockData {
  symbol: string;        // 종목 코드 (예: "005930")
  name: string;         // 종목명 (예: "삼성전자")
  currentPrice: number; // 현재가
  change: number;       // 전일 대비 변동
  changePercent: number; // 변동률 (%)
  volume: number;       // 거래량
  marketCap?: number;   // 시가총액 (옵션)
  high52w?: number;     // 52주 최고가 (옵션)
  low52w?: number;      // 52주 최저가 (옵션)
  lastUpdate: string;   // 마지막 업데이트 시간
}

export interface MarketIndex {
  name: string;         // 지수명 (예: "코스피", "코스닥")
  value: number;        // 지수값
  change: number;       // 전일 대비 변동
  changePercent: number; // 변동률 (%)
  lastUpdate: string;   // 마지막 업데이트 시간
}

export interface StockQuote {
  stocks: StockData[];
  indices: MarketIndex[];
  lastUpdate: string;
}

// 주요 한국 주식 종목 목록
export const MAJOR_KOREAN_STOCKS = [
  { symbol: '005930', name: '삼성전자' },
  { symbol: '000660', name: 'SK하이닉스' },
  { symbol: '035420', name: 'NAVER' },
  { symbol: '005380', name: '현대차' },
  { symbol: '006400', name: '삼성SDI' },
  { symbol: '051910', name: 'LG화학' },
  { symbol: '035720', name: '카카오' },
  { symbol: '207940', name: '삼성바이오로직스' },
  { symbol: '068270', name: '셀트리온' },
  { symbol: '096770', name: 'SK이노베이션' },
] as const;

// 한국 주요 지수
export const KOREAN_MARKET_INDICES = [
  { name: '코스피', symbol: 'KOSPI' },
  { name: '코스닥', symbol: 'KOSDAQ' },
  { name: 'KRX 100', symbol: 'KRX100' },
] as const;