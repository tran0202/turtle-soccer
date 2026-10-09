import { useEffect, useState } from "react";
import { View, ScrollView, ActivityIndicator, StyleSheet } from "react-native";
import { AppText as Text } from "../components/AppText";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { SharedDetailParamList } from "../navigation/RootNavigator";
import {
  getCompetition,
  getEdition,
  type Competition,
  type Edition,
} from "@turtle-soccer/core";
import { Flag } from "../components/Flag";
import { NameWithFlag } from "../components/NameWithFlag";
import { PlaceIcon } from "../components/PlaceIcon";
import { LogoMark } from "../components/LogoMark";
import { EDITION_LOGOS } from "../lib/editionLogoRegistry";

type Props = NativeStackScreenProps<SharedDetailParamList, "EditionDetail">;

type DetailData = {
  competition: Competition;
  edition: Edition;
};

export function EditionDetailScreen({ route, navigation }: Props) {
  const { competitionId, editionId } = route.params;
  const [data, setData] = useState<DetailData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [competition, edition] = await Promise.all([
          getCompetition(competitionId),
          getEdition(editionId),
        ]);
        if (!competition || !edition) {
          if (!cancelled) setError("Edition not found");
          return;
        }
        if (!cancelled) setData({ competition, edition });
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load");
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [competitionId, editionId]);

  useEffect(() => {
    if (data) {
      navigation.setOptions({
        title: `${data.edition.label} ${data.competition.name}`,
      });
    }
  }, [data, navigation]);

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!data) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2B34DE" />
      </View>
    );
  }

  const { competition, edition } = data;

  // Same resolution the web app uses for the 3rd/4th slots: a genuine
  // 3rd/4th place, a joint-third (drawn 3rd-place match, no 4th at all), or
  // semifinalists (no 3rd-place match played, so no real ranking between
  // the two).
  const slot3 = edition.coThirdPlace
    ? { name: edition.coThirdPlace[0], label: "Joint third" }
    : edition.semifinalists
    ? { name: edition.semifinalists[0], label: "Semifinalist" }
    : edition.thirdPlace
    ? { name: edition.thirdPlace, label: "Third place" }
    : null;
  const slot4 = edition.coThirdPlace
    ? { name: edition.coThirdPlace[1], label: "Joint third" }
    : edition.semifinalists
    ? { name: edition.semifinalists[1], label: "Semifinalist" }
    : edition.fourthPlace
    ? { name: edition.fourthPlace, label: "Fourth place" }
    : null;
  // No result yet: each place shows its numbered medal instead of a dash.
  const upcoming = edition.champion === null;

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <View style={styles.titleRow}>
        <LogoMark
          registry={EDITION_LOGOS}
          logoKey={edition.id}
          name={edition.label}
          width={64}
          height={64}
        />
        <View style={styles.titleText}>
          <Text display style={styles.editionLabel}>{edition.label}</Text>
          <Text display style={styles.competitionName}>
            {edition.historicalName ?? competition.name}
          </Text>
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.infoBox}>
          <Text style={styles.infoLabel}>Host</Text>
          <View style={styles.hostFlags}>
            {edition.hosts.map((h) => (
              <Flag key={h.code} code={h.code} size={18} />
            ))}
          </View>
          <Text style={styles.infoValue}>
            {edition.hosts.map((h) => h.name).join(" / ")}
          </Text>
        </View>
        <InfoBox
          label="Dates"
          value={`${formatDate(edition.startDate)} – ${formatDate(edition.endDate)}`}
        />
      </View>
      <View style={styles.row}>
        <InfoBox label="Teams" value={String(edition.teams)} />
        <InfoBox
          label="Top scorer"
          value={
            edition.topScorers.length
              ? edition.topScorers.map((s) => `${s.name} (${s.goals})`).join(", ")
              : "—"
          }
        />
      </View>

      <View style={styles.resultsBlock}>
        <ResultRow
          label="Champion"
          name={edition.champion}
          place={1}
          isCountry={competition.scope === "national"}
          color="#2B34DE"
        />
        <ResultRow
          label="Runner-up"
          name={edition.runnerUp}
          place={2}
          isCountry={competition.scope === "national"}
          color="#1C8A4B"
        />
        {slot3 ? (
          <ResultRow
            label={slot3.label}
            name={slot3.name}
            isCountry={competition.scope === "national"}
            color="#171A2199"
          />
        ) : upcoming ? (
          <ResultRow
            label="Third place"
            name={null}
            place={3}
            isCountry={competition.scope === "national"}
            color="#171A2199"
          />
        ) : null}
        {slot4 ? (
          <ResultRow
            label={slot4.label}
            name={slot4.name}
            isCountry={competition.scope === "national"}
            color="#171A2166"
          />
        ) : upcoming ? (
          <ResultRow
            label="Fourth place"
            name={null}
            place={4}
            isCountry={competition.scope === "national"}
            color="#171A2166"
          />
        ) : null}
      </View>

      {edition.notes ? <Text style={styles.notes}>{edition.notes}</Text> : null}
    </ScrollView>
  );
}

function InfoBox({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoBox}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

function ResultRow({
  label,
  name,
  place,
  isCountry,
  color,
}: {
  label: string;
  name: string | null;
  /** Which place this row is, so an empty row can show that place's medal. */
  place?: 1 | 2 | 3 | 4;
  isCountry: boolean;
  color: string;
}) {
  return (
    <View style={styles.resultRow}>
      <Text style={styles.resultLabel}>{label}</Text>
      {name ? (
        <NameWithFlag
          name={name}
          isCountry={isCountry}
          size={22}
          textStyle={[styles.resultName, { color }]}
          display
        />
      ) : place ? (
        <View style={styles.resultMedal}>
          <PlaceIcon place={place} color={color} size={30} />
        </View>
      ) : (
        <Text style={styles.resultDash}>—</Text>
      )}
    </View>
  );
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  errorText: {
    color: "#B91C1C",
    paddingHorizontal: 24,
    textAlign: "center",
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  titleText: {
    flex: 1,
  },
  editionLabel: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1C8A4B",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  competitionName: {
    fontSize: 30,
    fontWeight: "800",
    color: "#171A21",
    marginTop: 2,
    marginBottom: 16,
  },
  row: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 10,
  },
  infoBox: {
    flex: 1,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#E4E1D8",
    borderRadius: 10,
    padding: 12,
  },
  infoLabel: {
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    color: "#171A2166",
  },
  hostFlags: {
    flexDirection: "row",
    gap: 4,
    marginTop: 6,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: "600",
    color: "#171A21",
    marginTop: 4,
  },
  resultsBlock: {
    marginTop: 14,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#E4E1D8",
    borderRadius: 10,
    overflow: "hidden",
  },
  resultRow: {
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E4E1D8",
  },
  resultLabel: {
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    color: "#171A2166",
  },
  resultName: {
    fontSize: 22,
    fontWeight: "800",
    marginTop: 2,
  },
  resultDash: {
    fontSize: 22,
    marginTop: 2,
    color: "#171A2133",
  },
  resultMedal: {
    marginTop: 4,
    alignSelf: "flex-start",
  },
  notes: {
    fontSize: 14,
    color: "#171A2199",
    lineHeight: 20,
    marginTop: 18,
  },
});
