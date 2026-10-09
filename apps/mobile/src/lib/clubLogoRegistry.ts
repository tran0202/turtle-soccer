// Generated from club-logos.json — do not hand-edit.
// Mixed SVG (imported as components) and raster JPG/PNG/WEBP (required as
// asset references, which Metro resolves to a number) entries, tagged by
// kind so LogoMark can render either correctly. Regenerate with
// scripts/generate-logo-registry.py whenever the source *-logos.json
// changes.
import type { FC } from "react";
import type { SvgProps } from "react-native-svg";

import logo_Arsenal from "../assets/club-logos/Arsenal_FC.svg";
import logo_Aston_Villa from "../assets/club-logos/Aston_Villa_FC_new_crest.svg";
import logo_Atl_tico_Junior from "../assets/club-logos/Junior_Barranquilla_logo.svg";
import logo_Atl_tico_Madrid from "../assets/club-logos/Atletico_Madrid_Logo_2024.svg";
import logo_Atl_tico_Mineiro from "../assets/club-logos/Logo_of_Clube_Atletico_Mineiro.svg";
import logo_Barcelona from "../assets/club-logos/FC_Barcelona_(crest).svg";
import logo_Bayer_Leverkusen from "../assets/club-logos/Bayer_04_Leverkusen_logo.svg";
import logo_Bayern_Munich from "../assets/club-logos/FC_Bayern_Munchen_logo_2024.svg";
import logo_Boca_Juniors from "../assets/club-logos/Boca_Juniors_logo18.svg";
import logo_Borussia_Dortmund from "../assets/club-logos/Borussia_Dortmund_logo.svg";
import logo_Brest from "../assets/club-logos/Stade_Brestois_29_logo.svg";
import logo_Chelsea from "../assets/club-logos/Chelsea_FC.svg";
import logo_Defensor_Sporting from "../assets/club-logos/Defensor_Sporting.svg";
import logo_Deportivo_Independiente_Medell_n from "../assets/club-logos/Deportivo_Independiente_Medellin_logo_2026_official.svg";
import logo_Flamengo from "../assets/club-logos/Clube_de_Regatas_do_Flamengo_logo.svg";
import logo_Fluminense from "../assets/club-logos/Fluminense_Football_Club.svg";
import logo_Girona from "../assets/club-logos/Girona_FC_Logo.svg";
import logo_Gr_mio from "../assets/club-logos/Gremio_logo.svg";
import logo_Internacional from "../assets/club-logos/Sport_Club_Internacional_logo.svg";
import logo_Lan_s from "../assets/club-logos/Escudo_de_Lanus_sin_estrellas.svg";
import logo_Lille from "../assets/club-logos/Lille_OSC_2018_logo.svg";
const logo_Liverpool = require("../assets/club-logos/Liverpool_FC.svg.webp");
import logo_Liverpool__Montevideo_ from "../assets/club-logos/Liverpool_F.C._(Montevideo)_logo.svg";
import logo_Manchester_City from "../assets/club-logos/Manchester_City_FC_badge.svg";
import logo_Monaco from "../assets/club-logos/LogoASMonacoFC2021.svg";
const logo_Nacional = require("../assets/club-logos/Club_Nacional_de_Football.png");
const logo_Palmeiras = require("../assets/club-logos/SE_Palmeiras_2025_crest.png");
import logo_Paris_Saint_Germain from "../assets/club-logos/Paris_Saint-Germain_F.C..svg";
import logo_Pe_arol from "../assets/club-logos/Escudo_del_Club_Atletico_Penarol.svg";
import logo_RB_Leipzig from "../assets/club-logos/RB_Leipzig_2014_logo.svg";
import logo_Real_Madrid from "../assets/club-logos/Real_Madrid_CF.svg";
import logo_River_Plate from "../assets/club-logos/Club_Atletico_River_Plate_logo.svg";
const logo_San_Lorenzo = require("../assets/club-logos/Sanlorenzo_almagro_logo2026.png");
import logo_Talleres__C_rdoba_ from "../assets/club-logos/Escudo_Talleres_2015.svg";
import logo_VfB_Stuttgart from "../assets/club-logos/VfB_Stuttgart_1893_Logo.svg";

export type LogoEntry =
  | { kind: "svg"; Component: FC<SvgProps> }
  | { kind: "raster"; source: number };

export const CLUB_LOGOS: Record<string, LogoEntry> = {
  "Arsenal": { kind: "svg", Component: logo_Arsenal },
  "Aston Villa": { kind: "svg", Component: logo_Aston_Villa },
  "Atlético Junior": { kind: "svg", Component: logo_Atl_tico_Junior },
  "Atlético Madrid": { kind: "svg", Component: logo_Atl_tico_Madrid },
  "Atlético Mineiro": { kind: "svg", Component: logo_Atl_tico_Mineiro },
  "Barcelona": { kind: "svg", Component: logo_Barcelona },
  "Bayer Leverkusen": { kind: "svg", Component: logo_Bayer_Leverkusen },
  "Bayern Munich": { kind: "svg", Component: logo_Bayern_Munich },
  "Boca Juniors": { kind: "svg", Component: logo_Boca_Juniors },
  "Borussia Dortmund": { kind: "svg", Component: logo_Borussia_Dortmund },
  "Brest": { kind: "svg", Component: logo_Brest },
  "Chelsea": { kind: "svg", Component: logo_Chelsea },
  "Defensor Sporting": { kind: "svg", Component: logo_Defensor_Sporting },
  "Deportivo Independiente Medellín": { kind: "svg", Component: logo_Deportivo_Independiente_Medell_n },
  "Flamengo": { kind: "svg", Component: logo_Flamengo },
  "Fluminense": { kind: "svg", Component: logo_Fluminense },
  "Girona": { kind: "svg", Component: logo_Girona },
  "Grêmio": { kind: "svg", Component: logo_Gr_mio },
  "Internacional": { kind: "svg", Component: logo_Internacional },
  "Lanús": { kind: "svg", Component: logo_Lan_s },
  "Lille": { kind: "svg", Component: logo_Lille },
  "Liverpool": { kind: "raster", source: logo_Liverpool },
  "Liverpool (Montevideo)": { kind: "svg", Component: logo_Liverpool__Montevideo_ },
  "Manchester City": { kind: "svg", Component: logo_Manchester_City },
  "Monaco": { kind: "svg", Component: logo_Monaco },
  "Nacional": { kind: "raster", source: logo_Nacional },
  "Palmeiras": { kind: "raster", source: logo_Palmeiras },
  "Paris Saint-Germain": { kind: "svg", Component: logo_Paris_Saint_Germain },
  "Peñarol": { kind: "svg", Component: logo_Pe_arol },
  "RB Leipzig": { kind: "svg", Component: logo_RB_Leipzig },
  "Real Madrid": { kind: "svg", Component: logo_Real_Madrid },
  "River Plate": { kind: "svg", Component: logo_River_Plate },
  "San Lorenzo": { kind: "raster", source: logo_San_Lorenzo },
  "Talleres (Córdoba)": { kind: "svg", Component: logo_Talleres__C_rdoba_ },
  "VfB Stuttgart": { kind: "svg", Component: logo_VfB_Stuttgart },
};

