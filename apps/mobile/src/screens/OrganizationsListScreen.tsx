import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/RootNavigator";
import {
  getRootOrganizations,
  getChildOrganizations,
  type Organization,
} from "@turtle-soccer/core";

type Props = NativeStackScreenProps<RootStackParamList, "OrganizationsList">;

// A root org (FIFA) plus its direct children (confederations), fetched
// together so the list can show both in one screen without re-fetching
// per row.
type RootOrgWithChildren = {
  org: Organization;
  children: Organization[];
};

export function OrganizationsListScreen({ navigation }: Props) {
  const [roots, setRoots] = useState<RootOrgWithChildren[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const rootOrgs = await getRootOrganizations();
        const withChildren = await Promise.all(
          rootOrgs.map(async (org) => ({
            org,
            children: await getChildOrganizations(org.id),
          }))
        );
        if (!cancelled) setRoots(withChildren);
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

  if (!roots) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2B34DE" />
      </View>
    );
  }

  // Flatten into one list: each root org's row, followed by its children's
  // rows — mirrors the web app's root /organizations page structure (FIFA,
  // then its confederations nested under it).
  const rows: { org: Organization; isChild: boolean }[] = [];
  for (const { org, children } of roots) {
    rows.push({ org, isChild: false });
    for (const child of children) {
      rows.push({ org: child, isChild: true });
    }
  }

  return (
    <FlatList
      data={rows}
      keyExtractor={(row) => row.org.id}
      contentContainerStyle={styles.listContent}
      renderItem={({ item }) => (
        <Pressable
          style={[styles.row, item.isChild && styles.childRow]}
          onPress={() =>
            navigation.navigate("OrganizationDetail", { orgId: item.org.id })
          }
        >
          <Text style={styles.orgName}>{item.org.name}</Text>
          <Text style={styles.orgFullName} numberOfLines={1}>
            {item.org.fullName}
          </Text>
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
    paddingVertical: 8,
  },
  row: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E4E1D8",
  },
  childRow: {
    paddingLeft: 36,
    backgroundColor: "#FBFAF7",
  },
  orgName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#171A21",
  },
  orgFullName: {
    fontSize: 14,
    color: "#171A2180",
    marginTop: 2,
  },
});
