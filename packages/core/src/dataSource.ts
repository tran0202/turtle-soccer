// The single switch between "data lives in the app bundle" and "data comes
// from an API". Everything in data.ts calls through these three functions
// instead of importing the JSON files directly — so changing this one file
// (or just the DATA_SOURCE value) is the entire migration to an API later,
// with zero changes needed in either app (web or mobile).
//
// To switch to an API: change DATA_SOURCE to "api" below (or wire it up to
// an env var / build config), and fill in the fetch calls in the "api"
// branch of each function. Every screen in both apps already calls these
// functions with `await` and handles loading states, since they're async
// here regardless of source — so no screen code needs to change either.

import organizationsJson from "./data/organizations.json";
import competitionsJson from "./data/competitions.json";
import editionsJson from "./data/editions.json";
import type { Organization, Competition, Edition } from "./types";

type DataSource = "bundled" | "api";

// Flip this one value (or read it from an env var / build config) to switch
// every screen in the app from bundled JSON to a live API at once.
const DATA_SOURCE: DataSource = "bundled";

// Fill this in when there's a real API to call.
const API_BASE_URL = "https://api.example.com";

export async function fetchOrganizations(): Promise<Organization[]> {
  if (DATA_SOURCE === "bundled") {
    return organizationsJson as Organization[];
  }
  const res = await fetch(`${API_BASE_URL}/organizations`);
  return res.json();
}

export async function fetchCompetitions(): Promise<Competition[]> {
  if (DATA_SOURCE === "bundled") {
    return competitionsJson as Competition[];
  }
  const res = await fetch(`${API_BASE_URL}/competitions`);
  return res.json();
}

export async function fetchEditions(): Promise<Edition[]> {
  if (DATA_SOURCE === "bundled") {
    return editionsJson as Edition[];
  }
  const res = await fetch(`${API_BASE_URL}/editions`);
  return res.json();
}
