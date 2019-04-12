import React, { Component } from "react";
import {
  View,
  StyleSheet,
  Animated,
  PanResponder,
  Dimensions,
  LayoutAnimation,
  UIManager
} from "react-native";

const SCREEN_WIDTH = Dimensions.get("window").width;
const SWIPE_THRESHOLD = 0.25 * SCREEN_WIDTH;
const DURATION = 250;

export default class Deck extends Component {
  static defaultProps = {
    onSwipeLeft: () => {},
    onSwipeRight: () => {}
  };

  constructor(props) {
    super(props);
    const postion = new Animated.ValueXY();
    const panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (event, gesture) => {
        postion.setValue({ x: gesture.dx });
      },
      onPanResponderRelease: (event, gesture) => {
        if (gesture.dx > SWIPE_THRESHOLD) {
          this.forceSwipe("right");
        } else if (gesture.dx < -SWIPE_THRESHOLD) {
          this.forceSwipe("left");
        } else {
          this.resetPosition();
        }
      }
    });
    this.state = { panResponder, postion, index: 0 };
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
    Animated.timing(this.state.postion, {
      toValue: {
        x: direction == "right" ? SCREEN_WIDTH * 2 : -SCREEN_WIDTH * 2,
        y: 0
      },
      duration: DURATION
    }).start(() => this.onSwipeComplete(direction));
  };

  onSwipeComplete = direction => {
    const { onSwipeLeft, onSwipeRight, data } = this.props;
    const item = data[this.state.index];
    direction == "right" ? onSwipeRight(item) : onSwipeLeft(item);
    this.state.postion.setValue({ x: 0, y: 0 });
    this.setState(prevState => ({
      index: prevState.index + 1
    }));
  };

  resetPosition = () => {
    Animated.spring(this.state.postion, {
      toValue: { x: 0, y: 0 }
    }).start();
  };

  getCardStyle = () => {
    const { postion } = this.state;
    const rotate = postion.x.interpolate({
      inputRange: [-SCREEN_WIDTH * 2, 0, SCREEN_WIDTH * 2],
      outputRange: ["-120deg", "0deg", "120deg"]
    });
    return {
      ...postion.getLayout(),
      transform: [{ rotate }]
    };
  };

  renderCards = () => {
    if (this.state.index >= this.props.data.length) {
      return this.props.renderNoMoreCards();
    }
    return this.props.data
      .map((item, i) => {
        if (i < this.state.index) return null;
        if (i == this.state.index) {
          return (
            <Animated.View
              key={item.id}
              style={[this.getCardStyle(), styles.cardStyle]}
              {...this.state.panResponder.panHandlers}
            >
              {this.props.renderCard(item, "Swipe left and right")}
            </Animated.View>
          );
        }
        return (
          <Animated.View
            style={[styles.cardStyle, { top: 10 * (i - this.state.index) }]}
            key={item.id}
          >
            {this.props.renderCard(item, "Swipe left and right")}
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
    width: SCREEN_WIDTH
  }
});
