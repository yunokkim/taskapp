import { NextRequest, NextResponse } from 'next/server';
import { kisApi, convertKISDataToStockData } from '@/lib/kisApi';
import { MAJOR_KOREAN_STOCKS } from '@/types/stock';

// GET /api/stock - 주식 데이터 조회
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const symbols = searchParams.get('symbols')?.split(',') || 
                   MAJOR_KOREAN_STOCKS.slice(0, 4).map(stock => stock.symbol); // 기본적으로 상위 4개 종목

    // KIS API 키가 설정되어 있는지 확인
    const hasKisKeys = process.env.NEXT_PUBLIC_KIS_APP_KEY && 
                       process.env.NEXT_PUBLIC_KIS_SECRET_KEY &&
                       process.env.NEXT_PUBLIC_KIS_APP_KEY !== 'YOUR_KIS_APP_KEY_HERE';

    if (!hasKisKeys) {
      // API 키가 없으면 모의 데이터 반환
      const mockData = generateMockStockData(symbols);
      return NextResponse.json({
        stocks: mockData,
        indices: generateMockIndices(),
        source: 'mock',
        message: 'KIS API 키가 설정되지 않았습니다. 모의 데이터를 사용합니다.'
      }, {
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        }
      });
    }

    try {
      // 실제 KIS API 호출
      const stockPrices = await kisApi.getMultipleStockPrices(symbols);
      
      const stocks = symbols.map(symbol => {
        const stockInfo = MAJOR_KOREAN_STOCKS.find(s => s.symbol === symbol);
        const stockName = stockInfo?.name || symbol;
        
        if (stockPrices[symbol]) {
          return convertKISDataToStockData(symbol, stockName, stockPrices[symbol]);
        } else {
          // API 호출 실패 시 기본 데이터
          return {
            symbol,
            name: stockName,
            currentPrice: 0,
            change: 0,
            changePercent: 0,
            volume: 0,
            lastUpdate: new Date().toISOString()
          };
        }
      });

      return NextResponse.json({
        stocks,
        indices: generateMockIndices(), // 지수는 별도 API 필요
        source: 'kis_api',
        lastUpdate: new Date().toISOString()
      }, {
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        }
      });
    } catch (apiError) {
      console.error('KIS API Error:', apiError);
      
      // API 에러 시 모의 데이터 반환
      const mockData = generateMockStockData(symbols);
      return NextResponse.json({
        stocks: mockData,
        indices: generateMockIndices(),
        source: 'mock_fallback',
        error: 'KIS API 호출 실패',
        message: 'API 호출에 실패하여 모의 데이터를 사용합니다.'
      }, {
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        }
      });
    }
  } catch (error: any) {
    console.error('Stock API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch stock data' },
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        }
      }
    );
  }
}

// 모의 주식 데이터 생성
function generateMockStockData(symbols: string[]) {
  const baseData = [
    { symbol: '005930', name: '삼성전자', basePrice: 71500 },
    { symbol: '000660', name: 'SK하이닉스', basePrice: 128000 },
    { symbol: '035420', name: 'NAVER', basePrice: 185500 },
    { symbol: '035720', name: '카카오', basePrice: 45200 },
    { symbol: '005380', name: '현대차', basePrice: 195000 },
    { symbol: '006400', name: '삼성SDI', basePrice: 420000 },
  ];

  return symbols.map(symbol => {
    const stockInfo = baseData.find(s => s.symbol === symbol) || 
                     { symbol, name: symbol, basePrice: 50000 };
    
    const randomChange = (Math.random() - 0.5) * 5000; // -2500 ~ +2500
    const currentPrice = Math.max(stockInfo.basePrice + randomChange, 1000);
    const change = randomChange;
    const changePercent = (change / stockInfo.basePrice) * 100;
    const volume = Math.floor(Math.random() * 10000000) + 100000;

    return {
      symbol,
      name: stockInfo.name,
      currentPrice: Math.round(currentPrice),
      change: Math.round(change),
      changePercent: parseFloat(changePercent.toFixed(2)),
      volume,
      lastUpdate: new Date().toISOString()
    };
  });
}

// 모의 지수 데이터 생성
function generateMockIndices() {
  const baseIndices = [
    { name: '코스피', baseValue: 2485.67 },
    { name: '코스닥', baseValue: 731.25 },
  ];

  return baseIndices.map(index => {
    const randomChange = (Math.random() - 0.5) * 40; // -20 ~ +20
    const value = index.baseValue + randomChange;
    const change = randomChange;
    const changePercent = (change / index.baseValue) * 100;

    return {
      name: index.name,
      value: parseFloat(value.toFixed(2)),
      change: parseFloat(change.toFixed(2)),
      changePercent: parseFloat(changePercent.toFixed(2)),
      lastUpdate: new Date().toISOString()
    };
  });
}