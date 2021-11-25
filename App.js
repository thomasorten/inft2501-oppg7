import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  TextInput,
  FlatList,
} from 'react-native';
import {NavigationContainer, useFocusEffect} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as movies from './data.json';
import {Picker} from '@react-native-picker/picker';

const Stack = createNativeStackNavigator();

const storeData = async (key, value) => {
  try {
    const jsonValue = JSON.stringify(value);
    return await AsyncStorage.setItem(key, jsonValue);
  } catch (e) {
    // saving error
    console.log(e);
  }
};

const getData = async key => {
  try {
    return await AsyncStorage.getItem(key);
  } catch (e) {
    // error reading value
    console.log(e);
  }
};

export default function App() {
  useEffect(() => {
    storeData('@movies', movies).then(() => {
      // Do nothing
    });
  }, []);

  return (
    <>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Color" component={ColorScreen} />
        </Stack.Navigator>
      </NavigationContainer>
      <Toast />
    </>
  );
}

const Item = ({title, director, actors, shown}) => (
  <View style={styles.item}>
    {(shown == 'title' || shown == 'all') && (
      <Text key={title} style={{fontSize: 16, marginBottom: 5}}>
        {title}
      </Text>
    )}
    {(shown == 'director' || shown == 'all') && (
      <Text key={director}>Director: {director}</Text>
    )}
    {(shown == 'actors' || shown == 'all') && (
      <>
        {actors.map(actor => (
          <Text key={actor}>Actor: {actor}</Text>
        ))}
      </>
    )}
  </View>
);

function HomeScreen({navigation, route}) {
  const [moviedata, setMoviedata] = useState([]);
  const [shown, setShown] = useState('all');
  const [color, setColor] = useState('rgb(221, 221, 223)');

  const renderItem = ({item}) => (
    <View style={{flexDirection: 'row', alignItems: 'center'}}>
      <Item
        title={item.title}
        director={item.director}
        actors={item.actors}
        shown={shown}
      />
    </View>
  );

  useEffect(() => {
    getData('@movies').then(data => {
      const movies = JSON.parse(data);
      setMoviedata(movies.default);
    });
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      if (route.params && route.params.color) {
        console.log(route.params);
        setColor(color => route.params.color);
      }
    }, [route.params])
  );

  return (
    <View style={{
      backgroundColor: color,
      width: '100%'}}>
      <Picker
        selectedValue={shown}
        onValueChange={(itemValue, itemIndex) => setShown(itemValue)}>
        <Picker.Item label="All info" value="all" />
        <Picker.Item label="Title" value="title" />
        <Picker.Item label="Director" value="director" />
        <Picker.Item label="Actors" value="actors" />
      </Picker>
      <FlatList
        data={moviedata}
        renderItem={item => renderItem(item)}
        keyExtractor={item => item.title}
        extraData={shown}
      />
      <Button title="Velg farge" onPress={(e) => { 
          e.persist();
          navigation.navigate('Color', { color: color })
        }
      } />
    </View>
  );
}

function ColorScreen({route, navigation}) {

  const { color } = route.params;

  const [colorstring, setColorstring] = useState(color);

  return (
    <View>
      <Text style={{alignSelf: 'center', marginTop: 30, fontSize: 20}}>Choose a color</Text>
      <View style={styles.container}>
        <Picker
          selectedValue={colorstring}
          onValueChange={(itemValue, itemIndex) => setColorstring(itemValue)}>
          <Picker.Item label="Light grey" value="rgb(221, 221, 223)" />
          <Picker.Item label="Light yellow" value="#f2efa2" />
          <Picker.Item label="Light green" value="rgb(148, 218, 165)" />
        </Picker>
      </View>
      <Button
        title="Gå tilbake"
        onPress={() => navigation.navigate('Home', { color: colorstring })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    width: 100,
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  item: {
    borderTopColor: '#333',
    borderTopWidth: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 5,
    paddingBottom: 5,
  },
  fixToText: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
