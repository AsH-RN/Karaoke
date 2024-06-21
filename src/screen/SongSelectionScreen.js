/* eslint-disable prettier/prettier */
import React from 'react';
import {View, Text, Button, FlatList} from 'react-native';

const songs = [
  {id: '1', title: 'Song 1', file: require('./assets/song1.mp3')},
  {id: '2', title: 'Song 2', file: require('./assets/song2.mp3')},
  // Add more songs as needed
];

export default function SongSelectionScreen({navigation}) {
  return (
    <View>
      <Text>Select a Song</Text>
      <FlatList
        data={songs}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <Button
            title={item.title}
            onPress={() => navigation.navigate('Playback', {song: item})}
          />
        )}
      />
    </View>
  );
}
