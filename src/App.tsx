import React from 'react';
import { Rocket } from 'lucide-react';
import ProjectScopeExplorer from './components/ProjectScopeExplorer';

export default function App() {
  return (
    <div className="min-h-screen bg-background text-text">
      <header className="border-b border-accent/20">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center space-x-3">
            <div className="bg-accent/10 p-2 rounded-lg">
              <Rocket className="w-8 h-8 text-accent" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Southleft Project Scope Explorer: Tailored Estimates for Your Digital Needs</h1>
              <p className="mt-1 text-text/70">
                Select services and receive an instant AI-powered estimate to guide your project journey.
              </p>
            </div>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-8">
        <ProjectScopeExplorer />
      </main>
      <footer className="border-t border-accent/20 py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="bg-accent/10 p-1.5 rounded-lg">
                <Rocket className="w-5 h-5 text-accent" />
              </div>
              <span className="font-semibold">Southleft</span>
            </div>
            <p className="text-sm text-text/70">
              © {new Date().getFullYear()} All rights reserved
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
