// This file is generated from content/board.md. Do not edit it directly.
export type BoardMember = { name: string; role: string; initials: string };

export type BoardInfo = { season: string; description: string; members: BoardMember[]; coordinationNames: string[]; coordinationEmail: string };

export const board: BoardInfo = {
  "season": "2025 — 2026",
  "description": "Huit internes bénévoles organisent les formations et animent l’association tout au long de l’année.",
  "members": [
    {
      "name": "David Toubert",
      "role": "Président",
      "initials": "DT"
    },
    {
      "name": "Quentin Vigogne",
      "role": "Vice-président",
      "initials": "QV"
    },
    {
      "name": "Quentin Bui",
      "role": "Trésorier",
      "initials": "QB"
    },
    {
      "name": "Camélia El Gani",
      "role": "Secrétaire",
      "initials": "CE"
    },
    {
      "name": "Emmanuelle Sirieix",
      "role": "Membre du bureau",
      "initials": "ES"
    },
    {
      "name": "Julie Montret",
      "role": "Membre du bureau",
      "initials": "JM"
    },
    {
      "name": "Rachid Chekour",
      "role": "Membre du bureau",
      "initials": "RC"
    },
    {
      "name": "Tom Galvier",
      "role": "Membre du bureau",
      "initials": "TG"
    }
  ],
  "coordinationNames": [
    "Pr Raphaële Renard-Penna",
    "Pr Stéphanie Franchi-Abella"
  ],
  "coordinationEmail": "coordidesrx.psl@aphp.fr"
};
