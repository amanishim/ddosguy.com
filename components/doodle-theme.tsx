export default function DoodleTheme() {
  return (
    <style jsx global>{`
      :root {
        --paper: #FEFCF3;
        --ink: #2d2d2d;
        --accent: #FFD100;
      }
      html, body {
        background: var(--paper);
        color: var(--ink);
      }
      .font-heading {
        font-family: var(--font-caveat, Caveat), ui-rounded, "Comic Sans MS", system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial;
        font-weight: 700;
      }
      .nav-link {
        position: relative;
        font-weight: 600;
      }
      .nav-link:hover {
        text-decoration: underline;
        text-underline-offset: 4px;
      }
      .mobile-link {
        display: block;
        padding: 12px;
        font-weight: 600;
      }
      /* Doodle Border */
      .doodle-border {
        border: 2px solid var(--ink);
        border-radius: 15px 5px 20px 10px / 10px 20px 5px 15px;
        background: var(--paper);
        transition: transform 120ms ease, box-shadow 120ms ease;
      }
      .doodle-border:hover {
        transform: translate(-2px, -2px);
        box-shadow: 5px 5px 0px var(--accent);
      }
      /* Doodle Button */
      .doodle-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        padding: 0.625rem 1rem;
        border: 2px solid var(--ink);
        border-radius: 15px 5px 20px 10px / 10px 20px 5px 15px;
        background: white;
        color: var(--ink);
        font-weight: 800;
        text-decoration: none;
        box-shadow: 3px 3px 0px var(--ink);
        transition: transform 120ms ease, box-shadow 120ms ease, background-color 120ms ease;
      }
      .doodle-btn:hover {
        transform: translate(2px, 2px);
        box-shadow: 0 0 0 transparent;
      }
      .doodle-btn--accent {
        background: var(--accent);
      }
      /* Doodle Underline */
      .doodle-underline {
        position: relative;
        display: inline-block;
        padding: 0 0.15em;
      }
      .doodle-underline::after {
        content: "";
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0.08em;
        height: 0.45em;
        background: var(--accent);
        border-radius: 8px;
        transform: rotate(-1.2deg);
        z-index: -1;
        box-shadow: 0 1px 0 rgba(0,0,0,0.05);
      }
      /* Inputs */
      .doodle-input {
        border: 2px solid var(--ink);
        border-radius: 10px 8px 12px 5px / 8px 12px 5px 10px;
        transition: box-shadow 150ms ease, transform 150ms ease;
      }
      .doodle-input:focus {
        outline: none;
        box-shadow: 5px 5px 0px var(--accent);
      }
      /* Loader */
      .loader {
        border: 4px solid #f3f3f3;
        border-top: 4px solid var(--accent);
        border-radius: 50%;
        width: 48px;
        height: 48px;
        animation: spin 1s linear infinite;
      }
      @keyframes spin { 
        0% { transform: rotate(0deg); } 
        100% { transform: rotate(360deg); } 
      }

      /* Print-friendly tweak */
      @media print {
        .no-print { display: none !important; }
        body { background: white !important; }
        .doodle-border:hover, .doodle-btn:hover { box-shadow: none !important; transform: none !important; }
      }
    `}</style>
  )
}
