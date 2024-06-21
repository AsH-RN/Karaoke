/* eslint-disable prettier/prettier */
import React, {useEffect, useState} from 'react';
import {Text, View, StyleSheet} from 'react-native';

const PitchLine = ({song}) => {
  const [pitchLine, setPitchLine] = useState('');

  useEffect(() => {
    // Generate pitch line based on song data
    if (song) {
      const {title, artist} = song;
      setPitchLine(
        `Listen to "${title}" by ${artist} with our React Native app powered by the Conqt Song Vault API!`,
      );
    }
  }, [song]);

  return (
    <View style={styles.container}>
      <Text style={styles.pitch}>{pitchLine}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    marginBottom: 10,
  },
  pitch: {
    fontSize: 16,
    textAlign: 'center',
  },
});

export default PitchLine;
