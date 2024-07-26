import React, { useEffect, useRef, useState } from 'react';
import Editor, { OnChange, OnMount } from '@monaco-editor/react';
import io from 'socket.io-client';
import 'tailwindcss/tailwind.css';

// Initialize socket connection
const socket = io('http://localhost:4000'); // Ensure this matches your server URL

const CodeEditor: React.FC = () => {
  const editorRef = useRef<any>(null);
  const [code, setCode] = useState<string>('// Start coding...');
  const [language, setLanguage] = useState<string>('javascript');

  useEffect(() => {
    // Handle incoming code updates from server
    socket.on('code_update', (newCode: string) => {
      if (editorRef.current && newCode !== code) {
        setCode(newCode);
      }
    });

    return () => {
      socket.off('code_update');
    };
  }, [code]);

  const handleEditorChange: OnChange = (value) => {
    setCode(value || '');
    socket.emit('code_update', value);
  };

  const handleEditorDidMount: OnMount = (editor) => {
    editorRef.current = editor;
  };

  const evaluateCode = async () => {
    // Add your evaluation logic here if needed
  };

  const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(event.target.value);
  };

  return (
    <div className="w-full max-w-4xl p-4 bg-transparent rounded-lg">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Code Editor</h2>
        <select
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
          value={language}
          onChange={handleLanguageChange}
        >
          <option value="javascript">JavaScript</option>
          <option value="typescript">TypeScript</option>
          <option value="python">Python</option>
          <option value="java">Java</option>
          <option value="cpp">C++</option>
          <option value="html">HTML</option>
          <option value="css">CSS</option>
        </select>
      </div>
      <div className="editor-container" style={{ height: '50vh' }}>
        <Editor
          height="100%"
          theme="vs-dark"
          language={language}
          value={code}
          onChange={handleEditorChange}
          onMount={handleEditorDidMount}
          options={{
            automaticLayout: true,
            fontSize: 14,
            minimap: { enabled: false },
          }}
        />
      </div>
      <button
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
        onClick={evaluateCode}
      >
        Run Code
      </button>
    </div>
  );
};

export default CodeEditor;
