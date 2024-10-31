import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Clock, Save } from 'lucide-react';

const formatTime = (date) => {
  return date.toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'America/New_York'
  });
};

const formatDate = (date) => {
  return date.toISOString().split('T')[0];
};

const PreMarketChecklist = () => {
  const [currentTime, setCurrentTime] = useState(formatTime(new Date()));
  const [checklistItems, setChecklistItems] = useState([
    { id: 1, text: "Review overnight market events", checked: false },
    { id: 2, text: "Check economic calendar", checked: false },
    { id: 3, text: "Review pre-market movers", checked: false },
    { id: 4, text: "Check futures market", checked: false },
    { id: 5, text: "Review trading plan", checked: false },
    { id: 6, text: "Set daily profit target", checked: false },
    { id: 7, text: "Set daily loss limit", checked: false },
    { id: 8, text: "Check trading equipment", checked: false }
  ]);

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(formatTime(new Date()));
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const handleCheckChange = (itemId) => {
    setChecklistItems(items =>
      items.map(item =>
        item.id === itemId ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const progress = Math.round(
    (checklistItems.filter(item => item.checked).length / checklistItems.length) * 100
  );

  const saveChecklist = () => {
    const checklistData = {
      date: formatDate(new Date()),
      items: checklistItems,
      completedAt: formatTime(new Date()),
      progress
    };
    localStorage.setItem('premarket-checklist', JSON.stringify(checklistData));
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-white shadow-lg">
      <CardHeader className="space-y-1 bg-stone-50 border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold text-stone-800">
            Pre-Market Checklist
          </CardTitle>
          <div className="flex items-center gap-2 text-stone-600">
            <Clock size={18} />
            <span className="text-sm font-medium">
              {currentTime} ET
            </span>
          </div>
        </div>
        <div className="w-full bg-stone-200 h-2 rounded-full">
          <div 
            className="h-full rounded-full transition-all duration-300"
            style={{ 
              width: `${progress}%`,
              backgroundColor: progress === 100 ? '#7FA084' : '#8BA888'
            }}
          />
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <ScrollArea className="h-96 pr-4">
          <div className="space-y-4">
            {checklistItems.map(item => (
              <div
                key={item.id}
                className="flex items-center space-x-3 p-2 rounded hover:bg-stone-50"
              >
                <Checkbox
                  id={`item-${item.id}`}
                  checked={item.checked}
                  onCheckedChange={() => handleCheckChange(item.id)}
                  className="border-stone-300"
                />
                <label
                  htmlFor={`item-${item.id}`}
                  className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed 
                    peer-disabled:opacity-70 select-none cursor-pointer
                    ${item.checked ? 'text-stone-500 line-through' : 'text-stone-800'}`}
                >
                  {item.text}
                </label>
              </div>
            ))}
          </div>
        </ScrollArea>
        <div className="mt-4 flex justify-end">
          <Button
            onClick={saveChecklist}
            className="bg-stone-800 hover:bg-stone-700 text-white"
          >
            <Save className="mr-2 h-4 w-4" />
            Save Progress
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PreMarketChecklist;