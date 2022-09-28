import { useEffect, useState, } from 'react'

import { Image, FlatList, TouchableOpacity, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native'
import { Heading } from '../../components/Heading';
import { GameCard, GameCardProps } from '../../components/GameCard';
import { DiscordLogo } from 'phosphor-react-native';

import * as AuthSession from 'expo-auth-session';

import logoImg from '../../assets/logo-nlw-esports.png';

import { styles } from './styles';
import { Background } from '../../components/Background';
import { THEME } from '../../theme';

export function Home() {
  const [games, setGames] = useState<GameCardProps[]>([]);

  const navigation = useNavigation();

  function handleOpenGame({ id, title, bannerUrl }: GameCardProps) {
    navigation.navigate('game', { id, title, bannerUrl });
  }

  useEffect(() => {
    fetch('http://192.168.1.4:3335/games')
      .then(res => res.json())
      .then(data => setGames(data));
  }, []);

  async function handleDiscordSignIn() {
    const response = await AuthSession.startAsync({
      authUrl: "https://discord.com/api/oauth2/authorize?client_id=1024471652660162582&redirect_uri=https%3A%2F%2Fauth.expo.io%2F%40kentaurus%2Fmobile&response_type=token&scope=identify"
    });

    fetch('https://discord.com/api/users/@me', {
      headers: {
        'authorization': `Bearer ${response.params.access_token}`
      }
    })
      .then(response => response.json())
      .then(data => console.log(data))

  }

  return (
    <Background>
      <SafeAreaView style={styles.container} >
        <Image
          source={logoImg}
          style={styles.logo}
        />
        <Heading
          title="Encontre seu Duo!"
          subtitle="Selecione o game que deseja jogar"
        />

        <FlatList contentContainerStyle={styles.contentList}
          data={games}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <GameCard
              data={item}
              onPress={() => handleOpenGame(item)} />
          )
          }
          showsHorizontalScrollIndicator={false}
          horizontal
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleDiscordSignIn}>
          <DiscordLogo color={THEME.COLORS.TEXT}
            size={20} />

          <Text style={styles.buttonTitle}>
            Entrar com Discord
          </Text>

        </TouchableOpacity>
      </SafeAreaView>
    </Background>
  );
}