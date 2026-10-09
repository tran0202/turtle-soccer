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
import type { OrganizationsStackParamList } from "../navigation/RootNavigator";
import {
  getOrganization,
  getChildOrganizations,
  getCompetitionsByOrg,
  type Organization,
  type Competition,
} from "@turtle-soccer/core";
import { LogoMark } from "../components/LogoMark";
import { ORG_LOGOS } from "../lib/orgLogoRegistry";
import { COMPETITION_LOGOS } from "../lib/competitionLogoRegistry";

type Props = NativeStackScreenProps<OrganizationsStackParamList, "OrganizationDetail">;

type DetailData = {
  org: Organization;
  children: Organization[];
  competitions: Competition[];
};

export function OrganizationDetailScreen({ route, navigation }: Props) {
  const { orgId } = route.params;
  const [data, setData] = useState<DetailData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const org = await getOrganization(orgId);
        if (!org) {
          if (!cancelled) setError("Organization not found");
          return;
        }
        const [children, competitions] = await Promise.all([
          getChildOrganizations(orgId),
          getCompetitionsByOrg(orgId),
        ]);
        if (!cancelled) setData({ org, children, competitions });
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load");
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [orgId]);

  useEffect(() => {
    if (data) navigation.setOptions({ title: data.org.name });
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

  const { org, children, competitions } = data;

  // On a confederation's page, show how many associations it has — split
  // into full/associate only when it actually has associate members
  // (currently CAF and OFC), same rule as the web app's heading.
  const childLabel = (() => {
    if (org.level === "global") return "Confederations";
    if (org.level !== "confederation") return "Members";
    const associateCount = children.filter(
      (c) => c.confederationStatus === "associate"
    ).length;
    const fullCount = children.length - associateCount;
    return associateCount > 0
      ? `National Associations (${fullCount} full, ${associateCount} associate)`
      : `National Associations (${children.length})`;
  })();

  return (
    <FlatList
      ListHeaderComponent={
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <LogoMark
              registry={ORG_LOGOS}
              logoKey={org.id}
              name={org.name}
              width={100}
              height={56}
            />
            <View style={styles.headerText}>
              <Text display style={styles.orgName}>{org.name}</Text>
              <Text style={styles.orgFullName}>{org.fullName}</Text>
            </View>
          </View>
          <Text style={styles.description}>{org.description}</Text>
          {org.confederationHistory && (
            <Text style={styles.note}>{org.confederationHistory}</Text>
          )}
          {org.fifaAffiliation && (
            <Text style={styles.note}>{org.fifaAffiliation}</Text>
          )}

          {competitions.length > 0 && (
            <>
              <Text style={styles.sectionLabel}>Competitions</Text>
              {competitions.map((c) => (
                <Pressable
                  key={c.id}
                  style={[styles.card, styles.cardRow]}
                  onPress={() =>
                    navigation.navigate("CompetitionDetail", {
                      orgId,
                      competitionId: c.id,
                    })
                  }
                >
                  <LogoMark
                    registry={COMPETITION_LOGOS}
                    logoKey={c.id}
                    name={c.name}
                    width={40}
                    height={56}
                  />
                  <View style={styles.cardTextColumn}>
                    <Text display style={styles.cardTitle}>{c.name}</Text>
                    <Text style={styles.cardSubtitle}>{c.frequency}</Text>
                  </View>
                </Pressable>
              ))}
            </>
          )}

          {children.length > 0 && (
            <Text style={styles.sectionLabel}>{childLabel}</Text>
          )}
        </View>
      }
      data={children}
      keyExtractor={(child) => child.id}
      contentContainerStyle={styles.listContent}
      renderItem={({ item }) => (
        <Pressable
          style={[styles.card, styles.cardRow]}
          onPress={() =>
            navigation.push("OrganizationDetail", { orgId: item.id })
          }
        >
          <LogoMark
            registry={ORG_LOGOS}
            logoKey={item.id}
            name={item.name}
            width={56}
            height={32}
          />
          <View style={styles.cardTextColumn}>
            <Text display style={styles.cardTitle}>{item.name}</Text>
            <Text style={styles.cardSubtitle} numberOfLines={1}>
              {item.fullName}
            </Text>
          </View>
        </Pressable>
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
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  cardTextColumn: {
    flex: 1,
  },
  orgName: {
    fontSize: 32,
    fontWeight: "800",
    color: "#171A21",
  },
  orgFullName: {
    fontSize: 15,
    color: "#171A2180",
    marginTop: 2,
  },
  description: {
    fontSize: 15,
    color: "#171A2199",
    marginTop: 10,
    lineHeight: 21,
  },
  note: {
    fontSize: 13,
    color: "#171A2166",
    marginTop: 8,
    lineHeight: 18,
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
