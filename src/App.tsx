import React from 'react';
import ProjectScopeExplorer from './components/ProjectScopeExplorer';

export default function App() {
  return (
    <div className="min-h-screen text-text">
      <header className="border-b border-accent/20">
        <div className="py-6">
          <h2 className="o-heading o-heading--md">Southleft Project Scope Explorer: Tailored Estimates for Your Digital Needs</h2>
          <p className="text-text/70">
            Select services and receive an instant AI-powered estimate to guide your project journey.
          </p>
        </div>
      </header>
      <main className="py-8">
        <ProjectScopeExplorer />
      </main>
      <footer className="border-t border-accent/20 py-8 mt-16">
        <div className="flex items-center justify-between">
          <span className="font-semibold">Southleft</span>
          <p className="text-sm text-text/70">
            © {new Date().getFullYear()} All rights reserved
          </p>
        </div>
      </footer>
    </div>
  );
}
