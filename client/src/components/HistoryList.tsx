import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HistoryItem } from "@/pages/Home";
import { 
  getHistoryItems, 
  clearHistory,
  removeHistoryItem 
} from "@/lib/localStorage";
import { ChevronDown, ChevronUp, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";

interface HistoryListProps {
  onHistoryItemSelected: (item: HistoryItem) => void;
}

export default function HistoryList({ onHistoryItemSelected }: HistoryListProps) {
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  // Load history items from localStorage on component mount
  useEffect(() => {
    const items = getHistoryItems();
    setHistoryItems(items);
  }, []);

  const handleClearHistory = () => {
    clearHistory();
    setHistoryItems([]);
    toast({
      title: "History cleared",
      description: "All analysis history has been cleared."
    });
  };

  const handleRemoveItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    removeHistoryItem(id);
    setHistoryItems(historyItems.filter(item => item.id !== id));
    toast({
      title: "Item removed",
      description: "The analysis has been removed from history."
    });
  };

  const toggleExpanded = (id: string) => {
    const newExpandedItems = new Set(expandedItems);
    if (newExpandedItems.has(id)) {
      newExpandedItems.delete(id);
    } else {
      newExpandedItems.add(id);
    }
    setExpandedItems(newExpandedItems);
  };

  const formatTimeAgo = (date: Date) => {
    return formatDistanceToNow(date, { addSuffix: true });
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-900">Recent Analyses</h2>
          {historyItems.length > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleClearHistory}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Clear History
            </Button>
          )}
        </div>

        {historyItems.length === 0 ? (
          <div className="py-8 text-center border-2 border-dashed border-gray-200 rounded-lg">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No analysis history
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Analyzed arguments will appear here for easy reference.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {historyItems.map((item) => (
              <div 
                key={item.id} 
                className="p-3 bg-gray-50 rounded-md hover:bg-gray-100 cursor-pointer"
                onClick={() => onHistoryItemSelected(item)}
              >
                <div className="flex justify-between">
                  <div className="truncate flex-1">
                    <p className="font-medium text-sm truncate">
                      {item.inputText.length > 60 
                        ? `${item.inputText.substring(0, 60)}...` 
                        : item.inputText}
                    </p>
                    <p className="text-xs text-gray-500">
                      Analyzed with {item.aiModel.charAt(0).toUpperCase() + item.aiModel.slice(1)} • {formatTimeAgo(item.timestamp)}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 w-6 p-0 rounded-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleExpanded(item.id);
                      }}
                    >
                      {expandedItems.has(item.id) 
                        ? <ChevronUp className="h-4 w-4 text-gray-500" /> 
                        : <ChevronDown className="h-4 w-4 text-gray-500" />}
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 w-6 p-0 ml-1 rounded-full"
                      onClick={(e) => handleRemoveItem(item.id, e)}
                    >
                      <X className="h-4 w-4 text-gray-500" />
                    </Button>
                  </div>
                </div>

                {expandedItems.has(item.id) && (
                  <div className="mt-2 text-xs">
                    <div className="mt-2">
                      <p className="font-semibold">Claim:</p>
                      <p className="mt-1 ml-2">{item.result.claim}</p>
                    </div>
                    <div className="mt-2">
                      <p className="font-semibold">Premises:</p>
                      <ul className="mt-1 ml-2 pl-4 list-disc">
                        {item.result.premises.map((premise, idx) => (
                          <li key={idx}>{premise}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
