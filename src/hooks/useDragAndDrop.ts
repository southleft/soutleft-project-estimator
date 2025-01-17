import { useState } from 'react';
import { EstimateResult, ProjectContext } from '../types/project';
import { calculateEstimate } from '../utils/estimateCalculator';

export function useDragAndDrop(initialContext: ProjectContext) {
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [estimate, setEstimate] = useState<EstimateResult | null>(null);
  const [projectContext, setProjectContext] = useState<ProjectContext>(initialContext);

  const updateServicesAndEstimate = (newServices: string[]) => {
    setSelectedServices(newServices);
    setEstimate(calculateEstimate(newServices, projectContext));
  };

  const addService = (serviceId: string) => {
    const newServices = [...selectedServices, serviceId];
    updateServicesAndEstimate(newServices);
  };

  const removeService = (serviceId: string) => {
    const newServices = selectedServices.filter(id => id !== serviceId);
    updateServicesAndEstimate(newServices);
  };

  return {
    selectedServices,
    estimate,
    projectContext,
    setProjectContext: (context: ProjectContext) => {
      setProjectContext(context);
      setEstimate(calculateEstimate(selectedServices, context));
    },
    addService,
    removeService,
  };
}