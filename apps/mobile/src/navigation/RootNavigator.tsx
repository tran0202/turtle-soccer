import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { OrganizationsListScreen } from "../screens/OrganizationsListScreen";
import { OrganizationDetailScreen } from "../screens/OrganizationDetailScreen";

export type RootStackParamList = {
  OrganizationsList: undefined;
  OrganizationDetail: { orgId: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="OrganizationsList"
          component={OrganizationsListScreen}
          options={{ title: "Turtle Soccer Archive" }}
        />
        <Stack.Screen
          name="OrganizationDetail"
          component={OrganizationDetailScreen}
          options={{ title: "" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
