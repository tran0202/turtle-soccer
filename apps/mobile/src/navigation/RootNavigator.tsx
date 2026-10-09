import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { HomeScreen } from "../screens/HomeScreen";
import { OrganizationsListScreen } from "../screens/OrganizationsListScreen";
import { CompetitionsListScreen } from "../screens/CompetitionsListScreen";
import { OrganizationDetailScreen } from "../screens/OrganizationDetailScreen";
import { CompetitionDetailScreen } from "../screens/CompetitionDetailScreen";
import { EditionDetailScreen } from "../screens/EditionDetailScreen";

// Each tab gets its own stack, with its own copies of the detail screens —
// this keeps the tab bar visible while navigating within a tab, rather than
// a shared outer stack whose pushed screens would otherwise sit above (and
// visually hide) the tab bar entirely.
export type HomeStackParamList = {
  Home: undefined;
  EditionDetail: { orgId: string; competitionId: string; editionId: string };
};

export type OrganizationsStackParamList = {
  OrganizationsList: undefined;
  OrganizationDetail: { orgId: string };
  CompetitionDetail: { orgId: string; competitionId: string };
  EditionDetail: { orgId: string; competitionId: string; editionId: string };
};

export type CompetitionsStackParamList = {
  CompetitionsList: undefined;
  CompetitionDetail: { orgId: string; competitionId: string };
  EditionDetail: { orgId: string; competitionId: string; editionId: string };
};

export type TabParamList = {
  HomeTab: undefined;
  OrganizationsTab: undefined;
  CompetitionsTab: undefined;
};

// CompetitionDetailScreen and EditionDetailScreen are registered in
// multiple stacks above (EditionDetail in all three; CompetitionDetail in
// two) with identical route param shapes, and never need to navigate
// anywhere outside of these two routes — so rather than tying them to one
// specific parent stack's full param list, this shared minimal type is all
// either of them actually needs.
export type SharedDetailParamList = {
  CompetitionDetail: { orgId: string; competitionId: string };
  EditionDetail: { orgId: string; competitionId: string; editionId: string };
};

const HomeStack = createNativeStackNavigator<HomeStackParamList>();
const OrganizationsStack = createNativeStackNavigator<OrganizationsStackParamList>();
const CompetitionsStack = createNativeStackNavigator<CompetitionsStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

function HomeStackScreen() {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: "Turtle Soccer Archive" }}
      />
      <HomeStack.Screen
        name="EditionDetail"
        component={EditionDetailScreen}
        options={{ title: "" }}
      />
    </HomeStack.Navigator>
  );
}

function OrganizationsStackScreen() {
  return (
    <OrganizationsStack.Navigator>
      <OrganizationsStack.Screen
        name="OrganizationsList"
        component={OrganizationsListScreen}
        options={{ title: "Organizations" }}
      />
      <OrganizationsStack.Screen
        name="OrganizationDetail"
        component={OrganizationDetailScreen}
        options={{ title: "" }}
      />
      <OrganizationsStack.Screen
        name="CompetitionDetail"
        component={CompetitionDetailScreen}
        options={{ title: "" }}
      />
      <OrganizationsStack.Screen
        name="EditionDetail"
        component={EditionDetailScreen}
        options={{ title: "" }}
      />
    </OrganizationsStack.Navigator>
  );
}

function CompetitionsStackScreen() {
  return (
    <CompetitionsStack.Navigator>
      <CompetitionsStack.Screen
        name="CompetitionsList"
        component={CompetitionsListScreen}
        options={{ title: "Competitions" }}
      />
      <CompetitionsStack.Screen
        name="CompetitionDetail"
        component={CompetitionDetailScreen}
        options={{ title: "" }}
      />
      <CompetitionsStack.Screen
        name="EditionDetail"
        component={EditionDetailScreen}
        options={{ title: "" }}
      />
    </CompetitionsStack.Navigator>
  );
}

export function RootNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={{ tabBarActiveTintColor: "#2B34DE" }}>
        <Tab.Screen
          name="HomeTab"
          component={HomeStackScreen}
          options={{
            title: "Home",
            headerShown: false,
            tabBarIcon: ({ focused, color, size }) => (
              <Ionicons name={focused ? "home" : "home-outline"} color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="OrganizationsTab"
          component={OrganizationsStackScreen}
          options={{
            title: "Organizations",
            headerShown: false,
            tabBarIcon: ({ focused, color, size }) => (
              <Ionicons name={focused ? "shield" : "shield-outline"} color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="CompetitionsTab"
          component={CompetitionsStackScreen}
          options={{
            title: "Competitions",
            headerShown: false,
            tabBarIcon: ({ focused, color, size }) => (
              <Ionicons name={focused ? "trophy" : "trophy-outline"} color={color} size={size} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
