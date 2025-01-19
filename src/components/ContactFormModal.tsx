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

        <div className="fixed inset-0 flex items-start md:items-center justify-center p-4 overflow-y-auto">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="mx-auto w-full max-w-lg bg-background rounded-lg shadow-xl my-4 md:my-8">
              <div className="relative p-4 md:p-6">
                <button
                  onClick={onClose}
                  className="absolute top-2 right-2 md:top-4 md:right-4 p-1 rounded-md hover:bg-accent/10 text-text/70 hover:text-accent"
                >
                  <X className="w-5 h-5" />
                </button>

                <Dialog.Title className="text-lg md:text-xl font-semibold text-[#a49981] mb-4 md:mb-6 pr-8">
                  {state.succeeded ? 'Thank You!' : 'Book a Meeting to Discuss Your Estimate'}
                </Dialog.Title>

                {state.succeeded ? (
                  <div className="text-center py-4 md:py-8">
                    <h3 className="text-base md:text-lg font-semibold text-text mb-2">Thank you for your interest!</h3>
                    <p className="text-sm md:text-base text-text/70 mb-4 md:mb-6">
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
                  <form onSubmit={handleSubmit} className="space-y-6 md:space-y-10">
                    <div className="o-field flex-wrap">
                      <input
                        id="name"
                        type="text"
                        name="name"
                        placeholder="Name"
                        required
                        className="text-base md:text-base"
                      />
                      <label htmlFor="name" className="text-sm md:text-base">Name<span>*</span></label>
                      <ValidationError prefix="Name" field="name" errors={state.errors} />
                    </div>

                    <div className="o-field flex-wrap">
                      <input
                        id="email"
                        type="email"
                        name="email"
                        placeholder="Email"
                        required
                        className="text-base md:text-base"
                      />
                      <label htmlFor="email" className="text-sm md:text-base">Email<span>*</span></label>
                      <ValidationError prefix="Email" field="email" errors={state.errors} />
                    </div>

                    <div className="o-field flex-wrap">
                      <input
                        id="company"
                        type="text"
                        name="company"
                        placeholder="Company"
                        className="text-base md:text-base"
                      />
                      <label htmlFor="company" className="text-sm md:text-base">Company</label>
                    </div>

                    <div className="o-field flex-wrap">
                      <input
                        id="phone"
                        type="tel"
                        name="phone"
                        placeholder="Phone"
                        className="text-base md:text-base"
                      />
                      <label htmlFor="phone" className="text-sm md:text-base">Phone</label>
                    </div>
                    <div className="space-y-6">
                      <div className="o-field flex-wrap">
                        <textarea
                          id="message"
                          name="message"
                          rows={3}
                          placeholder=" "
                          className="px-4 py-3 md:px-5 md:py-4 text-base md:text-base"
                        />
                        <label htmlFor="message" className="text-sm md:text-base">Additional Notes</label>
                        <ValidationError prefix="Message" field="message" errors={state.errors} />
                      </div>

                      <input type="hidden" name="selected_services" value={projectData.selectedServices.map(service => `${service.category}: ${service.title}`).join('\n')} />
                      <input type="hidden" name="timeline" value={projectData.estimateResult.timelineRange} />
                      <input type="hidden" name="investment" value={projectData.estimateResult.investmentRange} />
                      <input type="hidden" name="level_of_effort" value={projectData.estimateResult.levelOfEffort.toString()} />
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

                      <div className="flex justify-end space-x-3">
                        <button
                          type="button"
                          onClick={onClose}
                          className="o-button text-sm md:text-base"
                        >
                          <span data-text="Cancel">Cancel</span>
                        </button>
                        <button
                          type="submit"
                          disabled={state.submitting}
                          className="o-button text-sm md:text-base"
                        >
                          <span data-text="Request Review">Request Review</span>
                        </button>
                      </div>
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
