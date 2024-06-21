/* eslint-disable prettier/prettier */
import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import Sound from 'react-native-sound';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {LinearGradient} from 'react-native-linear-gradient';
import HeaderComponent from '../component/HeaderComponent';
import SongListScreen from '../component/SongListComponent';
import CustomLoader from '../component/CustomLoader';
import {COLORS} from '../component/Color';
import {IMAGES} from '../component/Images';
import {FONTS} from '../component/Font';

const PlayBackScreen = props => {
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentLyric, setCurrentLyric] = useState('');
  const [songs, setSongs] = useState([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [currentSong, setCurrentSong] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSong();
  }, []);

  useEffect(() => {
    if (currentSong) {
      const soundInstance = new Sound(
        currentSong.url,
        Sound.MAIN_BUNDLE,
        error => {
          if (error) {
            console.log('Failed to load the sound', error);
            return;
          }
          setSound(soundInstance);
        },
      );

      return () => {
        if (soundInstance) {
          soundInstance.release();
        }
      };
    }
  }, [currentSong]);

  useEffect(() => {
    if (sound) {
      const interval = setInterval(() => {
        sound.getCurrentTime(seconds => {
          setCurrentTime(seconds * 1000);
        });
      }, 100);

      return () => clearInterval(interval);
    }
  }, [sound]);

  const fetchSong = async () => {
    try {
      const requestOptions = {
        method: 'GET',
        redirect: 'follow',
      };

      fetch(
        'https://dev-api.conqt.com/api/tc-song-vault/get-all-song-list?page=1&limit=0',
        requestOptions,
      )
        .then(response => response.json())
        .then(result => {
          console.log(result);
          // const x = JSON.stringify(result.data[0].lyrics);
          // console.log(x);
          setSongs(result.data);
          setIsLoading(false);
        });
    } catch (error) {
      console.log(error.message);
    }
  };

  const playPauseSound = () => {
    if (isPlaying) {
      sound?.pause();
    } else {
      sound?.play();
    }
    setIsPlaying(!isPlaying);
  };

  return isLoading ? (
    <CustomLoader />
  ) : (
    <SafeAreaView style={styles.container}>
      <HeaderComponent />

      <View style={styles.homeContainer}>
        <SongListScreen
          lyrics={songs[0]?.lyrics}
          audioUrl={songs[0]?.file_name_vocal}
          isPlaying={isPlaying}
        />

        <View style={styles.lyricsContainer}>
          <Text style={styles.lyricText}>{currentLyric}</Text>
        </View>

        <View style={styles.songInfoContainer}>
          <Image
            source={{uri: songs[0]?.album_art}}
            style={styles.coverImage}
          />

          <View style={styles.songInfo}>
            <View style={{width: wp(70)}}>
              <Text style={styles.songTitle} numberOfLines={1}>
                {songs[0]?.album_name}
              </Text>
            </View>

            <Text style={styles.artistName}> {songs[0]?.artists}</Text>
          </View>

          <TouchableOpacity>
            <FontAwesome
              name="heart"
              size={24}
              color={COLORS.white}
              style={{marginRight: wp(2)}}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.controlsContainer}>
          <TouchableOpacity>
            <Ionicons name="headset" size={32} color={COLORS.white} />
          </TouchableOpacity>

          <TouchableOpacity>
            <Image
              source={IMAGES.option}
              resizeMode="cover"
              style={styles.bottomIcon}
            />
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={1} onPress={playPauseSound}>
            <LinearGradient
              colors={['#ff00ff', '#ff99cc', '#ff0066']}
              start={{x: 1, y: 1}}
              end={{x: 0, y: 0}}
              style={styles.gradientCircle}>
              <Image
                source={isPlaying ? IMAGES.pause : IMAGES.play}
                resizeMode="cover"
                style={{
                  height: hp(4.5),
                  aspectRatio: 1 / 1,
                  tintColor: COLORS.white,
                }}
              />
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity>
            <Image
              source={IMAGES.repeat}
              resizeMode="cover"
              style={{height: hp(4.5), aspectRatio: 1 / 1}}
            />
          </TouchableOpacity>

          <TouchableOpacity>
            <Image
              source={IMAGES.check}
              resizeMode="cover"
              style={styles.bottomIcon}
            />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default PlayBackScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  homeContainer: {
    flex: 1,
  },
  lyricsContainer: {
    flex: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lyricText: {
    color: '#fff',
    fontSize: 24,
    textAlign: 'center',
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginVertical: 20,
  },
  songInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  coverImage: {
    width: 50,
    height: 50,
    borderRadius: 6,
    marginLeft: wp(2),
  },
  songInfo: {
    flex: 1,
    marginHorizontal: wp(4),
  },
  songTitle: {
    fontSize: 16,
    fontFamily: FONTS.bold,
    color: COLORS.white,
  },
  artistName: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: COLORS.white,
  },
  bottomIcon: {
    height: hp(4),
    aspectRatio: 1 / 1,
  },
  gradientCircle: {
    width: 70,
    height: 70,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
