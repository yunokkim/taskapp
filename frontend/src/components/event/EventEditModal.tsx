'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { usePersonaStore } from '@/store/personaStore';
import { useEventStore } from '@/store/eventStore';
import { Event, NotificationSetting } from '@/types';
import { REPEAT_OPTIONS, NOTIFICATION_OPTIONS } from '@/utils/constants';
import { format } from 'date-fns';
import { combineKSTDateTime, getKSTTimeString, getKSTDateOnly } from '@/utils/timezone';

interface EventEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventId: string | null;
}

export default function EventEditModal({ isOpen, onClose, eventId }: EventEditModalProps) {
  const { personas } = usePersonaStore();
  const { events, updateEvent, deleteEvent } = useEventStore();

  // 편집할 이벤트 찾기
  const eventToEdit = events.find(e => e.id === eventId);

  // 폼 상태 - eventToEdit이 있을 때 초기화
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedPersonaId, setSelectedPersonaId] = useState('');
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [repeat, setRepeat] = useState<Event['repeat']>('none');
  const [notifications, setNotifications] = useState<NotificationSetting[]>([]);
  
  // 유효성 검사
  const [errors, setErrors] = useState<Record<string, string>>({});

  // eventToEdit이 변경될 때마다 폼 초기화
  useEffect(() => {
    if (eventToEdit && isOpen) {
      setTitle(eventToEdit.title);
      setDescription(eventToEdit.description || '');
      setSelectedPersonaId(eventToEdit.personaId);
      
      // UTC로 저장된 시간을 한국시간으로 변환해서 표시
      const startDateTime = getKSTDateOnly(new Date(eventToEdit.start));
      setStartDate(startDateTime);
      setStartTime(getKSTTimeString(new Date(eventToEdit.start)));
      
      if (eventToEdit.end) {
        setEndTime(getKSTTimeString(new Date(eventToEdit.end)));
      }
      
      setTags(eventToEdit.tags || []);
      setRepeat(eventToEdit.repeat || 'none');
      setNotifications(eventToEdit.notifications || []);
    }
  }, [eventToEdit, isOpen]);

  // 이벤트가 없으면 렌더링하지 않음
  if (!eventToEdit) {
    return null;
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!title.trim()) {
      newErrors.title = '일정 제목을 입력해주세요';
    }
    
    if (!selectedPersonaId) {
      newErrors.persona = '페르소나를 선택해주세요';
    }
    
    if (!startDate) {
      newErrors.date = '날짜를 선택해주세요';
    }
    
    // 시간 유효성 검사
    if (startTime >= endTime) {
      newErrors.time = '종료 시간은 시작 시간보다 늦어야 합니다';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdate = () => {
    if (!validateForm()) return;

    // 한국시간 기준으로 시작/종료 DateTime 생성
    const start = combineKSTDateTime(startDate, startTime);
    const end = combineKSTDateTime(startDate, endTime);

    const updates: Partial<Omit<Event, 'id'>> = {
      title: title.trim(),
      description: description.trim() || undefined,
      start,
      end,
      personaId: selectedPersonaId,
      tags: tags.length > 0 ? tags : undefined,
      repeat,
      notifications: notifications.length > 0 ? notifications : undefined
    };

    updateEvent(eventToEdit.id, updates);
    handleClose();
  };

  const handleDelete = () => {
    if (confirm(`"${eventToEdit.title}" 일정을 삭제하시겠습니까?`)) {
      deleteEvent(eventToEdit.id);
      handleClose();
    }
  };

  const handleClose = () => {
    // 폼 초기화는 useEffect에서 처리
    setErrors({});
    setTagInput('');
    onClose();
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const toggleNotification = (type: 'email' | 'push', minutesBefore: number) => {
    const existingIndex = notifications.findIndex(
      n => n.type === type && n.minutesBefore === minutesBefore
    );
    
    if (existingIndex >= 0) {
      setNotifications(notifications.filter((_, index) => index !== existingIndex));
    } else {
      setNotifications([...notifications, { type, minutesBefore }]);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto modal-scrollbar">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-xl font-semibold text-gray-800">일정 수정</DialogTitle>
        </DialogHeader>

        <div className="space-y-8">
          {/* 제목 */}
          <div className="space-y-3">
            <Label htmlFor="title" className="text-sm font-medium text-gray-700">일정 제목 *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="일정 제목을 입력하세요"
              className={`h-11 ${errors.title ? 'border-red-500 focus:border-red-500' : 'focus:border-blue-500'}`}
            />
            {errors.title && <p className="text-sm text-red-500 mt-2">{errors.title}</p>}
          </div>

          {/* 설명 */}
          <div className="space-y-3">
            <Label htmlFor="description" className="text-sm font-medium text-gray-700">설명</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="일정에 대한 자세한 설명을 입력하세요"
              rows={3}
              className="focus:border-blue-500 resize-none"
            />
          </div>

          {/* 페르소나 선택 */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-700">페르소나 *</Label>
            <Select value={selectedPersonaId} onValueChange={setSelectedPersonaId}>
              <SelectTrigger className={`h-11 ${errors.persona ? 'border-red-500 focus:border-red-500' : 'focus:border-blue-500'}`}>
                <SelectValue placeholder="페르소나를 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                {personas.map((persona) => (
                  <SelectItem key={persona.id} value={persona.id}>
                    <div className="flex items-center gap-3">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: persona.color }}
                      />
                      <span className="text-sm">{persona.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.persona && <p className="text-sm text-red-500 mt-2">{errors.persona}</p>}
          </div>

          {/* 날짜 및 시간 */}
          <div className="space-y-4">
            <Label className="text-sm font-medium text-gray-700">일정 날짜 및 시간 *</Label>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <div className="text-xs text-gray-600">날짜</div>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={`w-full h-11 justify-start text-left font-normal ${
                        errors.date ? 'border-red-500 focus:border-red-500' : 'hover:border-blue-400 focus:border-blue-500'
                      }`}
                    >
                      {startDate ? (
                        format(startDate, 'yyyy년 M월 d일')
                      ) : (
                        '날짜 선택'
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={(date) => date && setStartDate(date)}
                    />
                  </PopoverContent>
                </Popover>
                {errors.date && <p className="text-xs text-red-500 mt-1">{errors.date}</p>}
              </div>

              <div className="space-y-2">
                <div className="text-xs text-gray-600">시작 시간</div>
                <Input
                  id="startTime"
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="h-11 focus:border-blue-500"
                />
              </div>

              <div className="space-y-2">
                <div className="text-xs text-gray-600">종료 시간</div>
                <Input
                  id="endTime"
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className={`h-11 ${errors.time ? 'border-red-500 focus:border-red-500' : 'focus:border-blue-500'}`}
                />
                {errors.time && <p className="text-xs text-red-500 mt-1">{errors.time}</p>}
              </div>
            </div>
          </div>

          {/* 태그 */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-700">태그</Label>
            <div className="flex gap-2">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="태그를 입력하세요"
                className="h-11 flex-1 focus:border-blue-500"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addTag();
                  }
                }}
              />
              <Button type="button" onClick={addTag} variant="outline" className="h-11 px-6">
                추가
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="cursor-pointer px-3 py-1 text-sm">
                    #{tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-2 text-xs hover:text-red-500"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* 반복 설정 */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-700">반복</Label>
            <Select value={repeat} onValueChange={(value: string) => setRepeat(value as Event['repeat'])}>
              <SelectTrigger className="h-11 focus:border-blue-500">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {REPEAT_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 알림 설정 */}
          <div className="space-y-4">
            <Label className="text-sm font-medium text-gray-700">알림 설정</Label>
            <div className="space-y-4 mt-3">
              {/* 푸시 알림 섹션 */}
              <div className="border rounded-lg p-4 bg-gray-50/50">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">📱</span>
                    <span className="font-medium text-sm">푸시 알림</span>
                  </div>
                  <Checkbox
                    checked={notifications.some(n => n.type === 'push')}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        // 푸시 알림이 하나도 없으면 기본값(30분 전) 추가
                        if (!notifications.some(n => n.type === 'push')) {
                          setNotifications([...notifications, { type: 'push', minutesBefore: 30 }]);
                        }
                      } else {
                        // 모든 푸시 알림 제거
                        setNotifications(notifications.filter(n => n.type !== 'push'));
                      }
                    }}
                  />
                </div>
                
                {notifications.some(n => n.type === 'push') && (
                  <div className="space-y-2">
                    <div className="text-xs text-gray-600 mb-2">알림 시점 선택:</div>
                    <div className="grid grid-cols-2 gap-2">
                      {NOTIFICATION_OPTIONS.map((option) => (
                        <Button
                          key={`push-${option.value}`}
                          type="button"
                          variant={notifications.some(n => n.type === 'push' && n.minutesBefore === option.value) ? 'default' : 'outline'}
                          size="sm"
                          className="text-xs h-8"
                          onClick={() => toggleNotification('push', option.value)}
                        >
                          {option.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* 이메일 알림 섹션 */}
              <div className="border rounded-lg p-4 bg-gray-50/50">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">✉️</span>
                    <span className="font-medium text-sm">이메일 알림</span>
                  </div>
                  <Checkbox
                    checked={notifications.some(n => n.type === 'email')}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        // 이메일 알림이 하나도 없으면 기본값(30분 전) 추가
                        if (!notifications.some(n => n.type === 'email')) {
                          setNotifications([...notifications, { type: 'email', minutesBefore: 30 }]);
                        }
                      } else {
                        // 모든 이메일 알림 제거
                        setNotifications(notifications.filter(n => n.type !== 'email'));
                      }
                    }}
                  />
                </div>
                
                {notifications.some(n => n.type === 'email') && (
                  <div className="space-y-2">
                    <div className="text-xs text-gray-600 mb-2">알림 시점 선택:</div>
                    <div className="grid grid-cols-2 gap-2">
                      {NOTIFICATION_OPTIONS.map((option) => (
                        <Button
                          key={`email-${option.value}`}
                          type="button"
                          variant={notifications.some(n => n.type === 'email' && n.minutesBefore === option.value) ? 'default' : 'outline'}
                          size="sm"
                          className="text-xs h-8"
                          onClick={() => toggleNotification('email', option.value)}
                        >
                          {option.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {/* 선택된 알림 요약 */}
              {notifications.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="text-xs font-medium text-blue-800 mb-2">설정된 알림</div>
                  <div className="flex flex-wrap gap-1">
                    {notifications.map((notification, index) => {
                      const option = NOTIFICATION_OPTIONS.find(opt => opt.value === notification.minutesBefore);
                      return (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {notification.type === 'push' ? '📱' : '✉️'} {option?.label}
                        </Badge>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <DialogFooter className="pt-6 border-t border-gray-200 gap-2">
          <Button 
            type="button" 
            variant="destructive" 
            onClick={handleDelete}
            className="mr-auto h-11 px-6"
          >
            삭제
          </Button>
          <Button type="button" variant="outline" onClick={handleClose} className="h-11 px-6">
            취소
          </Button>
          <Button type="button" onClick={handleUpdate} className="h-11 px-6 bg-blue-600 hover:bg-blue-700">
            수정 완료
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}