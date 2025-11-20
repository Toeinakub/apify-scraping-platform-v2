'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function RefreshButton() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const router = useRouter();

  const handleRefresh = () => {
    setIsRefreshing(true);
    router.refresh();

    // Reset loading state after a delay
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  return (
    <Button
      onClick={handleRefresh}
      disabled={isRefreshing}
      variant="outline"
      size="sm"
    >
      <RefreshCw
        className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`}
      />
      {isRefreshing ? 'Refreshing...' : 'Refresh'}
    </Button>
  );
}
