import { View, Text, StyleSheet, ScrollView, ImageBackground, Pressable } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { Entypo } from '@expo/vector-icons';

const PrivacyPolicy = () => {
  const navigation = useNavigation();

  return (
    <ImageBackground source={require('../../../assets/images/home.jpg')} style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.header}>Gizlilik Politikası</Text>
        <View style={styles.separator} />

        <ScrollView contentContainerStyle={styles.contentContainer}>
          <Text style={styles.content}>
            Uygulamamızın kullanımıyla ilgili olarak, kullanıcıların gizliliğini korumak amacıyla aşağıdaki
            politika uygulanır. Bu politika, uygulamanın nasıl topladığı, kullanığı ve paylaştığı kişisel
            bilgileri açıklar. Bu politikadaki terimler, uygulamamızı kullanırken kabul ettiğiniz hükümleri ve
            koşulları tanımlamak içindir.
          </Text>

          <Text style={styles.sectionHeader}>Toplanan Bilgiler</Text>
          <Text style={styles.content}>
            Uygulamamız, kullanıcılar tarafından sağlanan kişisel bilgileri toplayabilir. Bu bilgiler, kullanıcılar
            tarafından sağlanan ad, e-posta adresi ve diğer iletişim bilgilerini içerebilir.
          </Text>

          <Text style={styles.sectionHeader}>Kullanılan Bilgiler</Text>
          <Text style={styles.content}>
            Toplanan bilgiler, kullanıcıların deneyimlerini kişiselleştirmek, hizmetlerimizi sağlamak, teknik
            sorunları teşhis etmek, analizler yapmak ve daha iyi hizmet sunmak için kullanılabilir.
          </Text>

          <Text style={styles.sectionHeader}>Bilgi Paylaşımı</Text>
          <Text style={styles.content}>
            Uygulamamız, kişisel bilgileri hiçbir şekilde üçüncü taraflarla paylaşmaz veya satmaz. Ancak yasal
            gereklilikler veya uygulama politikalarının korunması durumunda, bilgiler yetkili makamlarla paylaşılabilir.
          </Text>

          <Text style={styles.sectionHeader}>Değişiklikler</Text>
          <Text style={styles.content}>
            Gizlilik politikamızı zaman zaman güncelleyebiliriz. Bu değişiklikler herhangi bir kullanıcıya
            önceden bildirilmeden yapılabilir. Bu sayfada yayımlanan herhangi bir değişiklik, bu sayfada
            yayımlandığı anda yürürlüğe girer.
          </Text>
        </ScrollView>

        <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
          <Entypo name="chevron-left" size={24} color="white" />
        </Pressable>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
},
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 15,
  },
  header: {
    fontSize: 25,
    fontWeight: 'light',
    color: 'white',
    textAlign: 'center',
    marginBottom: 10,
  },
  separator: {
    height: 1,
    backgroundColor: 'rgb(169,169,169)',
    marginVertical: 10,
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  content: {
    color: 'white',
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',

  },
  sectionHeader: {
    color: 'white',
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  backButton: {
    position: 'absolute',
    marginTop: 740,
    right: 20,
    backgroundColor: 'rgba(169,169,169, 0.2)',
    borderRadius: 50,
    padding: 10,
  },
});

export default PrivacyPolicy;
