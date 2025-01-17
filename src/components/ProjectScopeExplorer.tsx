import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { services } from '../data/services';
import ServiceCard from './DraggableService';
import ProjectContextForm from './ProjectContextForm';
import EstimateResult from './EstimateResult';
import type { ProjectContext, EstimateResult as EstimateResultType } from '../types/project';
import { MoveHorizontal, X } from 'lucide-react';

const initialProjectContext: ProjectContext = {
  complexity: 5,
  timeline: 'Normal',
  apiIntegrations: 0,
  dataVolume: 'Medium',
  existingSystemIntegration: false,
  teamSize: 'Small',
  description: '',
};

const calculateEstimate = (
  selectedServices: string[],
  context: ProjectContext
): EstimateResultType => {
  const baseTimePerService = 2;
  const totalServices = selectedServices.length;

  let timelineMultiplier = context.timeline === 'Urgent' ? 0.8 : context.timeline === 'Flexible' ? 1.2 : 1;
  let baseTime = totalServices * baseTimePerService;
  let minWeeks = Math.max(4, Math.round(baseTime * timelineMultiplier * 0.8));
  let maxWeeks = Math.round(baseTime * timelineMultiplier * 1.2);

  const baseRate = 15000;
  let investmentMultiplier = 1 + (context.complexity - 5) * 0.1;
  let minInvestment = Math.round((baseRate * totalServices * investmentMultiplier * 0.9) / 1000) * 1000;
  let maxInvestment = Math.round((baseRate * totalServices * investmentMultiplier * 1.1) / 1000) * 1000;

  let complexityRating = Math.min(
    10,
    Math.round(
      (context.complexity +
        totalServices +
        context.apiIntegrations * 0.5 +
        (context.dataVolume === 'High' ? 2 : context.dataVolume === 'Medium' ? 1 : 0) +
        (context.existingSystemIntegration ? 1 : 0)) /
        2
    )
  );

  const insights = [
    `Based on your selections, we recommend a ${
      context.teamSize === 'Small' ? 'focused agile team' : 'scaled agile approach'
    }.`,
    `This project's complexity suggests ${
      complexityRating > 7 ? 'a phased delivery approach' : 'an iterative development cycle'
    } would be optimal.`,
    `With the current scope, we can deliver impactful results within the estimated timeline.`,
  ];

  return {
    timelineRange: `${minWeeks}-${maxWeeks} weeks`,
    investmentRange: `$${(minInvestment / 1000).toFixed(0)}k-${(maxInvestment / 1000).toFixed(0)}k`,
    complexityRating,
    aiInsight: insights[Math.floor(Math.random() * insights.length)],
  };
};

const ProjectScopeExplorer: React.FC = () => {
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [projectContext, setProjectContext] = useState<ProjectContext>(initialProjectContext);
  const [estimate, setEstimate] = useState<EstimateResultType | null>(null);

  const handleAddService = (serviceId: string) => {
    if (!selectedServices.includes(serviceId)) {
      const newSelectedServices = [...selectedServices, serviceId];
      setSelectedServices(newSelectedServices);
      setEstimate(calculateEstimate(newSelectedServices, projectContext));
    }
  };

  const removeService = (serviceId: string) => {
    const newSelectedServices = selectedServices.filter((id) => id !== serviceId);
    setSelectedServices(newSelectedServices);
    setEstimate(calculateEstimate(newSelectedServices, projectContext));
  };

  const handleContextChange = (newContext: ProjectContext) => {
    setProjectContext(newContext);
    setEstimate(calculateEstimate(selectedServices, newContext));
  };

  const handleContactUs = () => {
    alert('Thank you for your interest! Our team will contact you shortly.');
  };

  return (
    <div className="flex flex-col space-y-8 gap-20">
      {/* Main Content Grid - Always First on Mobile */}
      <div className="order-1 md:order-2">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Available Services Column */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-text/90">Available Services</h3>
            <div className="space-y-6">
              {services.map((category) => (
                <div key={category.category}>
                  <h4 className="text-sm font-medium text-text/70 mb-2">
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
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-text/90">Selected Services</h3>
            <div
              className={`min-h-[400px] rounded-lg border-2 border-dashed
                ${
                  selectedServices.length === 0
                    ? 'border-accent/40 bg-accent/5'
                    : 'border-accent bg-accent/10'
                }
                p-4 space-y-3`}
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
                    <MoveHorizontal className="w-12 h-12 mx-auto mb-2" />
                    <p>Drag services here</p>
                  </div>
                </div>
              ) : (
                <AnimatePresence>
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
                </AnimatePresence>
              )}
            </div>
          </div>

          {/* Project Details Column */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-text/90">Project Details</h3>
            <ProjectContextForm context={projectContext} onChange={handleContextChange} />
          </div>
        </div>
      </div>

      {/* Estimate Section - Last on Mobile, First on Desktop */}
      {estimate && selectedServices.length > 0 && (
        <div className="order-2 md:order-1">
          <h2 className="text-xl font-semibold text-text/90 mb-4">Estimated Services</h2>
          <EstimateResult result={estimate} onContactUs={handleContactUs} />
        </div>
      )}
    </div>
  );
};

export default ProjectScopeExplorer;
