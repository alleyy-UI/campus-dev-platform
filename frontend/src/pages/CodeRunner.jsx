import { useState } from 'react';
import { Card, Select, Button, Input, message } from 'antd';
import { PlayCircleOutlined, RotateCcwOutlined } from '@ant-design/icons';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { codeAPI } from '../services/api';

const { TextArea } = Input;

const languages = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' }
];

const defaultCodes = {
  javascript: `function hello() {
  console.log('Hello, World!');
}

hello();`,
  python: `def hello():
    print('Hello, World!')

hello()`,
  java: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`
};

export default function CodeRunner() {
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState(defaultCodes.javascript);
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleRun = async () => {
    setLoading(true);
    setOutput('');
    setHasError(false);
    try {
      const res = await codeAPI.run({ code, language });
      setOutput(res.data.output);
      if (res.data.error) {
        setHasError(true);
      }
    } catch (error) {
      setOutput(error.response?.data?.output || '运行出错');
      setHasError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleLanguageChange = (value) => {
    setLanguage(value);
    setCode(defaultCodes[value]);
    setOutput('');
    setHasError(false);
  };

  const handleReset = () => {
    setCode(defaultCodes[language]);
    setOutput('');
    setHasError(false);
  };

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto' }}>
      <Card title="代码运行沙箱">
        <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
          <Select
            value={language}
            onChange={handleLanguageChange}
            options={languages}
            style={{ width: 150 }}
          />
          <Button 
            type="primary" 
            icon={<PlayCircleOutlined />} 
            onClick={handleRun}
            loading={loading}
          >
            运行
          </Button>
          <Button icon={<RotateCcwOutlined />} onClick={handleReset}>
            重置
          </Button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
          <div>
            <div style={{ marginBottom: '8px', fontWeight: 'bold' }}>代码编辑</div>
            <TextArea
              rows={15}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              style={{ fontFamily: 'monospace', fontSize: '14px' }}
            />
          </div>
          <div>
            <div style={{ marginBottom: '8px', fontWeight: 'bold' }}>输出结果</div>
            <div 
              style={{ 
                minHeight: '200px', 
                padding: '16px', 
                background: '#1d1f21', 
                color: hasError ? '#ff4d4f' : '#c5c8c6',
                fontFamily: 'monospace',
                fontSize: '14px',
                overflow: 'auto',
                borderRadius: '4px'
              }}
            >
              {output || '运行结果将显示在这里...'}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}