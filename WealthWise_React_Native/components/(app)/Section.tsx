import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Image } from 'react-native';
import { collection, query, getDocs, QuerySnapshot, DocumentData, where } from 'firebase/firestore';
import { db } from '@/configs/FirebaseConfig';
import { useRouter } from 'expo-router';

type SectionProps = {
  title: string;
};

const Section: React.FC<SectionProps> = ({ title }) => {
  const [modules, setModules] = useState<DocumentData[]>([]);
  const router = useRouter();

  // Local assets mapping based on module names
  const imageMapping: { [key: string]: any } = {
    'Investing': require('../../assets/images/investing.png'),
    'Budgeting': require('../../assets/images/budgeting.png'),
    'Banks': require('../../assets/images/banks.png'),
    // 'Entrepreneurship': require('../../assets/images/entrepreneurship.png'),
    // Add more mappings for other module names
  };


  useEffect(() => {
    const getSectionList = async () => {
      try {
        const q = query(collection(db, 'Section'), where('type', '==', title));
        const querySnapshot: QuerySnapshot<DocumentData> = await getDocs(q);

        const fetchedModules: DocumentData[] = [];
        querySnapshot.forEach((doc) => {
          fetchedModules.push(doc.data());
        });

        setModules(fetchedModules);
      } catch (error) {
        console.error('Error getting documents: ', error);
      }
    };

    getSectionList();
  }, [title]);

  const handlePress = (item: DocumentData) => {
    console.log('Pressed item:', item.moduleName);
    router.push(`/modulelist/${item.moduleName}`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <TouchableOpacity>
          <Text style={styles.explore}>Explore</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        horizontal
        data={modules}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.box} onPress={() => handlePress(item)}>
            <Image
              source={imageMapping[item.moduleName] || require('../../assets/images/default.png')}
              style={styles.image}
            />
            <Text style={styles.boxText}>{item.moduleName}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.moduleName}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.flatListContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 25,
    paddingHorizontal: 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
    paddingHorizontal: 24,
  },
  title: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  explore: {
    color: '#686185',
    fontSize: 16,
  },
  flatListContent: {
    paddingHorizontal: 7,
  },
  box: {
    backgroundColor: '#150c25',
    margin: 4,
    marginRight: 6,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 4,
  },
  image: {
    width: 150,
    height: 130,
    borderRadius: 8,
    marginBottom: 8,
  },
  boxText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
});

export default Section;
