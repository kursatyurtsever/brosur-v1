import { Template } from "@/types";

const sampleTemplates: Template[] = [
  {
    id: "template-1",
    name: "Standart A4 Broşür",
    layout: {
      gap: 1,
      footerHeightMm: 15,
    },
    printSpec: {
      bleed: 2,
    },
    surfaces: [
      {
        name: 'Ön Yüz',
        pages: [
          { pageNumber: 1, widthMm: 210, heightMm: 297, safeZone: [10, 10, 10, 10], freeRowsTop: 0 },
        ]
      },
      {
        name: 'Arka Yüz',
        pages: [
          { pageNumber: 2, widthMm: 210, heightMm: 297, safeZone: [10, 10, 10, 10], freeRowsTop: 0 },
        ]
      }
    ]
  },
  {
    id: "template-4",
    name: "Özel Katlamalı Broşür",
    surfaces: [
      {
        name: 'Dış Yüz',
        pages: [
          { pageNumber: 5, widthMm: 209, heightMm: 297, safeZone: [10, 5, 10, 10], freeRowsTop: 0 },
          { pageNumber: 6, widthMm: 210, heightMm: 297, safeZone: [10, 5, 10, 5], freeRowsTop: 0 },
          { pageNumber: 1, widthMm: 212, heightMm: 297, safeZone: [10, 10, 10, 5], freeRowsTop: 0 },
        ]
      },
      {
        name: 'İç Yüz',
        pages: [
          { pageNumber: 2, widthMm: 212, heightMm: 297, safeZone: [10, 5, 10, 10], freeRowsTop: 0 },
          { pageNumber: 3, widthMm: 210, heightMm: 297, safeZone: [10, 5, 10, 5], freeRowsTop: 0 },
          { pageNumber: 4, widthMm: 209, heightMm: 297, safeZone: [10, 10, 10, 5], freeRowsTop: 0 }
        ]
      }
    ]
  },
];

export const getAvailableTemplates = (): Template[] => {
  return sampleTemplates;
};
