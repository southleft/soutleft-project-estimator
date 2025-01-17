import React from 'react';
import { Dialog } from '@headlessui/react';
import { useForm, ValidationError } from '@formspree/react';
import { X } from 'lucide-react';
import { ProjectSubmission } from '../types/project';

type ContactFormModalProps = {
  isOpen: boolean;
  onClose: () => void;
  projectData: Omit<ProjectSubmission, 'contactInfo' | 'submittedAt'>;
};

const ContactFormModal: React.FC<ContactFormModalProps> = ({ isOpen, onClose, projectData }) => {
  const [state, handleSubmit] = useForm("xqaaowvp");

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    // Add formatted project details
    formData.append('Selected Services', projectData.selectedServices.map(service =>
      `${service.category}: ${service.title}`
    ).join('\n'));

    formData.append('Timeline', projectData.estimateResult.timelineRange);
    formData.append('Investment', projectData.estimateResult.investmentRange);
    formData.append('Complexity Rating', projectData.estimateResult.complexityRating.toString());
    formData.append('AI Insight', projectData.estimateResult.aiInsight);

    // Add project context
    formData.append('Project Timeline Priority', projectData.projectContext.timeline);
    formData.append('Data Volume', projectData.projectContext.dataVolume);
    formData.append('Team Size', projectData.projectContext.teamSize);
    formData.append('System Integration Required', projectData.projectContext.systemIntegration ? 'Yes' : 'No');
    formData.append('Number of API Integrations', projectData.projectContext.apiIntegrations.toString());
    formData.append('Project Complexity', `${projectData.projectContext.complexity}/10`);

    if (projectData.projectContext.description) {
      formData.append('Project Description', projectData.projectContext.description);
    }

    // Also include raw data for reference
    formData.append('_rawProjectData', JSON.stringify({
      selectedServices: projectData.selectedServices,
      projectContext: projectData.projectContext,
      estimateResult: projectData.estimateResult,
      submittedAt: new Date().toISOString(),
    }));

    await handleSubmit(e);
    if (state.succeeded) {
      onClose();
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/70" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-lg w-full bg-background rounded-lg shadow-xl">
          <div className="relative p-6">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1 rounded-md hover:bg-accent/10 text-text/70 hover:text-accent"
            >
              <X className="w-5 h-5" />
            </button>

            <Dialog.Title className="text-xl font-semibold text-[#a49981] mb-6">
              Book a Meeting to Discuss Your Estimate
            </Dialog.Title>

            {state.succeeded ? (
              <div className="text-center py-8">
                <h3 className="text-lg font-semibold text-text mb-2">Thank you for your interest!</h3>
                <p className="text-text/70">
                  We'll be in touch shortly to schedule a meeting and discuss your project in detail.
                </p>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-[#a49981] mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    className="w-full px-3 py-2 bg-[#333] border border-accent/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent text-text"
                  />
                  <ValidationError prefix="Name" field="name" errors={state.errors} />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-[#a49981] mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full px-3 py-2 bg-[#333] border border-accent/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent text-text"
                  />
                  <ValidationError prefix="Email" field="email" errors={state.errors} />
                </div>

                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-[#a49981] mb-1">
                    Company
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    className="w-full px-3 py-2 bg-[#333] border border-accent/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent text-text"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-[#a49981] mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className="w-full px-3 py-2 bg-[#333] border border-accent/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent text-text"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-[#a49981] mb-1">
                    Additional Notes
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={3}
                    className="w-full px-3 py-2 bg-[#333] border border-accent/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent text-text resize-none"
                  />
                  <ValidationError prefix="Message" field="message" errors={state.errors} />
                </div>

                {/* Hidden fields for project data */}
                <input
                  type="hidden"
                  name="selected_services"
                  value={projectData.selectedServices.map(service =>
                    `${service.category}: ${service.title}`
                  ).join('\n')}
                />
                <input
                  type="hidden"
                  name="timeline"
                  value={projectData.estimateResult.timelineRange}
                />
                <input
                  type="hidden"
                  name="investment"
                  value={projectData.estimateResult.investmentRange}
                />
                <input
                  type="hidden"
                  name="complexity_rating"
                  value={projectData.estimateResult.complexityRating.toString()}
                />
                <input
                  type="hidden"
                  name="ai_insight"
                  value={projectData.estimateResult.aiInsight}
                />
                <input
                  type="hidden"
                  name="timeline_priority"
                  value={projectData.projectContext.timeline}
                />
                <input
                  type="hidden"
                  name="data_volume"
                  value={projectData.projectContext.dataVolume}
                />
                <input
                  type="hidden"
                  name="team_size"
                  value={projectData.projectContext.teamSize}
                />
                <input
                  type="hidden"
                  name="system_integration"
                  value={projectData.projectContext.systemIntegration ? 'Yes' : 'No'}
                />
                <input
                  type="hidden"
                  name="api_integrations"
                  value={projectData.projectContext.apiIntegrations.toString()}
                />
                <input
                  type="hidden"
                  name="project_complexity"
                  value={`${projectData.projectContext.complexity}/10`}
                />
                {projectData.projectContext.description && (
                  <input
                    type="hidden"
                    name="project_description"
                    value={projectData.projectContext.description}
                  />
                )}
                <input
                  type="hidden"
                  name="raw_project_data"
                  value={JSON.stringify({
                    selectedServices: projectData.selectedServices,
                    projectContext: projectData.projectContext,
                    estimateResult: projectData.estimateResult,
                    submittedAt: new Date().toISOString(),
                  })}
                />

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-text/70 hover:text-text transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={state.submitting}
                    className="px-4 py-2 bg-accent text-text rounded-lg font-semibold hover:bg-accent/90 transition-colors disabled:opacity-50"
                  >
                    Book Meeting
                  </button>
                </div>
              </form>
            )}
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default ContactFormModal;
