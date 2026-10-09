import { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  Pressable,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { AppText as Text } from "../components/AppText";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { CompetitionsStackParamList } from "../navigation/RootNavigator";
import {
  getAllCompetitions,
  getOrganizations,
  type Competition,
  type Organization,
} from "@turtle-soccer/core";
import { LogoMark } from "../components/LogoMark";
import { COMPETITION_LOGOS } from "../lib/competitionLogoRegistry";

type Props = NativeStackScreenProps<CompetitionsStackParamList, "CompetitionsList">;

type Section = {
  title: string;
  org: Organization;
  data: Competition[];
};

// Same scope as the web app's /competitions page: FIFA and confederation-
// level competitions only, not every national association's domestic
// league — those live under Organizations instead, since listing all of
// them here would make this screen unbounded as more get added.
function buildSections(
  competitions: Competition[],
  orgs: Organization[]
): Section[] {
  const orgById = new Map(orgs.map((o) => [o.id, o]));
  const sections: Section[] = [];

  for (const c of competitions) {
    const org = orgById.get(c.organizationId);
    if (!org || (org.level !== "global" && org.level !== "confederation")) {
      continue;
    }
    let section = sections.find((s) => s.org.id === org.id);
    if (!section) {
      section = { title: org.name, org, data: [] };
      sections.push(section);
    }
    section.data.push(c);
  }

  // FIFA's own section first, then confederations in the order they first
  // appeared in the competitions list.
  return sections.sort((a, b) =>
    a.org.level === b.org.level ? 0 : a.org.level === "global" ? -1 : 1
  );
}

export function CompetitionsListScreen({ navigation }: Props) {
  const [sections, setSections] = useState<Section[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [competitions, orgs] = await Promise.all([
          getAllCompetitions(),
          getOrganizations(),
        ]);
        if (!cancelled) setSections(buildSections(competitions, orgs));
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

  if (!sections) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2B34DE" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.listContent}>
      {sections.map((section) => (
        <View key={section.org.id}>
          <Text style={styles.sectionHeader}>{section.title}</Text>
          {section.data.map((item) => (
            <Pressable
              key={item.id}
              style={[styles.card, styles.cardRow]}
              onPress={() =>
                navigation.navigate("CompetitionDetail", {
                  orgId: section.org.id,
                  competitionId: item.id,
                })
              }
            >
              <LogoMark
                registry={COMPETITION_LOGOS}
                logoKey={item.id}
                name={item.name}
                width={40}
                height={56}
              />
              <View style={styles.cardTextColumn}>
                <Text display style={styles.cardTitle}>{item.name}</Text>
                <Text style={styles.cardSubtitle}>{item.frequency}</Text>
              </View>
            </Pressable>
          ))}
        </View>
      ))}
    </ScrollView>
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
  listContent: {
    paddingBottom: 24,
  },
  sectionHeader: {
    fontSize: 13,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    color: "#1C8A4B",
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
  },
  card: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#E4E1D8",
    borderRadius: 10,
    padding: 14,
    marginHorizontal: 20,
    marginBottom: 10,
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  cardTextColumn: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#171A21",
  },
  cardSubtitle: {
    fontSize: 13,
    color: "#171A2180",
    marginTop: 2,
  },
});
