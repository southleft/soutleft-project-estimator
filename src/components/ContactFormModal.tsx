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
                <p className="text-text/70 mb-6">
                  We'll be in touch shortly to discuss your project in detail. <br />Feel free to book your meeting now to begin the conversation.
                </p>
                <a
                  href="https://calendly.com/tpitre/30min"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="o-button inline-block"
                >
                  <span data-text="Schedule Meeting Now">Schedule Meeting Now</span>
                </a>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-10">
                <div className="o-field flex-wrap">
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Name"
                    required
                  />
                  <label htmlFor="name">Name<span>*</span></label>
                  <ValidationError
                    prefix="Name"
                    field="name"
                    errors={state.errors}
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                <div className="o-field flex-wrap">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Email"
                    required
                  />
                  <label htmlFor="email">Email<span>*</span></label>
                  <ValidationError
                    prefix="Email"
                    field="email"
                    errors={state.errors}
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                <div className="o-field flex-wrap">
                  <input
                    type="text"
                    id="company"
                    name="company"
                    placeholder="Company"
                  />
                  <label htmlFor="company">Company</label>
                </div>

                <div className="o-field flex-wrap">
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    placeholder="Phone"
                  />
                  <label htmlFor="phone">Phone</label>
                </div>

                <div className="o-field flex-wrap">
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    placeholder=" "
                    className="px-5 py-4"
                  />
                  <label htmlFor="message">Additional Notes</label>
                  <ValidationError
                    prefix="Message"
                    field="message"
                    errors={state.errors}
                    className="text-red-500 text-sm mt-1"
                  />
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
                    className="o-button"
                  >
                    <span data-text="Cancel">Cancel</span>
                  </button>
                  <button
                    type="submit"
                    disabled={state.submitting}
                    className="o-button"
                  >
                    <span data-text="Request Review">Request Review</span>
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
