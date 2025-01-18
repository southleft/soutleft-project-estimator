import React from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useForm, ValidationError } from '@formspree/react';
import { X } from 'lucide-react';
import { ProjectSubmission } from '../types/project';
import { Fragment } from 'react';

type ContactFormModalProps = {
  isOpen: boolean;
  onClose: () => void;
  projectData: Omit<ProjectSubmission, 'contactInfo' | 'submittedAt'>;
};

const ContactFormModal: React.FC<ContactFormModalProps> = ({ isOpen, onClose, projectData }) => {
  const [state, handleSubmit] = useForm("xqaaowvp");

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/70" aria-hidden="true" />
        </Transition.Child>

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="mx-auto max-w-lg w-full bg-background rounded-lg shadow-xl">
              <div className="relative p-6">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-1 rounded-md hover:bg-accent/10 text-text/70 hover:text-accent"
                >
                  <X className="w-5 h-5" />
                </button>

                <Dialog.Title className="text-xl font-semibold text-[#a49981] mb-6">
                  {state.succeeded ? 'Thank You!' : 'Book a Meeting to Discuss Your Estimate'}
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
                  <form onSubmit={handleSubmit} className="space-y-10">
                    <div className="o-field flex-wrap">
                      <input
                        id="name"
                        type="text"
                        name="name"
                        placeholder="Name"
                        required
                      />
                      <label htmlFor="name">Name<span>*</span></label>
                      <ValidationError prefix="Name" field="name" errors={state.errors} />
                    </div>

                    <div className="o-field flex-wrap">
                      <input
                        id="email"
                        type="email"
                        name="email"
                        placeholder="Email"
                        required
                      />
                      <label htmlFor="email">Email<span>*</span></label>
                      <ValidationError prefix="Email" field="email" errors={state.errors} />
                    </div>

                    <div className="o-field flex-wrap">
                      <input
                        id="company"
                        type="text"
                        name="company"
                        placeholder="Company"
                      />
                      <label htmlFor="company">Company</label>
                    </div>

                    <div className="o-field flex-wrap">
                      <input
                        id="phone"
                        type="tel"
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
                      <ValidationError prefix="Message" field="message" errors={state.errors} />
                    </div>

                    {/* Project Data Fields */}
                    <input type="hidden" name="selected_services" value={projectData.selectedServices.map(service => `${service.category}: ${service.title}`).join('\n')} />
                    <input type="hidden" name="timeline" value={projectData.estimateResult.timelineRange} />
                    <input type="hidden" name="investment" value={projectData.estimateResult.investmentRange} />
                    <input type="hidden" name="complexity_rating" value={projectData.estimateResult.complexityRating.toString()} />
                    <input type="hidden" name="ai_insight" value={projectData.estimateResult.aiInsight} />
                    <input type="hidden" name="timeline_priority" value={projectData.projectContext.timeline} />
                    <input type="hidden" name="data_volume" value={projectData.projectContext.dataVolume} />
                    <input type="hidden" name="team_size" value={projectData.projectContext.teamSize} />
                    <input type="hidden" name="system_integration" value={projectData.projectContext.systemIntegration ? 'Yes' : 'No'} />
                    <input type="hidden" name="api_integrations" value={projectData.projectContext.apiIntegrations.toString()} />
                    <input type="hidden" name="project_complexity" value={`${projectData.projectContext.complexity}/10`} />
                    {projectData.projectContext.description && (
                      <input type="hidden" name="project_description" value={projectData.projectContext.description} />
                    )}

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
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ContactFormModal;
