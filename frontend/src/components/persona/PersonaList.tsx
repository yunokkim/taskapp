'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import PersonaItem from './PersonaItem';
import { usePersonaStore } from '@/store/personaStore';
import { useEventStore } from '@/store/eventStore';

const DEFAULT_COLORS = [
  '#3B82F6', '#EC4899', '#10B981', '#8B5CF6', '#F59E0B', 
  '#EF4444', '#6B7280', '#14B8A6'
];

export default function PersonaList() {
  const [isAdding, setIsAdding] = useState(false);
  const [newPersonaName, setNewPersonaName] = useState('');
  const { personas, addPersona, fetchPersonas, loading } = usePersonaStore();
  const { getEventsByPersona } = useEventStore();

  useEffect(() => {
    fetchPersonas();
  }, [fetchPersonas]);

  const handleAddPersona = () => {
    if (newPersonaName.trim()) {
      // 기존 페르소나 수를 기반으로 색상 선택 (deterministic)
      const colorIndex = personas.length % DEFAULT_COLORS.length;
      const selectedColor = DEFAULT_COLORS[colorIndex];
      addPersona({
        name: newPersonaName.trim(),
        color: selectedColor,
        description: `사용자 정의 페르소나: ${newPersonaName.trim()}`
      });
      setNewPersonaName('');
      setIsAdding(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddPersona();
    } else if (e.key === 'Escape') {
      setNewPersonaName('');
      setIsAdding(false);
    }
  };

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-900">페르소나별 보기</h3>
        <Button
          onClick={() => setIsAdding(true)}
          variant="ghost"
          size="sm"
          className="text-xs"
        >
          + 추가
        </Button>
      </div>
      
      <div className="space-y-2">
        {personas.map((persona) => {
          const eventCount = getEventsByPersona(persona.id).length;
          return (
            <PersonaItem
              key={persona.id}
              persona={persona}
              eventCount={eventCount}
            />
          );
        })}
        
        {/* 새 페르소나 추가 폼 */}
        {isAdding && (
          <div className="p-3 rounded-lg border-2 border-green-200 bg-green-50">
            <div className="space-y-3">
              <Input
                value={newPersonaName}
                onChange={(e) => setNewPersonaName(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="새 페르소나 이름"
                className="text-sm"
                autoFocus
              />
              <div className="flex gap-2">
                <Button onClick={handleAddPersona} size="sm" className="text-xs">
                  추가
                </Button>
                <Button 
                  onClick={() => {
                    setNewPersonaName('');
                    setIsAdding(false);
                  }} 
                  variant="outline" 
                  size="sm" 
                  className="text-xs"
                >
                  취소
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}