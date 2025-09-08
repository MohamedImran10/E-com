import React, { useState, useEffect } from 'react';
import ApiService from '../services/api';

const ApiTestComponent = () => {
  const [testResults, setTestResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const addResult = (message, type = 'info') => {
    setTestResults(prev => [...prev, { message, type, timestamp: new Date() }]);
  };

  const testAPI = async () => {
    setLoading(true);
    setTestResults([]);
    
    addResult('🔍 Starting API connectivity test...', 'info');
    
    try {
      // Test 1: Check API base URL
      addResult(`📍 API Base URL: ${ApiService.baseURL}`, 'info');
      
      // Test 2: Test products endpoint
      addResult('📦 Testing products endpoint...', 'info');
      const products = await ApiService.getProducts();
      addResult(`✅ Products loaded: ${products.count || products.length} items`, 'success');
      
      // Test 3: Test categories endpoint
      addResult('📁 Testing categories endpoint...', 'info');
      const categories = await ApiService.getCategories();
      addResult(`✅ Categories loaded: ${categories.count || categories.length} items`, 'success');
      
      addResult('🎉 All API tests passed!', 'success');
      
    } catch (error) {
      addResult(`❌ API test failed: ${error.message}`, 'error');
      console.error('Full error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    testAPI();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h2>🔧 API Connectivity Test</h2>
      
      <button 
        onClick={testAPI} 
        disabled={loading}
        style={{
          padding: '10px 20px',
          marginBottom: '20px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: loading ? 'not-allowed' : 'pointer'
        }}
      >
        {loading ? 'Testing...' : 'Run Test Again'}
      </button>

      <div style={{ backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '4px' }}>
        {testResults.map((result, index) => (
          <div
            key={index}
            style={{
              padding: '5px 0',
              color: result.type === 'error' ? '#dc3545' : 
                     result.type === 'success' ? '#28a745' : '#333',
              fontWeight: result.type === 'error' || result.type === 'success' ? 'bold' : 'normal'
            }}
          >
            {result.message}
          </div>
        ))}
        
        {loading && (
          <div style={{ color: '#007bff', fontWeight: 'bold' }}>
            ⏳ Running tests...
          </div>
        )}
        
        {testResults.length === 0 && !loading && (
          <div style={{ color: '#6c757d' }}>
            Click "Run Test Again" to start API testing
          </div>
        )}
      </div>
      
      <div style={{ marginTop: '20px', fontSize: '12px', color: '#6c757d' }}>
        <strong>Debug Info:</strong><br/>
        Current time: {new Date().toLocaleString()}<br/>
        Browser: {navigator.userAgent.split(' ')[0]}<br/>
        Location: {window.location.href}
      </div>
    </div>
  );
};

export default ApiTestComponent;
