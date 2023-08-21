import * as React from "react";
import {FC, useMemo} from "react";
import {StyleSheet} from 'react-native';
import {Button, IconButton, Text} from 'react-native-paper';

type ButtonRoundProps = Omit<React.ComponentProps<typeof Button>, 'style'> & {
  diameter: number,
  icon?: string
  text?: string,
  style?: {[key: string]: any}
}

export const ButtonRound: FC<ButtonRoundProps> = (
  {
    icon,
    diameter,
    style,
    text,
    ...args
  }) => {


  const buttonStyles = useMemo(() => {
    return {
      ...styles.button,
      ...{
        borderRadius: diameter / 2,
        width: diameter,
        height: diameter,
        minHeight: diameter,
        minWidth: diameter
      },
      ...style
    }
  }, [style]);

  const TextBtn = () => (
    <Button
      mode="contained"
      style={buttonStyles}
      {...args}
    >
      <Text
        numberOfLines={1}
        style={{
          width: diameter,
          height: diameter,
          color: style?.color || 'white',
          fontSize: diameter/2.5,
          lineHeight: diameter
        }}>
        {text}
      </Text>
    </Button>
  )

  const IconBtn = () => (
    <IconButton
      style={buttonStyles}
      size={diameter/2.5}
      icon={icon}
      iconColor={style?.color || 'white'}
      {...args}
    />
  )

  return icon ? <IconBtn/> : <TextBtn/>;
}

const styles = StyleSheet.create({
  button: {
    flex: 1,
    flexGrow: 0,
    flexShrink: 0,
    flexBasis: 'auto',
    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: 'transparent',

    margin: 6,

    minWidth: 'auto',
    minHeight: 'auto',

    overflow: 'hidden'
  }
});
