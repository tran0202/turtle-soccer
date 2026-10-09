import { useEffect, useState } from "react";
import {
  View,
  FlatList,
  Pressable,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { AppText as Text } from "../components/AppText";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { SharedDetailParamList } from "../navigation/RootNavigator";
import {
  getCompetition,
  getEditionsByCompetition,
  type Competition,
  type Edition,
} from "@turtle-soccer/core";
import { LogoMark } from "../components/LogoMark";
import { COMPETITION_LOGOS } from "../lib/competitionLogoRegistry";
import { EditionResultRow } from "../components/EditionResultRow";

type Props = NativeStackScreenProps<SharedDetailParamList, "CompetitionDetail">;

type DetailData = {
  competition: Competition;
  editions: Edition[];
};

export function CompetitionDetailScreen({ route, navigation }: Props) {
  const { orgId, competitionId } = route.params;
  const [data, setData] = useState<DetailData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const competition = await getCompetition(competitionId);
        if (!competition) {
          if (!cancelled) setError("Competition not found");
          return;
        }
        const editions = await getEditionsByCompetition(competitionId);
        if (!cancelled) setData({ competition, editions });
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load");
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [competitionId]);

  useEffect(() => {
    if (data) navigation.setOptions({ title: data.competition.name });
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

  const { competition, editions } = data;

  return (
    <FlatList
      ListHeaderComponent={
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <LogoMark
              registry={COMPETITION_LOGOS}
              logoKey={competition.id}
              name={competition.name}
              width={56}
              height={78}
            />
            <View style={styles.headerText}>
              <Text display style={styles.name}>{competition.name}</Text>
              <Text style={styles.meta}>
                {competition.scope} · {competition.gender} · since {competition.founded}
              </Text>
            </View>
          </View>
          <Text style={styles.description}>{competition.description}</Text>
          <Text style={styles.sectionLabel}>Editions</Text>
        </View>
      }
      data={editions}
      keyExtractor={(e) => e.id}
      contentContainerStyle={styles.listContent}
      renderItem={({ item }) => (
        <EditionResultRow
          edition={item}
          isCountry={competition.scope === "national"}
          onPress={() =>
            navigation.navigate("EditionDetail", {
              orgId,
              competitionId,
              editionId: item.id,
            })
          }
        />
      )}
    />
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
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  headerText: {
    flex: 1,
  },
  editionCardRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  cardTextColumn: {
    flex: 1,
  },
  name: {
    fontSize: 32,
    fontWeight: "800",
    color: "#171A21",
  },
  meta: {
    fontSize: 13,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    color: "#1C8A4B",
    marginTop: 6,
    fontWeight: "600",
  },
  description: {
    fontSize: 15,
    color: "#171A2199",
    marginTop: 10,
    lineHeight: 21,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    color: "#1C8A4B",
    marginTop: 24,
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
  cardLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#171A2180",
    textTransform: "uppercase",
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 2,
  },
  champion: {
    fontSize: 20,
    fontWeight: "800",
    color: "#2B34DE",
  },
  cardArrow: {
    fontSize: 20,
    color: "#171A2140",
  },
  runnerUp: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1C8A4B",
    marginTop: 2,
  },
});
