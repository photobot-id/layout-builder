import React, { useCallback, useEffect, useState } from "react";
import { View, StyleSheet, Platform } from "react-native";
import { Button, Text, useTheme } from "react-native-paper";

type NumericKeyboardProps = {
  value: string;
  onChange: (value: string) => void;
  cursor: { start: number; end: number };
  setCursorPosition: (value: { start: number; end: number }) => void;
};

export default function NumericKeyboard({
  value,
  onChange,
  cursor,
  setCursorPosition
}: NumericKeyboardProps) {
  const theme = useTheme();
  const append = useCallback(
    (key: string) => {
      const newValue =
        value.slice(0, cursor.start) + key + value.slice(cursor.end);

      const newPos = cursor.start + key.length;

      setCursorPosition({
        start: newPos,
        end: newPos,
      });

      onChange(newValue);
    },
    [cursor, onChange, value, setCursorPosition],
  );

  const backspace = useCallback(() => {
    if (cursor.start === 0 && cursor.end === 0) {
      return;
    }

    let newValue: string;
    let newPos: number;

    if (cursor.start !== cursor.end) {
      newValue = value.slice(0, cursor.start) + value.slice(cursor.end);

      newPos = cursor.start;
    } else {
      newValue = value.slice(0, cursor.start - 1) + value.slice(cursor.start);

      newPos = cursor.start - 1;
    }

    setCursorPosition({
      start: newPos,
      end: newPos,
    });

    onChange(newValue);
  }, [cursor, onChange, value, setCursorPosition]);

  const clear = () => {
    setCursorPosition({ start: 0, end: 0 });
    onChange("");
  };

  const renderKey = (label: string) => (
    <Button
      mode="outlined"
      style={styles.key}
      labelStyle={{ fontSize: 40, paddingVertical: 30, paddingHorizontal: 20 }}
      theme={{ roundness: 5 }}
      onPress={() => append(label)}
      {...(Platform.OS === "web"
        ? {
            onMouseDown: (e: any) => {
              e.preventDefault();
            },
          }
        : {})}
    >
      {label}
    </Button>
  );

  return (
    <View style={styles.container}>
      {/* <Text variant="displayLarge">{`${cursor?.start}, ${cursor?.end}`}</Text> */}
      <View style={styles.row}>
        {renderKey("1")}
        {renderKey("2")}
        {renderKey("3")}
      </View>

      <View style={styles.row}>
        {renderKey("4")}
        {renderKey("5")}
        {renderKey("6")}
      </View>

      <View style={styles.row}>
        {renderKey("7")}
        {renderKey("8")}
        {renderKey("9")}
      </View>

      <View style={styles.row}>
        <Button
          mode="outlined"
          style={styles.key}
          labelStyle={{
            fontSize: 40,
            paddingVertical: 30,
            paddingHorizontal: 0,
          }}
          onPress={clear}
          theme={{ roundness: 5 }}
          {...(Platform.OS === "web"
            ? {
                onMouseDown: (e: any) => {
                  e.preventDefault();
                },
              }
            : {})}
        >
          C
        </Button>
        {renderKey("0")}
        <Button
          mode="outlined"
          style={styles.key}
          labelStyle={{
            fontSize: 40,
            paddingVertical: 30,
            paddingHorizontal: 0,
          }}
          onPress={backspace}
          theme={{ roundness: 5 }}
          {...(Platform.OS === "web"
            ? {
                onMouseDown: (e: any) => {
                  e.preventDefault();
                },
              }
            : {})}
        >
          ⌫
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 20,
  },
  row: {
    flexDirection: "row",
    gap: 20,
  },
  key: {
    flex: 1,
    borderWidth: 5
  },
  actionButton: {
    flex: 1,
  },
});
