import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, Animated, Vibration } from 'react-native';
import { Audio } from 'expo-av';

const Quiz1: React.FC = () => {
  const questions = [
    {
      question: "Investing is the act of allocating resources, usually __________, with the expectation of generating an income or profit.",
      options: ["money", "time", "effort"],
      correctAnswer: "money"
    },
    {
      question: "Unlike __________, which involves setting money aside, investing puts your money to work with the potential for higher returns.",
      options: ["borrowing", "saving", "spending"],
      correctAnswer: "saving"
    },
    {
      question: "Through investing, you can grow your __________ over time, leveraging the power of compound interest and market growth.",
      options: ["debt", "wealth", "expenses"],
      correctAnswer: "wealth"
    },
    {
      question: "Investments often provide returns that outpace __________, helping to preserve and increase your purchasing power.",
      options: ["inflation", "taxes", "interest"],
      correctAnswer: "inflation"
    },
    {
      question: "Whether it's buying a home, funding education, or planning for retirement, investing can help you achieve significant financial __________.",
      options: ["losses", "goals", "risks"],
      correctAnswer: "goals"
    },
    {
      question: "Investments such as stocks, bonds, and real estate can generate ongoing __________ through dividends, interest, and rental payments.",
      options: ["income", "debt", "expenses"],
      correctAnswer: "income"
    },
    {
      question: "__________ is important because it can help you accumulate wealth, beat inflation, achieve financial goals, and generate income.",
      options: ["Spending", "Borrowing", "Investing"],
      correctAnswer: "Investing"
    }
  ];

  const [answers, setAnswers] = useState(Array(questions.length).fill(''));
  const [isCorrect, setIsCorrect] = useState(Array(questions.length).fill(false));
  const [modalVisible, setModalVisible] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number | null>(null);
  const [animationValue] = useState(new Animated.Value(0));

  const playSound = async (isCorrect: boolean) => {
    const { sound } = await Audio.Sound.createAsync(
      isCorrect
        ? require('@/assets/sounds/correct.wav')
        : require('@/assets/sounds/wrong.wav')
    );
    await sound.playAsync();
  };

  const handleAnswerChange = async (index: number, answer: string) => {
    const newAnswers = [...answers];
    const newIsCorrect = [...isCorrect];
    newAnswers[index] = answer;
    newIsCorrect[index] = answer === questions[index].correctAnswer;
    setAnswers(newAnswers);
    setIsCorrect(newIsCorrect);
    setModalVisible(false);
    setCurrentQuestionIndex(null);

    // Play sound and vibrate if incorrect
    await playSound(newIsCorrect[index]);
    if (!newIsCorrect[index]) {
      Vibration.vibrate();
    }

    // Trigger animation
    Animated.sequence([
      Animated.timing(animationValue, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(animationValue, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      })
    ]).start();
  };

  const handleBlankPress = (index: number) => {
    setCurrentQuestionIndex(index);
    setModalVisible(true);
  };

  const getBorderColor = (index: number) => {
    if (answers[index] === '') return '#DDD';
    return isCorrect[index] ? 'green' : 'red';
  };

  const animatedBackgroundColor = animationValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['#302F69', '#4CAF50']
  });

  return (
    <ScrollView style={styles.scrollView}>
      <Animated.View style={[styles.container, { backgroundColor: animatedBackgroundColor }]}>
        <Text style={styles.title}>Quiz: Fill-in-the-Blanks</Text>
        {questions.map((q, index) => (
          <View key={index} style={styles.questionContainer}>
            <Text style={styles.questionText}>
              {q.question.split('__________')[0]}
              <TouchableOpacity onPress={() => handleBlankPress(index)} style={[styles.blank, { borderColor: getBorderColor(index) }]}>
                <Text style={styles.blankText}>{answers[index] || '__________'}</Text>
              </TouchableOpacity>
              {q.question.split('__________')[1]}
            </Text>
          </View>
        ))}
      </Animated.View>
      {currentQuestionIndex !== null && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Choose the correct answer</Text>
              {questions[currentQuestionIndex].options.map((option, optionIndex) => (
                <TouchableOpacity
                  key={optionIndex}
                  onPress={() => handleAnswerChange(currentQuestionIndex, option)}
                  style={styles.optionButton}
                >
                  <Text style={styles.optionText}>{option}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Modal>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 20,
    textAlign: 'center',
  },
  questionContainer: {
    marginBottom: 20,
  },
  questionText: {
    fontSize: 18,
    color: '#FFF',
    marginBottom: 10,
  },
  blank: {
    borderBottomWidth: 2,
    paddingHorizontal: 5,
    marginHorizontal: 2,
  },
  blankText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  modalContent: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  optionButton: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#DDD',
    width: '100%',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 16,
    color: '#000',
  },
});

export default Quiz1;
