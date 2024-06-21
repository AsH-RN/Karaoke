/* eslint-disable prettier/prettier */
import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';

const RunningLyrics = ({lyrics, currentTime}) => {
  const [currentLine, setCurrentLine] = useState('');

  useEffect(() => {
    // Find the current lyrics line based on currentTime
    const current = lyrics.find(lyric => currentTime >= lyric.time);
    if (current) {
      setCurrentLine(current.text);
    }
  }, [currentTime, lyrics]);

  return (
    <View style={styles.lyricsContainer}>
      <ScrollView>
        <Text style={styles.lyricText}>{currentLine}</Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  lyricsContainer: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#1a1a1a',
  },
  lyricText: {
    fontSize: 20,
    color: '#fff',
    textAlign: 'center',
  },
});

export default RunningLyrics;
