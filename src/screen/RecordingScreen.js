/* eslint-disable prettier/prettier */
import React, {useState} from 'react';
import {View, Text, Button} from 'react-native';
import {Audio} from 'expo-av';

export default function RecordingScreen() {
  const [recording, setRecording] = useState();
  const [recordedUri, setRecordedUri] = useState();

  const startRecording = async () => {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync(
        Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY,
      );
      await recording.startAsync();
      setRecording(recording);
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  const stopRecording = async () => {
    setRecording(undefined);
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    setRecordedUri(uri);
    console.log('Recording stopped and stored at', uri);
  };

  return (
    <View>
      <Button
        title={recording ? 'Stop Recording' : 'Start Recording'}
        onPress={recording ? stopRecording : startRecording}
      />
      {recordedUri && <Text>Recorded file: {recordedUri}</Text>}
    </View>
  );
}
