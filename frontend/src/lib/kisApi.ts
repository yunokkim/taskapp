// 한국투자증권 KIS API 연동

interface KISConfig {
  appKey: string;
  secretKey: string;
  baseUrl: string;
}

interface KISTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

interface KISStockPrice {
  output: {
    iscd_stat_cls_code: string;  // 종목 상태 구분 코드
    marg_rate: string;           // 증거금 비율
    rprs_mrkt_kor_name: string;  // 대표 시장 한글명
    new_mkop_cls_code: string;   // 신 시장 개장 구분 코드
    bstp_kor_isnm: string;       // 업종 한글명
    temp_stop_yn: string;        // 임시 정지 여부
    oprc_rang_cont_yn: string;   // 가격 범위 연장 여부
    sus_yn: string;              // 거래정지 여부
    stck_prpr: string;          // 주식 현재가
    stck_oprc: string;          // 주식 시가
    stck_hgpr: string;          // 주식 최고가
    stck_lwpr: string;          // 주식 최저가
    stck_mxpr: string;          // 주식 상한가
    stck_llam: string;          // 주식 하한가
    stck_sdpr: string;          // 주식 기준가
    wghn_avrg_stck_prc: string; // 가중 평균 주식 가격
    hts_frgn_ehrt: string;      // HTS 외국인 소진율
    frgn_ntby_qty: string;      // 외국인 순매수 수량
    pgtr_ntby_qty: string;      // 프로그램매매 순매수 수량
    pvt_scnd_dmrs_prc: string;  // 피벗 2차 디저항 가격
    pvt_frst_dmrs_prc: string;  // 피벗 1차 디저항 가격
    pvt_pont_val: string;       // 피벗 포인트 값
    pvt_frst_dmsp_prc: string;  // 피벗 1차 디지지 가격
    pvt_scnd_dmsp_prc: string;  // 피벗 2차 디지지 가격
    dmrs_val: string;           // 디저항 값
    dmsp_val: string;           // 디지지 값
    cpfn: string;               // 자본금
    rstc_wdth_prc: string;      // 제한폭 가격
    stck_fcam: string;          // 주식 액면가
    stck_sspr: string;          // 주식 대용가
    aspr_unit: string;          // 호가단위
    hts_deal_qty_unit_val: string; // HTS 매매 수량 단위 값
    lst_stck_vl: string;        // 상장 주식 수
    hts_avls: string;           // HTS 시가총액
    per: string;                // PER
    pbr: string;                // PBR
    stac_month: string;         // 결산 월
    vol_tnrt: string;           // 거래량 회전율
    eps: string;                // EPS
    bps: string;                // BPS
    d250_hgpr: string;          // 250일 최고가
    d250_hgpr_date: string;     // 250일 최고가 일자
    d250_hgpr_vrss_prpr_rate: string; // 250일 최고가 대비 현재가 비율
    d250_lwpr: string;          // 250일 최저가
    d250_lwpr_date: string;     // 250일 최저가 일자
    d250_lwpr_vrss_prpr_ctrt: string; // 250일 최저가 대비 현재가 대비
    stck_dryy_hgpr: string;     // 주식 연중 최고가
    dryy_hgpr_vrss_prpr_rate: string; // 연중 최고가 대비 현재가 비율
    dryy_hgpr_date: string;     // 연중 최고가 일자
    stck_dryy_lwpr: string;     // 주식 연중 최저가
    dryy_lwpr_vrss_prpr_ctrt: string; // 연중 최저가 대비 현재가 대비
    dryy_lwpr_date: string;     // 연중 최저가 일자
    w52_hgpr: string;           // 52주 최고가
    w52_hgpr_vrss_prpr_ctrt: string; // 52주 최고가 대비 현재가 대비
    w52_hgpr_date: string;      // 52주 최고가 일자
    w52_lwpr: string;           // 52주 최저가
    w52_lwpr_vrss_prpr_ctrt: string; // 52주 최저가 대비 현재가 대비
    w52_lwpr_date: string;      // 52주 최저가 일자
    whol_loan_rmnd_rate: string; // 전체 융자 잔고 비율
    ssts_yn: string;            // 공매도과열종목여부
    stck_shrn_iscd: string;     // 주식 단축 종목코드
    fcam_cnnm: string;          // 액면가 통화명
    cpfn_cnnm: string;          // 자본금 통화명
    frgn_hldn_qty: string;      // 외국인 보유 수량
    vi_cls_code: string;        // VI적용구분코드
    ovtm_vi_cls_code: string;   // 시간외단일가VI적용구분코드
    last_ssts_cntg_qty: string; // 최종 공매도 체결 수량
    invt_caful_yn: string;      // 투자유의여부
    mrkt_warn_cls_code: string; // 시장경고구분코드
    short_over_yn: string;      // 단기과열여부
  };
}

