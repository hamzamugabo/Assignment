/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  Switch,
  Platform,
  ScrollView,
  PermissionsAndroid,
  Alert,
} from 'react-native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import {request} from 'react-native-permissions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Geolocation from 'react-native-geolocation-service';
import MapScreen from './MapScreen';

const RegistrationForm = () => {
  const [photo, setPhoto] = useState(null);

  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [coordinates, setCoordinates] = useState({});
  const [comment, setComment] = useState('');
  const [name, setName] = useState('');

  async function requestPermissions() {
    if (Platform.OS === 'ios') {
      Geolocation.requestAuthorization();
      Geolocation.setRNConfiguration({
        skipPermissionRequests: false,
        authorizationLevel: 'whenInUse',
      });
    }

    if (Platform.OS === 'android') {
      await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      ).then(granted => {
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('You can use the location');
          getLocation();
        } else {
          console.log('Location permission denied');
        }
      });
    }
  }

  const getLocation = () => {
    const options = {
      enableHighAccuracy: true,
      timeout: 20000,
      maximumAge: 1000,
      distanceFilter: 10, // set the minimum distance (in meters) the device must move horizontally before an update event is generated
    };

    Geolocation.getCurrentPosition(
      position => {
        const {latitude, longitude} = position.coords;
        setCoordinates({latitude, longitude});
        // do something with the position data
      },
      error => {
        console.log(error.code, error.message);
      },
      options,
    );
  };

  async function requestPhotoLibraryPermission() {
    try {
      const granted = await request(
        Platform.select({
          android: 'android.permission.READ_EXTERNAL_STORAGE',
          ios: 'ios.permission.PHOTO_LIBRARY',
        }),
      );
      if (granted === 'granted') {
        console.log('Photo library permission granted');
      } else {
        console.log('Photo library permission denied');
        return;
      }
    } catch (err) {
      console.warn(err);
    }
  }

  const onSubmit = async () => {
    if (name === '' || photo === null || date === '' || coordinates === '') {
      Alert.alert('Please fill all the required fields');
      return;
    }

    try {
      const data = {
        name,
        photo,
        date,
        coordinates,
        comment,
        consent: isEnabled,
      };

      const jsonValue = JSON.stringify(data);
      await AsyncStorage.setItem('data', jsonValue);
      Alert.alert('Data saved successfully');
    } catch (error) {
      console.log(error);
    }
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === 'ios');
    setDate(selectedDate || date);
  };

  const showDatepicker = () => {
    setShowDatePicker(true);
  };

  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  const takePhoto = async () => {
    // requestCameraPermission();
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'App Camera Permission',
          message: 'App needs access to your camera',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        launchCamera({mediaType: 'photo', saveToPhotos: true}, response => {
          if (response.didCancel) {
            console.log('User cancelled image picker');
          } else if (response.error) {
            console.log('ImagePicker Error: ', response.error);
          } else {
            console.log(response);
            // setPhoto({uri: response.assets[0].uri});
          }
        });
        console.log('Camera permission granted');
      } else {
        console.log('Camera permission denied');
        return;
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const selectFromLibrary = () => {
    requestPhotoLibraryPermission();
    launchImageLibrary({mediaType: 'photo'}, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        console.log(response);

        setPhoto({uri: response.assets[0].uri});
      }
    });
  };

  useEffect(() => {
    requestPermissions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    // <Formik
    //   initialValues={{
    //     consent: false,
    //     name: '',
    //     location: '',
    //     compoundShape: '',
    //   }}
    //   validationSchema={validationSchema}
    //   onSubmit={onSubmit}>
    //   {({handleChange, handleBlur, handleSubmit, values, errors}) => (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{marginBottom: 30}}>
          <Text style={{marginBottom: 10}}>
            Do you consent to be registered on our program?
          </Text>
          {/* <Field name="consent">
                {({field}) => ( */}
          <View>
            <View style={styles.consent}>
              <Text>{isEnabled ? 'Yes' : 'No'}</Text>
              <Switch
                trackColor={{false: '#767577', true: '#81b0ff'}}
                thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
                ios_backgroundColor="#3e3e3e"
                onValueChange={toggleSwitch}
                value={isEnabled}
              />
              <Text>*</Text>
            </View>

            {/* {errors.consent && <Text>{errors.consent}</Text>} */}
          </View>
          {/* )}
              </Field> */}
          <View>
            {/* {isEnabled && ( */}
            <View>
              <View style={styles.date}>
                <Text style={{marginRight: 10}}>Registration date:</Text>
                <View>
                  <TouchableOpacity
                    style={styles.datePicker}
                    onPress={showDatepicker}>
                    <Text style={{color: '#ccc'}}>
                      {date.toLocaleDateString()}
                    </Text>
                  </TouchableOpacity>
                  {showDatePicker && (
                    <DateTimePicker
                      value={date}
                      mode="date"
                      display="default"
                      onChange={handleDateChange}
                    />
                  )}
                </View>
                <Text>*</Text>
              </View>
              <View>
                {/* <Field name="name">
                      {({field}) => ( */}
                <View style={styles.nameContainer}>
                  <Text style={{marginRight: 10}}>Respondent Name:</Text>
                  <TextInput
                    placeholder="Name"
                    onChangeText={text => setName(text)}
                    value={name}
                    style={styles.input}
                  />
                  <Text>*</Text>
                  {/* {errors.name && <Text>{errors.name}</Text>} */}
                </View>
                {/* )}
                    </Field> */}
              </View>
              <View>
                {photo ? (
                  <View style={styles.imageContainer}>
                    <Image source={photo} style={{...styles.photo}} />
                    <TouchableOpacity
                      style={[
                        styles.button,
                        {backgroundColor: 'red', marginBottom: 10},
                      ]}
                      onPress={() => setPhoto(null)}>
                      <Text style={{color: 'white'}}>Remove Photo</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View>
                    {/* <TouchableOpacity onPress={selectPhoto}>
                <Text>Select Photo</Text>
              </TouchableOpacity> */}
                    <View style={styles.uploadImage}>
                      <TouchableOpacity
                        style={styles.button}
                        onPress={takePhoto}>
                        <Text style={{color: 'white'}}>Take Photo</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.button}
                        onPress={selectFromLibrary}>
                        <Text style={{color: 'white'}}>
                          Select from Library
                        </Text>
                      </TouchableOpacity>
                      <Text>*</Text>
                    </View>
                  </View>
                )}
              </View>
              {/* <Field name="location">
                    {({field}) => ( */}
              <View>
                <Text style={{alignSelf: 'center'}}>Respondent Location</Text>
                <View style={styles.location}>
                  <Text style={{marginRight: 10}}>
                    Latitude:{coordinates.latitude}
                  </Text>
                  <Text style={{marginRight: 10}}>
                    longitude:{coordinates.longitude}
                  </Text>
                </View>

                {/* {errors.location && <Text>{errors.location}</Text>} */}
              </View>
              {/* )}
                  </Field> */}
              {/* <Field name="compoundShape">
                    {({field}) => ( */}
              <View style={{paddingVertical: 10}}>
                <Text style={{alignSelf: 'center', marginVertical: 10}}>
                  Respondent compound shape and size
                </Text>

                <MapScreen
                  coords={coords => {
                    setCoordinates(coords);
                  }}
                />
                {/* {errors.compoundShape && <Text>{errors.compoundShape}</Text>} */}
              </View>
              {/* )}
                  </Field> */}
            </View>
            {/* )} */}
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text style={{marginVertical: 10}}>Comment </Text>
            <TextInput
              placeholder="Comment"
              onChangeText={text => setComment(text)}
              // onBlur={handleBlur('comment')}
              value={comment}
              style={[styles.input, {height: 60, width: '60%'}]}
              numberOfLines={4}
              multiline={true}
            />
            {/* {errors.comment && <Text>{errors.comment}</Text>} */}
          </View>
        </View>
        {/* <View style={{position: 'absolute', bottom: 10, left: 0, right: 0}}> */}
        <TouchableOpacity
          style={[
            styles.button,
            {alignSelf: 'center', marginVertical: 15, width: '80%'},
          ]}
          onPress={() => {
            onSubmit();
          }}>
          <Text style={{color: 'white'}}>Submit</Text>
        </TouchableOpacity>
        {/* </View> */}
        {/* <Button onPress={handleSubmit} title="Submit" /> */}
      </ScrollView>
    </View>
    // )}
    // </Formik>
  );
};

const styles = {
  photo: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginVertical: 10,
  },
  button: {
    width: '40%',
    height: 40,
    backgroundColor: '#333',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    width: '40%',
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
  },
  consent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 10,
    alignSelf: 'center',
  },
  date: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    marginTop: 10,
  },
  container: {flex: 1, padding: 20},
  datePicker: {
    // width: '50%',
    borderRadius: 10,
    // backgroundColor: 'white',
    padding: 10,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  nameContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  imageContainer: {alignItems: 'center', justifyContent: 'center'},
  uploadImage: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginVertical: 10,
  },
  location: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
};

export default RegistrationForm;
