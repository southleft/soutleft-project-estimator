import React, { useState } from 'react';
import { EstimateResult as EstimateResultType, ProjectSubmission, Service } from '../types/project';
import { Clock, DollarSign, BarChart2, Lightbulb, Send } from 'lucide-react';
import ContactFormModal from './ContactFormModal';

type EstimateResultProps = {
  result: EstimateResultType;
  selectedServices: Service[];
  projectContext: ProjectSubmission['projectContext'];
};

const EstimateResult: React.FC<EstimateResultProps> = ({
  result,
  selectedServices,
  projectContext,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-background/50 border border-accent/20 p-6 rounded-lg hover:shadow-glow transition-all duration-300">
          <div className="flex items-start space-x-2 mb-2">
            <Clock className="w-6 h-6 text-accent" />
            <h3 className="font-semibold text-lg text-[#a49981]">Timeline</h3>
          </div>
          <p className="text-2xl font-bold text-text">{result.timelineRange}</p>
        </div>

        <div className="bg-background/50 border border-accent/20 p-6 rounded-lg hover:shadow-glow transition-all duration-300">
          <div className="flex items-start space-x-2 mb-2">
            <DollarSign className="w-6 h-6 text-accent" />
            <h3 className="font-semibold text-lg text-[#a49981]">Investment</h3>
          </div>
          <p className="text-2xl font-bold text-text">{result.investmentRange}</p>
        </div>

        <div className="bg-background/50 border border-accent/20 p-6 rounded-lg hover:shadow-glow transition-all duration-300">
          <div className="flex items-start space-x-2 mb-2">
            <BarChart2 className="w-6 h-6 text-accent" />
            <h3 className="font-semibold text-lg text-[#a49981]">Level of Effort</h3>
          </div>
          <p className="text-2xl font-bold text-text">{result.levelOfEffort}/10</p>
        </div>
      </div>

      <div className="bg-accent/10 border border-accent/20 p-6 rounded-lg hover:shadow-glow transition-all duration-300">
        <div className="flex items-start space-x-4">
          <div className="p-2 bg-accent/20 rounded-lg flex-shrink-0">
            <Lightbulb className="w-6 h-6 text-accent" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg mb-2 text-[#a49981]">Southleft AI Insights</h3>
            <p className="text-text/80">{result.aiInsight}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center">
        <button
          onClick={() => setIsModalOpen(true)}
          className="o-button"
        >
          <span data-text="Book a Meeting to Discuss Your Estimate">Book a Meeting to Discuss Your Estimate</span>
        </button>
      </div>

      <ContactFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        projectData={{
          selectedServices,
          projectContext,
          estimateResult: result,
        }}
      />
    </div>
  );
};

export default EstimateResult;
