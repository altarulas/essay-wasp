// components/Text.test.js
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Text } from "@/components/core/Text/Text";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import "@testing-library/jest-dom";

// Create a mock store
const mockStore = configureStore([]);
const initialState = {
  essayStore: {
    tempEssayInfo: { essay_text: "" },
    sessionConditions: { is_session_finished: false, is_timer_running: true },
  },
};

const store = mockStore(initialState);

test("renders Text component", () => {
  render(
    <Provider store={store}>
      <Text />
    </Provider>
  );

  // Check if the textarea is rendered
  expect(
    screen.getByPlaceholderText("Type your essay here...")
  ).toBeInTheDocument();
});

test("updates textarea value when user types", () => {
  render(
    <Provider store={store}>
      <Text />
    </Provider>
  );

  const textarea = screen.getByPlaceholderText("Type your essay here...");

  fireEvent.change(textarea, { target: { value: "New essay text" } });

  expect(String(textarea.textContent)).toBe("New essay text");
});

test("disables textarea when session timer is not running", () => {
  const stateWithTimerStopped = {
    essayStore: {
      tempEssayInfo: { essay_text: "" },
      sessionConditions: {
        is_session_finished: false,
        is_timer_running: false,
      },
    },
  };
  const storeWithTimerStopped = mockStore(stateWithTimerStopped);

  render(
    <Provider store={storeWithTimerStopped}>
      <Text />
    </Provider>
  );

  const textarea = screen.getByPlaceholderText("Type your essay here...");
  expect(textarea).toBeDisabled();
});

test("tooltip displays correct information", async () => {
  render(
    <Provider store={store}>
      <Text />
    </Provider>
  );

  // Hover over the tooltip trigger
  const tooltipButton = screen.getByTestId("tooltip-button");
  fireEvent.mouseOver(tooltipButton);
});
