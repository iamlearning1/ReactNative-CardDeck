import React from "react";
import {
  View,
  Animated,
  PanResponder,
  StyleSheet,
  Dimensions,
  LayoutAnimation,
  UIManager
} from "react-native";

const SCREEN_HEIGHT = Dimensions.get("window").height;
const SWIPE_THRESHOLD = 0.25 * SCREEN_HEIGHT;
const DURATION = 250;

export default class Swipeup extends React.Component {
  constructor(props) {
    super(props);
    const position = new Animated.ValueXY();
    const panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (event, gesture) => {
        position.setValue({ y: gesture.dy });
      },
      onPanResponderRelease: (event, gesture) => {
        if (gesture.dy > SWIPE_THRESHOLD) {
          this.forceSwipe("up");
        } else if (gesture.dy < -SWIPE_THRESHOLD) {
          this.forceSwipe("down");
        } else {
          this.resetPosition();
        }
      }
    });
    this.state = { position, panResponder, index: 0 };
  }

  componentWillUpdate() {
    UIManager.setLayoutAnimationEnabledExperimental &&
      UIManager.setLayoutAnimationEnabledExperimental(true);
    LayoutAnimation.spring();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.data != this.props.data) {
      this.setState({ index: 0 });
    }
  }

  forceSwipe = direction => {
    Animated.timing(this.state.position, {
      toValue: {
        x: 0,
        y: direction == "up" ? SCREEN_HEIGHT * 2 : -SCREEN_HEIGHT * 5
      },
      duration: DURATION
    }).start(() => this.onSwipeComplete(direction));
  };

  resetPosition = () => {
    Animated.spring(this.state.position, {
      toValue: { x: 0, y: 0 }
    }).start();
  };

  onSwipeComplete = direction => {
    // if (direction == "up") {
    //   setTimeout(() => {
    //     this.setState(prevState => ({
    //       index: prevState.index + 1
    //     }));
    //     this.state.position.setValue({ x: 0, y: 0 });
    //   }, DURATION);
    // } else {
    this.setState(prevState => ({
      index: prevState.index + 1
    }));
    this.state.position.setValue({ x: 0, y: 0 });
    // }
  };

  getCardStyle = () => {
    const rotate = this.state.position.y.interpolate({
      inputRange: [-SCREEN_HEIGHT * 1.5, 0, SCREEN_HEIGHT * 1.5],
      outputRange: ["-360deg", "0deg", "360deg"]
    });
    return {
      ...this.state.position.getLayout(),
      transform: [{ rotateX: rotate }]
    };
  };

  renderCards = () => {
    if (this.state.index >= this.props.data.length) {
      return this.props.renderNoMoreCards();
    }
    return this.props.data
      .map((item, index) => {
        if (index < this.state.index) return null;
        if (index == this.state.index) {
          return (
            <Animated.View
              key={item.id}
              style={[this.getCardStyle(), styles.cardStyle, { zIndex: 100 }]}
              {...this.state.panResponder.panHandlers}
            >
              {this.props.renderCard(item, "Swipe up and down")}
            </Animated.View>
          );
        }
        return (
          <Animated.View
            style={[styles.cardStyle, { top: 10 * (index - this.state.index) }]}
            key={item.id}
          >
            {this.props.renderCard(item, "Swipe up and down")}
          </Animated.View>
        );
      })
      .reverse();
  };
  render() {
    return <View>{this.renderCards()}</View>;
  }
}

const styles = StyleSheet.create({
  cardStyle: {
    position: "absolute",
    width: Dimensions.get("screen").width
  }
});
