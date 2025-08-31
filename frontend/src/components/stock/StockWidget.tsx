'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RefreshCw, TrendingUp, TrendingDown } from 'lucide-react';
import { StockData, MarketIndex } from '@/types/stock';
import { formatKoreanDateTime } from '@/utils/dateUtils';

// 임시 데이터 (실제로는 API에서 가져올 예정)
const MOCK_STOCK_DATA: StockData[] = [
  {
    symbol: '005930',
    name: '삼성전자',
    currentPrice: 71500,
    change: 1200,
    changePercent: 1.71,
    volume: 15234567,
    lastUpdate: new Date().toISOString()
  },
  {
    symbol: '000660',
    name: 'SK하이닉스',
    currentPrice: 128000,
    change: -3200,
    changePercent: -2.44,
    volume: 8765432,
    lastUpdate: new Date().toISOString()
  },
  {
    symbol: '035420',
    name: 'NAVER',
    currentPrice: 185500,
    change: 2800,
    changePercent: 1.53,
    volume: 1234567,
    lastUpdate: new Date().toISOString()
  },
  {
    symbol: '035720',
    name: '카카오',
    currentPrice: 45200,
    change: -800,
    changePercent: -1.74,
    volume: 3456789,
    lastUpdate: new Date().toISOString()
  }
];

const MOCK_MARKET_INDICES: MarketIndex[] = [
  {
    name: '코스피',
    value: 2485.67,
    change: 12.34,
    changePercent: 0.50,
    lastUpdate: new Date().toISOString()
  },
  {
    name: '코스닥',
    value: 731.25,
    change: -5.42,
    changePercent: -0.73,
    lastUpdate: new Date().toISOString()
  }
];

export default function StockWidget() {
  const [stocks, setStocks] = useState<StockData[]>(MOCK_STOCK_DATA);
  const [indices, setIndices] = useState<MarketIndex[]>(MOCK_MARKET_INDICES);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // API에서 실시간 데이터 가져오기
  const updateStockData = async () => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/stock');
      if (!response.ok) {
        throw new Error('Failed to fetch stock data');
      }
      
      const data = await response.json();
      
      if (data.stocks) {
        setStocks(data.stocks);
      }
      if (data.indices) {
        setIndices(data.indices);
      }
      
      setLastUpdate(new Date());
      
      // 데이터 소스에 따른 메시지 표시 (개발용)
      if (data.source === 'mock' || data.source === 'mock_fallback') {
        console.log('Stock Widget:', data.message || '모의 데이터 사용 중');
      }
      
    } catch (error) {
      console.error('Error updating stock data:', error);
      // 에러 시 기존 데이터 유지
    } finally {
      setIsLoading(false);
    }
  };

  // 컴포넌트 마운트 시 초기 데이터 로드
  useEffect(() => {
    updateStockData();
  }, []);

  // 자동 업데이트 (30초마다)
  useEffect(() => {
    const interval = setInterval(updateStockData, 30000);
    return () => clearInterval(interval);
  }, []);

  const formatPrice = (price: number) => {
    return price.toLocaleString('ko-KR');
  };

  const formatChange = (change: number, changePercent: number) => {
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change.toLocaleString('ko-KR')} (${sign}${changePercent.toFixed(2)}%)`;
  };

  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-red-600'; // 상승 - 빨간색
    if (change < 0) return 'text-blue-600'; // 하락 - 파란색
    return 'text-gray-600'; // 보합 - 회색
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="w-3 h-3" />;
    if (change < 0) return <TrendingDown className="w-3 h-3" />;
    return null;
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">📈 실시간 주식시황</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={updateStockData}
            disabled={isLoading}
            className="h-8 w-8 p-0"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
        <p className="text-xs text-gray-500">
          마지막 업데이트: {formatKoreanDateTime(lastUpdate)}
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* 주요 지수 */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">주요 지수</h4>
          <div className="grid grid-cols-1 gap-2">
            {indices.map((index) => (
              <div key={index.name} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium text-sm">{index.name}</div>
                  <div className="text-lg font-bold">{formatPrice(index.value)}</div>
                </div>
                <div className={`text-right ${getChangeColor(index.change)}`}>
                  <div className="flex items-center gap-1 justify-end">
                    {getChangeIcon(index.change)}
                    <span className="text-xs font-medium">
                      {formatChange(index.change, index.changePercent)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 관심 종목 */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">관심 종목</h4>
          <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar">
            {stocks.map((stock) => (
              <div key={stock.symbol} className="p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between mb-1">
                  <div>
                    <div className="font-medium text-sm">{stock.name}</div>
                    <div className="text-xs text-gray-500">{stock.symbol}</div>
                  </div>
                  <Badge
                    variant="secondary"
                    className={`text-xs ${getChangeColor(stock.change)}`}
                  >
                    {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="text-lg font-bold">
                    {formatPrice(stock.currentPrice)}원
                  </div>
                  <div className={`text-right ${getChangeColor(stock.change)}`}>
                    <div className="flex items-center gap-1 justify-end">
                      {getChangeIcon(stock.change)}
                      <span className="text-xs">
                        {stock.change >= 0 ? '+' : ''}{stock.change.toLocaleString('ko-KR')}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-1 text-xs text-gray-500">
                  거래량: {stock.volume.toLocaleString('ko-KR')}주
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 하단 정보 */}
        <div className="pt-2 border-t text-xs text-gray-500 text-center">
          <p>💡 실시간 데이터는 약 15분 지연될 수 있습니다</p>
          <p className="mt-1">투자 판단은 신중히 하시기 바랍니다</p>
        </div>
      </CardContent>
    </Card>
  );
}