import React from 'react';
import { EstimateResult as EstimateResultType } from '../types/project';
import { Clock, DollarSign, BarChart2, Lightbulb, Send } from 'lucide-react';

type EstimateResultProps = {
  result: EstimateResultType;
  onContactUs: () => void;
};

const EstimateResult: React.FC<EstimateResultProps> = ({ result, onContactUs }) => {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-background/50 border border-accent/20 p-6 rounded-lg hover:shadow-glow transition-all duration-300">
          <div className="flex items-center space-x-2 mb-4">
            <Clock className="w-6 h-6 text-accent" />
            <h3 className="font-semibold text-lg text-text">Timeline</h3>
          </div>
          <p className="text-2xl font-bold text-text">{result.timelineRange}</p>
        </div>

        <div className="bg-background/50 border border-accent/20 p-6 rounded-lg hover:shadow-glow transition-all duration-300">
          <div className="flex items-center space-x-2 mb-4">
            <DollarSign className="w-6 h-6 text-accent" />
            <h3 className="font-semibold text-lg text-text">Investment</h3>
          </div>
          <p className="text-2xl font-bold text-text">{result.investmentRange}</p>
        </div>

        <div className="bg-background/50 border border-accent/20 p-6 rounded-lg hover:shadow-glow transition-all duration-300">
          <div className="flex items-center space-x-2 mb-4">
            <BarChart2 className="w-6 h-6 text-accent" />
            <h3 className="font-semibold text-lg text-text">Complexity</h3>
          </div>
          <div className="flex items-center space-x-2">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className={`w-4 h-4 rounded-full ${
                  i < Math.round(result.complexityRating / 2)
                    ? 'bg-accent'
                    : 'bg-accent/20'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="bg-accent/10 border border-accent/20 p-6 rounded-lg hover:shadow-glow transition-all duration-300">
        <div className="flex items-start space-x-4">
          <div className="p-2 bg-accent/20 rounded-lg">
            <Lightbulb className="w-6 h-6 text-accent" />
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-2 text-text">Southleft AI Insight</h3>
            <p className="text-text/80">{result.aiInsight}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center">
        <button
          onClick={onContactUs}
          className="px-8 py-4 bg-accent text-text rounded-lg font-semibold hover:bg-accent/90 transition-colors flex items-center space-x-2 hover:shadow-glow transition-all duration-300"
        >
          <Send className="w-5 h-5" />
          <span>Receive Your Custom AI Estimate</span>
        </button>
        <p className="mt-3 text-sm text-text/70 text-center">
          Powered by Southleft AI, receive a personalized estimate that aligns with your project's needs and goals.
        </p>
      </div>
    </div>
  );
};

export default EstimateResult;
