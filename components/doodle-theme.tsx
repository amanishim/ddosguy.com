"use client"

import { useEffect } from "react"

export default function DoodleTheme() {
  useEffect(() => {
    // Inject doodle theme CSS variables and styles
    const style = document.createElement("style")
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Kalam:wght@400;700&display=swap');
      
      :root {
        --cream: #FEFCF3;
        --ink: #333;
        --accent: #F6AD55;
        --border: #333;
      }
      
      * {
        font-family: 'Kalam', cursive !important;
      }
      
      body {
        background: var(--cream);
        color: var(--ink);
      }
      
      .font-heading {
        font-family: 'Kalam', cursive;
      }
      
      .doodle-border {
        border: 2px solid #333;
        border-radius: 8px;
        position: relative;
        background: white;
        box-shadow: 3px 3px 0px #333;
      }
      
      .doodle-border::before {
        content: '';
        position: absolute;
        top: -2px;
        left: -2px;
        right: -2px;
        bottom: -2px;
        border: 2px dashed var(--accent);
        border-radius: 8px;
        z-index: -1;
      }
      
      .doodle-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 12px 24px;
        background: white;
        color: var(--ink);
        text-decoration: none;
        font-weight: 600;
        border: 2px solid var(--ink);
        border-radius: 12px;
        transition: all 0.2s ease;
        font-family: inherit;
        cursor: pointer;
        box-shadow: 3px 3px 0px var(--ink);
      }
      
      .doodle-btn:hover {
        transform: translate(-2px, -2px);
        box-shadow: 5px 5px 0px var(--ink);
      }
      
      .doodle-btn:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        transform: none;
        box-shadow: 3px 3px 0px var(--ink);
      }
      
      .doodle-btn--accent {
        background: var(--accent);
        border-color: var(--ink);
        color: var(--ink);
      }
      
      .doodle-btn--accent:hover {
        background: #E69E47;
      }
      
      .doodle-btn--success {
        background: #10B981;
        color: white;
      }
      
      .doodle-btn--danger {
        background: #EF4444;
        color: white;
      }
      
      .doodle-input {
        width: 100%;
        padding: 16px;
        border: 2px solid var(--border);
        border-radius: 8px;
        font-size: 16px;
        font-weight: 500;
        background: white;
        box-shadow: 2px 2px 0px var(--border);
        transition: all 0.2s ease;
      }
      
      .doodle-input:focus {
        outline: none;
        transform: translate(-1px, -1px);
        box-shadow: 3px 3px 0px var(--border);
      }
      
      .doodle-card {
        background: white;
        border: 2px solid var(--ink);
        border-radius: 16px;
        padding: 24px;
        box-shadow: 4px 4px 0px var(--ink);
        transition: transform 0.2s ease;
      }
      
      .doodle-card:hover {
        transform: translate(-2px, -2px);
        box-shadow: 6px 6px 0px var(--ink);
      }
      
      .ai-analyst-card {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border: 2px solid var(--border);
        border-radius: 12px;
        padding: 24px;
        color: white;
        box-shadow: 4px 4px 0px var(--border);
      }
      
      .ai-btn {
        background: white;
        color: #667eea;
        border: none;
        padding: 12px 24px;
        border-radius: 8px;
        font-weight: bold;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        gap: 8px;
        transition: all 0.2s ease;
        box-shadow: 2px 2px 0px rgba(0,0,0,0.2);
      }
      
      .ai-btn:hover {
        transform: translate(-1px, -1px);
        box-shadow: 3px 3px 0px rgba(0,0,0,0.2);
      }
      
      .ai-result {
        background: rgba(255,255,255,0.1);
        border: 1px solid rgba(255,255,255,0.2);
        border-radius: 8px;
        padding: 16px;
        margin-top: 16px;
        position: relative;
      }
      
      .copy-btn {
        position: absolute;
        top: 12px;
        right: 12px;
        background: rgba(255,255,255,0.2);
        border: none;
        border-radius: 4px;
        padding: 6px;
        color: white;
        cursor: pointer;
        transition: all 0.2s ease;
      }
      
      .copy-btn:hover {
        background: rgba(255,255,255,0.3);
      }
      
      .loading-spinner {
        width: 20px;
        height: 20px;
        border: 2px solid rgba(255,255,255,0.3);
        border-top: 2px solid white;
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }
      
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      
      .nav-link {
        color: var(--ink);
        text-decoration: none;
        font-weight: 500;
        transition: color 0.2s ease;
        font-family: inherit;
      }
      
      .nav-link:hover {
        color: var(--accent);
      }
      
      .mobile-menu-btn {
        color: var(--ink);
        background: none;
        border: none;
        cursor: pointer;
        padding: 8px;
        border-radius: 8px;
        transition: background-color 0.2s ease;
      }
      
      .mobile-menu-btn:hover {
        background-color: rgba(0, 0, 0, 0.05);
      }
      
      .mobile-link {
        display: block;
        padding: 12px 0;
        color: var(--ink);
        text-decoration: none;
        font-weight: 500;
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        transition: color 0.2s ease;
      }
      
      .mobile-link:hover {
        color: var(--accent);
      }
      
      .faq-item {
        background: white;
        border: 2px solid var(--ink);
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 3px 3px 0px var(--ink);
      }
      
      .faq-question {
        width: 100%;
        padding: 20px;
        background: none;
        border: none;
        text-align: left;
        font-weight: 600;
        font-size: 1.1rem;
        color: var(--ink);
        cursor: pointer;
        transition: background-color 0.2s ease;
        font-family: inherit;
      }
      
      .faq-question:hover {
        background-color: rgba(246, 173, 85, 0.1);
      }
      
      .faq-answer {
        padding: 0 20px 20px 20px;
        color: var(--ink);
        opacity: 0.8;
        line-height: 1.6;
        border-top: 1px dashed var(--ink);
        margin-top: -1px;
        font-family: inherit;
      }
      
      .scan-result {
        padding: 16px;
        border: 2px solid var(--border);
        border-radius: 8px;
        background: white;
        box-shadow: 2px 2px 0px var(--border);
      }
      
      .scan-result--success {
        border-color: #10B981;
        background: #F0FDF4;
      }
      
      .scan-result--warning {
        border-color: #F59E0B;
        background: #FFFBEB;
      }
      
      .scan-result--danger {
        border-color: #EF4444;
        background: #FEF2F2;
      }
      
      .footer-link {
        color: #333;
        text-decoration: underline;
        text-decoration-style: wavy;
      }
      
      .footer-link:hover {
        color: #666;
      }
      
      .company-tagline {
        font-size: 0.75rem;
        color: var(--ink);
        opacity: 0.7;
        font-weight: 400;
        margin-top: -2px;
        line-height: 1;
      }
      
      .scan-total-badge {
        background: var(--accent);
        border: 2px solid var(--border);
        border-radius: 20px;
        padding: 6px 12px;
        font-size: 14px;
        font-weight: bold;
        color: var(--ink);
        box-shadow: 2px 2px 0px var(--border);
      }
      
      /* Responsive design */
      @media (max-width: 768px) {
        .doodle-card {
          padding: 16px;
        }
        
        .company-tagline {
          font-size: 0.7rem;
        }
      }
    `
    document.head.appendChild(style)

    return () => {
      document.head.removeChild(style)
    }
  }, [])

  return null
}
