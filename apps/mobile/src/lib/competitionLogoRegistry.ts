// Generated from competition-logos.json — do not hand-edit.
// Mixed SVG (imported as components) and raster JPG/PNG/WEBP (required as
// asset references, which Metro resolves to a number) entries, tagged by
// kind so LogoMark can render either correctly. Regenerate with
// scripts/generate-logo-registry.py whenever the source *-logos.json
// changes.
import type { FC } from "react";
import type { SvgProps } from "react-native-svg";

const logo_world_cup = require("../assets/comp-logos/FIFA_Trophy.jpg");
const logo_womens_world_cup = require("../assets/comp-logos/Trophy-scaled-1.jpg");
import logo_club_world_cup from "../assets/comp-logos/FIFA_Club_World_Cup_logo.svg";
const logo_afcon = require("../assets/comp-logos/Africa_Cup_of_Nation_official_logo.png");
const logo_afc_asian_cup = require("../assets/comp-logos/AFC_Asian_Cup.png");
const logo_euro = require("../assets/comp-logos/Coupe_Henri_Delaunay_2017.jpg");
import logo_champions_league from "../assets/comp-logos/UEFA_Champions_League.svg";
import logo_concacaf_gold_cup from "../assets/comp-logos/Concacaf_Gold_Cup_2021.svg";
const logo_ofc_nations_cup = require("../assets/comp-logos/OFC_Men's_Nations_Cup.jpg");
const logo_copa_america = require("../assets/comp-logos/291px-Copa_america_trofeo.jpg");
import logo_libertadores from "../assets/comp-logos/Copa_Libertadores_logo.svg";
import logo_liga_profesional_argentina from "../assets/comp-logos/Liga_Profesional_de_Futbol_Argentina_logo.svg";
import logo_brasileirao from "../assets/comp-logos/Campeonato_Brasileiro_Serie_A_logo_2024.svg";
import logo_categoria_primera_a from "../assets/comp-logos/BetPlay-Dimayor_logo.svg";
import logo_epl_season from "../assets/comp-logos/Premier_League_Logo.svg";
const logo_ligue_1 = require("../assets/comp-logos/Ligue_1_2024_Logo.png");
import logo_bundesliga from "../assets/comp-logos/Bundesliga_logo_(2017).svg";
import logo_la_liga from "../assets/comp-logos/LaLiga_2023_Vertical_Logo.svg";
const logo_primera_division_uruguay = require("../assets/comp-logos/Liga_AUF_Uruguaya_-_logo_azul.png");

export type LogoEntry =
  | { kind: "svg"; Component: FC<SvgProps> }
  | { kind: "raster"; source: number };

export const COMPETITION_LOGOS: Record<string, LogoEntry> = {
  "world-cup": { kind: "raster", source: logo_world_cup },
  "womens-world-cup": { kind: "raster", source: logo_womens_world_cup },
  "club-world-cup": { kind: "svg", Component: logo_club_world_cup },
  "afcon": { kind: "raster", source: logo_afcon },
  "afc-asian-cup": { kind: "raster", source: logo_afc_asian_cup },
  "euro": { kind: "raster", source: logo_euro },
  "champions-league": { kind: "svg", Component: logo_champions_league },
  "concacaf-gold-cup": { kind: "svg", Component: logo_concacaf_gold_cup },
  "ofc-nations-cup": { kind: "raster", source: logo_ofc_nations_cup },
  "copa-america": { kind: "raster", source: logo_copa_america },
  "libertadores": { kind: "svg", Component: logo_libertadores },
  "liga-profesional-argentina": { kind: "svg", Component: logo_liga_profesional_argentina },
  "brasileirao": { kind: "svg", Component: logo_brasileirao },
  "categoria-primera-a": { kind: "svg", Component: logo_categoria_primera_a },
  "epl-season": { kind: "svg", Component: logo_epl_season },
  "ligue-1": { kind: "raster", source: logo_ligue_1 },
  "bundesliga": { kind: "svg", Component: logo_bundesliga },
  "la-liga": { kind: "svg", Component: logo_la_liga },
  "primera-division-uruguay": { kind: "raster", source: logo_primera_division_uruguay },
};

