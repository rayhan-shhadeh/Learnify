import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import LottieView from "lottie-react-native";

interface StreakFireProps {
  streak: number;
  visible?: boolean;
  onFinish: () => void;
}

const StreakFire: React.FC<StreakFireProps> = ({
  streak,
  visible,
  onFinish,
}) => {
  const animation = useRef<LottieView>(null);
  const celebrate = useRef<LottieView>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }).start(() => {
        animation.current?.play();
        celebrate.current?.play();
      });
    }
  }, [visible]);
  if (!visible) return null;
  //n

  const handleAnimationFinish = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 900,
      useNativeDriver: true,
    }).start(() => onFinish());
  };

  return (
    <>
      <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
        <View style={styles.parentContainer}>
          <View style={styles.container}>
            <LottieView
              ref={animation}
              source={require("../../../assets/fire.json")}
              autoPlay
              loop={false}
              speed={1}
              onAnimationFinish={handleAnimationFinish}
              style={styles.fire}
            />
            <Text style={styles.streakText}>{streak} days in a row!</Text>
            {/* <Text style={styles.streakText}>🔥 {streak}</Text> */}
          </View>
          <View style={styles.celebrateContainer}>
            <LottieView
              ref={celebrate}
              source={require("../../../assets/celebrate.json")}
              autoPlay
              loop={false}
              style={styles.celebrate}
              speed={1} // Adjust the speed of the animation
            />
          </View>
        </View>
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  fire: {
    width: 200,
    height: 200,
    // marginBottom: 20,
    // position: "relative",
    // top: 0,
    // left: 0,
    // right: 0,
    // bottom: 0,
    // zIndex: 1,
  },
  celebrate: {
    position: "absolute",
    width: 500,
    height: 600,
    // top: 0,
    // left: 0,
    // right: 0,
    // bottom: 0,
    // zIndex: 1,
  },
  streakText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFA500",
    marginTop: 20,
  },
  celebrateContainer: {
    position: "absolute",
    // ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    // zIndex: 1,
    width: "100%",
    height: "100%",
  },
  parentContainer: {
    // flex: 1,
    // alignItems: "center",
    // justifyContent: "center",
    backgroundColor: "#fff",
    // width: "100%",
    // height: "100%",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
});

export default StreakFire;
