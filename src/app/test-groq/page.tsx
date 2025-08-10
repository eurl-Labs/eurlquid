'use client';

import { useState } from 'react';

// Komponen untuk menampilkan objek secara terstruktur dengan indentasi dan peluasan
const JsonViewer = ({ data }: { data: any }) => {
  const [expandedKeys, setExpandedKeys] = useState<Record<string, boolean>>({});

  const toggleExpand = (key: string) => {
    setExpandedKeys((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const renderValue = (value: any, path: string, depth: number = 0) => {
    if (value === null) return <span className="text-gray-400">null</span>;
    if (value === undefined) return <span className="text-gray-400">undefined</span>;
    
    const type = typeof value;
    
    if (type === 'string') return <span className="text-green-400">"{value}"</span>;
    if (type === 'number') return <span className="text-blue-400">{value}</span>;
    if (type === 'boolean') return <span className="text-yellow-400">{value.toString()}</span>;
    
    if (Array.isArray(value)) {
      if (value.length === 0) return <span className="text-gray-400">[]</span>;
      
      const isExpanded = expandedKeys[path];
      
      return (
        <div>
          <span 
            className="cursor-pointer text-purple-400" 
            onClick={() => toggleExpand(path)}
          >
            {isExpanded ? '[-]' : '[+]'} Array({value.length})
          </span>
          
          {isExpanded && (
            <div style={{ marginLeft: '20px' }}>
              {value.map((item, index) => (
                <div key={index}>
                  <span className="text-gray-400">{index}: </span>
                  {renderValue(item, `${path}.${index}`, depth + 1)}
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }
    
    if (type === 'object') {
      const keys = Object.keys(value);
      if (keys.length === 0) return <span className="text-gray-400">{'{}'}</span>;
      
      const isExpanded = expandedKeys[path];
      
      return (
        <div>
          <span 
            className="cursor-pointer text-purple-400" 
            onClick={() => toggleExpand(path)}
          >
            {isExpanded ? '{-}' : '{+}'} Object({keys.length})
          </span>
          
          {isExpanded && (
            <div style={{ marginLeft: '20px' }}>
              {keys.map((key) => (
                <div key={key}>
                  <span className="text-gray-300">{key}: </span>
                  {renderValue(value[key], `${path}.${key}`, depth + 1)}
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }
    
    return <span>{String(value)}</span>;
  };

  return (
    <div className="font-mono text-sm bg-gray-900 p-4 rounded-md overflow-x-auto max-h-[70vh] overflow-y-auto">
      {renderValue(data, 'root')}
    </div>
  );
};

export default function TestGroqPage() {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const testGroqApi = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Triggering Groq API call manually...');
      
      const res = await fetch('/api/groq', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store'
      });
      
      const data = await res.json();
      console.log('RECEIVED GROQ RESPONSE:', data);
      
      // Log detailed object structure
      console.log('Response prototype chain:');
      let proto = Object.getPrototypeOf(data);
      while (proto) {
        console.log(proto);
        proto = Object.getPrototypeOf(proto);
      }
      
      setResponse(data);
    } catch (err: any) {
      console.error('Error calling Groq API:', err);
      setError(err?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-3xl font-bold mb-6">Groq API Test Page</h1>
      
      <button 
        onClick={testGroqApi}
        disabled={loading}
        className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 mb-8"
      >
        {loading ? 'Loading...' : 'Test Groq API'}
      </button>
      
      {error && (
        <div className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-md">
          <h3 className="text-xl font-semibold text-red-400">Error</h3>
          <p>{error}</p>
        </div>
      )}
      
      {response && (
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Response Structure:</h3>
          <JsonViewer data={response} />
        </div>
      )}
    </div>
  );
}
