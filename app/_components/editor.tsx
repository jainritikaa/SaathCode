import React, { useEffect, useRef, useState } from 'react';
import Editor, { OnChange, OnMount, loader } from '@monaco-editor/react';
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

    // Update the theme to include light line numbers
    loader.init().then(monaco => {
      monaco.editor.defineTheme('custom-light', {
        base: 'vs', // can also be 'vs-dark' or 'hc-black'
        inherit: true, // inherit the base theme
        rules: [],
        colors: {
          'editorLineNumber.foreground': '#CCCCCC', // light line numbers
        }
      });
      monaco.editor.setTheme('custom-light');
    });
  };

  const evaluateCode = async () => {
    // Add your evaluation logic here if needed
  };

  const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(event.target.value);
  };

  return (
    <div className="w-full max-w-4xl p-4 rounded-lg bg-white">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Code Editor</h2>
        <select
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 focus:outline-none"
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
          className="overflow-hidden"
          height="100%"
          theme="vs-light"
          language={language}
          value={code}
          onChange={handleEditorChange}
          onMount={handleEditorDidMount}
          options={{
            automaticLayout: true,
            fontSize: 14,
            minimap: { enabled: false },
            lineNumbers: 'on',
            lineNumbersMinChars: 3,
            scrollbar: {
              vertical: 'auto',
              horizontal: 'auto',
            },
          }}
        />
      </div>
      <button
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 focus:outline-none"
        onClick={evaluateCode}
      >
        Run Code
      </button>
    </div>
  );
};

export default CodeEditor;
