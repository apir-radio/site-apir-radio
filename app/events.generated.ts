// Fichier généré depuis content/events.md. Ne pas le modifier directement.
export type ArchiveEvent = { month: string; specialty: string; speaker: string; hospital: string; label: string };

export type ArchiveSeason = { year: string; events: ArchiveEvent[] };

export type UpcomingEvent = { date: string; specialty: string; speaker: string; speakerHospital: string; venue: string; registrationUrl: string };

export const upcomingEvent: UpcomingEvent | null = {
  "date": "16 septembre 2026",
  "specialty": "Imagerie neurologique",
  "speaker": "Giacomo Lucchi",
  "speakerHospital": "Hôpital Bicêtre",
  "venue": "l’hôpital Saint-Joseph",
  "registrationUrl": "https://forms.gle/aAKgJAYqwx9rAGbo6"
};

export const archiveEvents: ArchiveSeason[] = [
  {
    "year": "2025 — 2026",
    "events": [
      {
        "month": "Mai",
        "specialty": "Imagerie tête et cou",
        "speaker": "Alexandre Faure",
        "hospital": "Hôpital Tenon",
        "label": "Mai · Imagerie tête et cou — Alexandre Faure, Hôpital Tenon"
      },
      {
        "month": "Avril",
        "specialty": "Imagerie gynécologique",
        "speaker": "Benjamin Fedida",
        "hospital": "Hôpital Tenon",
        "label": "Avril · Imagerie gynécologique — Benjamin Fedida, Hôpital Tenon"
      },
      {
        "month": "Mars",
        "specialty": "Imagerie ostéo-articulaire",
        "speaker": "Teodor Grand",
        "hospital": "Hôpital Européen Georges-Pompidou",
        "label": "Mars · Imagerie ostéo-articulaire — Teodor Grand, Hôpital Européen Georges-Pompidou"
      },
      {
        "month": "Février",
        "specialty": "Imagerie uro-néphrologique",
        "speaker": "Chloé Gallego",
        "hospital": "Hôpital Saint-Joseph",
        "label": "Février · Imagerie uro-néphrologique — Chloé Gallego, Hôpital Saint-Joseph"
      },
      {
        "month": "Janvier",
        "specialty": "Imagerie digestive",
        "speaker": "Mathilde Wagner",
        "hospital": "Hôpital Saint-Antoine",
        "label": "Janvier · Imagerie digestive — Mathilde Wagner, Hôpital Saint-Antoine"
      },
      {
        "month": "Novembre",
        "specialty": "Imagerie thoracique",
        "speaker": "Stéphane Tran Ba",
        "hospital": "Hôpital Avicenne",
        "label": "Novembre · Imagerie thoracique — Stéphane Tran Ba, Hôpital Avicenne"
      }
    ]
  },
  {
    "year": "2024 — 2025",
    "events": [
      {
        "month": "Mai",
        "specialty": "Imagerie ORL",
        "speaker": "Guillaume Poillon",
        "hospital": "Fondation Adolphe de Rothschild",
        "label": "Mai · Imagerie ORL — Guillaume Poillon, Fondation Adolphe de Rothschild"
      },
      {
        "month": "Avril",
        "specialty": "Imagerie ostéo-articulaire",
        "speaker": "Maxime Lacroix",
        "hospital": "HEGP",
        "label": "Avril · Imagerie ostéo-articulaire — Maxime Lacroix, HEGP"
      },
      {
        "month": "Mars",
        "specialty": "Imagerie gynécologique",
        "speaker": "Benjamin Fedida",
        "hospital": "Hôpital Tenon",
        "label": "Mars · Imagerie gynécologique — Benjamin Fedida, Hôpital Tenon"
      },
      {
        "month": "Février",
        "specialty": "Imagerie thoracique",
        "speaker": "Samia Boussouar",
        "hospital": "Pitié-Salpêtrière",
        "label": "Février · Imagerie thoracique — Samia Boussouar, Pitié-Salpêtrière"
      },
      {
        "month": "Janvier",
        "specialty": "Imagerie digestive",
        "speaker": "Aurélien Saltel-Fulero",
        "hospital": "HEGP",
        "label": "Janvier · Imagerie digestive — Aurélien Saltel-Fulero, HEGP"
      },
      {
        "month": "Décembre",
        "specialty": "Imagerie neurologique",
        "speaker": "Matthias Babin",
        "hospital": "Hôpital Bicêtre",
        "label": "Décembre · Imagerie neurologique — Matthias Babin, Hôpital Bicêtre"
      },
      {
        "month": "Novembre",
        "specialty": "Imagerie uro-néphrologique",
        "speaker": "Michel Dupuis",
        "hospital": "Pitié-Salpêtrière",
        "label": "Novembre · Imagerie uro-néphrologique — Michel Dupuis, Pitié-Salpêtrière"
      }
    ]
  },
  {
    "year": "2023 — 2024",
    "events": [
      {
        "month": "Juin",
        "specialty": "Imagerie digestive",
        "speaker": "Aurélien Saltel-Fulero",
        "hospital": "HEGP",
        "label": "Juin · Imagerie digestive — Aurélien Saltel-Fulero, HEGP"
      },
      {
        "month": "Mai",
        "specialty": "Radiologie interventionnelle",
        "speaker": "Lambros Tselikas",
        "hospital": "Gustave-Roussy",
        "label": "Mai · Radiologie interventionnelle — Lambros Tselikas, Gustave-Roussy"
      },
      {
        "month": "Avril",
        "specialty": "Imagerie tête et cou",
        "speaker": "Guillaume Poillon",
        "hospital": "Fondation Rothschild",
        "label": "Avril · Imagerie tête et cou — Guillaume Poillon, Fondation Rothschild"
      },
      {
        "month": "Mars",
        "specialty": "Imagerie cardio-vasculaire",
        "speaker": "Alban Redheuil",
        "hospital": "Pitié-Salpêtrière",
        "label": "Mars · Imagerie cardio-vasculaire — Alban Redheuil, Pitié-Salpêtrière"
      },
      {
        "month": "Février",
        "specialty": "Imagerie uro-néphrologique",
        "speaker": "Emmanuel Arama",
        "hospital": "Hôpital Béclère",
        "label": "Février · Imagerie uro-néphrologique — Emmanuel Arama, Hôpital Béclère"
      },
      {
        "month": "Janvier",
        "specialty": "Imagerie ostéo-articulaire",
        "speaker": "Raphaël Campagna",
        "hospital": "Hôpital Cochin",
        "label": "Janvier · Imagerie ostéo-articulaire — Raphaël Campagna, Hôpital Cochin"
      },
      {
        "month": "Novembre",
        "specialty": "Imagerie thoracique",
        "speaker": "Guillaume Chassagnon",
        "hospital": "Hôpital Cochin",
        "label": "Novembre · Imagerie thoracique — Guillaume Chassagnon, Hôpital Cochin"
      }
    ]
  }
];
