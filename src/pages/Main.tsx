import {StyleSheet, useWindowDimensions, View} from "react-native";

import {ButtonRound} from "../components/ButtonRound";
import {backgroundColor, buttonBackgroundColor, textColor} from "../styles/colors";
import * as React from "react";
import {useEffect, useMemo, useState} from "react";
import {Text} from "react-native-paper";
import {margin} from "../styles/spacing";

// components could be separated into another file
const ButtonPrimary = ({style, ...args}) => {
  const buttonStyle = useMemo(()=>({
    backgroundColor: buttonBackgroundColor.primary,
    color: textColor.primary,
    ...style
  }), [style])

  return (
    <ButtonRound style={buttonStyle} {...args} />
  )
}

const ButtonSecondary = ({style, selected, ...args}) => {
  const buttonStyle = useMemo(()=>({
    backgroundColor: selected ? buttonBackgroundColor.forth : buttonBackgroundColor.secondary,
    color: selected ? textColor.tertiary : textColor.primary,
    ...style
  }), [style, selected])

  return (
    <ButtonRound
    style={buttonStyle}
    {...args}
    />
  )
}

const ButtonTertiary = ({style, ...args}) => {
  const buttonStyle = useMemo(()=>({
    backgroundColor: buttonBackgroundColor.tertiary,
    color: textColor.secondary,
      ...style
    }), [style])

  return (
    <ButtonRound style={buttonStyle} {...args} />
  )
}

const Row = ({children}) => (
  <View style={{flexDirection: "row", flexGrow: 0, flexShrink: 1, overflow: 'hidden'}}>
    {children}
  </View>
)

enum OPERATION {
  plus, minus, multiply, divide
}

const MAX_CHARACTERS = 6;

