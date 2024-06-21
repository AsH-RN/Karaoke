/* eslint-disable prettier/prettier */
import React, {useState, useEffect, useRef} from 'react';
import {View, ScrollView, Text, StyleSheet, Dimensions} from 'react-native';
import Video from 'react-native-video';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import Slider from '@react-native-community/slider';
import LinearGradient from 'react-native-linear-gradient';
import {COLORS} from './Color';
import {FONTS} from './Font';

const {height} = Dimensions.get('window');

const SongListComponent = ({lyrics, audioUrl, isPlaying}) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentLyricIndex, setCurrentLyricIndex] = useState(0);
  const scrollViewRef = useRef(null);
  const [parsedLyrics, setParsedLyrics] = useState([]);
  const videoPlayerRef = useRef(null);

  useEffect(() => {
    const parsedLyrics = lyrics
      .split('\n')
      .map(line => {
        const timeMatch = line.match(/\[(\d{2}):(\d{2})(?:\.(\d{2}))?]/);
        if (timeMatch) {
          const minutes = parseInt(timeMatch[1]);
          const seconds = parseInt(timeMatch[2]);
          const totalSeconds = minutes * 60 + seconds;
          const text = line.slice(timeMatch[0].length).trim();
          return {
            time: totalSeconds,
            text: text,
          };
        }
        return null;
      })
      .filter(Boolean);

    setParsedLyrics(parsedLyrics);
  }, [lyrics]);

  useEffect(() => {
    if (parsedLyrics.length > 0) {
      const index = parsedLyrics.findIndex(line => line.time > currentTime) - 1;
      setCurrentLyricIndex(index >= 0 ? index : 0);
    }
  }, [currentTime, parsedLyrics]);

  useEffect(() => {
    if (scrollViewRef.current && currentLyricIndex >= 0) {
      scrollViewRef.current.scrollTo({
        y: currentLyricIndex * 40,
        animated: true,
      });
    }
  }, [currentLyricIndex]);

  // Function to format time as mm:ss
  const formatTime = time => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.sliderContainer}>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={duration}
          value={currentTime}
          onSlidingComplete={value => {
            // Seek to the new time
            if (videoPlayerRef.current) {
              videoPlayerRef.current.seek(value);
            }
          }}
          minimumTrackTintColor={COLORS.pink}
          maximumTrackTintColor={COLORS.white}
          thumbTintColor="transparent"
          thumbStyle={styles.hiddenThumb}
        />
      </View>

      {/* Display current time and duration */}
      <View style={styles.timeContainer}>
        <Text style={styles.timeText}>{formatTime(currentTime)}</Text>
        <Text style={styles.timeText}>{formatTime(duration)}</Text>
      </View>

      <ScrollView
        ref={scrollViewRef}
        style={styles.lyricsContainer}
        contentContainerStyle={styles.lyricsContentContainer}>
        {parsedLyrics.map((line, index) => (
          <Text
            key={index}
            style={[
              styles.lyricText,
              index === currentLyricIndex ? styles.activeLyric : {},
            ]}>
            {line.text}
          </Text>
        ))}
      </ScrollView>

      <Video
        ref={videoPlayerRef}
        source={{uri: audioUrl}}
        paused={!isPlaying}
        onProgress={({currentTime}) => setCurrentTime(currentTime)}
        onLoad={({duration}) => setDuration(duration)}
        onError={error => console.log('Video error:', error)}
        style={styles.audioPlayer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: hp(60),
    backgroundColor: '#000',
    paddingTop: 50,
  },
  lyricsContainer: {
    height: height - 100,
  },
  lyricsContentContainer: {
    paddingBottom: 100,
  },
  lyricText: {
    fontSize: wp(3.9),
    color: COLORS.white,
    textAlign: 'center',
    fontFamily: FONTS.semiBold,
    paddingVertical: 10,
  },
  activeLyric: {
    fontSize: wp(6),
    color: COLORS.pink,
    fontFamily: FONTS.semiBold,
  },
  sliderContainer: {
    width: '100%',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  slider: {
    width: '110%',
    height: 10,
    borderRadius: 5,
  },
  hiddenThumb: {
    width: 0,
    height: 0,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  timeText: {
    color: COLORS.white,
    fontFamily: FONTS.regular,
    fontSize: wp(3.5),
  },
  audioPlayer: {
    height: 0,
    width: 0,
  },
});

export default SongListComponent;
