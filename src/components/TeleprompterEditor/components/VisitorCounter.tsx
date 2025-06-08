import React, { useState, useEffect } from 'react';
import { Users } from 'lucide-react';

export default function VisitorCounter() {
  const [visitorCount, setVisitorCount] = useState<number>(0);

  useEffect(() => {
    // Fetch visitor count from a simple analytics service
    async function fetchCount() {
      try {
        const res = await fetch(
          'https://api.countapi.xyz/hit/teleprompter.example/visits'
        );
        const data = await res.json();
        setVisitorCount(data.value);
      } catch (error) {
        console.error('Failed to fetch visitor count', error);
      }
    }

    fetchCount();
  }, []);

  return (
    <div className="bg-gray-800/30 p-4 rounded-lg backdrop-blur-sm">
      <div className="flex items-center gap-2 text-gray-300">
        <Users className="w-4 h-4 text-blue-400" />
        <span className="text-sm">מבקרים ייחודיים</span>
      </div>
      <div className="mt-2 text-2xl font-bold text-white">
        {visitorCount.toLocaleString('he-IL')}
      </div>
    </div>
  );
}
