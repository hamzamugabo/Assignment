import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Image,
  TouchableOpacity,
} from 'react-native';
import {Formik, Field} from 'formik';
import * as yup from 'yup';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

const RegistrationForm = () => {
  const [photo, setPhoto] = useState(null);
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

  // const selectPhoto = () => {
  //   ImagePicker.showImagePicker(
  //     {
  //       title: 'Select Photo',
  //       storageOptions: {
  //         skipBackup: true,
  //         path: 'images',
  //       },
  //     },
  //     response => {
  //       if (response.didCancel) {
  //         console.log('User cancelled image picker');
  //       } else if (response.error) {
  //         console.log('ImagePicker Error: ', response.error);
  //       } else {
  //         setPhoto({uri: response.uri});
  //       }
  //     },
  //   );
  // };

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
        <View>
          <Text>Do you consent to be registered on our program?</Text>
          <Field name="consent">
            {({field}) => (
              <View>
                <Text>Yes</Text>
                <TextInput
                  {...field}
                  placeholder="Consent"
                  onChangeText={handleChange('consent')}
                  onBlur={handleBlur('consent')}
                  value={values.consent}
                />
                {errors.consent && <Text>{errors.consent}</Text>}
              </View>
            )}
          </Field>
          <Text>Registration date: {new Date().toDateString()}</Text>
          <Field name="name">
            {({field}) => (
              <View>
                <Text>Respondent Name</Text>
                <TextInput
                  {...field}
                  placeholder="Name"
                  onChangeText={handleChange('name')}
                  onBlur={handleBlur('name')}
                  value={values.name}
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
              <TouchableOpacity onPress={takePhoto}>
                <Text>Take Photo</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={selectFromLibrary}>
                <Text>Select from Library</Text>
              </TouchableOpacity>
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
};

export default RegistrationForm;