export class KISApi {
  private config: KISConfig;
  private accessToken: string | null = null;
  private tokenExpiry: Date | null = null;

  constructor(config: KISConfig) {
    this.config = config;
  }

  // 접근 토큰 발급
  private async getAccessToken(): Promise<string> {
    if (this.accessToken && this.tokenExpiry && new Date() < this.tokenExpiry) {
      return this.accessToken;
    }

    const response = await fetch(`${this.config.baseUrl}/oauth2/tokenP`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        grant_type: 'client_credentials',
        appkey: this.config.appKey,
        appsecret: this.config.secretKey,
      }),
    });

    const data: KISTokenResponse = await response.json();
    
    this.accessToken = data.access_token;
    this.tokenExpiry = new Date(Date.now() + (data.expires_in * 1000));
    
    return this.accessToken;
  }

  // 주식 현재가 조회
  async getStockPrice(stockCode: string): Promise<KISStockPrice> {
    const token = await this.getAccessToken();

    const response = await fetch(
      `${this.config.baseUrl}/uapi/domestic-stock/v1/quotations/inquire-price?fid_cond_mrkt_div_code=J&fid_input_iscd=${stockCode}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'authorization': `Bearer ${token}`,
          'appkey': this.config.appKey,
          'appsecret': this.config.secretKey,
          'tr_id': 'FHKST01010100',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`KIS API Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  }

  // 여러 종목 현재가 조회
  async getMultipleStockPrices(stockCodes: string[]): Promise<{ [key: string]: KISStockPrice }> {
    const promises = stockCodes.map(code => this.getStockPrice(code));
    const results = await Promise.allSettled(promises);
    
    const priceData: { [key: string]: KISStockPrice } = {};
    
    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        priceData[stockCodes[index]] = result.value;
      } else {
        console.error(`Failed to fetch price for ${stockCodes[index]}:`, result.reason);
      }
    });

    return priceData;
  }
}

// KIS API 설정
export const kisApiConfig: KISConfig = {
  appKey: process.env.NEXT_PUBLIC_KIS_APP_KEY || '',
  secretKey: process.env.NEXT_PUBLIC_KIS_SECRET_KEY || '',
  baseUrl: process.env.NEXT_PUBLIC_KIS_BASE_URL || 'https://openapi.koreainvestment.com:9443',
};

// KIS API 인스턴스
export const kisApi = new KISApi(kisApiConfig);

// StockData 타입으로 변환하는 유틸리티 함수
export function convertKISDataToStockData(stockCode: string, stockName: string, kisData: KISStockPrice): import('@/types/stock').StockData {
  const output = kisData.output;
  const currentPrice = parseInt(output.stck_prpr);
  const prevPrice = parseInt(output.stck_sdpr);
  const change = currentPrice - prevPrice;
  const changePercent = (change / prevPrice) * 100;

  return {
    symbol: stockCode,
    name: stockName,
    currentPrice,
    change,
    changePercent,
    volume: 0, // KIS API에서 실시간 거래량은 별도 조회 필요
    high52w: parseInt(output.w52_hgpr),
    low52w: parseInt(output.w52_lwpr),
    lastUpdate: new Date().toISOString(),
  };
}