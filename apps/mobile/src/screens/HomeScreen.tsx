import { useEffect, useState } from "react";
import { View, Pressable, ActivityIndicator, StyleSheet } from "react-native";
import { AppText as Text } from "../components/AppText";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { HomeStackParamList } from "../navigation/RootNavigator";
import {
  getEdition,
  getCompetition,
  getOrganization,
  type Edition,
  type Competition,
  type Organization,
} from "@turtle-soccer/core";
import { Flag } from "../components/Flag";
import { NameWithFlag } from "../components/NameWithFlag";

type Props = NativeStackScreenProps<HomeStackParamList, "Home">;

// Same featured edition the web app's home page hardcodes — update this
// alongside app/page.tsx on the web side when a new one is added.
const FEATURED_EDITION_ID = "world-cup-2026";

type FeaturedData = {
  edition: Edition;
  competition: Competition;
  org: Organization;
};

export function HomeScreen({ navigation }: Props) {
  const [data, setData] = useState<FeaturedData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const edition = await getEdition(FEATURED_EDITION_ID);
        if (!edition) {
          if (!cancelled) setError("Featured edition not found");
          return;
        }
        const competition = await getCompetition(edition.competitionId);
        if (!competition) {
          if (!cancelled) setError("Competition not found");
          return;
        }
        const org = await getOrganization(competition.organizationId);
        if (!org) {
          if (!cancelled) setError("Organization not found");
          return;
        }
        if (!cancelled) setData({ edition, competition, org });
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load");
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

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

  const { edition, competition, org } = data;

  return (
    <View style={styles.container}>
      <Text display style={styles.welcome}>Welcome</Text>
      <Text style={styles.subtitle}>
        An archive of soccer organizations, their competitions, and
        every edition played. A hobby, non-commercial project for the
        love of soccer.
      </Text>

      <Pressable
        style={styles.featuredCard}
        onPress={() =>
          navigation.navigate("EditionDetail", {
            orgId: org.id,
            competitionId: competition.id,
            editionId: edition.id,
          })
        }
      >
        <Text style={styles.featuredLabel}>Featured edition</Text>
        <View style={styles.featuredTitleRow}>
          <Text display style={styles.featuredCompetition}>{competition.name}</Text>
          <View style={styles.hostFlags}>
            {edition.hosts.map((h) => (
              <Flag key={h.code} code={h.code} size={16} />
            ))}
          </View>
          <Text display style={styles.featuredYear}>{edition.label}</Text>
        </View>
        <Text style={styles.featuredHosts}>
          {edition.hosts.map((h) => h.name).join(" / ")}
        </Text>
        {edition.champion ? (
          <View style={styles.championRow}>
            <Text style={styles.championLabel}>Champion: </Text>
            <NameWithFlag
              name={edition.champion}
              isCountry={competition.scope === "national"}
              size={18}
              textStyle={styles.championName}
            />
          </View>
        ) : null}
      </Pressable>
    </View>
  );
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
  container: {
    flex: 1,
    padding: 20,
  },
  welcome: {
    fontSize: 30,
    fontWeight: "800",
    color: "#171A21",
  },
  subtitle: {
    fontSize: 15,
    color: "#171A2199",
    marginTop: 8,
    marginBottom: 24,
    lineHeight: 21,
  },
  featuredCard: {
    backgroundColor: "#2B34DE",
    borderRadius: 14,
    padding: 22,
  },
  featuredLabel: {
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
    color: "#FFFFFF99",
    marginBottom: 10,
  },
  featuredTitleRow: {
    flexDirection: "row",
    alignItems: "baseline",
    flexWrap: "wrap",
    gap: 8,
  },
  featuredCompetition: {
    fontSize: 24,
    fontWeight: "800",
    color: "#FFFFFF",
    textTransform: "uppercase",
  },
  featuredYear: {
    fontSize: 24,
    fontWeight: "800",
    color: "#FFFFFFCC",
  },
  hostFlags: {
    flexDirection: "row",
    gap: 4,
  },
  featuredHosts: {
    fontSize: 14,
    color: "#FFFFFFB3",
    marginTop: 4,
  },
  championRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
  },
  championLabel: {
    fontSize: 15,
    color: "#FFFFFFCC",
  },
  championName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});
