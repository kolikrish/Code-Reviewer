import { useEffect, useState } from 'react'
import Editor from "react-simple-code-editor"
import 'prismjs/themes/prism-tomorrow.css'
import prism from 'prismjs'
import axios from 'axios'
import './App.css'

function App() {
  useEffect(() => {
    prism.highlightAll()
  }, [])

  const [code, setCode] = useState(`function sum() {
  return 1 + 1
}`)

  const [output, setOutput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  async function reviewCode() {
    setIsLoading(true)
    try {
      const prompt = `Explain the following code in detail: ${code}`
      const response = await axios.post('http://localhost:3000/ai/get-review', { prompt })
      setOutput(response.data)
    } catch (error) {
      setOutput('Error analyzing code. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Code Analyzer</h1>
      </header>
      
      <main className="content-container">
        <div className="editor-section">
          <div className="section-header">
            <h2>Your Code</h2>
          </div>
          <div className="code-editor">
            <Editor
              value={code}
              onValueChange={code => setCode(code)}
              highlight={code => prism.highlight(code, prism.languages.javascript, 'javascript')}
              padding={20}
              style={{
                fontFamily: "'SF Mono', 'Menlo', 'Monaco', 'Courier New', monospace",
                fontSize: 16,
                height: '100%',
                width: '100%',
                backgroundColor: '#1a1a1a',
                borderRadius: '0',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
              }}
            />
          </div>
          <button 
            className="review-button"
            onClick={reviewCode}
            disabled={isLoading}
          >
            {isLoading ? 'Analyzing...' : 'Analyze Code'}
          </button>
        </div>

        <div className="output-section">
          <div className="section-header">
            <h2>Analysis</h2>
          </div>
          <div className="output-container">
            {output ? (
              <pre>
                <code>{output}</code>
              </pre>
            ) : (
              <div className="placeholder-message">
                <p>Your code analysis will appear here</p>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <footer className="app-footer">
        <p>Code Analyzer • Built with React</p>
      </footer>
    </div>
  )
}

export default App