export const Main = () => {

  const [displayValue, setDisplayValue] = useState<string>('');
  const [currentOperation, setCurrentOperation] = useState<OPERATION | undefined>();
  const [lastOperation, setLastOperation] = useState<OPERATION | undefined>();

  const [accumulatedValue, setAccumulatedValue] = useState<number>(0);

  const [showAccumulator, setShowAccumulator] = useState(false);

  const [error, setError] = useState<string>('');
  const {width} = useWindowDimensions();


  useEffect(() => {
    if(currentOperation !== undefined)
      setLastOperation(currentOperation)
  }, [currentOperation])

  // constants
  const diameter = useMemo(() => {
    const containerWidth = Math.min(width, 600)
    const buttonWidth = (containerWidth / 4);
    const marginWidth = margin.base * 2;

    return Math.floor(buttonWidth - marginWidth);
  }, [width]);

  const containerWidth = diameter * 4 + margin.base * 8;

  // functions

  const testDisplayLength = (value) => {
    if(value.toString().length > MAX_CHARACTERS)
      setError('Max character length reached')
  }

  const clearCurrentValue = (displayResetValue = 0) => {

    setDisplayValue(displayResetValue.toString());
    setAccumulatedValue(0)
    setShowAccumulator(false)
    setCurrentOperation(undefined)
    setError('')
  }

  const numberPressed = (value) => {

    if(displayValue === '0') {
      setDisplayValue(value.toString());
      return;
    }

    if(currentOperation === undefined) {
      concatToCurrent(value)
    } else {
      setDisplayValue(value.toString());
      setCurrentOperation(undefined)
    }

    setShowAccumulator(false)

    function concatToCurrent(value) {
      let _currentValue = displayValue.split('');
      // if length will overflow the container then remove first character
      if(_currentValue.length > MAX_CHARACTERS) _currentValue.shift();
      setDisplayValue(_currentValue.join('') + value)
    }
  }

  const operationPressed = (operation?: OPERATION) => {

    if(currentOperation !== undefined) {
      setCurrentOperation(operation)
    } else {
      setCurrentOperation(operation);
    }

    if(displayValue && accumulatedValue && operation !== undefined) {
      accumulateOperation(operation);
      setShowAccumulator(true);
      setDisplayValue('');
    }

    if(!accumulatedValue) {
      setAccumulatedValue(Number.parseFloat(displayValue));
      // setDisplayValue('');
    }
  }

  const accumulateOperation = (operation?: OPERATION) => {

    const result = calculateNewValue();
    setAccumulatedValue(result)
    testDisplayLength(result);

    function calculateNewValue(){
      const currentValue = Number.parseFloat(displayValue);
      let result = accumulatedValue;
      if(operation === OPERATION.plus)
        result += currentValue;
      else if(operation === OPERATION.divide)
        result /= currentValue;
      else if(operation === OPERATION.minus)
        result -= currentValue;
      else if(operation === OPERATION.multiply)
        result *= currentValue;
      return result
    }
  }

  return (
    <View style={styles.container}>
      <View style={[styles.innerContainer, { width: containerWidth }]}>
        <View style={styles.displayContainer}>
          {error.length === 0 &&

            <Text
              style={{
                ...styles.text,
                fontSize: diameter,
                lineHeight: diameter
              }}>
              {showAccumulator ? accumulatedValue : displayValue || '0'}
            </Text> ||

            <Text
              style={{
                ...styles.text,
                width: containerWidth,
                fontSize: diameter/4,
                textAlign: 'center'
              }}>
              {error}
            </Text>
          }
        </View>
        <View style={styles.buttonContainer}>
          <Row>
            <ButtonTertiary diameter={diameter} text="AC" onPress={() => clearCurrentValue()}/>
            <ButtonTertiary diameter={diameter} icon='plus-minus-variant'/>
            <ButtonTertiary diameter={diameter} icon='percent' />
            <ButtonSecondary
              diameter={diameter}
              icon='division'
              selected={currentOperation === OPERATION.divide}
              onPress={()=>operationPressed(OPERATION.divide)}
            />
          </Row>
          <Row>
            <ButtonPrimary diameter={diameter} text="7" onPress={()=>numberPressed(7)}/>
            <ButtonPrimary diameter={diameter} text="8" onPress={()=>numberPressed(8)}/>
            <ButtonPrimary diameter={diameter} text="9" onPress={()=>numberPressed(9)}/>
            <ButtonSecondary
              diameter={diameter}
              text="X"
              selected={currentOperation === OPERATION.multiply}
              onPress={()=>operationPressed(OPERATION.multiply)}
            />
          </Row>
          <Row>
            <ButtonPrimary diameter={diameter} text="4" onPress={()=>numberPressed(4)}/>
            <ButtonPrimary diameter={diameter} text="5" onPress={()=>numberPressed(5)}/>
            <ButtonPrimary diameter={diameter} text="6" onPress={()=>numberPressed(6)}/>
            <ButtonSecondary
              diameter={diameter}
              text="-"
              selected={currentOperation === OPERATION.minus}
              onPress={()=>operationPressed(OPERATION.minus)}
            />
          </Row>
          <Row>
            <ButtonPrimary diameter={diameter} text="1" onPress={()=>numberPressed(1)}/>
            <ButtonPrimary diameter={diameter} text="2" onPress={()=>numberPressed(2)}/>
            <ButtonPrimary diameter={diameter} text="3" onPress={()=>numberPressed(3)}/>
            <ButtonSecondary
              diameter={diameter}
              text="+"
              selected={currentOperation === OPERATION.plus}
              onPress={()=>operationPressed(OPERATION.plus)}
            />
          </Row>
          <Row>
            <ButtonPrimary
              diameter={diameter}
              style={{minWidth: diameter * 2 + 12}}
              text="0"
              onPress={()=>numberPressed(0)}
            />
            <ButtonPrimary diameter={diameter} text="." />
            <ButtonSecondary
              diameter={diameter}
              text="="
              onPress={() => {
                if(lastOperation !== undefined) {
                  accumulateOperation(lastOperation)
                  setShowAccumulator(true)
                }
              }}/>
          </Row>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    overflow: 'hidden',
    backgroundColor: backgroundColor.primary
  },
  innerContainer: {
    marginTop: 'auto',
  },
  displayContainer: {
    flexGrow: 2,
    marginTop: 'auto',
    marginBottom: margin.base,
    marginHorizontal:
    margin.base
  },
  text: {
    textAlign: 'right',
    display: 'flex',
    flexWrap: 'nowrap',
    overflow: 'hidden',
    justifyContent: 'flex-end',
    color: textColor.primary,
    marginHorizontal: margin.base
  },

  buttonContainer: {
    marginHorizontal: 'auto'
  }
});



