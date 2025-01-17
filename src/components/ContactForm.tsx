import React, { useState } from 'react';
import { ProjectSubmission } from '../types/project';

type ContactFormProps = {
  onSubmit: (contactInfo: ProjectSubmission['contactInfo']) => void;
  onCancel: () => void;
};

const ContactForm: React.FC<ContactFormProps> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-[#a49981] mb-1">
          Name *
        </label>
        <input
          type="text"
          id="name"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-3 py-2 bg-[#333] border border-accent/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent text-text"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-[#a49981] mb-1">
          Email *
        </label>
        <input
          type="email"
          id="email"
          required
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full px-3 py-2 bg-[#333] border border-accent/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent text-text"
        />
      </div>

      <div>
        <label htmlFor="company" className="block text-sm font-medium text-[#a49981] mb-1">
          Company
        </label>
        <input
          type="text"
          id="company"
          value={formData.company}
          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
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
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className="w-full px-3 py-2 bg-[#333] border border-accent/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent text-text"
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-text/70 hover:text-text transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-accent text-text rounded-lg font-semibold hover:bg-accent/90 transition-colors"
        >
          Book Meeting
        </button>
      </div>
    </form>
  );
};

export default ContactForm;
