import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View, Button, TextInput} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Toast from 'react-native-toast-message';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={HomeScreen} />
        </Stack.Navigator>
      </NavigationContainer>
      <Toast />
    </>
  );
}

function HomeScreen({navigation}) {

  const [name, setName] = useState('');
  const [card, setCard] = useState('');
  const [isLoading, setLoading] = useState(true);
  const [response, setResponse] = useState('');
  const [clicks, setClicks] = useState(0);
  const [started, setStarted] = useState(false);

  const sendRequest = async (url, callback) => {
    try {
     const response = await fetch(url);
     const res = await response.text();
     setLoading(false);
     setResponse(res);
     callback(res);
   } catch (error) {
     console.error(error);
   }
 };

  const startGame = async (url) => {
    sendRequest(`https://bigdata.idi.ntnu.no/mobil/tallspill.jsp?navn=${name}&kortnummer=${card}`, (res) => {   
      setStarted(true);
    });
  };

  const choose = (number) => {
    sendRequest(`https://bigdata.idi.ntnu.no/mobil/tallspill.jsp?tall=${number}`, (res) => {   
      setClicks((clicks) => clicks+1);
    });
  }

  useEffect(() => {

  }, []);

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>

      <Text style={{marginBottom: 20}}>Vennligst oppgi navn og kortnummer for å spille!</Text>

      <Text style={{marginBottom: 30, fontSize: 24}}>{response}</Text>

      { started &&
      <View style={{alignItems: 'flex-start', justifyContent: 'space-evenly', flexDirection: 'row', marginBottom: 30}}>
        {[...Array(10).keys()].map((prop, key) => {
          return (
            <Button key={key} title={`${key+1}`} onPress={() => choose(key+1)} />
          );
        })}
      </View>
      }

      <Text>Navn:</Text>
      <TextInput
        style={styles.input}
        value={`${name}`}
        onChangeText={setName}
      />

      <Text>Kortnummer:</Text>
      <TextInput
        style={styles.input}
        value={`${card}`}
        onChangeText={setCard}
      />

      <View style={styles.fixToText}>
        <Button
          title="Spill!"
          onPress={() => startGame()}
        />
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
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
});