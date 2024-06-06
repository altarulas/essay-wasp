// components/Text.test.js
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
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

const defaultStore = mockStore(initialState);

describe("Text Component", () => {
  test("renders Text component", () => {
    render(
      <Provider store={defaultStore}>
        <Text />
      </Provider>
    );

    const textarea = screen.getByPlaceholderText("Type your essay here...");

    expect(textarea).toBeInTheDocument();
    expect(textarea).toHaveTextContent("");
  });

  test("updates textarea value when user types", () => {
    render(
      <Provider store={defaultStore}>
        <Text />
      </Provider>
    );

    const textarea = screen.getByPlaceholderText("Type your essay here...");

    fireEvent.change(textarea, { target: { value: "New essay text" } });

    expect(textarea).toHaveTextContent("New essay text");
  });

  test("disables textarea when session timer is not running (when session is finished)", () => {
    const stateWithTimerStopped = {
      essayStore: {
        tempEssayInfo: { essay_text: "New essay text" },
        sessionConditions: {
          is_session_finished: true,
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
    expect(textarea).toHaveTextContent("New essay text");
  });
});
