import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, TouchableOpacity, View } from 'react-native';
import { DailyTask } from '../screens/dailyTask';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faAngleLeft, faArrowTrendUp, faCircleUser, faUser } from '@fortawesome/free-solid-svg-icons';
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons/faCircleCheck';
import { Profile } from '../screens/profile';
import Colors from '../constant/colors';
import { Dashboard } from '../screens/dashboard';
import styles from '../styles/styles';
import { Weight } from '../screens/weight';
import { Temperature } from '../screens/temperature';
import { DailyPic } from '../screens/dailyPic';
import { DailyQuestionarie } from '../screens/dailyQuestionarie';
import { EditProfile } from '../screens/editProfile';
import { createStackNavigator } from '@react-navigation/stack';
import { useRoute } from '@react-navigation/native';
import StroopTest from '../screens/stroopTest';
import { BP } from '../screens/bp';



const Tab = createBottomTabNavigator();

const CustomDailyTasksHeader = ({ navigation, label }: any) => {
  const route = navigation?.getState()?.routes?.[navigation?.getState()?.index];

  const navigateBack = () => {
    if (label != "Daily Task")
      navigation.goBack();
    else
      navigation.navigate("Overview");
  }

  return (
    <View style={[{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', height: 55, paddingHorizontal: 10, backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: Colors.LightGray }]}>
      <TouchableOpacity style={{ flexDirection: 'row' }} onPress={navigateBack}>
        {label != "Daily Task" ? <FontAwesomeIcon icon={faAngleLeft} size={30} color={Colors.bottomNavigationIconInActive} /> : null}
        <Text style={[styles.headerText, { paddingLeft: 10 }]}>Daily Tasks</Text>
      </TouchableOpacity>
      <View style={{ flexDirection: 'row' }}>
        {/* <TouchableOpacity onPress={() => console.log('First icon pressed')}>
          <FontAwesomeIcon icon={faBell} size={24} color={Colors.defaultColor} />
        </TouchableOpacity>
        <TouchableOpacity style={{ paddingLeft: 10 }} onPress={() => console.log('Second icon pressed')}>
          <FontAwesomeIcon icon={faCircleUser} size={30} color={Colors.bottomNavigationIconInActive} />
        </TouchableOpacity> */}
      </View>
    </View>
  );
};

const CustomProfileHeader = ({ navigation }: any) => {
  //const icon = label === 'Health Trends' ? faArrowTrendUp : label === 'Screen B' ? faCircleCheck : faUser;
  // const route = navigation?.getState()?.routes?.[navigation?.getState()?.index];
  // console.log(route, "deno route name", route?.name)
  // Inside your component function
  const route: any = useRoute();

  const navigateBack = () => {
    const previousScreenName = route.params?.previousScreen || 'Unknown'
    console.log(previousScreenName, "???????????????????????????????????????????????????????????????????????????????????????")
    console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^", "navigateBack", route)
    navigation.goBack();
  }

  return (
    <View style={[{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', height: 55, paddingHorizontal: 20, backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: Colors.LightGray }]}>
      <TouchableOpacity style={{ flexDirection: 'row' }} onPress={navigateBack}>
        {/* <FontAwesomeIcon icon={faAngleLeft} size={30} color={Colors.bottomNavigationIconInActive} /> */}
        <Text style={[styles.headerText, {}]}>Profile</Text>
      </TouchableOpacity>
      <View style={{ flexDirection: 'row' }}>
        <TouchableOpacity onPress={() => console.log('First icon pressed')}>
          {/* <FontAwesomeIcon icon={faBell} size={24} color={Colors.defaultColor} /> */}
        </TouchableOpacity>
        <TouchableOpacity style={{ paddingLeft: 10 }} onPress={() => console.log('Second icon pressed')}>
          <FontAwesomeIcon icon={faCircleUser} size={30} color={Colors.bottomNavigationIconInActive} />
        </TouchableOpacity>
      </View>
    </View>
  );
};


const CustomTabBar = ({ state, descriptors, navigation }: any) => (
  <View style={{
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CCCCCC',
    width: '100%',
    height: 80,
    marginBottom: 7,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20
  }}>
    {
      state.routes.map((route: any, index: any) => {
        const { options } = descriptors[route.key];
        let label = options.tabBarLabel !== undefined ? options.tabBarLabel : options.title !== undefined ? options.title : route.name;
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };


        console.log(label, route, index, "************************")
        const icon = label === 'Health Trends' ? faArrowTrendUp : label === 'Screen B' ? faCircleCheck : faUser;
        console.log(label, "albel++++++++++++++++++++")

        return (
          label === "Daily Tasks" || label === "Health Trends" || label === "Profile" ? (
            <TouchableOpacity
              key={index}
              onPress={onPress}
              style={{ flex: 1, alignItems: 'center' }}
            >
              <FontAwesomeIcon icon={icon} size={30} color={(isFocused) ? Colors.bottomNavigationIconActive : Colors.bottomNavigationIconInActive} />
              <Text style={{ color: (isFocused) ? Colors.bottomNavigationIconActive : Colors.bottomNavigationIconInActive }}>
                {label}
              </Text>
            </TouchableOpacity>
          ) : null
        );

      })}
  </View>
);
const Stack = createStackNavigator();

const ProfileStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Profile" component={Profile} options={{ headerShown: true, header: (props) => <CustomProfileHeader {...props} /> }} />
      <Stack.Screen name="EditProfile" component={EditProfile} options={{ headerShown: true, header: (props) => <CustomProfileHeader {...props} /> }} />
    </Stack.Navigator>
  );
};

const DailyTaskStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Daily Task" component={DailyTask} options={{ headerShown: true, header: (props) => <CustomDailyTasksHeader {...props} label="Daily Task" /> }} />
      <Stack.Screen name="Weight" component={Weight} options={{ headerShown: true, header: (props) => <CustomDailyTasksHeader {...props} label="Weight" /> }} />
      <Stack.Screen name="Temperature" component={Temperature} options={{ headerShown: true, header: (props) => <CustomDailyTasksHeader {...props} label="Temperature" /> }} />
      <Stack.Screen name="BP" component={BP} options={{ headerShown: true, header: (props) => <CustomDailyTasksHeader {...props} label="BP" /> }} />
      <Stack.Screen name="StroopTest" component={StroopTest} options={{ headerShown: true, header: (props) => <CustomDailyTasksHeader {...props} label="Stroop Test" /> }} />
      <Stack.Screen name="DailyPic" component={DailyPic} options={{ headerShown: true, header: (props) => <CustomDailyTasksHeader {...props} label="DailyPic" /> }} />
      <Stack.Screen name="DailyQuestionarie" component={DailyQuestionarie} options={{ headerShown: true, header: (props) => <CustomDailyTasksHeader {...props} label="DailyQuestionarie" /> }} />
    </Stack.Navigator>
  );
};

const BottomNavigation = ({ navigation }: any) => {
  return (
    <Tab.Navigator tabBar={props => <CustomTabBar {...props} />} >
      <Tab.Screen
        name="Overview"
        component={Dashboard}
        options={{ tabBarLabel: 'Health Trends', headerShown: true }}
      />
      <Tab.Screen
        name="Daily Tasks"
        component={DailyTaskStackNavigator}
        options={{
          tabBarLabel: 'Daily Tasks', headerShown: false,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStackNavigator}
        options={{
          tabBarLabel: 'Profile', headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomNavigation;

