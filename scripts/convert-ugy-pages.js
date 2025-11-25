// Script to convert ugy4-ugy12 pages to React imports
// This is a helper script - manual conversion is still needed for some parts

const fs = require('fs');
const path = require('path');

const ugyNumbers = [4, 5, 6, 7, 8, 9, 10, 11, 12];

ugyNumbers.forEach(num => {
  const filePath = path.join(__dirname, `../src/pages/ugy${num}/index.jsx`);
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${filePath}`);
    return;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace imports
  content = content.replace(
    /\/\*\* global React, ReactDOM, NarrativeBlock, TaskCard, ChallengeInput \*\/\nconst { useState, useMemo, useEffect } = React;/,
    `import React, { useState, useMemo, useEffect, useRef } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import NarrativeBlock from '../../components/Ugy1/NarrativeBlock'
import TaskCard from '../../components/Ugy1/TaskCard'
import ChallengeInput from '../../components/Ugy1/ChallengeInput'
import '../../styles/ugy1.css'`
  );
  
  // Replace React.useRef and React.useEffect
  content = content.replace(/React\.useRef/g, 'useRef');
  content = content.replace(/React\.useEffect/g, 'useEffect');
  
  // Replace App with Ugy{num}
  content = content.replace(/const App = \(\) =>/g, `const Ugy${num} = () =>`);
  
  // Replace window.location.search with useSearchParams
  content = content.replace(
    /const urlParams = new URLSearchParams\(window\.location\.search\);/g,
    `const [searchParams] = useSearchParams()`
  );
  content = content.replace(/urlParams\.get\(/g, 'searchParams.get(');
  
  // Add useAuth hook
  if (!content.includes('const { saveLevelCompletion, isAuthenticated } = useAuth()')) {
    content = content.replace(
      /const Ugy\d+ = \(\) => \{[\s\S]*?const \[searchParams\] = useSearchParams\(\)/,
      match => match + '\n  const { saveLevelCompletion, isAuthenticated } = useAuth()'
    );
  }
  
  // Replace saveProgress function calls
  content = content.replace(
    /function saveProgress\(step, done\) \{[\s\S]*?\n\}/g,
    '// saveProgress will be updated inside the component to use useAuth hook'
  );
  
  // Replace saveProgress calls in useEffect
  content = content.replace(
    /useEffect\(\(\) => \{[\s\S]*?saveProgress\(step, done\);[\s\S]*?\}, \[step, done\]\);/g,
    `useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ step, done }));
      if (isAuthenticated) {
        saveLevelCompletion('ugy${num}').catch(console.warn)
      }
    } catch(e) {
      console.warn('Nem sikerült menteni az állapotot:', e);
    }
  }, [step, done, isAuthenticated, saveLevelCompletion]);`
  );
  
  // Replace window.CMAuth calls
  content = content.replace(
    /if \(window\.CMAuth && window\.CMAuth\.isAuthenticated\) \{[\s\S]*?window\.CMAuth\.saveLevelCompletion\('ugy\d+'\);[\s\S]*?\}/g,
    `if (isAuthenticated) {
                          saveLevelCompletion('ugy${num}').catch(console.warn)
                        }`
  );
  
  // Replace href with Link
  content = content.replace(/<a href="\/"/g, '<Link to="/');
  content = content.replace(/<a href="\/(ugy\d+|aurora)\.html/g, (match, path) => {
    const route = path === 'aurora' ? '/aurora' : `/${path}`;
    return `<Link to="${route}`;
  });
  content = content.replace(/<a className="btn-ghost" href="\/(ugy\d+)\.html\?start=1"/g, (match, num) => {
    return `<Link className="btn-ghost" to="/ugy${num}?start=1"`;
  });
  content = content.replace(/<\/a>/g, '</Link>');
  
  // Replace ReactDOM.createRoot
  content = content.replace(/ReactDOM\.createRoot\(document\.getElementById\('root'\)\)\.render\(<App \/>\);/g, `export default Ugy${num}`);
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Converted ugy${num}/index.jsx`);
});

console.log('Conversion complete!');

