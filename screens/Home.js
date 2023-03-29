import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Image,
  TouchableOpacity,
  Switch,
  Platform,
} from 'react-native';
import {Formik, Field} from 'formik';
import * as yup from 'yup';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';

const RegistrationForm = () => {
  const [photo, setPhoto] = useState(null);

  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const validationSchema = yup.object().shape({
    consent: yup.bool().required('Please consent to register'),
    name: yup.string().required('Please enter your name'),
    location: yup.string().required('Please enter your location'),
    compoundShape: yup
      .string()
      .required('Please enter your compound shape and size'),
  });

  const onSubmit = values => {
    // Save data to database or API
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

  const takePhoto = () => {
    launchCamera({mediaType: 'photo', saveToPhotos: true}, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        setPhoto({uri: response.uri});
      }
    });
  };

  const selectFromLibrary = () => {
    launchImageLibrary({mediaType: 'photo'}, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        setPhoto({uri: response.uri});
      }
    });
  };

  return (
    <Formik
      initialValues={{
        consent: false,
        name: '',
        location: '',
        compoundShape: '',
      }}
      validationSchema={validationSchema}
      onSubmit={onSubmit}>
      {({handleChange, handleBlur, handleSubmit, values, errors}) => (
        <View style={{flex: 1, padding: 20}}>
          <Text style={{marginBottom: 10}}>
            Do you consent to be registered on our program?
          </Text>
          <Field name="consent">
            {({field}) => (
              <View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    marginBottom: 10,
                    alignSelf: 'center',
                  }}>
                  <Text>{isEnabled ? 'Yes' : 'No'}</Text>
                  <Switch
                    trackColor={{false: '#767577', true: '#81b0ff'}}
                    thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={toggleSwitch}
                    value={isEnabled}
                  />
                </View>

                {errors.consent && <Text>{errors.consent}</Text>}
              </View>
            )}
          </Field>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 10,
              marginTop: 10,
            }}>
            <Text style={{marginRight: 10}}>Registration date:</Text>
            <View>
              <TouchableOpacity
                style={{
                  // width: '50%',
                  borderRadius: 10,
                  backgroundColor: 'white',
                  padding: 10,
                  backgroundColor: '#333',
                }}
                onPress={showDatepicker}>
                <Text style={{color: 'white'}}>
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
          </View>
          <Field name="name">
            {({field}) => (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginVertical: 10,
                }}>
                <Text style={{marginRight: 10}}>Respondent Name:</Text>
                <TextInput
                  {...field}
                  placeholder="Name"
                  onChangeText={handleChange('name')}
                  onBlur={handleBlur('name')}
                  value={values.name}
                  style={styles.input}
                />
                {errors.name && <Text>{errors.name}</Text>}
              </View>
            )}
          </Field>
          {photo ? (
            <View>
              <Image source={photo} style={{...styles.photo}} />
              <TouchableOpacity onPress={() => setPhoto(null)}>
                <Text>Remove Photo</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View>
              {/* <TouchableOpacity onPress={selectPhoto}>
                <Text>Select Photo</Text>
              </TouchableOpacity> */}
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-around',
                  alignItems: 'center',
                  marginVertical: 10,
                }}>
                <TouchableOpacity style={styles.button} onPress={takePhoto}>
                  <Text style={{color:'white'}}>Take Photo</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.button}
                  onPress={selectFromLibrary}>
                  <Text style={{color:'white'}}>Select from Library</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          <Field name="location">
            {({field}) => (
              <View>
                <Text>Respondent Location</Text>
                <TextInput
                  {...field}
                  placeholder="Location"
                  onChangeText={handleChange('location')}
                  onBlur={handleBlur('location')}
                  value={values.location}
                />
                {errors.location && <Text>{errors.location}</Text>}
              </View>
            )}
          </Field>
          <Field name="compoundShape">
            {({field}) => (
              <View>
                <Text>Respondent compound shape and size</Text>
                <TextInput
                  {...field}
                  placeholder="Compound Shape"
                  onChangeText={handleChange('compoundShape')}
                  onBlur={handleBlur('compoundShape')}
                  value={values.compoundShape}
                />
                {errors.compoundShape && <Text>{errors.compoundShape}</Text>}
              </View>
            )}
          </Field>
          <Button onPress={handleSubmit} title="Submit" />
        </View>
      )}
    </Formik>
  );
};

const styles = {
  photo: {
    width: 200,
    height: 200,
  },
  button: {
   width:'40%',
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
};

export default RegistrationForm;
