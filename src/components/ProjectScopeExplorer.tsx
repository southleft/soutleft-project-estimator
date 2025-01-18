import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { services } from '../data/services';
import ServiceCard from './DraggableService';
import ProjectContextForm from './ProjectContextForm';
import EstimateResult from './EstimateResult';
import type { ProjectContext, EstimateResult as EstimateResultType } from '../types/project';
import { MoveHorizontal, X } from 'lucide-react';
import { generateEstimate } from '../utils/openai';

const initialProjectContext: ProjectContext = {
  complexity: 5,
  timeline: 'Normal',
  dataVolume: 'Medium',
  teamSize: 'Small',
  systemIntegration: false,
  apiIntegrations: 0,
  description: '',
};

const ProjectScopeExplorer: React.FC = () => {
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [projectContext, setProjectContext] = useState<ProjectContext>(initialProjectContext);
  const [estimate, setEstimate] = useState<EstimateResultType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddService = async (serviceId: string) => {
    if (!selectedServices.includes(serviceId)) {
      const newSelectedServices = [...selectedServices, serviceId];
      setSelectedServices(newSelectedServices);
      await updateEstimate(newSelectedServices, projectContext);
    }
  };

  const removeService = async (serviceId: string) => {
    const newSelectedServices = selectedServices.filter((id) => id !== serviceId);
    setSelectedServices(newSelectedServices);
    await updateEstimate(newSelectedServices, projectContext);
  };

  const handleContextChange = async (newContext: ProjectContext) => {
    setProjectContext(newContext);
    await updateEstimate(selectedServices, newContext);
  };

  const updateEstimate = async (services: string[], context: ProjectContext) => {
    if (services.length === 0) {
      setEstimate(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await generateEstimate(services, context);
      setEstimate(result);
    } catch (err) {
      setError('Failed to generate estimate. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleContactUs = () => {
    alert('Thank you for your interest! Our team will contact you shortly.');
  };

  return (
    <div className="flex flex-col space-y-8 gap-8">
      {/* Estimate Section */}
      <AnimatePresence>
        {(estimate || isLoading) && selectedServices.length > 0 && (
          <motion.div
            className="order-2 md:order-1"
            initial={{ opacity: 0, height: 0, y: -20 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {isLoading ? (
              <div className="flex items-center justify-center p-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
              </div>
            ) : error ? (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500">
                {error}
              </div>
            ) : (
              estimate && (
                <EstimateResult
                  result={estimate}
                  selectedServices={services
                    .flatMap(category =>
                      category.items.map(item => ({
                        ...item,
                        category: category.category
                      }))
                    )
                    .filter(service => selectedServices.includes(service.id))}
                  projectContext={projectContext}
                />
              )
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Grid */}
      <div className="order-1 md:order-2">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Available Services Column */}
          <div className="flex flex-col h-full space-y-4">
            <h3 className="text-lg font-semibold text-[#a49981]">Available Services</h3>
            <div className="flex-1 overflow-y-auto pr-2 space-y-6">
              {services.map((category) => (
                <div key={category.category}>
                  <h4 className="text-sm font-medium text-[#a49981] mb-2 sticky top-0 backdrop-blur-sm py-2">
                    {category.category}
                  </h4>
                  <div className="space-y-3">
                    {category.items
                      .filter((service) => !selectedServices.includes(service.id))
                      .map((service) => (
                        <ServiceCard
                          key={service.id}
                          id={service.id}
                          title={service.title}
                          description={service.description}
                          icon={service.icon}
                          onAdd={handleAddService}
                        />
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Selected Services Column */}
          <div className="flex flex-col h-full space-y-4">
            <h3 className="text-lg font-semibold text-[#a49981]">Selected Services</h3>
            <div
              className={`flex-1 rounded-lg border-2 border-dashed
                ${
                  selectedServices.length === 0
                    ? 'border-accent/40 bg-accent/5'
                    : 'border-accent bg-accent/10'
                }
                p-4 overflow-y-auto`}
              onDragOver={(e) => {
                e.preventDefault();
                e.currentTarget.classList.add('border-accent', 'bg-accent/20');
              }}
              onDragLeave={(e) => {
                e.preventDefault();
                e.currentTarget.classList.remove('border-accent', 'bg-accent/20');
              }}
              onDrop={(e) => {
                e.preventDefault();
                const serviceId = e.dataTransfer.getData('text/plain');
                handleAddService(serviceId);
                e.currentTarget.classList.remove('border-accent', 'bg-accent/20');
              }}
            >
              {selectedServices.length === 0 ? (
                <div className="h-full flex items-center justify-center text-text/50">
                  <div className="text-center">
                    <MoveHorizontal className="w-12 h-12 mx-auto mb-2 hidden md:block" />
                    <p className="hidden md:block">Drag services here</p>
                    <p className="md:hidden">Tap the + icon to add services</p>
                  </div>
                </div>
              ) : (
                <AnimatePresence>
                  <div className="space-y-3">
                    {selectedServices.map((serviceId) => {
                      const service = services
                        .flatMap((cat) => cat.items)
                        .find((s) => s.id === serviceId);
                      if (!service) return null;

                      return (
                        <motion.div
                          key={service.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                        >
                          <div className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-accent/20">
                            <span className="text-text">{service.title}</span>
                            <button
                              onClick={() => removeService(service.id)}
                              className="p-1 rounded-md hover:bg-accent/10 text-text/70 hover:text-accent"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </AnimatePresence>
              )}
            </div>
          </div>

          {/* Project Details Column */}
          <div className="flex flex-col h-full space-y-4">
            <h3 className="text-lg font-semibold text-[#a49981]">Project Details</h3>
            <div className="flex-1">
              <ProjectContextForm context={projectContext} onChange={handleContextChange} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectScopeExplorer;
