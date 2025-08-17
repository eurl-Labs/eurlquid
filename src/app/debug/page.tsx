'use client'

import { useState } from 'react';
import { debugMultiPoolAMM, debugTokenInfo } from '@/lib/debug-multipool';
import { debugAvailablePools } from '@/lib/debug-available-pools';

export default function DebugPage() {
  const [isDebugging, setIsDebugging] = useState(false);
  const [debugLog, setDebugLog] = useState<string[]>([]);

  const runDebug = async () => {
    setIsDebugging(true);
    setDebugLog(['🔍 Starting Available Pools debug process...']);
    
    // Override console.log to capture output
    const originalConsoleLog = console.log;
    const logs: string[] = [];
    
    console.log = (...args) => {
      const message = args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' ');
      logs.push(message);
      originalConsoleLog(...args);
    };

    try {
      await debugTokenInfo();
      await debugAvailablePools();
    } catch (error) {
      logs.push(`❌ Debug error: ${error}`);
    }

    // Restore console.log
    console.log = originalConsoleLog;
    
    setDebugLog(logs);
    setIsDebugging(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
      <h1 className="text-2xl font-bold mb-6 text-center">Available Pools Debug Console</h1>
      
      <div className="mb-6">
        <button 
          onClick={runDebug}
          disabled={isDebugging}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          {isDebugging ? '🔍 Debugging...' : '🚀 Test Available Pools'}
        </button>
      </div>          <div className="bg-black/50 rounded-lg p-4 border border-white/10">
            <h2 className="text-lg font-semibold text-white mb-4">Debug Output:</h2>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {debugLog.length > 0 ? (
                debugLog.map((log, index) => (
                  <div key={index} className="text-sm text-gray-300 font-mono whitespace-pre-wrap">
                    {log}
                  </div>
                ))
              ) : (
                <div className="text-gray-500 italic">Click "Start Debug" to see output...</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
