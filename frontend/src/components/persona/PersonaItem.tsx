'use client';

import { useState, useRef, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Persona } from '@/types';
import { usePersonaStore } from '@/store/personaStore';
import { DEFAULT_PERSONAS } from '@/utils/constants';

interface PersonaItemProps {
  persona: Persona;
  eventCount?: number;
}

const COLOR_OPTIONS = [
  '#3B82F6', // Blue
  '#EC4899', // Pink
  '#10B981', // Green
  '#8B5CF6', // Purple
  '#F59E0B', // Orange
  '#EF4444', // Red
  '#6B7280', // Gray
  '#14B8A6', // Teal
];

export default function PersonaItem({ persona, eventCount = 0 }: PersonaItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(persona.name);
  const [selectedColor, setSelectedColor] = useState(persona.color);
  // const [showColorPicker, setShowColorPicker] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const { updatePersona, deletePersona } = usePersonaStore();
  
  const isDefault = DEFAULT_PERSONAS.some(p => p.id === persona.id);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSave = () => {
    if (editName.trim() && editName !== persona.name) {
      updatePersona(persona.id, { name: editName.trim() });
    }
    if (selectedColor !== persona.color) {
      updatePersona(persona.id, { color: selectedColor });
    }
    setIsEditing(false);
    setShowColorPicker(false);
  };

  const handleCancel = () => {
    setEditName(persona.name);
    setSelectedColor(persona.color);
    setIsEditing(false);
    setShowColorPicker(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  const handleDelete = () => {
    if (confirm(`"${persona.name}" 페르소나를 삭제하시겠습니까?`)) {
      deletePersona(persona.id);
    }
  };

  if (isEditing) {
    return (
      <div className="p-3 rounded-lg border-2 border-blue-200 bg-blue-50">
        <div className="space-y-3">
          {/* 이름 편집 */}
          <Input
            ref={inputRef}
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            onKeyDown={handleKeyPress}
            className="text-sm"
            placeholder="페르소나 이름"
          />
          
          {/* 색상 선택 */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded-full border-2 border-gray-300"
                style={{ backgroundColor: selectedColor }}
              />
              <span className="text-xs text-gray-600">색상 선택</span>
            </div>
            <div className="flex gap-1 flex-wrap">
              {COLOR_OPTIONS.map((color) => (
                <button
                  key={color}
                  className={`w-6 h-6 rounded-full border-2 hover:scale-110 transition-transform ${
                    selectedColor === color ? 'border-gray-800' : 'border-gray-300'
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => setSelectedColor(color)}
                />
              ))}
            </div>
          </div>

          {/* 액션 버튼 */}
          <div className="flex gap-2">
            <Button onClick={handleSave} size="sm" className="text-xs">
              저장
            </Button>
            <Button onClick={handleCancel} variant="outline" size="sm" className="text-xs">
              취소
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-100 cursor-pointer group"
      onClick={() => setIsEditing(true)}
    >
      <div className="flex items-center gap-2">
        <div
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: persona.color }}
        />
        <span className="text-sm font-medium">{persona.name}</span>
      </div>
      
      <div className="flex items-center gap-2">
        <Badge variant="secondary" className="text-xs">
          {eventCount}
        </Badge>
        
        {/* 기본 페르소나가 아닌 경우 삭제 버튼 표시 */}
        {!isDefault && (
          <Button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete();
            }}
            variant="ghost"
            size="sm"
            className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700 p-1 h-auto"
          >
            ×
          </Button>
        )}
      </div>
    </div>
  );
}