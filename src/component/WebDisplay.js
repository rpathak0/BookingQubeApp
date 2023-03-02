import React from "react";
import RenderHTML from "react-native-render-html";
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { useWindowDimensions } from "react-native";

const WebDisplay = React.memo(function WebDisplay({html}) {
  const {width: contentWidth} = useWindowDimensions();
  const tagsStyles = {
    p: {
      fontSize: wp(3.5)
    }
  };
  return (
    <RenderHTML
      contentWidth={contentWidth}
      source={{html}}
      tagsStyles={tagsStyles}
    />
  );
});

export default WebDisplay;