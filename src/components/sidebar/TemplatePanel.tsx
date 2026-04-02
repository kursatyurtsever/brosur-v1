
'use client';

import { useEffect, useState } from 'react';
import { getAvailableTemplates } from '@/services/templateService';
import { useDocStore } from '@/store/useDocStore';
import type { Template } from '@/types';

export function TemplatePanel() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const loadTemplate = useDocStore((state) => state.loadTemplate);

  useEffect(() => {
    // Servisten şablonları çek
    const allTemplates = getAvailableTemplates();
    setTemplates(allTemplates);
  }, []);

  const handleTemplateSelect = (templateId: string) => {
    if (confirm('Mevcut çalışmanızın üzerine bu şablon yüklenecektir. Emin misiniz?')) {
      loadTemplate(templateId);
    }
  };

  return (
    <aside className="w-64 bg-gray-800 p-4 shrink-0">
      <h2 className="text-lg font-bold mb-4">Şablonlar</h2>
      <ul className="space-y-2">
        {templates.map((template) => (
          <li key={template.id}>
            <button
              onClick={() => handleTemplateSelect(template.id)}
              className="w-full text-left p-2 bg-gray-700 hover:bg-gray-600 rounded"
            >
              {template.name}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}


