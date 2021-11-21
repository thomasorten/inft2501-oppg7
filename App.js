import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  TextInput,
  FlatList,
  TouchableWithoutFeedback,
} from 'react-native';
import {NavigationContainer, useFocusEffect} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Toast from 'react-native-toast-message';
import uuid from 'react-native-uuid';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Details" component={DetailsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
      <Toast />
    </>
  );
}

const Item = ({name, date}) => (
  <View style={styles.item}>
    <Text style={styles.name}>{name}</Text>
    <Text style={styles.date}>{date}</Text>
  </View>
);

function HomeScreen({route, navigation}) {

  const renderItem = ({item}) => (
    <View style={{flexDirection: 'row', alignItems: 'center'}}>
      <Item name={item.name} date={item.date} />
      <Button title="Rediger" onPress={(e) => { 
          e.persist();
          navigation.navigate('Details', { friend: item })
        }
      } />
    </View>
  );

  const [friends, setFriends] = useState([]);
  const [name, setName] = useState('');
  const [date, setDate] = useState('');

  useFocusEffect(
    React.useCallback(() => {
      if (route.params && route.params.friend) {
        setFriends(friends => friends.map((row, index) => {
          console.log(row);
          if (row.id === route.params.friend.id) {
            return route.params.friend;
          }
          return row;
        }));
      }
    }, [route.params])
  );

  const onAddFriend = () => {
    const friend = {
      id: uuid.v4(),
      name: name,
      date: date,
    }
    setFriends(friends => [...friends, friend]);
  };

  return (
    <View
      style={{
        alignItems: 'center',
        flex: 1,
        justifyContent: 'space-around'
      }}>

      <FlatList
        data={friends}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />

      <View style={{alignItems: 'center', marginBottom: 50}}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text>Navn:</Text>
          <TextInput style={styles.input} value={name} onChangeText={setName} />

          <Text>Fødselsdato:</Text>
          <TextInput style={styles.input} value={date} onChangeText={setDate} />
        </View>

        <View style={styles.fixToText}>
          <Button title="Legg til" onPress={() => onAddFriend()} />
        </View>
      </View>
    </View>
  );
}

function DetailsScreen({route, navigation}) {

  const { friend } = route.params;

  console.log('Friend: ', friend);

  const [name, setName] = useState(friend.name);
  const [date, setDate] = useState(friend.date);
  const [id, setId] = useState(friend.id);

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>Rediger</Text>

      <View style={{alignItems: 'center', marginBottom: 50}}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text>Navn:</Text>
          <TextInput style={styles.input} value={name} onChangeText={setName} />

          <Text>Fødselsdato:</Text>
          <TextInput style={styles.input} value={date} onChangeText={setDate} />
        </View>

      </View>

      <Button
        title="Gå tilbake"
        onPress={() => navigation.navigate('Home', { friend: { name: name, date: date, id: id } })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: 0,
  },
  input: {
    width: 100,
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  fixToText: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  item: {
    backgroundColor: '#fff',
    padding: 10,
    marginVertical: 8,
    marginHorizontal: 8,
  },
  name: {
    fontSize: 16,
  },
  date: {
    fontSize: 16,
  },
});
