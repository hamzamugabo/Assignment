import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({navigation}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      const user = await AsyncStorage.getItem('user');
      const userDate = JSON.parse(user);
      if (user) {
        // const {password: storedPassword} = userDate?.password;
        if (
          password === userDate?.password &&
          username === userDate?.username
        ) {
          setUsername('');
          setPassword('');
          setError('');
          navigation.navigate('Home');
        } else {
          console.log(password);
          console.log(username);
          setError('Incorrect password or username');
        }
      } else {
        setError('User not found');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleRegister = () => {
    navigation.navigate('Register');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Login</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TextInput
        style={styles.input}
        placeholder="Username"
        onChangeText={text => {
          setUsername(text);
          setError('');
        }}
        value={username}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry={true}
        onChangeText={text => {
          setPassword(text);
          setError('');
        }}
        value={password}
      />
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'space-around',
          flexDirection: 'column',
          width: '100%',
        }}>
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleRegister}>
          <Text style={{color: '#333'}}>Dont have an account? Register</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heading: {
    fontSize: 32,
    marginBottom: 20,
  },
  input: {
    width: '80%',
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
  },
  button: {
    width: '80%',
    height: 40,
    backgroundColor: '#333',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  error: {
    color: 'red',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
  },
});

export default LoginScreen;
