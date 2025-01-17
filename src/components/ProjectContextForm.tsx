import React, { useState } from 'react';
import { ProjectContext } from '../types/project';
import { Plus, Minus, HelpCircle } from 'lucide-react';

type ProjectContextFormProps = {
  context: ProjectContext;
  onChange: (context: ProjectContext) => void;
};

const Tooltip: React.FC<{ text: string }> = ({ text }) => (
  <div className="absolute z-50 w-[280px] p-3 -translate-x-1/2 left-1/2 mt-2 text-sm bg-[#f3f1eb] text-[#333] border border-accent/20 rounded-lg shadow-lg whitespace-normal">
    {text}
  </div>
);

const LabelWithTooltip: React.FC<{ label: string; tooltip: string }> = ({ label, tooltip }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm font-medium text-text/90">{label}</span>
      <div className="relative inline-block">
        <button
          type="button"
          onClick={() => setShowTooltip(!showTooltip)}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          className="p-1 text-text/50 hover:text-accent focus:outline-none transition-colors"
          aria-label="More information"
        >
          <HelpCircle className="w-4 h-4" />
        </button>
        {showTooltip && <Tooltip text={tooltip} />}
      </div>
    </div>
  );
};

const ProjectContextForm: React.FC<ProjectContextFormProps> = ({ context, onChange }) => {
  const [showSystemIntegrationTooltip, setShowSystemIntegrationTooltip] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <LabelWithTooltip
          label="Tell us about your project"
          tooltip="Share your project vision and requirements to help us understand your needs better."
        />
        <textarea
          value={context.description}
          onChange={(e) => onChange({ ...context, description: e.target.value })}
          placeholder="Share your project vision and requirements..."
          className="mt-2 w-full h-32 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent text-text resize-none"
        />
      </div>

      <div>
        <LabelWithTooltip
          label="Project Complexity"
          tooltip="Evaluate your project's complexity for a tailored solution, from simple to intricate systems."
        />
        <input
          type="range"
          min="1"
          max="10"
          value={context.complexity}
          onChange={(e) => onChange({ ...context, complexity: parseInt(e.target.value) })}
          className="mt-2 w-full h-2 bg-accent/20 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-sm text-text/70 mt-1">
          <span>Simple</span>
          <span>Complex</span>
        </div>
      </div>

      <div>
        <LabelWithTooltip
          label="Timeline Priority"
          tooltip="Outline your timeline priorities to keep your project on track, whether urgent or flexible."
        />
        <select
          value={context.timeline}
          onChange={(e) => onChange({ ...context, timeline: e.target.value as ProjectContext['timeline'] })}
          className="mt-2 block w-full px-3 py-2 bg-[#333] border border-accent/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent text-text"
        >
          <option value="Urgent">Urgent</option>
          <option value="Normal">Normal</option>
          <option value="Flexible">Flexible</option>
        </select>
      </div>

      <div>
        <LabelWithTooltip
          label="API Integrations"
          tooltip="Specify the number of API integrations needed for seamless connectivity and enhanced functionality."
        />
        <div className="mt-2 flex items-center space-x-4">
          <button
            onClick={() => onChange({ ...context, apiIntegrations: Math.max(0, context.apiIntegrations - 1) })}
            className="p-2 rounded-md bg-accent/10 text-accent hover:bg-accent/20"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="text-lg font-medium w-8 text-center text-text">
            {context.apiIntegrations}
          </span>
          <button
            onClick={() => onChange({ ...context, apiIntegrations: context.apiIntegrations + 1 })}
            className="p-2 rounded-md bg-accent/10 text-accent hover:bg-accent/20"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div>
        <LabelWithTooltip
          label="Data Processing Volume"
          tooltip="Determine the volume of data processing required to customize your scalable solutions."
        />
        <select
          value={context.dataVolume}
          onChange={(e) => onChange({ ...context, dataVolume: e.target.value as ProjectContext['dataVolume'] })}
          className="mt-2 block w-full px-3 py-2 bg-[#333] border border-accent/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent text-text"
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      </div>

      <div>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={context.existingSystemIntegration}
            onChange={(e) => onChange({ ...context, existingSystemIntegration: e.target.checked })}
            className="mt-1 rounded border-accent/20 text-accent focus:ring-accent"
          />
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-text/90">Integration with existing systems required</span>
            <div className="relative inline-block">
              <button
                type="button"
                onClick={() => setShowSystemIntegrationTooltip(!showSystemIntegrationTooltip)}
                onMouseEnter={() => setShowSystemIntegrationTooltip(true)}
                onMouseLeave={() => setShowSystemIntegrationTooltip(false)}
                className="p-1 text-text/50 hover:text-accent focus:outline-none transition-colors"
                aria-label="More information"
              >
                <HelpCircle className="w-4 h-4" />
              </button>
              {showSystemIntegrationTooltip && (
                <Tooltip text="Indicate if integration with existing systems is required, ensuring compatibility and efficiency." />
              )}
            </div>
          </div>
        </div>
      </div>

      <div>
        <LabelWithTooltip
          label="Development Team Size"
          tooltip="Choose the ideal team size to match your project scope and delivery targets."
        />
        <select
          value={context.teamSize}
          onChange={(e) => onChange({ ...context, teamSize: e.target.value as ProjectContext['teamSize'] })}
          className="mt-2 block w-full px-3 py-2 bg-[#333] border border-accent/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent text-text"
        >
          <option value="Small">Small (1-3 developers)</option>
          <option value="Medium">Medium (4-7 developers)</option>
          <option value="Large">Large (8+ developers)</option>
        </select>
      </div>
    </div>
  );
};

export default ProjectContextForm;
