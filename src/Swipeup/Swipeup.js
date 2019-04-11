import React from "react";
import { Text, View, Animated, PanResponder, StyleSheet } from "react-native";

export default class Swipeup extends React.Component {
  constructor(props) {
    super(props);
    const position = new Animated.ValueXY();
    const panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (event, gesture) => {
        position.setValue({ y: gesture.dy });
      },
      onPanResponderRelease: () => {}
    });
    this.state = { position, panResponder };
  }

  getCardStyle = () => {
    return this.state.position.getLayout();
    // const rotate = this.state.position.x.interpolate({
    //     inputRange = []
    // })
  };

  renderCards = () => {
    return this.props.data.map((item, index) => {
      if (index == 0) {
        return (
          <Animated.View
            key={item.id}
            style={[this.getCardStyle()]}
            {...this.state.panResponder.panHandlers}
          >
            {this.props.renderCard(item)}
          </Animated.View>
        );
      }
      return (
        <Animated.View key={item.id} {...this.state.panResponder.panHandlers}>
          {this.props.renderCard(item)}
        </Animated.View>
      );
    });
  };
  render() {
    return <View>{this.renderCards()}</View>;
  }
}
